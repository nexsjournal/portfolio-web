# Lex Portfolio Web

这是我的个人作品集网站，用于展示我在产品与体验方向上的思考、作品与持续迭代过程。

核心内容包括：

- 首页品牌介绍与个人定位
- 产品作品卡片与详情页展示
- 理念与方法论板块
- 联系方式与社媒入口

## 首页改版

- 参考 [Xiaoyang Hu 的作品集](https://xiaoyanghu.com/) 的紧凑首屏、侧边导航与截图卡片，采用 [clone-website](https://github.com/JCodesMore/ai-website-cloner-template/blob/master/.agents/skills/clone-website/SKILL.md) 的「观察 → 重建 → 验证」流程。站内仅使用 Lex 自己的文案与素材。
- 首页 `/` 集中展示个人介绍与精选作品；产品详情保留 `/rephoto`、`/travelroutes`、`/altitudeshot`。产品数据仍维护在 `src/content/products.ts`。
- 本地预览：`npm ci` 后运行 `npm run dev`。提交前运行 `npm run lint` 和 `npm run build`。

