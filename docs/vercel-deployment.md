# 将 Lex Portfolio 部署到 Vercel（详细指南）

本文说明如何把本仓库（Next.js App Router）从本地推到 **Vercel** 上线，并绑定自定义域名（例如 `lextellsyou.asia`）。无需自建服务器；构建与 CDN 由 Vercel 托管。

---

## 1. 前置条件

- 已安装 [Git](https://git-scm.com/)，代码已提交到本地仓库。
- 有一个 [GitHub](https://github.com)（或 GitLab / Bitbucket）账号。
- 有一个 [Vercel](https://vercel.com) 账号（可用 GitHub 登录）。

---

## 2. 在 GitHub 上创建「空仓库」（完整步骤，避免出错）

下面以 **GitHub 网页** 为例；目标是一个**没有任何初始提交、没有 README** 的远程仓库，这样你本地已有项目可以干净地作为**第一次推送**，不会出现「远程已有提交、本地也有提交」的合并冲突。

### 2.1 创建步骤

1. 打开 [https://github.com](https://github.com) 并登录。
2. 页面右上角点击 **「+」** → **「New repository」**（新建仓库）。
3. **Owner**：选你的个人账号或组织。
4. **Repository name**：填写仓库名（例如 `portfolio-web`），仅字母、数字、`-`、`_` 等，避免空格与中文。
5. **Description**（可选）：一句话说明项目。
6. **Public / Private**：按需要选择；Vercel 导入时两种方式都可以（私有仓库需给 Vercel 授权）。
7. **下面三项务必注意（针对「本地已有代码、第一次推到 GitHub」的场景）：**
   - **不要**勾选 **「Add a README file」**
   - **不要**勾选 **「Add .gitignore」**
   - **不要**勾选 **「Choose a license」**  
   保持这三项都不选，GitHub 会生成一个**空仓库**（没有初始提交）。这样你后面在本地执行 `git push -u origin main` 时，不会和远程上「多出来的 README 提交」冲突。
8. 若页面有 **Default branch** 名称，选 **`main`**（与下文命令一致）。
9. 点击绿色按钮 **「Create repository」**。

创建成功后，浏览器会进入一个说明页，上面有 **HTTPS** 仓库地址，形如：

`https://github.com/<你的用户名>/<仓库名>.git`

请复制备用；下一节会把它设为 `origin`。

### 2.2 若不小心勾选了 README / .gitignore 会怎样

若你勾选了 **Add a README**，远程仓库会立刻有一个初始提交。此时**仍然可以**推送本地项目，但需要多一步，例如：

```bash
git pull origin main --allow-unrelated-histories
# 解决可能出现的合并冲突后
git push -u origin main
```

对不熟悉 Git 的人来说容易混乱。**更简单的做法**：若刚建完、还没有重要协作，可在 GitHub 仓库 **Settings → Danger zone → Delete this repository** 删掉仓库，再按 **2.1** 重新建一个**完全空**的仓库。

---

## 3. 本地初始化 Git 并推送到远程

若项目目录**还不是** Git 仓库，在项目根目录执行：

```bash
cd /path/to/lex_portfolio_web
git init
git add .
git commit -m "Initial commit"
```

将 **2.1** 里复制的地址替换下面命令中的 URL，添加远程并推送：

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

**说明：**

- `git remote add origin ...` 只需执行**一次**。若提示 `remote origin already exists`，说明已添加过远程，可用 `git remote -v` 查看；若要改地址，用 `git remote set-url origin <新 URL>`。
- 首次 `git push` 时，GitHub 可能要求**登录**：浏览器登录或 **Personal Access Token**（HTTPS）；若使用 **SSH**，请先在 GitHub 添加本机 SSH 公钥，并把远程 URL 换成 `git@github.com:用户名/仓库名.git`。
- 推送成功后，刷新 GitHub 仓库页面，应能看到你的代码文件。

之后每次改完代码：

```bash
git add .
git commit -m "描述本次修改"
git push
```

Vercel 会按你的设置自动用最新提交重新部署。

---

## 4. 在 Vercel 导入项目

1. 打开 [https://vercel.com/new](https://vercel.com/new)。
2. **Import** 你刚推送的 Git 仓库。
3. **Framework Preset** 选 **Next.js**（一般会自动识别）。
4. **Root Directory**：若代码在仓库根目录，保持默认 `.`。
5. **Build Command**：保持默认 `npm run build`（或 `next build`）。
6. **Output Directory**：Next.js 由 Vercel 内置集成处理，**不要**改成 `out`（除非你真的在用 `next export` 静态导出；本项目默认不是）。
7. **Install Command**：有 `package-lock.json` 时 Vercel 通常会用 `npm install`；保持默认即可。

点击 **Deploy**。首次构建可能需要几分钟；失败时打开 **Build Logs** 查看报错（常见：Node 版本、环境变量、依赖安装失败等）。

---

## 5. 环境变量

本项目使用 `NEXT_PUBLIC_SITE_URL` 作为站点完整 URL（用于 sitemap、canonical 等）。

在 Vercel：**Project → Settings → Environment Variables**：

| Name | 示例值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_SITE_URL` | `https://lextellsyou.asia` | 生产环境填你的正式域名；预览环境可填 Vercel 提供的 `https://xxx.vercel.app` |

为 **Production**、**Preview**、**Development** 按需勾选；改完后 **Redeploy** 一次使变量生效。

本地可复制仓库里的 `.env.example` 为 `.env.local` 做同样配置。

---

## 6. 绑定自定义域名（lextellsyou.asia）

1. Vercel：**Project → Settings → Domains** → 添加 `lextellsyou.asia`（及可选 `www.lextellsyou.asia`）。
2. 按 Vercel 提示到你的 **域名注册商 / DNS 服务商** 添加记录，常见两种：
   - **A 记录** 指向 Vercel 提供的 IP，或  
   - **CNAME** 将 `www` 指到 `cname.vercel-dns.com`（具体以 Vercel 面板显示为准）。
3. 等待 DNS 传播（几分钟到 48 小时不等）。Vercel 会自动申请 **HTTPS** 证书。

在域名生效后，把 `NEXT_PUBLIC_SITE_URL` 设为 `https://lextellsyou.asia` 并重新部署。

---

## 7. 日常发布流程

1. 本地 `npm run build` 确认能通过（可选但推荐）。
2. `git push` 到默认分支（如 `main`）。
3. Vercel 自动触发新部署；在 **Deployments** 查看状态与预览 URL。

若使用 **Pull Request**：Vercel 会为每个 PR 生成独立 **Preview** 链接，便于在合并前检查。

---

## 8. 常见问题

**构建失败：Module not found / 依赖问题**  
在本地删除 `node_modules` 后执行 `npm install`，再 `npm run build` 复现并修复。

**环境变量不生效**  
修改变量后需要 **Redeploy**；`NEXT_PUBLIC_*` 会打进前端包，确认名称拼写与部署环境一致。

**域名已添加但访问不对**  
检查 DNS 是否按 Vercel 要求配置；用 `dig` 或在线 DNS 查询确认解析目标。

**只想静态托管、不用 Vercel**  
Next.js 默认是服务端/边缘特性混合；若未来改为纯静态导出，需单独改 `next.config` 与构建脚本，与本指南的默认流程不同。

---

## 9. 相关文件

- 根目录 [`README.md`](../README.md)：开发与素材目录说明。
- [`package.json`](../package.json)：`dev`、`build`、`start`、`lint` 脚本。
