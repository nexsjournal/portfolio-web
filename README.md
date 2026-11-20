# Lex Portfolio Web

这是我的个人作品集网站，用于展示我在产品与体验方向上的思考、作品与持续迭代过程。

核心内容包括：

- 首页品牌介绍与个人定位
- 产品作品卡片与详情页展示
- 理念与方法论板块
- 联系方式与社媒入口

## 首页改版

- 参考 [Xiaoyang Hu 的作品集](https://xiaoyanghu.com/)：通过 ego-browser 检查渲染样式和电脑屏幕的多层媒体，实测印章与联系弹层、作品悬停和退出状态。底色取实测的 `#F8FAFC`，作品卡默认白色，悬停才展开渐变、贴纸和跟随提示。
- 采用 [clone-website](https://github.com/JCodesMore/ai-website-cloner-template/blob/master/.agents/skills/clone-website/SKILL.md) 的「观察 → 重建 → 验证」流程，在原 Next.js 工程实现。对比了以资源镜像为主的 [Remake](https://github.com/rubenhassid1/remake) 和以设计令牌为主的 [Design Extract](https://github.com/Manavarya09/design-extract)，均未引入额外运行时。电脑外观和像素贴纸为生成素材；头像、产品截图、文案和链接来自 Lex Studio。
- 首页 `/` 集中展示个人介绍与精选作品；产品详情保留 `/rephoto`、`/travelroutes`、`/altitudeshot`。产品数据仍维护在 `src/content/products.ts`。
- 本地预览：`npm ci` 后运行 `npm run dev`。提交前运行 `npm run lint` 和 `npm run build`。

