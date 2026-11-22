import { createHash } from "node:crypto";

import { load } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import type { NoteType } from "@/content/notes";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MAX_IMAGES = 30;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 40 * 1024 * 1024;

export type ImportMode = "url" | "html" | "text";

export type ImportedImage = {
  marker: string;
  fileName: string;
  bytes: Uint8Array;
  contentType: string;
};

export type ParsedArticle = {
  slug: string;
  title: string;
  date: string;
  type: NoteType;
  tags: string[];
  excerpt: string;
  cover?: ImportedImage;
  sourceUrl?: string;
  sourceLabel?: string;
  canonical?: string;
  markdown: string;
  images: ImportedImage[];
};

function normalizeType(value?: string): NoteType {
  return value === "video" || value === "event" || value === "note" ? value : "article";
}

function extensionFromType(contentType: string) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
}

function extensionFromUrl(url: string) {
  try {
    const format = new URL(url).searchParams.get("wx_fmt");
    if (format && /^[a-z0-9]+$/i.test(format)) return format.toLowerCase();
    const extension = new URL(url).pathname.split(".").at(-1)?.toLowerCase();
    if (extension && /^(jpg|jpeg|png|webp|gif)$/.test(extension)) return extension === "jpeg" ? "jpg" : extension;
  } catch {
    /* ignore */
  }
  return "";
}

async function fetchImage(url: string) {
  const response = await fetch(url.startsWith("//") ? `https:${url}` : url, {
    headers: { "user-agent": USER_AGENT, referer: "https://mp.weixin.qq.com/" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (!contentType.startsWith("image/")) throw new Error("not an image");

  const length = Number(response.headers.get("content-length") ?? 0);
  if (length > MAX_IMAGE_BYTES) throw new Error("image is too large");

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error("image is too large");
  const extension = extensionFromUrl(url) || extensionFromType(contentType);
  return { bytes, contentType, extension };
}

function cleanText(value: string) {
  return value.replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\u00a0/g, " ").trim();
}

function plainTextMarkdown(value: string) {
  return cleanText(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

function dateFromWechat(html: string) {
  const timestamp = html.match(/var ct = "(\d+)"/)?.[1];
  if (timestamp) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(
      new Date(Number(timestamp) * 1000),
    );
  }
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
}

function makeSlug(title: string, date: string, sourceUrl?: string) {
  const sourceId = sourceUrl
    ? new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1)?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)
    : "";
  const hash = createHash("sha1").update(`${title}:${date}`).digest("hex").slice(0, 6);
  return `${sourceUrl ? "wechat" : "note"}-${date.replaceAll("-", "")}-${sourceId || hash}`;
}

export async function parseArticle(input: {
  mode: ImportMode;
  value: string;
  type?: string;
  tags?: string[];
  canonicalSelf?: boolean;
}): Promise<ParsedArticle> {
  const value = input.value.trim();
  if (!value) throw new Error("请粘贴公众号链接或文章内容。");

  let sourceUrl: string | undefined;
  let html = "";
  let articleHtml = "";
  let fallbackTitle = "";
  let fallbackDate = "";
  let fallbackText = "";

  if (input.mode === "url") {
    if (!/^https?:\/\//i.test(value)) throw new Error("请输入完整的公众号文章链接。");
    sourceUrl = value;
    const response = await fetch(value, {
      headers: {
        "user-agent": USER_AGENT,
        "accept-language": "zh-CN,zh;q=0.9",
        referer: "https://mp.weixin.qq.com/",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error(`文章请求失败：HTTP ${response.status}`);
    html = await response.text();
  } else if (input.mode === "html") {
    html = value;
  } else {
    const lines = value.split(/\n/).map(cleanText).filter(Boolean);
    fallbackTitle = lines[0] ?? "";
    fallbackText = plainTextMarkdown(value.replace(/^\s*[^\n]+\n?/, ""));
    fallbackDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
    articleHtml = `<main>${fallbackText.split(/\n{2,}/).map((paragraph) => `<p>${paragraph}</p>`).join("")}</main>`;
  }

  const $ = load(html || articleHtml);
  const title = cleanText(
    $("#activity-name").text()
    || $('meta[property="og:title"]').attr("content")
    || $("h1").first().text()
    || $("title").text()
    || fallbackTitle
    || "未命名文章",
  );
  const account = cleanText($("#js_name").text());
  const description = cleanText($('meta[property="og:description"]').attr("content") ?? "");
  const coverUrl = $('meta[property="og:image"]').attr("content")?.trim();
  const date = html ? dateFromWechat(html) : fallbackDate;
  const type = normalizeType(input.type);

  let content = $("#js_content").first();
  if (!content.length) content = $("article").first();
  if (!content.length) content = $("main").first();
  if (!content.length) content = $("body");
  if (!content.length) throw new Error("没有找到文章正文。");

  content.find("script, style, noscript, iframe, svg, video, audio, mp-common-videosnap, mpvoice, qqmusic").remove();
  content.find("[style], [class]").removeAttr("style").removeAttr("class");
  content.find("*").each((_, element) => {
    const attributes = { ...element.attribs };
    for (const name of Object.keys(attributes)) {
      if (!["href", "src", "alt", "title"].includes(name)) $(element).removeAttr(name);
    }
  });
  content.find("a").each((_, element) => {
    const link = $(element);
    const href = link.attr("href");
    if (href?.startsWith("//")) link.attr("href", `https:${href}`);
    if (!href || /^javascript:/i.test(href)) link.removeAttr("href");
  });

  const imageSources: Array<{ marker: string; url: string }> = [];
  content.find("img").each((index, element) => {
    const image = $(element);
    const src = image.attr("data-src") || image.attr("src");
    if (!src || src.startsWith("data:") || index >= MAX_IMAGES) {
      image.remove();
      return;
    }
    const marker = `lex-image-${String(index).padStart(2, "0")}`;
    imageSources.push({ marker, url: src.startsWith("//") ? `https:${src}` : src });
    image.attr("src", marker);
    image.attr("alt", cleanText(image.attr("alt") ?? ""));
  });

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });
  turndown.use(gfm);
  turndown.addRule("shiftHeadings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (text, node) => `\n\n${"#".repeat(Math.min(Number(node.nodeName.slice(1)) + 1, 6))} ${text}\n\n`,
  });
  turndown.addRule("removeEmptyLinks", {
    filter: (node) => node.nodeName === "A" && !node.textContent?.trim() && !node.querySelector("img"),
    replacement: () => "",
  });

  let markdown = turndown
    .turndown(content.html() ?? fallbackText)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  const images: ImportedImage[] = [];
  let totalBytes = 0;
  for (const source of imageSources) {
    try {
      const image = await fetchImage(source.url);
      if (totalBytes + image.bytes.byteLength > MAX_TOTAL_IMAGE_BYTES) break;
      totalBytes += image.bytes.byteLength;
      const fileName = `${source.marker}.${image.extension}`;
      images.push({ marker: source.marker, fileName, bytes: image.bytes, contentType: image.contentType });
    } catch {
      markdown = markdown.replace(new RegExp(`!\\[[^\\]]*\\]\\(${source.marker}\\)`, "g"), "");
    }
  }

  let cover: ImportedImage | undefined;
  if (coverUrl) {
    try {
      const image = await fetchImage(coverUrl);
      cover = {
        marker: "cover",
        fileName: `cover.${image.extension}`,
        bytes: image.bytes,
        contentType: image.contentType,
      };
    } catch {
      /* cover is optional */
    }
  }

  const tags = input.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [];
  if (!tags.length && account) tags.push(account);
  const excerpt = description || cleanText(markdown.replace(/[#>*_`[\]()!-]/g, " ")).slice(0, 140);
  const slug = makeSlug(title, date, sourceUrl);
  const canonical = sourceUrl && !input.canonicalSelf ? sourceUrl : undefined;

  if (!markdown) throw new Error("正文解析后为空，请检查粘贴内容。");

  return {
    slug,
    title,
    date,
    type,
    tags,
    excerpt,
    cover,
    sourceUrl,
    ...(sourceUrl ? { sourceLabel: "查看公众号原文" } : {}),
    ...(canonical ? { canonical } : {}),
    markdown,
    images,
  };
}

export function applyImageUrls(markdown: string, urls: Map<string, string>) {
  let result = markdown;
  for (const [marker, url] of urls) result = result.replaceAll(marker, url);
  return result;
}
