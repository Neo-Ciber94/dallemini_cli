import { Image } from "imagescript";
import { generate } from "./generate.ts";
import * as path from "std/path";
import * as fs from "std/fs";
import { Counter } from "../utils/counter.ts";
import { merge } from "../utils/merge.ts";
import * as colors from "std/colors";

const CHAR_WHITELIST_REGEX = /[^\w]/g;
export const DEFAULT_RETRY = 3;
export const DEFAULT_BATCH = 1;
export const DEFAULT_OUTPUT = path.join(Deno.cwd(), "dallemini_images");

const NULL_LOGGER: DalleImageGeneratorLogging = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

export interface DalleImageGeneratorLogging {
  debug?: (message: string) => void;
  info?: (message: string) => void;
  warn?: (message: string) => void;
  error?: (message: string) => void;
}

export interface GenerateImageOptions {
  prompt: string;
  output?: string;
  filename?: string;
  retry?: number;
  batch?: number;
  logging?: DalleImageGeneratorLogging;
}

export class DalleImageGenerator {
  public readonly options: Readonly<GenerateImageOptions> & {
    logging: Required<DalleImageGeneratorLogging>;
  };

  private get logger(): Required<DalleImageGeneratorLogging> {
    return this.options.logging;
  }

  private getBatchCount(): number {
    return Math.max(1, this.options.batch || DEFAULT_BATCH);
  }

  private getRetryCount(): number {
    return Math.max(0, this.options.retry || DEFAULT_RETRY);
  }

  private getOutputPath(): string {
    return this.options.output || DEFAULT_OUTPUT;
  }

  constructor(options: GenerateImageOptions) {
    const logging = merge(
      NULL_LOGGER,
      options.logging || {}
    ) as Required<DalleImageGeneratorLogging>;
    this.options = { ...options, logging };
  }

  async generate() {
    const options = this.options;

    if (options.prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty");
    }

    const generateBatchPromises: Promise<void>[] = [];
    const batch = this.getBatchCount();
    const retry = this.getRetryCount();
    const counter = new Counter();

    this.logger.info(
      `Generating images for prompt: ${colors.brightGreen(options.prompt)}`
    );

    this.logger.debug(`With ${batch} batch${batch > 1 ? "es" : ""}`);
    this.logger.debug(`With ${retry} ${retry > 1 ? "retries" : "retry"}`);
    this.logger.debug(`With output path: ${this.getOutputPath()}`);

    for (let i = 0; i < batch; i++) {
      generateBatchPromises.push(this.newBatch(i + 1, counter));
    }

    await Promise.all(generateBatchPromises);
  }

  private async newBatch(batchId: number, counter: Counter) {
    const options = this.options;
    const retry = Math.max(0, options.retry || DEFAULT_RETRY);
    let canRetry = true;
    let retryCount = 0;

    while (true) {
      try {
        this.logger.debug(`Generating images for batch ${batchId}`);
        const { images, version } = await generate(options.prompt);
        retryCount += 1;

        this.logger.info(
          `Generated ${images.length} images in version '${version}' for batch ${batchId}`
        );

        const outpath = options.output || DEFAULT_OUTPUT;
        await fs.ensureDir(outpath);

        const saveImagePromises: Promise<void>[] = [];
        for (const img of images) {
          const index = counter.incrementGet();
          saveImagePromises.push(this.saveImage(index, img, outpath));
        }

        // If we fail to save images don't retry
        try {
          await Promise.all(saveImagePromises);
        } catch (e) {
          this.logger.error(`Failed to save images in batch ${batchId}`);
          this.logger.error(e);
          canRetry = false;
        }

        return;
      } catch (e) {
        this.logger.error(e);

        if (!canRetry) {
          return;
        }

        this.logger.info(
          `Request failed in batch ${batchId}, retry ${retryCount}`
        );
      }

      if (retryCount === retry) {
        return;
      }
    }
  }

  private async saveImage(index: number, img: Image, outpath: string) {
    const options = this.options;
    const filename = options.filename || getFileNameForPrompt(options.prompt);
    const baseFilePath = path.join(outpath, filename);
    const filepath = `${baseFilePath}_${index}.png`;
    await Deno.writeFile(filepath, await img.encode());

    this.logger.info(`Saved image: ${filepath}`);
  }
}

function getFileNameForPrompt(prompt: string) {
  return prompt.replaceAll(CHAR_WHITELIST_REGEX, "_");
}
