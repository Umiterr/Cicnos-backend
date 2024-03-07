import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getData(fileName) {
  const filePath = path.join(__dirname, `../data/${fileName}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}
