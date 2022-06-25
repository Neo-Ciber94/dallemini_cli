# DALL·E mini CLI

[![CI](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Neo-Ciber94/dallemini_cli/actions/workflows/ci.yml)

A CLI utility for generate images using DALL·E mini.

## Usage

```bash
  Usage:   dallemini generate <prompt>
  Version: 0.1.0

  DALL-E Mini: https://huggingface.co/spaces/dalle-mini/dalle-mini

  Description:

    Generates an image from the given prompt using DALL-E Mini

  Options:

    -h, --help                - Show this help.
    -v, --verbose  [verbose]  - Show additional information                (Default: false)
    -o, --output   <output>   - Output path of the images
    -n, --name     <name>     - Name of the generate files
    -r, --retry    <retry>    - Number of retries if the operation fails.  (Default: 3)
    -b, --batch    <batch>    - Number of times to generate images         (Default: 1)

  Examples:

    Generate image: dallemini generate --output ./out pizza
```
