import type { SiteLang } from "@/context/site-language";

export const siteCopy = {
  zh: {
    nav: {
      products: "产品",
      about: "关于",
      philosophy: "理念",
      contact: "联系",
    },
    heroBadge: "设计 · 体验 · 创造",
    heroSub:
      "PM & UX & 独立开发者 · 构建有用且有趣的APP",
    heroTitle: "于细微处，为生活作序",
    sections: {
      products: "PRODUCTS",
      productsDesc:
        "独立开发的应用与实验合集。每一件作品都追求清晰叙事、顺手交互，以及能带出门的真实完成度。",
      about: "ABOUT",
      philosophy: "PHILOSOPHY",
      philosophyDesc:
        "几条长期有效的原则：不堆概念，只保留经得起反复使用的设计选择。",
      contact: "CONTACT",
      contactDesc:
        "可通过邮件或社媒联系；我会认真阅读，回复可能需要一点时间。",
    },
    products: {
      open: "查看详情",
      openBtn: "了解详情",
      soon: "敬请期待",
      soonBadge: "筹备中",
    },
    productDetail: {
      back: "← 返回产品",
      category: "分类",
      language: "语言",
      size: "大小",
      platform: "上架平台",
      screenshots: "截图预览",
      features: "核心功能",
    },
  },
  en: {
    nav: {
      products: "Products",
      about: "About",
      philosophy: "Philosophy",
      contact: "Contact",
    },
    heroBadge: "Design · Experience · Create",
    heroSub: "PM & UX & Indie dev · Building useful, delightful apps.",
    heroTitle: "Ordering life, in the smallest details.",
    sections: {
      products: "PRODUCTS",
      productsDesc:
        "A set of indie apps and experiments—clear stories, crisp UX, and real shipping quality.",
      about: "ABOUT",
      philosophy: "PHILOSOPHY",
      philosophyDesc:
        "A few principles that hold up: no buzzwords, only choices that survive daily use.",
      contact: "CONTACT",
      contactDesc:
        "Reach out by email or social—I read everything; replies may take a moment.",
    },
    products: {
      open: "Details",
      openBtn: "Open",
      soon: "Coming soon",
      soonBadge: "In progress",
    },
    productDetail: {
      back: "← Back to products",
      category: "Category",
      language: "Language",
      size: "Size",
      platform: "Platform",
      screenshots: "Screenshots",
      features: "Key features",
    },
  },
} as const;

export function t(lang: SiteLang) {
  return siteCopy[lang];
}
