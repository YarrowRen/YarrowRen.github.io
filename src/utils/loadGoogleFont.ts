import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadLocalFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const regularPath = path.join(
    process.cwd(),
    "node_modules",
    "katex",
    "dist",
    "fonts",
    "KaTeX_Typewriter-Regular.ttf"
  );

  const regularFont = await readFile(regularPath);
  const regularData = new Uint8Array(regularFont).buffer;

  return [
    {
      name: "KaTeX Typewriter",
      data: regularData,
      weight: 400,
      style: "normal",
    },
    {
      name: "KaTeX Typewriter",
      data: regularData,
      weight: 700,
      style: "normal",
    },
  ];
}

export default loadLocalFonts;
