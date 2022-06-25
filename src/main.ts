import { Command } from "cliffy";
import generate from "./cli/generate.command.ts";

const command = new Command()
  .name("dallemini")
  .description("A CLI utility to generate images with DALL-E Mini")
  .version("0.2.1")
  .command("generate", generate)
  .example("Generate image", "\n\ndallemini generate --output ./out pizza")
  .meta("DALL-E Mini", "https://huggingface.co/spaces/dalle-mini/dalle-mini");

await command.parse(Deno.args);
