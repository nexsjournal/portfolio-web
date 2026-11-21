export type Localized = { zh: string; en: string };

export type CaseTone = "cream" | "pink" | "mint" | "blue";

export type CaseChapter = {
  id: string;
  no: string;
  title: Localized;
  body: Localized;
  aside: Localized;
  tone: CaseTone;
  visual: "shots" | "flow" | "detail" | "cards";
  shots: number[];
  steps?: Localized[];
  highlight?: Localized;
};

export type CaseStudy = {
  slug: string;
  productSlug: string;
  seoTitle: string;
  title: Localized;
  subtitle: Localized;
  intro: Localized;
  meta: { role: Localized; platform: string; year: string };
  chapters: CaseChapter[];
  principles: { title: Localized; body: Localized }[];
  next: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "rephoto",
    productSlug: "echosnap",
    seoTitle: "iOS 滑动相册整理",
    title: {
      zh: "RePhoto，\n让整理相册轻一点",
      en: "RePhoto, a calmer way\nto clean your camera roll",
    },
    subtitle: {
      zh: "用滑动手势整理照片与视频。目标不是清得更多，而是每一次判断都不费力。",
      en: "A swipe-first camera roll cleaner. The goal is not to delete more, but to make every decision feel lighter.",
    },
    intro: {
      zh: "从第一次打开到最后一组照片，RePhoto 的每个界面都由我设计和实现。",
      en: "From the first launch to the last group, I designed and built every interface in RePhoto.",
    },
    meta: {
      role: { zh: "产品、UX 与 iOS", en: "Product, UX & iOS" },
      platform: "iOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "删照片，不该这么费劲", en: "Deleting photos shouldn't feel like work" },
        body: {
          zh: "相册越积越满，真正难的不是删除，而是连续做几十次判断。很多清理工具把照片压成小格子，让人越清越累。我想把这件事缩回到一次只看一张。",
          en: "Camera rolls fill up quietly. The hard part isn't deleting; it's making dozens of decisions in a row. Most cleaners squeeze photos into tiny grids and make the job feel heavier. I wanted to bring it back to one photo at a time.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "一张大图，一个决定。", en: "One photo, one decision." },
      },
      {
        id: "swipe",
        no: "02",
        title: { zh: "把判断压成一次滑动", en: "Turn a decision into a swipe" },
        body: {
          zh: "左右保留、上滑删除，撤销始终在手边。更大的预览和明确的手势反馈，让手比脑子先做出决定。常用的动作被缩短到一次滑动。",
          en: "Swipe left or right to keep, up to delete, with undo always within reach. Larger previews and clear gesture feedback let your hand decide before your head starts second-guessing.",
        },
        aside: { zh: "Interaction", en: "Interaction" },
        tone: "pink",
        visual: "flow",
        shots: [1, 2],
        steps: [
          { zh: "保留", en: "Keep" },
          { zh: "删除", en: "Delete" },
          { zh: "撤销", en: "Undo" },
        ],
      },
      {
        id: "system",
        no: "03",
        title: { zh: "让进度看得见", en: "Make progress visible" },
        body: {
          zh: "分组筛选把截屏、自拍、实况照片分开；影历和空间统计，把「清了多少」变成看得见的反馈。清理不再是一个没有尽头的动作。",
          en: "Group filters separate screenshots, selfies, and Live Photos. Timeline and storage stats turn 'how much did I clear?' into visible feedback, so cleaning has an end.",
        },
        aside: { zh: "The system", en: "The system" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "分组、影历、空间收益。", en: "Groups, timeline, storage saved." },
      },
      {
        id: "shipped",
        no: "04",
        title: { zh: "上线，然后继续打磨", en: "Ship, then keep refining" },
        body: {
          zh: "RePhoto 已在 App Store 上线。上线后我继续用真实路径检查：哪些手势会犹豫、撤销是否够快、第一次打开时该先看到什么。",
          en: "RePhoto is live on the App Store. After launch I keep testing real paths: where a gesture hesitates, whether undo is fast enough, and what should be visible on first launch.",
        },
        aside: { zh: "After launch", en: "After launch" },
        tone: "blue",
        visual: "cards",
        shots: [0, 3, 4],
      },
    ],
    principles: [
      { title: { zh: "先做自己会用的", en: "Build what I'd use" }, body: { zh: "先说服自己，再谈上线。", en: "Start with a problem I keep running into." } },
      { title: { zh: "把常用动作做短", en: "Shorten the common path" }, body: { zh: "能滑一下就完成的事，不多进一层菜单。", en: "If a swipe can do it, don't add another menu." } },
      { title: { zh: "上线后继续看反馈", en: "Keep listening after launch" }, body: { zh: "用真实使用检验取舍，再修掉反复卡住的地方。", en: "Use real use to test the trade-offs, then fix recurring friction." } },
    ],
    next: "travelroutes",
  },
  {
    slug: "travelroutes",
    productSlug: "travel-route",
    seoTitle: "旅行路线动画与视频制作",
    title: {
      zh: "TravelRoute，\n把走过的路变成动画",
      en: "TravelRoute,\nturning a trip into motion",
    },
    subtitle: {
      zh: "给旅行者的路线动画工具：添加地点、调整顺序，然后导出一段值得分享的视频。",
      en: "A route-animation tool for travelers: add places, arrange the order, and export a video worth sharing.",
    },
    intro: {
      zh: "从路线编辑到视频导出，每个环节都在回答同一个问题：怎样让一段旅程更好讲？",
      en: "From route editing to export, every step answers one question: how can a trip tell a better story?",
    },
    meta: {
      role: { zh: "产品、UX 与 iOS", en: "Product, UX & iOS" },
      platform: "iOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "路线不该只留在记忆里", en: "A route deserves more than memory" },
        body: {
          zh: "旅行结束后，照片能回看，路线却常常散落在截图和地图历史里。我想让走过的路径变成一段可以直接分享的视觉故事。",
          en: "After a trip, photos are easy to revisit but routes get scattered across screenshots and map history. I wanted the path itself to become a visual story you can share.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "让路线成为主角。", en: "Make the route the subject." },
      },
      {
        id: "edit",
        no: "02",
        title: { zh: "先把编辑变短", en: "Make editing short first" },
        body: {
          zh: "添加地点、拖动顺序、选择一个风格。路径编辑不要求用户先学一套复杂的时间线，先让一段路线成立，再让动画发生。",
          en: "Add a place, drag the order, pick a style. Editing doesn't ask people to learn a complex timeline first; the route comes together, then the motion follows.",
        },
        aside: { zh: "The flow", en: "The flow" },
        tone: "pink",
        visual: "flow",
        shots: [1, 2],
        steps: [
          { zh: "添加地点", en: "Add places" },
          { zh: "调整顺序", en: "Order stops" },
          { zh: "生成动画", en: "Animate" },
        ],
      },
      {
        id: "motion",
        no: "03",
        title: { zh: "给动画一点节奏", en: "Give the motion a rhythm" },
        body: {
          zh: "路线需要被读出来，而不只是被播放。节点、镜头速度和停留时间一起决定节奏，让观众知道旅程从哪里开始、在哪里停过。",
          en: "A route should be read, not just played. Stops, camera speed, and hold time set the rhythm so viewers understand where the trip began and where it paused.",
        },
        aside: { zh: "The craft", en: "The craft" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "节点、速度、停留。", en: "Stops, speed, hold." },
      },
      {
        id: "share",
        no: "04",
        title: { zh: "让旅程可以被分享", en: "Make the trip shareable" },
        body: {
          zh: "最终产物是一段高质量视频，而不是只存在于 App 里的地图。旅行结束后，它可以进入相册、聊天和社交媒体。",
          en: "The output is a high-quality video, not a map trapped inside an app. At the end of a trip, it can move into a camera roll, a chat, or a social feed.",
        },
        aside: { zh: "The result", en: "The result" },
        tone: "blue",
        visual: "cards",
        shots: [0, 2, 4],
      },
    ],
    principles: [
      { title: { zh: "先让路径成立", en: "Make the route work first" }, body: { zh: "先解决编辑，再谈动画。", en: "Solve the route before the motion." } },
      { title: { zh: "让结果可带走", en: "Make the output portable" }, body: { zh: "视频要能离开 App，进入真实分享场景。", en: "The video should leave the app and enter real conversations." } },
      { title: { zh: "节奏比效果重要", en: "Rhythm over effects" }, body: { zh: "动画先服务讲述，再服务炫技。", en: "Motion serves the story before it serves the spectacle." } },
    ],
    next: "altitudeshot",
  },
  {
    slug: "altitudeshot",
    productSlug: "altitudeshot",
    seoTitle: "实时海拔测量与登顶卡片",
    title: {
      zh: "AltitudeNow，\n把到达这一刻留下来",
      en: "AltitudeNow,\nkeeping the moment you arrive",
    },
    subtitle: {
      zh: "实时海拔、GPS 与气压信息，一屏读完，一键变成值得收藏的登顶卡片。",
      en: "Live altitude, GPS, and pressure at a glance, turned into a summit card worth keeping.",
    },
    intro: {
      zh: "在户外，信息应该一眼可读。AltitudeNow 把复杂的传感数据压缩成一张清晰、可以分享的卡片。",
      en: "Outdoors, information has to read at a glance. AltitudeNow compresses complex sensor data into one clear, shareable card.",
    },
    meta: {
      role: { zh: "产品、UX 与 iOS", en: "Product, UX & iOS" },
      platform: "iOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "山顶没有时间慢慢找数据", en: "At the summit, there's no time to dig" },
        body: {
          zh: "户外用户不想在冷风里翻三层菜单。海拔、位置、气压和时间要同时出现，而且必须在强光下也能读清。",
          en: "Nobody wants to dig through three menus in the cold. Altitude, location, pressure, and time need to appear together, and stay legible in bright sun.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "先读清，再记录。", en: "Read first, record second." },
      },
      {
        id: "read",
        no: "02",
        title: { zh: "一屏读完", en: "Read it in one screen" },
        body: {
          zh: "超大字号的海拔数字作为视觉锚点，经纬度、气压和指南针退到第二层。信息有先后，界面才不会变成仪表盘。",
          en: "A giant altitude number anchors the screen. Coordinates, pressure, and compass sit on a second level. A clear hierarchy keeps it from becoming a dashboard.",
        },
        aside: { zh: "The hierarchy", en: "The hierarchy" },
        tone: "pink",
        visual: "flow",
        shots: [1, 2],
        steps: [
          { zh: "海拔", en: "Altitude" },
          { zh: "环境", en: "Conditions" },
          { zh: "方向", en: "Compass" },
        ],
      },
      {
        id: "card",
        no: "03",
        title: { zh: "把数据变成卡片", en: "Turn data into a card" },
        body: {
          zh: "一拍一 Pin：照片、地点、海拔和时间自动合成一张登顶卡片。它既是一张纪念，也是一种不需要解释的分享方式。",
          en: "One shot, one Pin: the photo, place, altitude, and time compose a summit card automatically. It's a keepsake, and a way to share without explaining.",
        },
        aside: { zh: "The object", en: "The object" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "照片 + 地点 + 海拔 + 时间。", en: "Photo + place + altitude + time." },
      },
      {
        id: "outdoors",
        no: "04",
        title: { zh: "在户外也能读清", en: "Made for the outdoors" },
        body: {
          zh: "大字号、强对比、双语切换和到达时间线，都是为了让它在真实环境里可靠地工作，而不是只在设计稿里好看。",
          en: "Large type, strong contrast, bilingual labels, and an arrival timeline exist so it works in real conditions, not just in a design file.",
        },
        aside: { zh: "The details", en: "The details" },
        tone: "blue",
        visual: "cards",
        shots: [0, 3, 4],
      },
    ],
    principles: [
      { title: { zh: "先保证可读", en: "Legibility first" }, body: { zh: "户外场景，信息的优先级高于装饰。", en: "Outdoors, hierarchy beats decoration." } },
      { title: { zh: "让数据成为物件", en: "Turn data into an object" }, body: { zh: "一张卡片比一串数字更容易被记住。", en: "A card is easier to remember than a list of numbers." } },
      { title: { zh: "在真实环境里测试", en: "Test in real conditions" }, body: { zh: "强光、移动和戴手套都算进设计里。", en: "Sunlight, motion, and gloves are part of the design." } },
    ],
    next: "flowdo",
  },
  {
    slug: "flowdo",
    productSlug: "flowdo",
    seoTitle: "本地待办、手账与句子收藏",
    title: {
      zh: "FlowDo，\n把今天过清楚一点",
      en: "FlowDo,\na clearer way through today",
    },
    subtitle: {
      zh: "本地优先的待办、句子与手账。先记下来，再整理；不注册，不上传。",
      en: "A local-first home for tasks, saved sentences, and journal pages. Capture first, organize later—no account, no upload.",
    },
    intro: {
      zh: "FlowDo 把快速记录、今天的安排和句子收藏放进同一套安静的系统里。",
      en: "FlowDo brings quick capture, today's plan, and saved sentences into one quiet system.",
    },
    meta: {
      role: { zh: "产品、UX 与原生开发", en: "Product, UX & native app" },
      platform: "macOS · iOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "记一件事，不该先填一张表", en: "Capture shouldn't start with a form" },
        body: {
          zh: "待办工具常常在录入前就要求选择项目、标签、优先级。FlowDo 先把动作缩短：记下来，之后再把事情放到合适的位置。",
          en: "Task tools often ask for a project, tag, and priority before anything is saved. FlowDo shortens the first step: capture it now, place it later.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "先记下来，再整理。", en: "Capture first, organize later." },
      },
      {
        id: "capture",
        no: "02",
        title: { zh: "把入口缩短到一次唤出", en: "Shorten capture to one summon" },
        body: {
          zh: "Mac 菜单栏、全局快捷键和快捷面板都能直接进入输入框。Tab 在面板里循环，Esc 退出，不打断正在做的事。",
          en: "The menu bar, global shortcuts, and quick panel all open straight into the input. Tab cycles inside the panel, Esc closes it, and your current work stays put.",
        },
        aside: { zh: "The flow", en: "The flow" },
        tone: "pink",
        visual: "flow",
        shots: [1, 2],
        steps: [
          { zh: "唤出", en: "Summon" },
          { zh: "记下", en: "Capture" },
          { zh: "回到手头", en: "Return" },
        ],
      },
      {
        id: "system",
        no: "03",
        title: { zh: "任务与句子，各有归处", en: "Give tasks and sentences their own place" },
        body: {
          zh: "今天、看板、句子与手账共享同一套反馈，却不互相挤占。任务有状态和时间，句子只负责被留住，两种内容都不必伪装成另一种。",
          en: "Today, Board, Quotes, and Journal share one interaction language without competing for space. Tasks have status and dates; sentences simply get kept.",
        },
        aside: { zh: "The system", en: "The system" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "今天、看板、句子、手账。", en: "Today, board, quotes, journal." },
      },
      {
        id: "local",
        no: "04",
        title: { zh: "本地优先，才敢长期用", en: "Local-first makes it worth keeping" },
        body: {
          zh: "数据留在这台设备上，不需要账户或后端。JSON 备份可以带走，深色模式、键盘焦点和减少动态效果也一起做好。",
          en: "Data stays on the device, with no account or backend. JSON backups can leave with you, and dark mode, keyboard focus, and reduced motion are treated as core behavior.",
        },
        aside: { zh: "The promise", en: "The promise" },
        tone: "blue",
        visual: "cards",
        shots: [0, 2, 3],
      },
    ],
    principles: [
      { title: { zh: "录入先于结构", en: "Capture before structure" }, body: { zh: "不要求用户先想清楚所有属性。", en: "Don't make people define every attribute first." } },
      { title: { zh: "让内容各得其所", en: "Give each kind of content a home" }, body: { zh: "任务、句子和手账不共享同一种容器。", en: "Tasks, sentences, and journal pages need different containers." } },
      { title: { zh: "本地优先是产品承诺", en: "Local-first is a product promise" }, body: { zh: "数据主权不是设置项，是默认行为。", en: "Data ownership is the default, not a settings toggle." } },
    ],
    next: "aray-studio",
  },
  {
    slug: "aray-studio",
    productSlug: "aray-studio",
    seoTitle: "Mac 录屏、剪辑与离线字幕",
    title: {
      zh: "ARay Studio，\n录完就能剪",
      en: "ARay Studio,\nready to edit the moment you stop",
    },
    subtitle: {
      zh: "录屏、剪辑、字幕和导出，在一个 macOS App 里完成。字幕留在本机，成片直接进入分享场景。",
      en: "Record, edit, caption, and export in one macOS app. Captions stay on-device, and the finished video is ready to share.",
    },
    intro: {
      zh: "ARay Studio 把录屏工具和剪辑器接成一条连续的路径：停止录制，时间线已经准备好。",
      en: "ARay Studio connects recorder and editor into one continuous path: stop recording, and the timeline is already there.",
    },
    meta: {
      role: { zh: "产品、UX 与原生开发", en: "Product, UX & native app" },
      platform: "macOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "录屏、剪辑、字幕，不该散在四个 App 里", en: "Recording, editing, and captions shouldn't live in four apps" },
        body: {
          zh: "录完要换剪辑器，字幕再交给另一个服务，导出又是另一套设置。素材在应用之间来回搬，真正的创作时间被切碎。",
          en: "Record in one app, edit in another, send audio to a third for captions, then learn a fourth set of export settings. The actual making gets chopped into handoffs.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 2],
        highlight: { zh: "从录完到成片，一条路径。", en: "One path from stop to export." },
      },
      {
        id: "flow",
        no: "02",
        title: { zh: "录完，时间线已经准备好了", en: "The timeline is ready when you stop" },
        body: {
          zh: "录制条、时间线、预览和检查器共享同一个工程。切分、重排、章节、缩放和音效都直接作用在录制结果上。",
          en: "Recorder, timeline, preview, and inspector share one project. Cuts, reordering, chapters, zooms, and sound effects act directly on the take.",
        },
        aside: { zh: "The flow", en: "The flow" },
        tone: "pink",
        visual: "flow",
        shots: [1, 2],
        steps: [
          { zh: "录制", en: "Record" },
          { zh: "切分", en: "Cut" },
          { zh: "字幕", en: "Caption" },
        ],
      },
      {
        id: "wysiwyg",
        no: "03",
        title: { zh: "预览与导出，不再各走一套", en: "Preview and export share one truth" },
        body: {
          zh: "预览和导出调用同一个无状态合成器。任意 seek 都能得到正确一帧，转场、镜头布局和字幕避让不会在成片里突然漂移。",
          en: "Preview and export call the same stateless compositor. Any seek produces the right frame, so transitions, layouts, and caption avoidance don't drift in the final file.",
        },
        aside: { zh: "The craft", en: "The craft" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "所见即所得，靠同一条渲染路径。", en: "WYSIWYG comes from one render path." },
      },
      {
        id: "offline",
        no: "04",
        title: { zh: "字幕不出本机，成片可以直接发", en: "Captions stay local, the result travels" },
        body: {
          zh: "本地 Whisper 或 Apple 本机识别生成字幕，音频不上传。最后导出 MP4、GIF 或 SRT，进入相册、聊天和社媒。",
          en: "On-device Whisper or Apple speech recognition creates captions without uploading audio. Export MP4, GIF, or SRT into a camera roll, chat, or social feed.",
        },
        aside: { zh: "The result", en: "The result" },
        tone: "blue",
        visual: "cards",
        shots: [3, 4, 0],
      },
    ],
    principles: [
      { title: { zh: "别让工具打断创作", en: "Don't let tools interrupt making" }, body: { zh: "录、剪、字幕、导出尽量在同一条路径里。", en: "Keep record, edit, caption, and export on one path." } },
      { title: { zh: "预览必须可信", en: "The preview has to be trustworthy" }, body: { zh: "所见即所得来自同一条渲染路径。", en: "WYSIWYG comes from sharing one render path." } },
      { title: { zh: "隐私是默认值", en: "Privacy is the default" }, body: { zh: "音频不出本机，也不拿用户素材训练模型。", en: "Audio stays on-device and never trains a model on user footage." } },
    ],
    next: "colpix",
  },
  {
    slug: "colpix",
    productSlug: "colpix",
    seoTitle: "本地图片与素材管理",
    title: {
      zh: "Colpix，\n让每张参考都找得回来",
      en: "Colpix,\nevery reference within reach",
    },
    subtitle: {
      zh: "从网页采集、截图到标签与搜索，把图片、动图和影音素材收进一个本地图库。",
      en: "Capture from the web, screenshot what matters, and keep images, GIFs, video, and audio in one local library.",
    },
    intro: {
      zh: "可图把采集、整理、搜索和预览放在同一个本地目录里，让存下来的灵感不再散落。",
      en: "Colpix keeps capture, organization, search, and preview on one local library, so saved inspiration doesn't drift away.",
    },
    meta: {
      role: { zh: "产品、UX 与桌面开发", en: "Product, UX & desktop app" },
      platform: "macOS · Windows · Chrome / Edge",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "灵感存了，却找不回来", en: "Saved, then lost" },
        body: {
          zh: "网页图片进了下载文件夹，截图躺在桌面，参考链接又散在收藏夹。真正的问题不是没有保存，而是保存之后没有一个共同的归处。",
          en: "Web images land in Downloads, screenshots pile up on the desktop, and reference links disappear into bookmarks. The problem isn't saving; it's that none of it shares a home.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "存下来，只是开始。", en: "Saving is only the beginning." },
      },
      {
        id: "capture",
        no: "02",
        title: { zh: "在浏览现场，直接收进来", en: "Capture where you see it" },
        body: {
          zh: "拖拽、右键、Alt + 点击和截图都在浏览器里完成。素材不必先下载再导入，确认之后直接进入当前图库。",
          en: "Drag, right-click, Alt-click, and screenshots all happen inside the browser. Nothing has to be downloaded and re-imported; once confirmed, it lands in the current library.",
        },
        aside: { zh: "The capture", en: "The capture" },
        tone: "pink",
        visual: "flow",
        shots: [0, 2],
        steps: [
          { zh: "拖拽", en: "Drag" },
          { zh: "确认", en: "Confirm" },
          { zh: "入库", en: "Save" },
        ],
      },
      {
        id: "organize",
        no: "03",
        title: { zh: "存下来之后，才开始有用", en: "Useful after it's saved" },
        body: {
          zh: "集合负责项目，标签负责内容，颜色负责感觉。名称、备注、来源、标签和近似色可以一起搜索，整理不是另一套负担。",
          en: "Collections map to projects, tags describe content, and colors capture mood. Search across names, notes, sources, tags, and approximate colors without creating a second job.",
        },
        aside: { zh: "The system", en: "The system" },
        tone: "mint",
        visual: "detail",
        shots: [1, 2],
        highlight: { zh: "集合、标签、颜色、搜索。", en: "Collections, tags, color, search." },
      },
      {
        id: "local",
        no: "04",
        title: { zh: "图库就是你的文件夹", en: "Your library is your folder" },
        body: {
          zh: "没有账号、没有私有格式，也不需要「导出」。原图按内容哈希只存一份，Finder 里看得到，备份就是复制整个目录。",
          en: "No account, no proprietary format, no export step. Originals are stored once by content hash and visible in Finder—backup is just copying the folder.",
        },
        aside: { zh: "The promise", en: "The promise" },
        tone: "blue",
        visual: "cards",
        shots: [3, 0],
        highlight: { zh: "本地优先，文件仍然属于你。", en: "Local-first, files still yours." },
      },
    ],
    principles: [
      { title: { zh: "采集不离开浏览现场", en: "Capture in context" }, body: { zh: "看到就收，不让流程打断灵感。", en: "Save at the moment of discovery." } },
      { title: { zh: "别让文件变成黑盒", en: "Keep files inspectable" }, body: { zh: "图库首先是文件夹，其次才是应用。", en: "The library is a folder before it is an app." } },
      { title: { zh: "AI 只是助手", en: "AI stays an assistant" }, body: { zh: "标签建议由你启用，图库和命名仍由你掌握。", en: "You enable suggestions; the library and naming stay yours." } },
    ],
    next: "mycelia",
  },
  {
    slug: "mycelia",
    productSlug: "mycelia",
    seoTitle: "Mac 多平台内容运营工作台",
    title: {
      zh: "Mycelia，\n把多平台运营接成一条线",
      en: "Mycelia,\none line from idea to review",
    },
    subtitle: {
      zh: "选题、创作、平台适配、排期、数据与互动，收进一个本地 macOS 内容工作台。",
      en: "Ideation, writing, platform adaptation, scheduling, analytics, and engagement in one local macOS workspace.",
    },
    intro: {
      zh: "小菌丝不是再开一个数据后台，而是把一条内容从想法到复盘的每一步接起来。",
      en: "Mycelia isn't another analytics dashboard. It connects every step of a piece of content, from the first idea to the post-publish review.",
    },
    meta: {
      role: { zh: "产品、UX 与 macOS 开发", en: "Product, UX & macOS app" },
      platform: "macOS",
      year: "2026",
    },
    chapters: [
      {
        id: "problem",
        no: "01",
        title: { zh: "不是内容不够，是每一步都在重来", en: "The work restarts at every step" },
        body: {
          zh: "想看数据要挨个打开后台，同一篇内容要按平台重做标题、封面和长度，评论又散在不同通知里。内容没变少，重复劳动却越来越多。",
          en: "Analytics live in separate dashboards, one piece has to be rewritten for every platform, and comments scatter across notifications. The content isn't the problem; the repeated work is.",
        },
        aside: { zh: "The problem", en: "The problem" },
        tone: "cream",
        visual: "shots",
        shots: [0, 1],
        highlight: { zh: "把断开的工作流接回来。", en: "Reconnect the broken workflow." },
      },
      {
        id: "flow",
        no: "02",
        title: { zh: "一条内容，从想法走到复盘", en: "One idea, all the way through" },
        body: {
          zh: "AI 助手从账号和内容摘要里找方向，把长文拆成平台版本；建议可以存成稿件、加入日历，再进入发布任务。",
          en: "The AI assistant finds directions from account and content context, turns long-form ideas into platform versions, and saves suggestions as drafts, calendar entries, or publishing tasks.",
        },
        aside: { zh: "The flow", en: "The flow" },
        tone: "pink",
        visual: "flow",
        shots: [0, 2],
        steps: [
          { zh: "找方向", en: "Ideate" },
          { zh: "写版本", en: "Draft" },
          { zh: "排发布", en: "Schedule" },
        ],
      },
      {
        id: "local",
        no: "03",
        title: { zh: "账号留在本机，发布由你确认", en: "Local accounts, human publish" },
        body: {
          zh: "稿件、素材、平台 Cookie 和业务数据留在设备上。每个账号使用独立浏览器环境，小菌丝准备好内容，但最后一键仍由你在平台页面确认。",
          en: "Drafts, assets, platform cookies, and business data stay on-device. Each account gets an isolated browser environment; Mycelia prepares the post, but you confirm the final publish on the platform.",
        },
        aside: { zh: "The promise", en: "The promise" },
        tone: "mint",
        visual: "detail",
        shots: [2, 3],
        highlight: { zh: "准备可以自动，发布必须可见。", en: "Preparation can automate; publishing stays visible." },
      },
      {
        id: "overview",
        no: "04",
        title: { zh: "九个平台，一处管理", en: "Nine platforms, one desk" },
        body: {
          zh: "粉丝、内容、播放、互动与今日观察收在同一张总览里，平台的差异被保留，来回切换后台的次数被拿掉。",
          en: "Followers, content, views, engagement, and daily observations share one overview. Platform differences remain; the dashboard hopping disappears.",
        },
        aside: { zh: "The overview", en: "The overview" },
        tone: "blue",
        visual: "cards",
        shots: [1, 4],
        highlight: { zh: "九个平台，一条内容路径。", en: "Nine platforms, one content path." },
      },
    ],
    principles: [
      { title: { zh: "让每一步接得上", en: "Keep steps connected" }, body: { zh: "建议要能进入稿件、日历和发布任务。", en: "Suggestions must become drafts, dates, and tasks." } },
      { title: { zh: "保留人的确认权", en: "Keep human confirmation" }, body: { zh: "准备可以自动化，发布不能偷偷发生。", en: "Preparation can automate; publishing can't happen silently." } },
      { title: { zh: "本地是产品边界", en: "Local is a product boundary" }, body: { zh: "账号与内容数据默认留在设备上。", en: "Account and content data stay on-device by default." } },
    ],
    next: "rephoto",
  },
];

export function getCaseStudyByProductSlug(slug: string) {
  return caseStudies.find((study) => study.productSlug === slug);
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
