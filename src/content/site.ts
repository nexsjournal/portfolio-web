export type Language = "zh" | "en";

export type SiteCopy = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    product: string;
    philosophy: string;
    contact: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    micro: string[];
  };
  about: {
    title: string;
    body: string[];
    stats: { label: string; value: string }[];
  };
  featured: {
    title: string;
    body: string;
    bullets: string[];
    cta: string;
    badge: string;
    /** 首页产品区右侧示意卡片副文案 */
    mockSubtitle: string;
  };
  philosophy: {
    title: string;
    items: { title: string; body: string }[];
  };
  contact: {
    title: string;
    body: string;
    emailLabel: string;
    socialLabel: string;
  };
  footer: {
    note: string;
  };
};

export type JourneyTimeCopy = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    kicker: string;
    name: string;
    tagline: string;
    status: string;
  };
  story: {
    title: string;
    body: string[];
  };
  features: {
    title: string;
    items: { title: string; body: string }[];
  };
  gallery: {
    title: string;
    hint: string;
  };
  download: {
    title: string;
    body: string;
    appStore: string;
    playStore: string;
    comingSoon: string;
  };
};

export const siteConfig = {
  name: "Lex",
  domain: "lextellsyou.asia",
  email: "hello@lextellsyou.asia",
  social: {
    github: "https://github.com/",
    x: "https://x.com/",
  },
};

export const SITE_COPY: Record<Language, SiteCopy> = {
  zh: {
    meta: {
      title: "Lex · 独立开发者 · 产品作品集",
      description:
        "Lex（独立开发者）的个人网站：展示产品、理念与联系方式。深色科技风、蓝橙撞色、偏叙事与交互体验。",
    },
    nav: {
      home: "首页",
      about: "关于",
      product: "产品",
      philosophy: "方法",
      contact: "联系",
    },
    hero: {
      kicker: "INDIE APP MAKER · LEX",
      headline: "把工具做成可感知的体验。",
      subhead:
        "我专注做 iOS/Android 上的小而强工具：更快、更干净、更“顺手”。这里是我的作品集、产品叙事与持续更新。",
      primaryCta: "查看旅迹时光",
      secondaryCta: "联系合作",
      micro: [],
    },
    about: {
      title: "关于我",
      body: [
        "我是 Lex，一名独立开发者。我喜欢把复杂问题拆解成可复用的结构，把“好用”变成“愿意天天打开”。",
        "我的产品通常以体验为先：动效、反馈、节奏、空状态，都不是“装饰”，而是让用户更确定自己在做什么。",
      ],
      stats: [
        { label: "当前产品", value: "1 款上架准备中" },
        { label: "平台", value: "iOS / Android" },
        { label: "协作方式", value: "独立交付" },
      ],
    },
    featured: {
      title: "旅迹时光",
      badge: "FEATURED APP",
      body:
        "一款面向旅行记录与路线回忆的工具型 App：把旅程组织成可浏览的时间线，让照片、地点与故事更容易被重新看见。",
      bullets: [
        "时间线串联旅程：关键节点清晰，回忆有顺序与节奏",
        "轻量化记录路径：减少「为了记录而记录」的额外负担",
        "深色界面配合蓝橙强调：夜景、路线与地图信息更易读",
        "照片、地点与文字组合呈现，便于日后回顾与分享",
        "交互与反馈优先：空状态、加载与转场都可被理解",
        "下载与商店入口将随 App Store / Google Play 上架状态更新",
      ],
      cta: "进入详情页",
      mockSubtitle: "时间线 · 旅行记录",
    },
    philosophy: {
      title: "我的构建方式",
      items: [
        {
          title: "体验优先",
          body: "把“可感知反馈”放在功能之前：加载、转场、空状态、错误提示，都要可理解。",
        },
        {
          title: "结构清晰",
          body: "信息架构与命名一致：页面、模块、组件的边界清楚，后续迭代不拖泥带水。",
        },
        {
          title: "性能与可维护",
          body: "静态站点 + 轻量动效：首屏快、交互顺、可访问性不被牺牲。",
        },
      ],
    },
    contact: {
      title: "联系与合作",
      body:
        "如果你有产品合作、定制工具、或想聊聊独立开发流程，欢迎发邮件。",
      emailLabel: "邮件",
      socialLabel: "社交",
    },
    footer: {
      note: "© Lex · lextellsyou.asia",
    },
  },
  en: {
    meta: {
      title: "Lex · Indie Developer · Product Portfolio",
      description:
        "Lex is an indie developer building focused iOS/Android utilities. Dark, futuristic portfolio with blue/orange accents and narrative-first layouts.",
    },
    nav: {
      home: "Home",
      about: "About",
      product: "Product",
      philosophy: "Philosophy",
      contact: "Contact",
    },
    hero: {
      kicker: "INDIE APP MAKER · LEX",
      headline: "Tools that feel like experiences.",
      subhead:
        "I build small, sharp utilities for iOS/Android—fast, clean, and satisfying to use. This site is my portfolio, product story, and changelog hub.",
      primaryCta: "View Journey Time",
      secondaryCta: "Contact",
      micro: [],
    },
    about: {
      title: "About",
      body: [
        "I’m Lex—an indie developer who likes turning messy problems into reusable structure, and turning “usable” into “open-every-day”.",
        "My work is usually experience-first: motion, feedback, pacing, and empty states aren’t decoration—they help users stay oriented.",
      ],
      stats: [
        { label: "Shipping", value: "1 app in review" },
        { label: "Platforms", value: "iOS / Android" },
        { label: "Mode", value: "Indie / solo" },
      ],
    },
    featured: {
      title: "旅迹时光 · Journey Time",
      badge: "FEATURED APP",
      body:
        "A travel journal utility focused on timelines and routes—making trips easier to revisit without turning logging into a chore.",
      bullets: [
        "Timeline-first trips: ordered key moments with a clear rhythm",
        "Lightweight capture: fewer steps, less “logging for logging’s sake”",
        "Dark UI + blue/orange accents: night shots, routes, and maps read cleaner",
        "Photos, places, and notes together—easier to revisit and share",
        "Feedback-first UX: empty states, loading, and transitions stay understandable",
        "Store links will update as App Store / Google Play listings go live",
      ],
      cta: "Open details",
      mockSubtitle: "Timeline · Travel memories",
    },
    philosophy: {
      title: "How I build",
      items: [
        {
          title: "Experience first",
          body: "Feedback before features: loading, transitions, empty states, and errors must be understandable.",
        },
        {
          title: "Clear structure",
          body: "Consistent IA and naming: boundaries between pages/modules/components stay obvious.",
        },
        {
          title: "Fast + maintainable",
          body: "Static site + lightweight motion: fast first paint, smooth interactions, accessibility preserved.",
        },
      ],
    },
    contact: {
      title: "Contact",
      body:
        "For collaborations, product commissions, or indie dev workflows—email is the best channel.",
      emailLabel: "Email",
      socialLabel: "Social",
    },
    footer: {
      note: "© Lex · lextellsyou.asia",
    },
  },
};

export const JOURNEY_TIME_COPY: Record<Language, JourneyTimeCopy> = {
  zh: {
    meta: {
      title: "旅迹时光 · Journey Time",
      description:
        "旅迹时光：旅行记录与路线回忆的工具型 App。深色主题、清晰时间线、强调轻量记录与可回看体验。",
    },
    hero: {
      kicker: "APP",
      name: "旅迹时光",
      tagline: "把旅程整理成可浏览的时间线。",
      status: "App Store 审核中（页面会随上架状态更新）",
    },
    story: {
      title: "产品故事",
      body: [
        "旅行最容易被“遗忘在相册里”。旅迹时光希望把路线、地点与故事组织成一条可回看的旅程，而不是一堆散点。",
        "我尽量让记录变轻：少一点表单，多一点“当下就能完成”的动作；把复杂留给后台结构，而不是用户界面。",
      ],
    },
    features: {
      title: "核心体验",
      items: [
        {
          title: "旅程时间线",
          body: "把关键节点串起来，让回忆有顺序、有节奏。",
        },
        {
          title: "轻量记录",
          body: "减少“为了记录而记录”的路径，让完成更自然。",
        },
        {
          title: "深色界面",
          body: "夜景照片与地图信息更耐看，强调色用于关键状态与引导。",
        },
      ],
    },
    gallery: {
      title: "宣传与截图",
      hint: "Logo（1:1）放 `logo/`，竖版宣传图与截图（建议 9:16）放 `marketing/` 与 `screens/`（见 README）。",
    },
    download: {
      title: "下载",
      body: "当 App Store / Google Play 链接可用时，这里会替换为真实按钮与二维码区域。",
      appStore: "App Store",
      playStore: "Google Play",
      comingSoon: "即将上架",
    },
  },
  en: {
    meta: {
      title: "Journey Time · 旅迹时光",
      description:
        "Journey Time: a travel journal utility focused on timelines and revisiting trips—dark UI, crisp structure, lightweight capture.",
    },
    hero: {
      kicker: "APP",
      name: "Journey Time",
      tagline: "Turn your trip into a browsable timeline.",
      status: "App Store review in progress (this page updates as status changes)",
    },
    story: {
      title: "Story",
      body: [
        "Trips often get lost in camera rolls. Journey Time organizes routes, places, and moments into a timeline you can revisit.",
        "I keep capture lightweight: fewer forms, more “finish in the moment” flows—complexity hides in structure, not UI.",
      ],
    },
    features: {
      title: "Core experience",
      items: [
        {
          title: "Trip timeline",
          body: "Connect key moments so memories have order and rhythm.",
        },
        {
          title: "Lightweight logging",
          body: "Reduce friction—make completion feel natural.",
        },
        {
          title: "Dark UI",
          body: "Night shots and map details read better; accents guide state.",
        },
      ],
    },
    gallery: {
      title: "Screens & marketing",
      hint: "Logo (1:1) in `logo/`; portrait promos & screenshots (9:16 recommended) in `marketing/` and `screens/` (see README).",
    },
    download: {
      title: "Download",
      body: "When store links are ready, this section becomes real buttons + QR area.",
      appStore: "App Store",
      playStore: "Google Play",
      comingSoon: "Coming soon",
    },
  },
};
