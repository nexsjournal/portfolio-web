# Notes 内容格式

`/notes` 读取本目录下的 `.md` / `.mdx` 文件。文件名即 URL slug，例如 `my-note.mdx` → `/notes/my-note`。

## Frontmatter

```yaml
---
title: "文章标题"
date: "2026-11-22"
type: "article" # article | video | event | note
tags: ["标签一", "标签二"]
excerpt: "列表页摘要"
cover: "/assets/notes/<slug>/cover.jpg"
sourceUrl: "https://mp.weixin.qq.com/s/..."
sourceLabel: "查看公众号原文"
canonical: "https://mp.weixin.qq.com/s/..."
lang: "zh"
---
```

`draft: true` 的文章不会出现在列表、构建或 sitemap 中。

## 在网站后台即时发布

登录 `/studio` 后可直接粘贴公众号链接、完整 HTML 或纯文本。内容会写入 Vercel Blob，并在 Notes 前台即时出现，不会触发 Git 提交或重新部署。正文图片默认保留公众号链接；需要避免外链失效时，切到“转存到 Blob”。Blob 中的文章也可以在后台删除。

## 公众号文章导入

公众号发布后，复制文章链接执行：

```bash
npm run import:wechat -- "https://mp.weixin.qq.com/s/..." --tags "产品,独立开发"
```

脚本会抓取正文与封面、下载公众号图片到 `public/assets/notes/<slug>/`，并生成 MDX。默认把 canonical 指回公众号原文，避免同一篇内容在搜索引擎里重复竞争；如果希望网站作为 canonical，加 `--canonical-self`。

可选参数：`--slug`、`--type`、`--tags`、`--no-images`、`--canonical-self`。
