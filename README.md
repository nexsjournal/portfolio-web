# Lex Portfolio（lextellsyou.asia）

独立开发者 Lex 的个人作品展示站：**Next.js App Router + TypeScript + Tailwind CSS v4 + Framer Motion**，纯前端静态内容，适合部署在 **Vercel**（无需自建后端）。

## 本地开发

使用 **npm** 安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

复制 `.env.example` 为 `.env.local`，按需修改：

- `NEXT_PUBLIC_SITE_URL`：生产站点完整 URL（用于 `sitemap.xml` / `robots.txt` 等），例如 `https://lextellsyou.asia`。

## 文案与联系方式

编辑 [`src/content/site.ts`](src/content/site.ts) 中的 `siteConfig`（邮箱、GitHub、X 等）以及中英 `SITE_COPY` / `JOURNEY_TIME_COPY`。

## 图片与素材目录

静态资源放在 `public/` 下，构建后会按路径原样访问。

| 用途 | 目录 |
|------|------|
| 旅迹时光 App 截图（建议 9:16 竖版） | `public/assets/apps/journey-time/screens/` |
| 旅迹时光宣传 / 介绍图（建议 9:16） | `public/assets/apps/journey-time/marketing/` |
| 旅迹时光 App Logo（1:1，png / webp / svg 等） | `public/assets/apps/journey-time/logo/` |
| 个人头像、品牌图 | `public/assets/brand/` |

命名建议（小写 + 短横线）：

- 截图：`journey-time-screen-01.webp`
- 宣传图：`journey-time-promo-01.webp`
- 头像 / Logo：`lex-avatar.webp`、`lex-logo-mark.svg`

首页与详情页会通过 `src/lib/journeyTimeAssets.ts` 读取：`logo/`（首张作 1:1，首页产品卡片与详情页 Hero 使用）、`screens/` 与 `marketing/` 合并为详情页「宣传与截图」横向画廊（容器比例 9:16）。

**以后新增产品时**：为每个产品建 `public/assets/apps/<slug>/logo/`、`screens/`、`marketing/` 等子目录，并在代码里按 slug 扩展 `getJourneyTimeAssets` 或等价逻辑。

## 设计系统（ui-ux-pro-max）

检索结果与主文档在 [`design-system/lex-portfolio/MASTER.md`](design-system/lex-portfolio/MASTER.md)。

## 部署到 Vercel

完整步骤（导入仓库、环境变量、自定义域名、排错）见 **[`docs/vercel-deployment.md`](docs/vercel-deployment.md)**。

摘要：推送代码到 Git → 在 [Vercel](https://vercel.com) Import 项目 → 设置 `NEXT_PUBLIC_SITE_URL` → 按面板提示配置 DNS。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm start` | 启动生产构建后的服务 |
| `npm run lint` | ESLint |
