import type { NoteSummary } from "@/content/notes";

export type HomeNote = NoteSummary & { previewHref?: string };

/** 本地未配置 Blob 时用于预览首页「精选笔记」，线上仍以真实笔记数据为准。 */
export const homeNotesFallback: HomeNote[] = [
  {
    slug: "wechat-20261117-h3ctp4s3JR",
    title: "最近爆火的透视切换视频，原来是这么做出来的！",
    date: "2026-11-17",
    type: "article",
    tags: ["工具推荐"],
    excerpt: "一座城市、一处熟悉的场景，被压进一张画里。镜头一转，藏在画里的空间慢慢展开。",
    cover: "https://jfrpb3pgmttgpf4v.public.blob.vercel-storage.com/notes/assets/wechat-20261117-h3ctp4s3JR/1795317529536-cover.jpeg",
    sourceUrl: "https://mp.weixin.qq.com/s/h3ct_p4s3J-RVLcYLvYVag",
    previewHref: "https://mp.weixin.qq.com/s/h3ct_p4s3J-RVLcYLvYVag",
    lang: "zh",
  },
  {
    slug: "wechat-20261110-wq1gCODpf7",
    title: "Vibe 的产品总感觉不精致？试试用24个图标库让它变好看！",
    date: "2026-11-10",
    type: "article",
    tags: ["资源素材"],
    excerpt: "16 套 UI 图标库、4 个图标汇总站、4 个品牌 logo 站，一共 24 个，附首页截图、常用图标和给 AI 的选库提示词。",
    cover: "https://jfrpb3pgmttgpf4v.public.blob.vercel-storage.com/notes/assets/wechat-20261110-wq1gCODpf7/1795317140954-cover.jpeg",
    sourceUrl: "https://mp.weixin.qq.com/s/wq1g_CODpf7ivay3KFu3Ew",
    previewHref: "https://mp.weixin.qq.com/s/wq1g_CODpf7ivay3KFu3Ew",
    lang: "zh",
  },
  {
    slug: "wechat-20261108-hWw0KD5XVj",
    title: "最近很火的鼠标集群效果到底是什么？ Swarm Rebuild 说正是在下！",
    date: "2026-11-08",
    type: "article",
    tags: ["工具推荐"],
    excerpt: "一群彩色光标同时搭建网页？试试 Swarm Rebuild，看看它如何把现有页面变成一段重建动画。",
    cover: "https://jfrpb3pgmttgpf4v.public.blob.vercel-storage.com/notes/assets/wechat-20261108-hWw0KD5XVj/1795317436998-cover.jpeg",
    sourceUrl: "https://mp.weixin.qq.com/s/hWw0KD5XVjLvtBh09y_QZg",
    previewHref: "https://mp.weixin.qq.com/s/hWw0KD5XVjLvtBh09y_QZg",
    lang: "zh",
  },
];
