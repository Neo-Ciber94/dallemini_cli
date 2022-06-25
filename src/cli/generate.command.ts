import { Command } from "cliffy";
import { MultiProgressBar } from "progress";
import {
  DalleImageGenerator,
  DEFAULT_BATCH,
  DEFAULT_RETRY,
} from "../core/DalleImageGenerator.ts";
import { createConsoleLogger } from "../utils/logger.ts";

const generate = new Command()
  .name("generate")
  .description("Generates an image from the given prompt using DALL-E Mini")
  .arguments("<prompt:string>")
  .option("-v, --verbose", "Show additional information", {
    collect: true,
    value: (val: boolean) => val,
  })
  .option("-o, --output <output:string>", "Output path of the images")
  .option("-n, --name <name:string>", "Name of the generate files")
  .option(
    "-r, --retry <retry:number>",
    `Number of retries if the operation fails.`,
    {
      default: DEFAULT_RETRY,
    }
  )
  .option("-b, --batch <batch:number>", "Number of times to generate images", {
    default: DEFAULT_BATCH,
  })
  .action(async ({ name, output, verbose, retry, batch }, prompt: string) => {
    const logger = createConsoleLogger("debug");
    const logging = verbose
      ? {
          debug: logger.debug,
          info: logger.info,
          warn: logger.warn,
          error: logger.error,
        }
      : undefined;

    const abortController = new AbortController();
    const bars = renderProgressBar(abortController.signal);

    const imageGenerator = new DalleImageGenerator({
      filename: name,
      output,
      retry,
      batch,
      prompt,
      logging,
    });

    await imageGenerator.generate();
    abortController.abort();
  });

function renderProgressBar(signal: AbortSignal): MultiProgressBar {
  const MAX = 100;
  const MS = 100;

  const progressBar = new MultiProgressBar({
    title: "Generating images with DALL-E Mini\n",
    complete: "#",
    incomplete: "-",
    display: "[:bar] :text",
  });

  let current = 0;
  let ms = 0;

  const render = (seconds: number, completed: number) => {
    progressBar.render([
      {
        text: `${seconds} seconds`,
        completed,
        total: MAX,
      },
    ]);
  };

  const intervalId = setInterval(() => {
    const seconds = Math.floor(ms / 1000);
    if (signal.aborted) {
      render(seconds, MAX);
      clearInterval(intervalId);
      return;
    }

    render(seconds, current % MAX);

    current += 5;
    ms += MS;
  }, MS);

  return progressBar;
}

export default generate;
