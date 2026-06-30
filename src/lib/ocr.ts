export interface OcrResult {
  rawText: string;
  storeName: string | null;
  amount: number | null;
  date: string | null;
}

export async function recognizeReceipt(blob: Blob): Promise<OcrResult> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["jpn", "eng"]);
  try {
    const { data } = await worker.recognize(blob);
    const rawText = data.text;
    return {
      rawText,
      storeName: extractStoreName(rawText),
      amount: extractAmount(rawText),
      date: extractDate(rawText),
    };
  } finally {
    await worker.terminate();
  }
}

function extractStoreName(text: string): string | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  for (const line of lines) {
    const letters = line.replace(/[^\p{L}]/gu, "");
    if (letters.length >= 2) return line;
  }
  return null;
}

const TOTAL_KEYWORDS = ["合計", "ご利用金額", "お会計", "総額", "合計金額", "お買上げ"];

function extractAmount(text: string): number | null {
  const lines = text.split("\n");
  for (const line of lines) {
    if (TOTAL_KEYWORDS.some((keyword) => line.includes(keyword))) {
      const nums = numbersInLine(line);
      if (nums.length) return Math.max(...nums);
    }
  }
  const nums = numbersInLine(text).filter((n) => n > 0 && n < 1_000_000);
  return nums.length ? Math.max(...nums) : null;
}

function numbersInLine(line: string): number[] {
  const matches = line.match(/[\d,]{2,}/g) ?? [];
  return matches
    .map((m) => parseInt(m.replace(/,/g, ""), 10))
    .filter((n) => !isNaN(n));
}

function extractDate(text: string): string | null {
  const match = text.match(/(20\d{2})[\/\-.年](\d{1,2})[\/\-.月](\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
