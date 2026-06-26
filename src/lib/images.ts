import { v4 as uuidv4 } from "uuid";
import type { ReceiptImage } from "@/types";
import { getDB } from "./db";

async function compressImage(
  blob: Blob,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (result) => resolve(result!),
        "image/jpeg",
        quality
      );
    };
    img.src = url;
  });
}

export async function saveImage(blob: Blob): Promise<string> {
  const db = await getDB();
  const id = uuidv4();
  const compressed = await compressImage(blob, 1200, 0.75);
  const thumbnail = await compressImage(blob, 200, 0.6);
  const image: ReceiptImage = {
    id,
    blob: compressed,
    thumbnail,
    createdAt: new Date().toISOString(),
  };
  await db.put("images", image);
  return id;
}

export async function getImage(id: string): Promise<ReceiptImage | undefined> {
  const db = await getDB();
  return db.get("images", id);
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("images", id);
}

export function createImageUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
