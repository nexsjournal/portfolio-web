export type Product = {
  /** 资源目录名，对应 `public/assets/products/<slug>/`（可与对外 URL 不同） */
  slug: string;
  /**
   * 详情页路径（不含前后斜杠），如 travelroutes、rephoto、altitudeshot。
   * 仅已上线产品填写；`generateStaticParams` 与站内链接均用此字段。
   * 若历史上曾使用 `/products/<slug>` 或 `/work/<caseSlug>`，middleware 会统一 308 到 `/projects/<caseSlug>`。
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
  /** 产品详情页 CTA 文案，默认使用 App Store 下载 */
  actionLabel?: string;
  actionLabelEn?: string;
  features: string[];
  featuresEn?: string[];
  comingSoon?: boolean;
  /** 覆盖默认的 `/assets/products/<slug>/icon.png`，用于 .jpg / .webp 等 */
  iconSrc?: string;
  /** 详情页横向截图，如 `/assets/products/<slug>/screens/01.jpg` */
  screenshots?: string[];
  /** 截图布局：手机竖屏或桌面横屏 */
  screenshotLayout?: "phone" | "desktop";
  /** 截图统一宽高比，供 Next Image 与卡片预览使用 */
  screenshotWidth?: number;
  screenshotHeight?: number;
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
      "专为户外爱好者与旅行打卡者打造。超大字号实时海拔、GPS 经纬度、气压与指南针数据一屏呈现；一拍一 Pin 自动合成适合小红书、朋友圈的精美分享卡。",
    summaryEn:
      "Built for outdoor lovers and travel check-ins. Giant live altitude, GPS coordinates, barometric pressure, and compass on one screen—one shot, one Pin, beautiful cards ready for social feeds.",
    category: "户外与记录",
    categoryEn: "Outdoors & Journaling",
    language: "简体中文 / English",
    languageEn: "Chinese / English",
    size: "6.5 MB",
    sizeEn: "6.5 MB",
    platform: "iOS",
    platformEn: "iOS",
    platformUrl: "https://apps.apple.com/cn/app/id6773985059",
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
    slug: "flowdo",
    path: "flowdo",
    name: "FlowDo",
    nameEn: "FlowDo",
    tagline:
      "把今天过清楚一点。待办、句子与手账，本地优先，先记下来，再慢慢整理。",
    taglineEn:
      "A quieter place for tasks, saved sentences, and journal pages. Local-first, capture first, organize later.",
    summary:
      "FlowDo 是一套本地优先的待办与句子收藏工具：Mac 菜单栏和快捷键负责快速记录，主窗口与 iOS 五个标签页负责整理和回看。不需要注册账户，也不上传个人数据。",
    summaryEn:
      "FlowDo is a local-first task and quote keeper. The Mac menu bar and shortcuts capture things quickly; the main window and five iOS tabs help you arrange and revisit them. No account, no upload.",
    category: "效率与记录",
    categoryEn: "Productivity & Journaling",
    language: "中文",
    languageEn: "Chinese",
    size: "—",
    sizeEn: "—",
    platform: "macOS · iOS",
    platformEn: "macOS · iOS",
    features: [
      "Mac 菜单栏、全局快捷键与快捷面板：不离开当前工作就能记下一件事",
      "今天、看板、句子、手账与设置五个 iOS 标签页，任务和句子各有归处",
      "计划日、截止时间与提醒时间相互独立，支持系统通知",
      "本地优先：不需要账户或后端，支持 JSON 备份导入与导出",
      "浅色 / 深色 / 跟随系统，支持键盘操作、VoiceOver 与减少动态效果",
    ],
    featuresEn: [
      "Mac menu bar, global shortcuts, and a quick panel for capture without leaving your work",
      "Five iOS tabs—Today, Board, Quotes, Journal, and Settings—for tasks and saved sentences",
      "Separate planned date, due time, and reminder time, with system notifications",
      "Local-first: no account or backend, with JSON backup import and export",
      "Light, dark, or system appearance with keyboard control, VoiceOver, and reduced motion",
    ],
    iconSrc: "/assets/products/flowdo/icon.png",
    screenshots: [
      "/assets/products/flowdo/screens/01.webp",
      "/assets/products/flowdo/screens/02.webp",
      "/assets/products/flowdo/screens/03.webp",
      "/assets/products/flowdo/screens/04.webp",
    ],
    screenshotLayout: "phone",
    screenshotWidth: 900,
    screenshotHeight: 1957,
  },
  {
    slug: "aray-studio",
    path: "aray-studio",
    name: "ARay Studio",
    nameEn: "ARay Studio",
    tagline:
      "录屏、剪辑、字幕与导出，在一个 Mac App 里做完。字幕留在本机，成片直接进入分享场景。",
    taglineEn:
      "Record, edit, caption, and export in one Mac app. Subtitles stay on-device, and the finished video is ready to share.",
    summary:
      "ARay Studio 是一套 macOS 原生的录屏与剪辑工作流：悬浮录制条、时间线剪辑、摄像头与光标效果、离线字幕、章节和缩放标记，以及 1080p60 导出。预览与导出共用同一套合成器。",
    summaryEn:
      "ARay Studio is a native macOS recording and editing workflow: a floating recorder, timeline editing, camera and cursor effects, offline captions, chapters, zoom markers, and 1080p60 export. Preview and export share one compositor.",
    category: "影音与创作",
    categoryEn: "Video & Creation",
    language: "简体中文 / English",
    languageEn: "Chinese / English",
    size: "99 MB",
    sizeEn: "99 MB",
    platform: "macOS",
    platformEn: "macOS",
    features: [
      "屏幕、窗口或区域录制，支持系统声音、麦克风与摄像头",
      "多轨时间线：切分、重排、转场、变速、章节、缩放与打码",
      "本地 Whisper / Apple 本机识别生成字幕，音频不出本机",
      "预览与导出共用无状态合成器，所见即所得",
      "MP4 / GIF / SRT 导出，支持 1080p60 与逐段镜头布局",
      "本机 HTTP Agent 接口，可让 Codex / Claude Code 操作正在运行的 App",
    ],
    featuresEn: [
      "Record the screen, a window, or a region with system audio, microphone, and camera",
      "Multi-track timeline with cuts, reordering, transitions, speed, chapters, zooms, and redaction",
      "On-device Whisper or Apple speech recognition for captions; audio never leaves the Mac",
      "Preview and export share one stateless compositor for true WYSIWYG",
      "MP4, GIF, and SRT export at 1080p60, with per-clip camera layouts",
      "A local HTTP agent endpoint lets Codex or Claude Code control the running app",
    ],
    iconSrc: "/assets/products/aray-studio/icon.svg",
    screenshots: [
      "/assets/products/aray-studio/screens/01.webp",
      "/assets/products/aray-studio/screens/02.webp",
      "/assets/products/aray-studio/screens/03.webp",
      "/assets/products/aray-studio/screens/04.webp",
    ],
    screenshotLayout: "desktop",
    screenshotWidth: 1600,
    screenshotHeight: 1000,
  },
  {
    slug: "colpix",
    path: "colpix",
    name: "可图",
    nameEn: "Colpix",
    tagline:
      "网页图片、截图与影音素材，收进一个本地优先的图库。拖一下，灵感归你。",
    taglineEn:
      "A local-first home for web images, screenshots, and media references. Drag it in, keep it yours.",
    summary:
      "可图 Colpix 是本地优先的图片、截图与影音素材管理工具。用 Chrome / Edge 扩展收藏网页图片和整页截图，再通过集合、标签、搜索与颜色筛选整理；原图、视频和音频都留在自己的文件夹。",
    summaryEn:
      "Colpix is a local-first library for web images, screenshots, and media assets. Capture from Chrome or Edge, then organize with collections, tags, search, and color filters—original files stay in a folder you choose.",
    category: "图片与素材管理",
    categoryEn: "Images & Asset Management",
    language: "中文",
    languageEn: "Chinese",
    size: "—",
    sizeEn: "—",
    platform: "macOS · Windows",
    platformEn: "macOS · Windows",
    platformUrl: "https://colpix.top/",
    actionLabel: "访问可图官网",
    actionLabelEn: "Visit Colpix",
    features: [
      "拖拽、右键或 Alt + 点击收藏网页图片，也可截取区域、页面元件和完整长图",
      "集合、标签、颜色和全文搜索并存，支持批量整理与标签合并撤销",
      "瀑布流、网格与列表三种布局，图片、动图、视频和音频均可预览",
      "图库就是你选择的本地文件夹，无账号、无云端同步，原图按内容哈希去重",
      "可选接入自己的多模态模型，只给新收藏提供标签建议，Key 与费用由你控制",
    ],
    featuresEn: [
      "Collect images by drag, right-click, or Alt-click, plus region, element, and full-page screenshots",
      "Collections, tags, color filters, and full-text search, with reversible batch organization and tag merges",
      "Switch between waterfall, grid, and list views; preview images, GIFs, video, and audio",
      "Your library is a local folder—no account, no cloud sync, and originals deduplicated by content hash",
      "Optionally connect your own multimodal model for tag suggestions, with your key and costs under your control",
    ],
    iconSrc: "/assets/products/colpix/icon.png",
    screenshots: [
      "/assets/products/colpix/screens/01.webp",
      "/assets/products/colpix/screens/02.webp",
      "/assets/products/colpix/screens/03.webp",
      "/assets/products/colpix/screens/04.webp",
    ],
    screenshotLayout: "desktop",
    screenshotWidth: 1600,
    screenshotHeight: 955,
  },
  {
    slug: "mycelia",
    path: "mycelia",
    name: "小菌丝",
    nameEn: "Mycelia",
    tagline:
      "把多平台内容运营，收进一个本地工作台。从选题到复盘，每一步都接得上。",
    taglineEn:
      "A local workspace for multi-platform content operations—from ideas to post-publish review.",
    summary:
      "小菌丝 Mycelia 是面向个人创作者和小型内容工作室的 macOS 本地工作台，把选题、创作、平台适配、排期、数据与互动放进同一条内容路径，并支持九个平台。",
    summaryEn:
      "Mycelia is a local-first macOS workspace for creators and small content teams. It connects ideation, writing, platform adaptation, scheduling, analytics, and engagement across nine platforms.",
    category: "内容运营",
    categoryEn: "Content Operations",
    language: "中文",
    languageEn: "Chinese",
    size: "399 MB",
    sizeEn: "399 MB",
    platform: "macOS",
    platformEn: "macOS",
    platformUrl: "https://aimycelia.cc/",
    actionLabel: "访问小菌丝官网",
    actionLabelEn: "Visit Mycelia",
    features: [
      "总览九个平台的粉丝、内容、播放与互动数据，减少来回切换后台",
      "AI 助手从账号和内容摘要里找方向，并把长文拆成不同平台版本",
      "选题、创作、素材、日历与发布任务共用一条内容工作流",
      "稿件、素材、平台 Cookie 与业务数据留在本机，账号使用独立浏览器环境",
      "小菌丝准备标题、正文、素材与平台参数，发布前由你在平台页面确认",
    ],
    featuresEn: [
      "See follower, content, view, and engagement data across nine platforms without hopping between dashboards",
      "An AI assistant finds directions from account and content context, then adapts long-form ideas for each platform",
      "Ideation, writing, assets, calendar, and publishing tasks share one content workflow",
      "Drafts, assets, platform cookies, and business data stay on-device, with an isolated browser environment per account",
      "Mycelia prepares titles, copy, assets, and platform parameters for you to review before publishing",
    ],
    iconSrc: "/assets/products/mycelia/icon.png",
    screenshots: [
      "/assets/products/mycelia/screens/01.webp",
      "/assets/products/mycelia/screens/02.webp",
      "/assets/products/mycelia/screens/03.webp",
      "/assets/products/mycelia/screens/04.webp",
    ],
    screenshotLayout: "desktop",
    screenshotWidth: 1600,
    screenshotHeight: 968,
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

export const featuredProductSlugs = ["travel-route", "altitudeshot", "echosnap"] as const;
export const moreProductSlugs = ["colpix", "mycelia", "flowdo"] as const;

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
