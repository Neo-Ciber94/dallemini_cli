import { Image } from "imagescript";
import * as base64 from "std/base64";

export const DALLE_MINI_URL = "https://bf.dallemini.ai/generate";

export interface GeneratedImage {
  images: Image[];
  version: string;
}

interface DalleMiniGenerateImageResponse {
  images: string[];
  version: string;
}

export async function generate(prompt: string): Promise<GeneratedImage> {
  const res = await fetch(DALLE_MINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const json: DalleMiniGenerateImageResponse = await res.json();
  const imagesPromises = json.images
    .map((s) => s.replaceAll(`\\n`, ""))
    .map((s) => {
      const bytes = base64.decode(s);
      return Image.decode(bytes);
    });

  const images = await Promise.all(imagesPromises);

  return {
    images,
    version: json.version,
  };
}
