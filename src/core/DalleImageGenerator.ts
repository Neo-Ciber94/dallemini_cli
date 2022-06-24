import { Image } from "imagescript";
import { Ref } from "../types/ref.ts";
import { generate } from "./generate.ts";
import * as path from "std/path";
import * as fs from "std/fs";
import { Counter } from "../utils/counter.ts";

const CHAR_WHITELIST_REGEX = /[^\w]/g;
export const DEFAULT_RETRY = 3;
export const DEFAULT_BATCH = 1;
export const DEFAULT_OUTPUT = path.join(Deno.cwd(), "dallemini_images");

export interface GenerateImageOptions {
  prompt: string;
  output?: string;
  filename?: string;
  retry?: number;
  batch?: number;
  verbose?: boolean;
}

export class DalleImageGenerator {
  constructor(readonly options: Readonly<GenerateImageOptions>) {}

  async generate() {
    const options = this.options;

    if (options.prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty");
    }

    const generateBatchPromises: Promise<void>[] = [];
    const batch = Math.max(1, options.batch || DEFAULT_BATCH);
    const counter = new Counter();

    for (let i = 0; i < batch; i++) {
      generateBatchPromises.push(this.newBatch(counter));
    }

    await Promise.all(generateBatchPromises);
  }

  private async newBatch(counter: Counter) {
    const options = this.options;
    const retry = Math.max(0, options.retry || DEFAULT_RETRY);
    let canRetry = true;
    let retryCount = 0;

    while (true) {
      try {
        const { images } = await generate(options.prompt);
        retryCount += 1;

        console.log("Generated images: ", images.length);
        const outpath = options.output || DEFAULT_OUTPUT;
        await fs.emptyDir(outpath);

        const saveImagePromises: Promise<void>[] = [];
        for (const img of images) {
          const index = counter.incrementGet();
          saveImagePromises.push(this.saveImage(index, img, outpath));
        }

        // If we fail to save images don't retry
        try {
          await Promise.all(saveImagePromises);
        } catch (e) {
          console.error(e);
          canRetry = false;
        }

        return;
      } catch (e) {
        console.error(e);

        if (!canRetry) {
          return;
        }
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
    console.log(filepath);
    await Deno.writeFile(filepath, await img.encode());
  }
}

function getFileNameForPrompt(prompt: string) {
  return prompt.replaceAll(CHAR_WHITELIST_REGEX, "_");
}
