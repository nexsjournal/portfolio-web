#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { load } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const args = process.argv.slice(2);
const url = args.find((arg) => /^https?:\/\//.test(arg));

if (!url) {
  console.error("用法：npm run import:wechat -- <公众号文章链接> [--slug my-article] [--tags 标签1,标签2] [--type article]");
  process.exit(1);
}

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const requestedSlug = option("--slug");
const requestedType = option("--type") ?? "article";
const requestedTags = option("--tags");
const skipImages = args.includes("--no-images");
const selfCanonical = args.includes("--canonical-self");

const response = await fetch(url, {
  headers: {
    "user-agent": USER_AGENT,
    "accept-language": "zh-CN,zh;q=0.9",
    referer: "https://mp.weixin.qq.com/",
  },
  redirect: "follow",
});

if (!response.ok) {
  throw new Error(`文章请求失败：HTTP ${response.status}`);
}

const html = await response.text();
const $ = load(html);
const content = $("#js_content").first();

if (!content.length) {
  const message = $(".weui-msg__title").text().trim() || $("title").text().trim();
  throw new Error(`没有找到公众号正文，可能文章已删除或需要验证：${message || "unknown"}`);
}

const title =
  $("#activity-name").text().trim() ||
  $('meta[property="og:title"]').attr("content")?.trim() ||
  "未命名文章";
const account = $("#js_name").text().trim();
const description = $('meta[property="og:description"]').attr("content")?.trim() ?? "";
const coverUrl = $('meta[property="og:image"]').attr("content") ?? "";
const timestamp = html.match(/var ct = "(\d+)"/)?.[1];
const date = timestamp
  ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date(Number(timestamp) * 1000))
  : new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
const articleId = new URL(url).pathname.split("/").filter(Boolean).at(-1)?.replace(/[^a-zA-Z0-9]/g, "") ?? "article";
const slug = requestedSlug || `wechat-${date.replaceAll("-", "")}-${articleId.slice(0, 8)}`;

content.find("script, style, noscript, iframe, svg, video, audio, mp-common-videosnap").remove();
content.find("[style], [class]").removeAttr("style").removeAttr("class");

content.find("img").each((_, element) => {
  const image = $(element);
  const src = image.attr("data-src") || image.attr("src");
  if (!src || src.startsWith("data:")) {
    image.remove();
    return;
  }
  image.attr("src", src.startsWith("//") ? `https:${src}` : src);
  image.removeAttr("data-src data-type data-ratio data-w data-croporisrc data-cropx1 data-cropx2 data-cropy1 data-cropy2");
  image.removeAttr("width height");
});

content.find("a").each((_, element) => {
  const link = $(element);
  const href = link.attr("href");
  if (href?.startsWith("//")) link.attr("href", `https:${href}`);
});

const imageDir = path.join(process.cwd(), "public", "assets", "notes", slug);
const imageMap = new Map();

async function downloadImage(imageUrl, fileName) {
  const normalizedUrl = imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;
  const imageResponse = await fetch(normalizedUrl, {
    headers: { "user-agent": USER_AGENT, referer: "https://mp.weixin.qq.com/" },
  });
  if (!imageResponse.ok) throw new Error(`HTTP ${imageResponse.status}`);

  const contentType = imageResponse.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) throw new Error(`not an image: ${contentType}`);

  const format = new URL(normalizedUrl).searchParams.get("wx_fmt");
  const extension = format && /^[a-z0-9]+$/i.test(format) ? format.toLowerCase() : contentType.split("/")[1]?.split(";")[0] || "jpg";
  const publicPath = `/assets/notes/${slug}/${fileName}.${extension}`;
  await fs.mkdir(imageDir, { recursive: true });
  await fs.writeFile(path.join(imageDir, `${fileName}.${extension}`), Buffer.from(await imageResponse.arrayBuffer()));
  return publicPath;
}

if (!skipImages) {
  let index = 0;
  for (const element of content.find("img").toArray()) {
    const image = $(element);
    const src = image.attr("src");
    if (!src) continue;
    index += 1;
    try {
      const publicPath = await downloadImage(src, `img-${String(index).padStart(2, "0")}`);
      imageMap.set(src, publicPath);
      image.attr("src", publicPath);
    } catch (error) {
      console.warn(`跳过图片 ${src}：${error.message}`);
      image.remove();
    }
  }
}

let cover;
if (!skipImages && coverUrl) {
  try {
    cover = await downloadImage(coverUrl, "cover");
  } catch (error) {
    console.warn(`封面下载失败：${error.message}`);
  }
}

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
  replacement: (content, node) => {
    const level = Math.min(Number(node.nodeName.slice(1)) + 1, 6);
    return `\n\n${"#".repeat(level)} ${content}\n\n`;
  },
});
turndown.addRule("removeEmptyLinks", {
  filter: (node) => node.nodeName === "A" && !node.textContent?.trim() && !node.querySelector("img"),
  replacement: () => "",
});

const markdown = turndown
  .turndown(content.html() ?? "")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

if (!markdown) {
  throw new Error("正文转换后为空，未写入文件。");
}

const tags = requestedTags
  ? requestedTags.split(",").map((tag) => tag.trim()).filter(Boolean)
  : account
    ? [account]
    : [];

const frontmatter = [
  "---",
  `title: ${JSON.stringify(title)}`,
  `date: ${JSON.stringify(date)}`,
  `type: ${JSON.stringify(requestedType)}`,
  `tags: ${JSON.stringify(tags)}`,
  `excerpt: ${JSON.stringify(description || markdown.replace(/\s+/g, " ").slice(0, 120))}`,
  ...(cover ? [`cover: ${JSON.stringify(cover)}`] : []),
  `sourceUrl: ${JSON.stringify(url)}`,
  'sourceLabel: "查看公众号原文"',
  ...(selfCanonical ? [] : [`canonical: ${JSON.stringify(url)}`]),
  'lang: "zh"',
  "---",
  "",
].join("\n");

const outputDirectory = path.join(process.cwd(), "content", "notes");
const outputPath = path.join(outputDirectory, `${slug}.mdx`);
await fs.mkdir(outputDirectory, { recursive: true });
await fs.writeFile(outputPath, `${frontmatter}${markdown}\n`, "utf8");

console.log(`已导入：${title}`);
console.log(`文件：${path.relative(process.cwd(), outputPath)}`);
console.log(`图片：${imageMap.size} 张${cover ? " + 封面" : ""}`);
