# DALL·E mini CLI

[![CI](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/ci.yml)

[![DALL-E Mini HealthCheck](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/healthcheck.yml/badge.svg)](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/healthcheck.yml)


A CLI utility for generate images using DALL·E mini.

>Try it out **DALLE-Mini**: https://huggingface.co/spaces/dalle-mini/dalle-mini

## Usage

```bash
  Usage:   dallemini generate <prompt>
  Version: 0.2.1

  DALL-E Mini: https://huggingface.co/spaces/dalle-mini/dalle-mini

  Description:

    Generates an image from the given prompt using DALL-E Mini    

  Options:

    -h, --help              - Show this help.
    -s, --silent            - Don't show any output
    -l, --log     [log]     - Minimum log level                          (Default: "debug", Values: "debug", "info", "warn", "error")
    -o, --output  <output>  - Output path of the images
    -n, --name    <name>    - Name of the generate files
    -r, --retry   <retry>   - Number of retries if the operation fails.  (Default: 3)
    -b, --batch   <batch>   - Number of times to generate images         (Default: 1)

  Examples:

    Generate image: dallemini generate --output ./out pizza
```
