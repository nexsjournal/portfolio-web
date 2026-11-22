import { createHash } from "node:crypto";

import { load, type CheerioAPI } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import type { NoteType } from "@/content/notes";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MAX_IMAGES = 60;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 40 * 1024 * 1024;

export type ImportMode = "url" | "html" | "text";
export type ImageMode = "link" | "upload";

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
  coverUrl?: string;
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

type Selection = ReturnType<CheerioAPI>;

function styleNumber(style: string, property: string) {
  const match = style.match(new RegExp(`${property}\\s*:\\s*([\\d.]+)`, "i"));
  return match ? Number(match[1]) : 0;
}

function wechatHeadingLevel(style: string) {
  const size = styleNumber(style, "font-size");
  const weight = styleNumber(style, "font-weight");
  if (weight < 650) return 0;
  if (size >= 17.5) return 2;
  if (size >= 16.5) return 3;
  return 0;
}

function normalizeWechatBlocks($: CheerioAPI, content: Selection) {
  content.find("section").each((_, element) => {
    const section = $(element);
    const style = section.attr("style") ?? "";
    if (!/border\s*:\s*1px\s+solid\s+#243044/i.test(style)) return;

    const codeLines = section.find('p[style*="white-space:pre-wrap"]');
    if (codeLines.length) {
      const title = cleanText(section.find("p").first().text()) || "TEXT";
      const code = codeLines.toArray().map((line) => cleanText($(line).text())).join("\n");
      const blockquote = $("<blockquote></blockquote>");
      blockquote.append($("<p></p>").text(title));
      blockquote.append($("<pre></pre>").append($("<code></code>").text(code)));
      section.replaceWith(blockquote);
      return;
    }

    const blockquote = $("<blockquote></blockquote>");
    blockquote.append(section.contents());
    section.replaceWith(blockquote);
  });

  content.find("p").each((_, element) => {
    const paragraph = $(element);
    const text = cleanText(paragraph.text());
    if (!text || text.length > 80 || paragraph.find("img").length) return;

    const level = wechatHeadingLevel(paragraph.attr("style") ?? "");
    if (!level) return;
    const label = text.replace(/^(\d{2})(?=\D)/, "$1 ");
    paragraph.replaceWith($(`<h${Math.max(level - 1, 1)}></h${Math.max(level - 1, 1)}>`).text(label));
  });

  content.find("p, span").each((_, element) => {
    const node = $(element);
    const text = cleanText(node.text());
    if (/^[A-Z][A-Z0-9 &/+.-]{1,15}$/.test(text) && !/[a-z]/.test(text)) node.remove();
  });
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
  imageMode?: ImageMode;
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
    let response: Response;
    try {
      response = await fetch(value, {
        headers: {
          "user-agent": USER_AGENT,
          "accept-language": "zh-CN,zh;q=0.9",
          referer: "https://mp.weixin.qq.com/",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new Error("访问公众号超时。请确认链接能在浏览器正常打开，或改用“完整 HTML”模式粘贴正文。");
      }
      throw new Error("无法访问公众号。请改用“完整 HTML”模式粘贴正文。");
    }
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
  const coverUrl = $('meta[property="og:image"]').attr("content")?.trim()
    || html.match(/msg_cdn_url\s*=\s*"([^"]+)"/)?.[1];
  const date = html ? dateFromWechat(html) : fallbackDate;
  const type = normalizeType(input.type);

  let content = $("#js_content").first();
  if (!content.length && input.mode === "url") {
    const wechatError = cleanText($(".weui-msg__title").text());
    if (wechatError) {
      throw new Error(`公众号返回「${wechatError}」。链接可能不完整、已失效或仅限微信内打开；请复制地址栏完整链接，或改用“完整 HTML”模式。`);
    }
  }
  if (!content.length) content = $("article").first();
  if (!content.length) content = $("main").first();
  if (!content.length) content = $("body");
  if (!content.length) throw new Error("没有找到文章正文。");

  content.find("script, style, noscript, iframe, svg, video, audio, mp-common-videosnap, mpvoice, qqmusic").remove();
  normalizeWechatBlocks($, content);

  const imageMode = input.imageMode === "upload" ? "upload" : "link";
  const imageSources: Array<{ marker: string; url: string }> = [];
  content.find("img").each((index, element) => {
    const image = $(element);
    const src = image.attr("data-src") || image.attr("src");
    if (!src || src.startsWith("data:") || index >= MAX_IMAGES) {
      image.remove();
      return;
    }
    const normalizedUrl = src.startsWith("//") ? `https:${src}` : src.replace(/^http:\/\//i, "https://");
    image.attr("src", normalizedUrl);
    image.attr("alt", cleanText(image.attr("alt") ?? ""));
    if (imageMode === "upload") {
      const marker = `lex-image-${String(index).padStart(2, "0")}`;
      imageSources.push({ marker, url: normalizedUrl });
      image.attr("src", marker);
    }
  });

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
  turndown.addRule("wechatBullet", {
    filter: (node) => node.nodeName === "P" && /^•/.test(node.textContent?.trim() ?? ""),
    replacement: (content) => `\n- ${content.replace(/^\s*•\s*/, "").trim()}\n`,
  });

  let markdown = turndown
    .turndown(content.html() ?? fallbackText)
    .replace(/^•\s*/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  const images: ImportedImage[] = [];
  let totalBytes = 0;
  if (imageMode === "upload") {
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
  }

  let cover: ImportedImage | undefined;
  const normalizedCoverUrl = coverUrl?.startsWith("//")
    ? `https:${coverUrl}`
    : coverUrl?.replace(/^http:\/\//i, "https://");
  if (normalizedCoverUrl) {
    try {
      const image = await fetchImage(normalizedCoverUrl);
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
    ...(normalizedCoverUrl ? { coverUrl: normalizedCoverUrl } : {}),
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
