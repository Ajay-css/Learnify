import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const extractTextFromPDF = async (buffer) => {
  const data = await pdf(buffer);
  return data.text;
};