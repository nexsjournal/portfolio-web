type IdeaCopy = {
  title: string;
  category: string;
  summary: string;
  features: [string, string];
};

export type Idea = {
  slug: string;
  artwork: "switchelp" | "crt" | "camera" | "stationery" | "postcard" | "notes";
  cover?: string;
  galleryCover?: string;
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
      category: "开源工具",
      summary: "在 Mac 版 Codex 里接入并切换第三方模型。",
      features: ["第三方模型", "Codex 原生切换"],
    },
    en: {
      title: "Switchelp",
      category: "Open-source tool",
      summary: "Switch third-party models in Codex.",
      features: ["Model providers", "Native picker"],
    },
  },
];

const sampleIdeas: Idea[] = [
  {
    slug: "sample-retro-crt",
    artwork: "crt",
    cover: "/assets/hero/retro-crt.webp",
    sample: true,
    zh: { title: "复古电脑", category: "交互实验", summary: "在复古电脑屏幕上切换不同的 App 展示。", features: ["复古 CRT", "切换 App"] },
    en: { title: "Retro CRT", category: "Interaction", summary: "Switch app previews on a CRT.", features: ["Retro CRT", "Switch apps"] },
  },
  {
    slug: "sample-instant-camera",
    artwork: "camera",
    cover: "/assets/hero/polaroid-camera-front-v2.webp",
    sample: true,
    zh: { title: "网页拍立得", category: "网页功能", summary: "在浏览器里拍一张拍立得风格的合影。", features: ["按下快门", "拍立得合影"] },
    en: { title: "Instant Camera", category: "Web feature", summary: "Take instant portraits on the web.", features: ["Quick shutter", "Instant portrait"] },
  },
  {
    slug: "sample-desk-stationery",
    artwork: "stationery",
    cover: "/assets/hero/desk-stationery.webp",
    sample: true,
    zh: { title: "桌面文具", category: "视觉小样", summary: "用纸张和文具拼贴出一张数字桌面。", features: ["纸张纹理", "桌面拼贴"] },
    en: { title: "Desk Objects", category: "Visual study", summary: "Arrange stationery on a digital desk.", features: ["Paper textures", "Desk collage"] },
  },
  {
    slug: "sample-travel-postcard",
    artwork: "postcard",
    cover: "/assets/contact/lake.webp",
    sample: true,
    zh: { title: "旅行明信片", category: "图像小样", summary: "把旅途中的照片做成一张明信片。", features: ["湖光山色", "旅行影像"] },
    en: { title: "Travel Postcard", category: "Image study", summary: "Turn a travel photo into a postcard.", features: ["Mountain lakes", "Travel photos"] },
  },
  {
    slug: "sample-pocket-notes",
    artwork: "notes",
    sample: true,
    zh: { title: "口袋短记", category: "排版小样", summary: "把随手记的灵感排成口袋笔记本。", features: ["随手记录", "纸页排版"] },
    en: { title: "Pocket Notes", category: "Layout study", summary: "A pocket layout for quick ideas.", features: ["Quick notes", "Paper layouts"] },
  },
];

export const featuredIdeaCount = 6;
export const displayedIdeas = [...ideas, ...sampleIdeas.slice(0, Math.max(0, featuredIdeaCount - ideas.length))];
