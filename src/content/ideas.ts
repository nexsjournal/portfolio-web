type IdeaCopy = {
  title: string;
  category: string;
  summary: string;
  features: [string, string];
};

export type Idea = {
  slug: string;
  artwork: "switchelp" | "catgame" | "storyframe" | "framyriad" | "duoblur" | "blanket";
  cover?: string;
  galleryCover?: string;
  stampTitle?: string;
  href?: string;
  sample?: true;
  zh: IdeaCopy;
  en: IdeaCopy;
};

export const ideas: Idea[] = [
  {
    slug: "switchelp",
    artwork: "switchelp",
    galleryCover: "/assets/ideas/switchelp-interface.webp",
    href: "https://github.com/nexsjournal/switchelp-macapp",
    zh: {
      title: "Switchelp",
      category: "开源工具 · macOS",
      summary: "在 Mac 版 Codex 里接入并切换第三方模型。",
      features: ["第三方模型", "Codex 原生切换"],
    },
    en: {
      title: "Switchelp",
      category: "Open-source tool · macOS",
      summary: "Switch third-party models in Codex.",
      features: ["Model providers", "Native picker"],
    },
  },
  {
    slug: "changan-cat-chronicles",
    artwork: "catgame",
    cover: "/assets/ideas/catgame-stamp.webp",
    galleryCover: "/assets/ideas/catgame-cover.webp",
    href: "https://ai-passport.folotoy.cn/plays/2675/",
    zh: {
      title: "长安猫游记",
      category: "AI 小游戏",
      summary: "在 AI Passport 掌机里带四只猫闯长安。",
      features: ["三键操作", "像素长安"],
    },
    en: {
      title: "Changan Cat Chronicles",
      category: "AI game",
      summary: "Guide four cats through Changan on AI Passport.",
      features: ["Three buttons", "Pixel Changan"],
    },
  },
  {
    slug: "storyframe",
    artwork: "storyframe",
    stampTitle: "Storyframe",
    cover: "/assets/ideas/storyframe-stamp.webp",
    galleryCover: "/assets/ideas/storyframe-cover.webp",
    href: "https://github.com/nexsjournal/storyframe-video",
    zh: {
      title: "Storyframe Video",
      category: "开源 Skill · AI 视频",
      summary: "把创意、素材和节拍组织成可验收的视频。",
      features: ["分镜节拍", "自动质检"],
    },
    en: {
      title: "Storyframe Video",
      category: "Open skill · AI video",
      summary: "Turn ideas, assets, and beats into verified videos.",
      features: ["Beat sheets", "Auto QA"],
    },
  },
  {
    slug: "framyriad",
    artwork: "framyriad",
    cover: "/assets/ideas/framyriad-stamp.webp",
    galleryCover: "/assets/ideas/framyriad-hero.webp",
    href: "https://oneframe.space/",
    zh: {
      title: "一帧亿影",
      category: "粤语影像资料库",
      summary: "从台词、角色与取景地重回港片现场。",
      features: ["港片档案", "粤拼台词"],
    },
    en: {
      title: "Framyriad",
      category: "Cantonese cinema archive",
      summary: "Revisit Hong Kong films through lines, faces, and places.",
      features: ["Film archive", "Cantonese lines"],
    },
  },
  {
    slug: "duoblur",
    artwork: "duoblur",
    cover: "/assets/ideas/duoblur-stamp.webp",
    galleryCover: "/assets/ideas/duoblur-cover.webp",
    href: "https://github.com/nexsjournal/duoblur-macapp",
    zh: {
      title: "DuoBlur",
      category: "macOS 工具 · Metal",
      summary: "转头时让屏幕像折叠屏一样卷起模糊。",
      features: ["头部追踪", "折页模糊"],
    },
    en: {
      title: "DuoBlur",
      category: "macOS tool · Metal",
      summary: "Fold the screen into blur when you turn your head.",
      features: ["Head tracking", "Fold blur"],
    },
  },
  {
    slug: "desktop-rug",
    artwork: "blanket",
    cover: "/assets/ideas/blanket-stamp.webp",
    galleryCover: "/assets/ideas/blanket-rug.webp",
    href: "https://github.com/nexsjournal/desktop-blanket",
    zh: {
      title: "桌面毛毯",
      category: "macOS 小玩具 · 布料物理",
      summary: "在桌面图标上铺一块会飘会折的毛毯。",
      features: ["3D 布料", "鼠标穿透"],
    },
    en: {
      title: "Desktop Rug",
      category: "macOS toy · Cloth physics",
      summary: "Drape a simulated rug over your desktop icons.",
      features: ["3D cloth", "Click-through"],
    },
  },
];

export const featuredIdeaCount = 6;
export const displayedIdeas = ideas;
