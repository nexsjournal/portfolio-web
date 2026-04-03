import { promises as fs } from "node:fs";
import path from "node:path";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

function isRasterImage(filename: string) {
  return IMAGE_EXT.has(path.extname(filename).toLowerCase());
}

function isLogoFile(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return isRasterImage(filename) || ext === ".svg";
}

async function safeReadDir(dir: string) {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export type JourneyTimeAssets = {
  /** 首张可用作首页右侧预览的竖版图（优先 marketing） */
  preview9x16: string | null;
  /** `public/assets/apps/journey-time/logo/` 下首张 Logo，建议 1:1 */
  logo: string | null;
  screens: string[];
  marketing: string[];
};

/**
 * 读取旅迹时光静态素材：Logo（1:1）、宣传图与截图（建议 9:16 竖版）。
 */
export async function getJourneyTimeAssets(): Promise<JourneyTimeAssets> {
  const cwd = process.cwd();
  const base = path.join(cwd, "public", "assets", "apps", "journey-time");

  const screenDir = path.join(base, "screens");
  const marketingDir = path.join(base, "marketing");
  const logoDir = path.join(base, "logo");

  const screenFiles = (await safeReadDir(screenDir))
    .filter(isRasterImage)
    .sort((a, b) => a.localeCompare(b, "en"));

  const marketingFiles = (await safeReadDir(marketingDir))
    .filter(isRasterImage)
    .sort((a, b) => a.localeCompare(b, "en"));

  const logoFiles = (await safeReadDir(logoDir))
    .filter(isLogoFile)
    .sort((a, b) => a.localeCompare(b, "en"));

  const screens = screenFiles.map((f) => `/assets/apps/journey-time/screens/${f}`);
  const marketing = marketingFiles.map(
    (f) => `/assets/apps/journey-time/marketing/${f}`,
  );

  const logo = logoFiles[0]
    ? `/assets/apps/journey-time/logo/${logoFiles[0]}`
    : null;

  const preview9x16 = marketing[0] ?? screens[0] ?? null;

  return {
    logo,
    preview9x16,
    screens,
    marketing,
  };
}
