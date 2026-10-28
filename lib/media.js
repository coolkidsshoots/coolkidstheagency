import fs from "node:fs";
import path from "node:path";
import { CLOUD_PHOTOS, CLOUD_VIDEOS } from "./photos.js";

const EXT_IMG = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const EXT_VID = new Set([".mp4", ".webm", ".mov", ".m4v"]);

// Reads /public/media at build time. Files are shown in file-name order (01, 02, 03...).
export function getMedia() {
  const dir = path.join(process.cwd(), "public", "media");
  let names = [];
  try { names = fs.readdirSync(dir); } catch {}
  const local = names
    .filter((n) => !n.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((n) => {
      const ext = path.extname(n).toLowerCase();
      if (EXT_IMG.has(ext)) return { src: `/media/${n}`, thumb: `/media/${n}`, type: "image" };
      if (EXT_VID.has(ext)) return { src: `/media/${n}`, type: "video" };
      return null;
    })
    .filter(Boolean);
  // Cloudinary photos first, then anything in /public/media (videos etc.)
  return [...CLOUD_PHOTOS, ...CLOUD_VIDEOS, ...local];
}
