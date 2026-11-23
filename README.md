# Lex Studio Portfolio

这是我的个人作品集网站，用于展示我在产品与体验方向上的思考、作品与持续迭代过程。

核心内容包括：

- 首页品牌介绍与个人定位
- 产品作品卡片与详情页展示
- 理念与方法论板块
- 联系方式与社媒入口

## 设计系统

- [Lex Studio 设计规范](DESIGN.md)：品牌、基础样式、组件状态和页面模板。
- [Design Tokens](public/design-system/tokens.json) · [CSS 变量](public/design-system/tokens.css) · [交互展示页](public/design-system/index.html)（开发环境路径 `/design-system/index.html`）。
- 修改站点样式后，运行 `node scripts/design-system.mjs` 同步令牌；用 `node scripts/design-system.mjs --check` 检查是否有遗漏。

## 即时发布后台

- `/studio` 是单人内容发布入口，需要 `STUDIO_USER`、`STUDIO_PASSWORD` 与 `STUDIO_SESSION_SECRET`；发布内容写入 Vercel Blob，不需要提交代码或重新部署。
- 支持公众号链接、完整 HTML 和纯文本。公众号读取受限时，改用“完整 HTML”模式粘贴正文源码。
- 线上需要连接一个 Public Blob Store，Vercel 会注入 `BLOB_READ_WRITE_TOKEN`。`content/notes/*.mdx` 继续作为本地内容与回退数据。
- 本机预览时可在 `.env.local` 填入同名变量，但不要提交 Blob Token 或后台密码。

## 首页改版

- 参考 [Xiaoyang Hu 的作品集](https://xiaoyanghu.com/)：通过 ego-browser 检查渲染样式和电脑屏幕的多层媒体，实测印章与联系弹层、作品悬停和退出状态。底色取实测的 `#F8FAFC`，作品卡默认白色，悬停才展开渐变、贴纸和跟随提示。
- 采用 [clone-website](https://github.com/JCodesMore/ai-website-cloner-template/blob/master/.agents/skills/clone-website/SKILL.md) 的「观察 → 重建 → 验证」流程，在原 Next.js 工程实现。对比了以资源镜像为主的 [Remake](https://github.com/rubenhassid1/remake) 和以设计令牌为主的 [Design Extract](https://github.com/Manavarya09/design-extract)，均未引入额外运行时。电脑外观和像素贴纸为生成素材；头像、产品截图、文案和链接来自 Lex Studio。
- 首屏真人头像使用内置 imagegen 转为 Aqua 风格 3D 卡通素材，保留真人面部、眼镜和服装特征；Projects 卡片采用连续轮廓的文件夹框，鼠标悬停时纸片笔记从封面后抽出，移开后收回，内层内容统一裁切在文件夹范围内。
- 首页 `/` 集中展示个人介绍、3 个精选作品、Projects 纸板区、About 相机卡和两段叠放式内容卡片；更多项目区展示可图、小菌丝和 FlowDo，入口分别进入 `/projects/*`。产品数据仍维护在 `src/content/products.ts`，案例文案维护在 `src/content/case-studies.ts`。
- Projects 纸板区的项目截图直接满铺在文件夹封面内，不再叠加项目名、平台等小字；FlowDo 与其他项目使用同样的满铺裁切。首页与 `/projects` 共用同一套拼贴尺寸和下移规则：手机 5 图/4 图分别约 20%/23%，截图整体下移并由卡片底边裁切。
- 「关于我」「我怎么做产品」「联系我」合并为一组 `26rem` 等高圆角卡片，桌面端滚动时通过 sticky 依次向上叠放，上一张只露出 `14px` 顶边；卡片不添加外层投影，移动端和 `prefers-reduced-motion` 下恢复普通纵向排列。
- 案例详情底部提供「上一件 / 下一件」双向浏览；桌面 App 预览使用 5px 深色外框，与手机预览保持一致的设备感。
- Projects 区块的「查看更多」进入 `/projects`，全部项目使用纵向大卡片展示；卡片内按截图数量生成不同尺寸、角度与层级的照片拼贴。
- `/projects` 复用案例内页的 `1240px` 顶栏结构：圆形返回按钮、Lex Studio 标识与右侧控件左右边界完全对齐。
- 精选作品、顶部 App 标签和 Projects 卡片统一进入 `/projects/*` 案例内页；旧 `/work/*` 与 `/products/*` 仅保留 308 兼容跳转，案例顶栏左右控件对齐 `1240px` 内容区。
- 案例内页保留固定顶栏、加长产品简介、可切换的真实界面预览和下一项目；章节说明、原则区与功能示意动画不再展示。
- 案例 Hero 使用 [Kubai Icons](https://icons.kubai.design/) 产品装饰图标，每页随机分布在文字安全区外，并支持鼠标拖拽后保持位置；真实界面预览使用循环轮播。
- 标题、产品名与手写卡片使用本地字体「乐米春序晚星体 Light」，正文保留无衬线字体保证可读性；字体来源与版权说明见 `public/fonts/LICENSE-LemiChunXuWanXing.txt`。
- 主要按钮参考 [michi-onl/aqua](https://github.com/michi-onl/aqua) 的 macOS Aqua 分层渐变与高光处理，用纯 CSS 实现蓝色凝胶按钮和银色胶囊按钮。
- 案例返回按入口区分：首页精选回首页、更多项目回 `#projects`、全部项目回 `/projects`；案例顶部的「全部案例」统一进入 `/projects`。蓝色 Aqua 按钮使用白字和轻微投影，实时海拔计案例使用青绿色点缀与多组浅色章节底色。
- 新增 `/notes` 文章与记录区，内容来自 `content/notes/*.mdx`；支持文章、活动、视频、短记四种类型与标签筛选，详情页包含封面、原文链接和上一篇/下一篇。内容格式与公众号导入方式见 `content/notes/README.md`。
- 公众号文章可通过 `npm run import:wechat -- "<文章链接>"` 导入：自动抓取标题、正文、发布时间与封面，下载正文图片，生成带 frontmatter 的 MDX，不需要在网站上二次排版。
- 自定义 404 页面使用 `public/assets/404/lex-404.webp` 的 Aqua 像素风 IP 形象，配合“SIGNAL LOST”叙事、指南针与坐标标注，提供回首页、笔记和项目列表入口；明暗主题与移动端均已适配。
- 本地预览：`npm ci` 后运行 `npm run dev`。提交前运行 `npm run lint` 和 `npm run build`。

## 感谢相机 · AI 合影

- 点击首页末尾相机快门会请求摄像头权限；授权后在取景器里再按一次快门，截取 4:3 自拍。
- 服务器把自拍与 `public/assets/hero/lex-aqua-avatar-v2.webp` 的 IP 形象一起发给生图模型，统一成 Aqua 3D 卡通风格；照片以白边拍立得呈现，并带“吐出 + 显影”动效。
- 拍摄图默认只在请求内处理，不写入存储；勾选“放进公开合影墙”后才会保存到 Vercel Blob 的 `polaroids/` 目录。服务端会先去除 EXIF、限制尺寸并做单 IP 限流。照片会发送给所选生图服务完成本次合成，上线时请在隐私说明中注明第三方处理。
- 摄像头要求 HTTPS 或 `localhost`。没有生图 key 时可用 `POLAROID_PROVIDER=mock` 在本地预览完整动效。
- `/polaroids` 是公开合影墙，只展示访客主动勾选公开的照片；页面设置为不参与搜索引擎索引。照片存储在 Vercel Blob（与 `/studio` 共用 `BLOB_READ_WRITE_TOKEN`），不占服务器磁盘。

生图通道（`.env.local` 配置；`auto` 会优先 Cloudflare，想用豆包请显式设 `POLAROID_PROVIDER=ark`）：

- `cloudflare`（默认推荐）：`CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN`。Workers AI 每天有 10,000 Neurons 免费额度（[定价](https://developers.cloudflare.com/workers-ai/platform/pricing/)）；FLUX.2 [klein] 9B 支持最多 4 张参考图、1024×768 输出（[模型](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-9b/)），约合每天 6–7 张合影；换成 `@cf/black-forest-labs/flux-2-klein-4b` 可到约 60 张/天，但细节略弱。
- `ark`（豆包 Seedream）：`ARK_API_KEY`。Seedream 4.0/4.5 新用户通常有一次性 200 张免费额度；4.0 支持 2–14 张参考图与 `2048x1536` 的 4:3 输出，之后按张计费。

部署到 Vercel 时，除了 `.env.local`，还要在 Project → Settings → Environment Variables 为 Production / Preview 添加 `POLAROID_PROVIDER`、`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_IMAGE_MODEL`；只在本地配置时，线上接口会返回 503。

豆包 App 的每日免费生图额度不等于开放 API 额度；API 侧按量计费，免费额度主要用于首次接入测试。

Cloudflare Token 在 Dashboard → My Profile → API Tokens 创建，权限选择 Workers AI Read/Edit + Account Analytics Read（后者用于读取 24 小时 Neuron 用量并计算准确的额度恢复时间）；Account ID 在 Workers & Pages 概览页。火山方舟的 Key 在「API Key 管理」创建，并确认模型已开通。

Vercel Blob Hobby 包含 1GB 存储；超出后 Blob 会暂停到下一个 30 天周期，不会自动升级计费。照片量更大时建议升级 Pro，或改用 Cloudflare R2（每月 10GB 免费额度）。本地测试合影墙时需要在 `.env.local` 填入 `BLOB_READ_WRITE_TOKEN`。

