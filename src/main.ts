import { Command } from "cliffy";
import generate from "./cli/generate.command.ts";

const command = new Command()
  .name("dallemini")
  .description("A CLI utility to generate images with DALL-E Mini")
  .version("0.1.0")
  .command("generate", generate)
  .example("Generate image", "\n\ndallemini generate --output ./out pizza")
  .meta("DALL-E Mini", "https://huggingface.co/spaces/dalle-mini/dalle-mini");
  //.action(() => command.showHelp());

await command.parse(Deno.args);
