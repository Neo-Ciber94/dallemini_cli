import { Command } from "cliffy";
import { MultiProgressBar } from "progress";
import { abortable } from "std/async";
import {
  DalleImageGenerator,
  DEFAULT_BATCH,
  DEFAULT_RETRY,
} from "../core/DalleImageGenerator.ts";

const generate = new Command()
  .name("generate")
  .description("Generates an image from the given prompt using DALL-E Mini")
  .arguments("<prompt:string>")
  .option("-v, --verbose [verbose:boolean]", "Show additional information", {
    default: false,
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
    const imageGenerator = new DalleImageGenerator({
      filename: name,
      output,
      retry,
      batch,
      prompt,
      verbose,
    });

    const abortController = new AbortController();
    renderProgressBar(abortController.signal);

    await imageGenerator.generate();
    abortController.abort();
  });

function renderProgressBar(signal: AbortSignal) {
  const MAX = 100;
  const progressBar = new MultiProgressBar({
    title: "Generating images with DALL-E Mini\n",
    complete: "=",
    incomplete: "-",
    width: 50,
    clear: true,
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
    render(seconds, current % MAX);

    if (signal.aborted) {
      render(seconds, MAX);
      clearInterval(intervalId);
      return;
    }

    current += 1;
    ms += 100;
  }, 100);
}

export default generate;
