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
  whoFor: {
    title: string;
    bullets: string[];
  };
  features: {
    title: string;
    items: { title: string; body: string }[];
  };
  gallery: {
    title: string;
    hint: string;
    emptyHint: string;
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
  email: "tenthproducts@zohomail.cn",
  social: {
    github: "https://github.com/nexsjournal",
    x: "https://x.com/justraylex",
  },
};

export const SITE_COPY: Record<Language, SiteCopy> = {
  zh: {
    meta: {
      title: "Lex · 独立开发者 · 产品作品集",
      description:
        "Lex（独立开发者）的个人网站：展示产品、理念与联系方式。深色科技风、蓝青撞色、偏叙事与交互体验。",
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
      headline: "于细微处，为生活作序",
      subhead:
        "独立开发、产品叙事与持续迭代。这里集中展示我当前在做的工具型应用，以及我如何打磨交互与信息结构。",
      primaryCta: "查看旅迹时光",
      secondaryCta: "联系合作",
      micro: [],
    },
    about: {
      title: "关于我",
      body: [
        "我是 Lex，一名独立开发者。工作方式偏「小而完整」：从问题定义、信息架构到动效与反馈，尽量让每一步都可被理解，而不是堆功能清单。",
        "我主要面向 iOS（以及后续会考虑的 Android）做工具型产品：关注路径是否更短、状态是否更清晰、错误是否可恢复。旅迹时光是我当前投入最多的一款——把真实路线、预览与回忆组织成一段可观看、可分享的旅程叙事。",
        "这个站点本身是静态作品集：用来集中呈现产品说明、截图与联系方式。若你有合作、定制工具或想交流独立开发流程，欢迎通过页面底部的邮件与我联系。",
      ],
      stats: [
        { label: "当前产品", value: "旅迹时光（上架准备中）" },
        { label: "平台", value: "iOS 优先" },
        { label: "协作方式", value: "独立交付" },
      ],
    },
    featured: {
      title: "旅迹时光",
      badge: "FEATURED APP",
      body:
        "旅迹时光是一款在 iPhone 上使用的旅行路线创作工具：在地图上规划起点、终点与途经点，基于 Apple MapKit 计算道路级路径，搭配多种交通方式与 3D 动画预览，把旅程变成可观看、可导出的短视频；标记点可绑定相册照片，在预览与成片里「到点出图」，让路线成为带记忆的叙事。",
      bullets: [
        "真实路线：用系统地图能力计算路段，路线贴近道路与分段逻辑",
        "可观看的旅程：多交通工具、相机运动与 3D 呈现，预览即「小成片」",
        "点点回忆：标记点绑定相册图片（每点最多 3 张），在对应位置展示",
        "可分享产出：多比例导出视频至相册，并用系统分享面板转发",
        "资产可管理：路线可保存、载入、重命名、删除；示例路线降低上手门槛",
      ],
      cta: "进入详情页",
      mockSubtitle: "路线 · 预览 · 成片",
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
        "Lex is an indie developer building focused iOS/Android utilities. Dark, futuristic portfolio with blue/teal accents and narrative-first layouts.",
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
      headline: "Order life in the small moments.",
      subhead:
        "Indie development, product storytelling, and steady iteration. This site highlights the utilities I’m building and how I shape interaction and information architecture.",
      primaryCta: "View Journey Time",
      secondaryCta: "Contact",
      micro: [],
    },
    about: {
      title: "About",
      body: [
        "I’m Lex—an indie developer who prefers small, complete slices of work: from problem framing and IA to motion and feedback, I aim for clarity at every step—not a pile of features.",
        "I build tool-style apps primarily for iOS (with Android in mind later). I care whether paths are shorter, states are clearer, and errors are recoverable. Journey Time is my current focus—turning real routes, previews, and memories into a watchable, shareable trip story.",
        "This portfolio is a static site: product notes, screenshots, and contact. If you’d like to collaborate, commission a utility, or chat indie workflows, email me via the footer.",
      ],
      stats: [
        { label: "Shipping", value: "Journey Time (in review)" },
        { label: "Platforms", value: "iOS-first" },
        { label: "Mode", value: "Indie / solo" },
      ],
    },
    featured: {
      title: "旅迹时光 · Journey Time",
      badge: "FEATURED APP",
      body:
        "Journey Time is a route-creation tool for iPhone: plan start, end, and stops on the map, compute road-level paths with Apple MapKit, preview with multiple transport modes and 3D motion, and export a shareable short video. Bind photos from your library to stops so images appear at the right moments—routes become memory-rich stories.",
      bullets: [
        "Real routes: MapKit-powered segments that follow roads and logical legs—not freehand scribbles",
        "Watchable journeys: transport modes, camera motion, and 3D—preview feels like a mini film",
        "Moments at stops: up to 3 photos per pin, shown in preview and export",
        "Shareable output: export video to Photos and share via the system sheet",
        "Manageable library: save, load, rename, delete; sample routes lower the learning curve",
      ],
      cta: "Open details",
      mockSubtitle: "Route · Preview · Export",
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
        "旅迹时光：在 iPhone 上用地图规划旅行路线，基于 MapKit 计算道路级路径，3D 预览与视频导出，标记点可绑定相册照片，让旅程成为可分享的叙事。",
    },
    hero: {
      kicker: "APP",
      name: "旅迹时光",
      tagline: "记录旅途轨迹，一键导出视频",
      status: "App Store 审核中（页面会随上架状态更新）",
    },
    story: {
      title: "产品是什么",
      body: [
        "旅迹时光是一款在 iPhone 上使用的旅行路线创作工具。你可以在地图上规划起点、终点与途经点，应用基于 Apple MapKit 计算道路级路径，搭配多种交通工具与 3D 动画预览，把整条旅程变成一段可观看、可导出的短视频；同时支持在标记点绑定相册中的旅行照片，在预览与成片里「到点出图」，让路线不仅是轨迹，更是带记忆的旅程叙事。",
        "它尽量在本地完成创作闭环：从编辑路线、切换预览方式，到导出与整理路线资产，减少「必须登录某服务器才能用」的门槛，更适合把工具当作随身创作箱的用户。",
      ],
    },
    whoFor: {
      title: "为谁而做",
      bullets: [
        "喜欢把旅行、出差、自驾、打卡路线整理成可视化作品的人",
        "希望发社交内容时不仅有图，还有动态路线与节奏感的人",
        "需要一款不依赖服务器账号也能完成创作与导出的工具型用户",
      ],
    },
    features: {
      title: "核心价值",
      items: [
        {
          title: "真实路线",
          body: "使用系统地图能力计算路段，路线贴近道路与分段逻辑，而非随手画线。",
        },
        {
          title: "可观看的旅程",
          body: "多交通工具、相机运动与 3D 呈现，预览即「小成片」体验。",
        },
        {
          title: "点点回忆",
          body: "标记点可绑定相册图片（每点最多 3 张），预览与导出时在对应位置展示。",
        },
        {
          title: "可分享产出",
          body: "支持多比例导出视频至相册，并通过系统分享面板转发。",
        },
        {
          title: "资产可管理",
          body: "路线可保存、载入、重命名、删除；提供示例路线降低上手门槛。",
        },
      ],
    },
    gallery: {
      title: "宣传与截图",
      hint: "以下为竖屏比例下的界面与宣传预览（与常见 iPhone 全屏截图比例一致），可左右滑动浏览。",
      emptyHint: "预览素材就绪后，将在此处展示。",
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
        "Journey Time: plan travel routes on iPhone with MapKit road paths, 3D previews, video export, and photos bound to stops—stories you can watch and share.",
    },
    hero: {
      kicker: "APP",
      name: "Journey Time",
      tagline: "Record your route, export video in one tap.",
      status: "App Store review in progress (this page updates as status changes)",
    },
    story: {
      title: "What it is",
      body: [
        "Journey Time is a route-creation app for iPhone. Plan start, end, and stops on the map; MapKit computes road-level paths across transport modes with 3D animated previews, turning the whole trip into a short video you can export. Bind photos from your library to pins so images appear at the right moments—routes become memory-rich stories, not just lines on a map.",
        "The workflow stays local-first: edit, preview, export, and organize routes without tying you to a server account—built for people who want a portable creation toolbox.",
      ],
    },
    whoFor: {
      title: "Who it’s for",
      bullets: [
        "People who turn trips, drives, and check-ins into visual stories",
        "Creators who want motion and rhythm—not only stills—when posting",
        "Users who prefer finishing and exporting without a mandatory cloud login",
      ],
    },
    features: {
      title: "Core value",
      items: [
        {
          title: "Real routes",
          body: "MapKit-backed legs that follow roads and sensible segments—not freehand doodles.",
        },
        {
          title: "Watchable journeys",
          body: "Transport modes, camera motion, and 3D—preview feels like a mini film.",
        },
        {
          title: "Memories at stops",
          body: "Up to 3 photos per pin, shown in preview and export where it matters.",
        },
        {
          title: "Shareable output",
          body: "Export video to Photos and share through the system share sheet.",
        },
        {
          title: "Manageable assets",
          body: "Save, load, rename, delete; sample routes help you get started fast.",
        },
      ],
    },
    gallery: {
      title: "Promos & screenshots",
      hint: "Portrait previews below match common full-screen iPhone capture proportions—scroll horizontally to browse.",
      emptyHint: "Previews will appear here once assets are ready.",
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
