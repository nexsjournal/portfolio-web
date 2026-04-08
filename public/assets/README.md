# 静态资源放置说明

以下路径相对项目根目录的 `public/` 文件夹。放入文件后，在代码里用 **`/文件名`** 引用（无需写 `public`）。

## 站点与导航

| 用途 | 建议路径 |
|------|-----------|
| 导航栏 Logo（小图标） | `public/assets/logo-mark.svg`（已占位，可替换为正式 Logo） |

## 产品（旅迹时光：slug `travel-route`，英文标识 TravelRoute）

| 用途 | 路径 |
|------|-----------|
| App 图标 / 列表与详情顶栏 | 推荐 `public/assets/products/travel-route/icon.jpg`（或 `.png` / `.webp`）。若文件名不是默认的 `icon.png`，请在 `src/content/products.ts` 里为该产品的 `iconSrc` 写上真实路径。 |
| 详情页大 Logo（可选另一套） | `public/assets/products/travel-route/logo@2x.png` |
| 应用商店截图（横向滚动） | `public/assets/products/travel-route/screens/01.png`、`02.png` … |

代码中默认通过 `slug` 解析为：`/assets/products/<slug>/icon.png`（见 `getProductIconPath`）。

## 关于页左侧人像

| 用途 | 建议路径 |
|------|-----------|
| 像素画原图（建议正方形或竖图） | `public/assets/about/portrait.jpg`（或 `.webp` / `.png`） |

将 `About` 区块里 `PixelatedCanvas` 的 `src` 改为 `/assets/about/portrait.jpg`。

## 小结

- **产品相关**：统一放在 `public/assets/products/<slug>/` 下，便于多产品扩展。
- **个人相关**：放在 `public/assets/about/`。
- 优先 **WebP**，大图注意体积；截图建议宽度与商店要求一致（如 1290 宽一类比例）。
