import { Command, EnumType } from "cliffy";
import {
  DalleImageGenerator,
  DEFAULT_BATCH,
  DEFAULT_RETRY,
} from "../core/DalleImageGenerator.ts";
import { createConsoleLogger, LogLevel } from "../utils/logger.ts";

const logLevel = new EnumType<LogLevel>(["debug", "info", "warn", "error"]);

const generate = new Command()
  .name("generate")
  .description("Generates an image from the given prompt using DALL-E Mini")
  .arguments("<prompt:string>")
  .option("-s, --silent", "Don't show any output", {
    collect: true,
    value: (val: boolean) => val,
  })
  .type("logLevel", logLevel)
  .option("-l, --log [log:logLevel]", "Minimum log level", {
    default: "debug",
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
  .action(
    async ({ name, output, retry, silent, batch, log }, prompt: string) => {
      const logger = createConsoleLogger(log as LogLevel);
      const logging = !silent
        ? {
            debug: logger.debug,
            info: logger.info,
            warn: logger.warn,
            error: logger.error,
          }
        : undefined;

      const imageGenerator = new DalleImageGenerator({
        filename: name,
        output,
        retry,
        batch,
        prompt,
        logging,
      });

      await imageGenerator.generate();
    }
  );

export default generate;
