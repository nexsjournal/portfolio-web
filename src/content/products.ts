export type Product = {
  /** 资源目录名，对应 `public/assets/products/<slug>/`（可与对外 URL 不同） */
  slug: string;
  /**
   * 详情页路径（不含前后斜杠），如 travelroutes、rephoto、altitudeshot。
   * 仅已上线产品填写；`generateStaticParams` 与站内链接均用此字段。
   * 若历史上曾使用 `/products/<slug>`，middleware 会按 slug 查到本产品并 308 到 `/<path>`，无需再改 next.config。
   */
  path?: string;
  name: string;
  /** 对外英文标识（如应用名、商店名） */
  nameEn?: string;
  tagline: string;
  taglineEn?: string;
  summary: string;
  summaryEn?: string;
  category: string;
  categoryEn?: string;
  language: string;
  languageEn?: string;
  size: string;
  sizeEn?: string;
  platform: string;
  platformEn?: string;
  platformUrl?: string;
  features: string[];
  featuresEn?: string[];
  comingSoon?: boolean;
  /** 覆盖默认的 `/assets/products/<slug>/icon.png`，用于 .jpg / .webp 等 */
  iconSrc?: string;
  /** 详情页横向截图，如 `/assets/products/<slug>/screens/01.jpg` */
  screenshots?: string[];
  privacyUrl?: string;
  termsUrl?: string;
};

export const products: Product[] = [
  {
    slug: "echosnap",
    path: "rephoto",
    name: "归影",
    nameEn: "RePhoto",
    tagline:
      "让回忆更清晰，让相册更轻盈。用滑动手势快速保留、删除与收藏，整理变得轻松上瘾。",
    taglineEn:
      "Clearer memories, a lighter camera roll. Swipe to keep, delete, and favorite—cleaning becomes addictive.",
    summary:
      "归影用滑动手势帮你快速整理照片与视频：分组审阅、撤销收藏、影历回顾、空间统计，让清理变得轻松上瘾。",
    summaryEn:
      "RePhoto helps you declutter photos and videos with swipe gestures—group review, undo & favorites, timeline recap, and storage stats that make cleaning addictive.",
    category: "照片与整理",
    categoryEn: "Photos & Organizing",
    language: "中文",
    languageEn: "Chinese",
    size: "5.3 MB",
    sizeEn: "5.3 MB",
    platform: "iOS",
    platformEn: "iOS",
    platformUrl:
      "https://apps.apple.com/cn/app/%E5%BD%92%E5%BD%B1/id6764041103",
    features: [
      "滑动式审阅：照片/视频左右保留、上滑删除，单手更顺手",
      "分组筛选：截屏/自拍/实况/动图等一键聚合",
      "影历视图：按年/月回顾清理进度，清理成果可视化",
      "统计与空间收益：删除数量与空间节省一目了然",
      "常用工具：撤销、收藏、分享、信息查看（拍摄时间/文件信息等）",
    ],
    featuresEn: [
      "Swipe review: keep with left/right, delete with up—one-hand friendly",
      "Group filters: screenshots, selfies, Live Photos, GIFs, and more in one tap",
      "Timeline view: review progress by year/month with clear visual feedback",
      "Stats & storage gains: deleted items and space saved at a glance",
      "Tools: undo, favorite, share, and inspect info (time, file details, etc.)",
    ],
    iconSrc: "/assets/products/echosnap/icon.jpg",
    screenshots: [
      "/assets/products/echosnap/screens/01.jpg",
      "/assets/products/echosnap/screens/02.jpg",
      "/assets/products/echosnap/screens/03.jpg",
      "/assets/products/echosnap/screens/04.jpg",
      "/assets/products/echosnap/screens/05.jpg",
    ],
    privacyUrl: "https://nexsjournal.github.io/echosnap-legal/privacy-policy.html",
    termsUrl: "https://nexsjournal.github.io/echosnap-legal/terms-of-service.html",
  },
  {
    slug: "travel-route",
    path: "travelroutes",
    name: "旅迹时光",
    nameEn: "TravelRoute",
    tagline:
      "旅迹时光是一款专为旅行者设计的应用，让你的旅程轨迹变成生动的动画视频。",
    taglineEn:
      "A travel app that turns your route into cinematic animated journey videos.",
    summary:
      "通过简单的地点添加和路线编辑，即可生成专业的旅行路线动画，并导出为高质量视频，完美记录你的旅行故事。",
    summaryEn:
      "Create polished travel route animations with simple waypoint editing and export high-quality videos to tell your trip story.",
    category: "旅游与记录",
    categoryEn: "Travel & Journaling",
    language: "中文 / English",
    languageEn: "Chinese / English",
    size: "29.2 MB",
    sizeEn: "29.2 MB",
    platform: "iOS",
    platformEn: "iOS",
    platformUrl:
      "https://apps.apple.com/cn/app/%E6%97%85%E8%BF%B9%E6%97%B6%E5%85%89/id6761244678",
    features: [
      "多段旅行路线编辑，支持关键节点标注",
      "一键生成路线动画并导出高质量视频",
      "可选风格模板，适配旅行 vlog 与社媒分享",
    ],
    featuresEn: [
      "Multi-stop route editing with key waypoint annotations",
      "Generate animated route videos with one tap and export in high quality",
      "Style templates tailored for travel vlogs and social sharing",
    ],
    iconSrc: "/assets/products/travel-route/icon.jpg",
    screenshots: [
      "/assets/products/travel-route/screens/01.jpg",
      "/assets/products/travel-route/screens/02.jpg",
      "/assets/products/travel-route/screens/03.jpg",
      "/assets/products/travel-route/screens/04.jpg",
      "/assets/products/travel-route/screens/05.jpg",
    ],
    privacyUrl: "https://nexsjournal.github.io/travelroute-legal/privacy-policy.html",
    termsUrl: "https://nexsjournal.github.io/travelroute-legal/terms-of-service.html",
  },
  {
    slug: "altitudeshot",
    path: "altitudeshot",
    name: "实时海拔计",
    nameEn: "AltitudeNow",
    tagline:
      "把「到达这一刻」变成一张值得分享、可收藏的登顶卡片——超大海拔数字与取景画面，一目了然。",
    taglineEn:
      "Turn the moment you arrive into a shareable summit card—huge live altitude and your view, at a glance.",
    summary:
      "不是又一个堆满参数的 GPS 工具箱。打开 App，第一眼就是超大海拔数字和取景画面：你在哪座山、此刻海拔多少，一目了然。拍一张实景，或切换氛围主题一键 Pin，系统自动合成带海拔、地点、气压与精度的 3:4 竖版分享卡，直接保存相册或发到朋友圈、小红书。",
    summaryEn:
      "Not another GPS dashboard. Open the app to a giant live altitude readout and your camera view—where you are on the mountain, right now. Shoot a real scene or pick a themed Pin; we compose a 3:4 share card with altitude, place, pressure, and accuracy—ready for your camera roll or social feeds.",
    category: "户外与记录",
    categoryEn: "Outdoors & Journaling",
    language: "简体中文 / English",
    languageEn: "Chinese / English",
    size: "—",
    sizeEn: "—",
    platform: "iOS",
    platformEn: "iOS",
    features: [
      "实时 GPS 海拔与地点，支持米 / 英尺切换",
      "气压、含氧量估算、经纬度与指南针",
      "登顶卡片：自动合成海拔、地点、气压、精度等信息",
      "到达记录时间线：按日分组，支持详情查看、再次分享与删除",
      "应用内简体中文 / English 切换",
      "App Store 新版本更新提醒",
    ],
    featuresEn: [
      "Live GPS altitude and place names, with meters / feet",
      "Barometric pressure, estimated oxygen, coordinates, and compass",
      "Summit cards: auto-compose altitude, location, pressure, and accuracy",
      "Arrival timeline grouped by day—view, re-share, or delete",
      "In-app Chinese / English",
      "App Store update prompts when a new version is available",
    ],
    privacyUrl: "https://nexsjournal.github.io/altitudeshot-terms/privacy-policy.html",
    termsUrl: "https://nexsjournal.github.io/altitudeshot-terms/terms-of-service.html",
    iconSrc: "/assets/products/altitudeshot/icon.jpg",
    screenshots: [
      "/assets/products/altitudeshot/screens/01.jpg",
      "/assets/products/altitudeshot/screens/02.jpg",
      "/assets/products/altitudeshot/screens/03.jpg",
      "/assets/products/altitudeshot/screens/04.jpg",
      "/assets/products/altitudeshot/screens/05.jpg",
    ],
  },
  {
    slug: "coming-soon",
    name: "敬请期待",
    tagline: "下一个产品正在打磨中，马上见。",
    summary: "新产品尚在开发阶段。",
    category: "TBD",
    language: "TBD",
    size: "TBD",
    platform: "TBD",
    features: ["新方向探索中"],
    comingSoon: true,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getProductByPath(path: string) {
  return products.find((item) => item.path === path);
}

/** 用于 `generateStaticParams` 等，仅含已配置 path 且非即将上线的产品 */
export function getProductPathsForStaticGeneration(): string[] {
  return products.filter((p) => p.path && !p.comingSoon).map((p) => p.path!);
}

/** 图标路径：优先 `iconSrc`，否则默认 `icon.png` */
export function getProductIconPath(product: Product): string {
  if (product.comingSoon) return "";
  return product.iconSrc ?? `/assets/products/${product.slug}/icon.png`;
}
