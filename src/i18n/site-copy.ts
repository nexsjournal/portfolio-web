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
    heroSub: "PM & UX & 独立开发者 · 构建有用且有趣的APP",
    heroTitle: "于细微处，为生活作序",
    heroCta: "查看产品 →",
    sections: {
      products: "PRODUCTS",
      productsDesc:
        "一些我折腾出来的小产品，有的是为了解决问题，有的是因为觉得可以更好",
      about: "ABOUT",
      philosophy: "PHILOSOPHY",
      philosophyDesc:
        "我不太相信功能越多越好，更在意的是，用起来有没有阻力",
      contact: "CONTACT",
      contactDesc: "有想法就发给我，我基本都会看",
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
    heroCta: "View products →",
    sections: {
      products: "PRODUCTS",
      productsDesc:
        "Small things I've shipped—some to solve a problem, some because I thought they could be better.",
      about: "ABOUT",
      philosophy: "PHILOSOPHY",
      philosophyDesc:
        "I don't assume more features is better—what I care about is whether it feels effortless to use.",
      contact: "CONTACT",
      contactDesc: "Send me your thoughts—I read almost all of them.",
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
