import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parse } = createRequire(require.resolve("next/package.json"))("postcss");
const files = Object.fromEntries(["portfolio", "case-study", "notes"].map((name) => {
  const path = `src/app/${name}.css`;
  return [name, { path, sheet: parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8")) }];
}));

function declaration(file, selector, property) {
  const { path, sheet } = files[file];
  const matches = sheet.nodes.filter((rule) => rule.type === "rule" && rule.selector === selector)
    .flatMap((rule) => rule.nodes.filter((node) => node.type === "decl" && node.prop === property));
  if (!matches.length) throw new Error(`Missing design source: ${path} ${selector} ${property}`);
  return matches.at(-1).value.replace(/\s+/g, " ").trim();
}

const tokens = {};

function token(group, name, type, description, file, selector, property, { dark, css = `--lex-${group}-${name}` } = {}) {
  const value = declaration(file, selector, property);
  tokens[group] ??= {};
  tokens[group][name] = {
    type,
    value,
    ...(dark ? { dark: declaration(file, dark, property) } : {}),
    css,
    description,
    source: { file: files[file].path, selector, property, ...(dark ? { darkSelector: dark } : {}) },
  };
}

const root = (group, name, type, description, css, themed = false) =>
  token(group, name, type, description, "portfolio", ":root", css, { css, dark: themed ? ".theme-dark" : undefined });

for (const [name, description] of Object.entries({
  paper: "页面底色", panel: "卡片和浮层底色", ink: "标题与正文", muted: "摘要与次要文字",
  line: "细分隔线与边框", accent: "链接、焦点与强调", highlight: "选项衬底与淡色区域", "on-accent": "实色强调上的前景",
})) root("color", name, "color", description, `--portfolio-${name}`, true);

for (const [name, type, description] of [
  ["primary-bg", "gradient", "蓝色主按钮底色"], ["primary-edge", "color", "蓝色主按钮描边"],
  ["primary-ink", "color", "蓝色主按钮前景"], ["primary-shadow", "shadow", "蓝色按钮内外阴影"],
  ["primary-text-shadow", "shadow", "蓝色按钮文字阴影"], ["silver-bg", "gradient", "银色次级控件底色"],
  ["silver-edge", "color", "银色次级控件描边"], ["silver-ink", "color", "银色次级控件前景"],
  ["silver-shadow", "shadow", "银色控件内外阴影"], ["silver-text-shadow", "shadow", "银色控件文字阴影"],
  ["gloss", "gradient", "Aqua 上沿高光"],
]) root("aqua", name, type, description, `--aqua-${name}`, true);

for (const [name, description, product] of [
  ["rephoto", "归影", null], ["travel-route", "旅迹时光", "travel-route"], ["altitudeshot", "实时海拔计", "altitudeshot"],
  ["flowdo", "FlowDo", "flowdo"], ["aray-studio", "ARay Studio", "aray-studio"], ["colpix", "可图", "colpix"], ["mycelia", "小菌丝", "mycelia"],
]) token("project", name, "color", description, "portfolio", product ? `.portfolio-project[data-project="${product}"]` : ".portfolio-project", "--project-color");

for (const [name, description] of [["event", "活动"], ["video", "视频"], ["note", "短记"]]) {
  const selector = `.note-type-${name}`;
  token("note", `${name}-bg`, "color", `${description}徽标底色`, "notes", selector, "background", { dark: `.theme-dark ${selector}` });
  token("note", `${name}-ink`, "color", `${description}徽标文字`, "notes", selector, "color", { dark: `.theme-dark ${selector}` });
}

for (const [name, description] of [["font", "界面及正文"], ["serif", "英文衬线、编号与签名"], ["hand", "人物签名、便签等手写质感"]])
  root("font", name, "fontFamily", description, `--portfolio-${name}`);

for (const [group, name, type, description, css] of [
  ["layout", "content", "dimension", "首页、作品与 Notes 列表内容宽度", "--portfolio-width"],
  ["space", "gutter", "dimension", "页面两侧流体边距", "--portfolio-gutter"],
  ["radius", "panel", "dimension", "卡片、封面与弹窗主圆角", "--portfolio-radius"],
]) root(group, name, type, description, css);

for (const [group, name, type, description, file, selector, property] of [
  ["layout", "chrome", "dimension", "内页顶栏最大宽度", "case-study", ".case-page", "--case-max"],
  ["layout", "chrome-height", "dimension", "内页顶栏基准高度", "case-study", ".case-page", "--case-chrome-h"],
  ["layout", "article", "dimension", "文章正文流体宽度（上限 48rem）", "notes", ".notes-article", "width"],
  ["layout", "dialog", "dimension", "弹窗流体宽度（上限 32rem）", "portfolio", ".portfolio-dialog", "width"],
  ["layout", "story-height", "dimension", "首页桌面故事卡基准高度", "portfolio", ".portfolio-story-stack", "--story-card-height"],
  ["space", "story-peek", "dimension", "故事叠卡间距与露边", "portfolio", ".portfolio-story-stack", "--story-peek"],
  ["space", "section", "dimension", "首页区块上留白", "portfolio", ".portfolio-section", "margin-block-start"],
  ["space", "note-grid", "dimension", "文章卡网格间距", "notes", ".notes-list", "gap"],
  ["space", "note-card-inset", "dimension", "文章卡正文内边距", "notes", ".note-card-body", "padding"],
  ["space", "note-card-content", "dimension", "文章卡正文区行组间距", "notes", ".note-card-body", "gap"],
  ["space", "tag-gap", "dimension", "项目标签间距", "portfolio", ".portfolio-tags", "gap"],
  ["space", "control-gap", "dimension", "主按钮图标与文字间距", "portfolio", ".portfolio-action", "gap"],
  ["space", "dialog-inset", "dimension", "弹窗内部留白", "portfolio", ".portfolio-dialog-content", "padding"],
  ["radius", "pill", "dimension", "按钮、类型徽标与筛选项", "portfolio", ".portfolio-action", "border-radius"],
  ["radius", "note-tag", "dimension", "文章普通标签", "notes", ".note-tags span", "border-radius"],
  ["radius", "photo", "dimension", "联系卡的照片边框", "portfolio", ".portfolio-contact-scene", "border-radius"],
  ["type", "intro-title", "dimension", "首页姓名标题", "portfolio", ".portfolio-intro h1", "font-size"],
  ["type", "case-title", "dimension", "案例主标题", "case-study", ".case-hero h1", "font-size"],
  ["type", "notes-title", "dimension", "文章列表主标题", "notes", ".notes-index-hero h1", "font-size"],
  ["type", "article-title", "dimension", "文章详情主标题", "notes", ".notes-article-header h1", "font-size"],
  ["type", "section-title", "dimension", "首页区块标题", "portfolio", ".portfolio-heading h2", "font-size"],
  ["type", "note-card-title", "dimension", "文章卡标题", "notes", ".note-card h2", "font-size"],
  ["type", "body", "dimension", "作品简述", "portfolio", ".portfolio-project-copy p", "font-size"],
  ["type", "prose", "dimension", "文章正文", "notes", ".note-prose", "font-size"],
  ["type", "prose-leading", "number", "文章正文行高", "notes", ".note-prose", "line-height"],
  ["type", "meta", "dimension", "文章卡日期等元信息", "notes", ".note-card-meta", "font-size"],
  ["control", "primary-height", "dimension", "Aqua 主按钮最小高度", "portfolio", ".portfolio-action", "min-height"],
  ["control", "close-size", "dimension", "弹窗圆形关闭按钮", "portfolio", ".portfolio-dialog-close", "width"],
  ["control", "focus", "stroke", "控件键盘焦点描边", "case-study", ".case-page :is(a, button):focus-visible", "outline"],
  ["control", "focus-offset", "dimension", "控件键盘焦点描边偏移", "case-study", ".case-page :is(a, button):focus-visible", "outline-offset"],
  ["image", "note-cover", "ratio", "文章列表封面", "notes", ".note-card-cover", "aspect-ratio"],
  ["image", "article-cover", "ratio", "文章详情封面", "notes", ".notes-article-cover", "aspect-ratio"],
  ["image", "contact-print", "ratio", "联系卡照片默认比例", "portfolio", ".portfolio-contact-scene", "aspect-ratio"],
  ["effect", "dialog-shadow", "shadow", "浮层阴影", "portfolio", ".portfolio-dialog", "box-shadow"],
  ["effect", "dialog-scrim", "color", "浮层遮罩", "portfolio", ".portfolio-dialog::backdrop", "background"],
  ["effect", "dialog-blur", "filter", "浮层背景虚化", "portfolio", ".portfolio-dialog::backdrop", "backdrop-filter"],
  ["motion", "action", "transition", "主按钮悬停与按下过渡", "portfolio", ".portfolio-action", "transition"],
  ["motion", "filter", "transition", "筛选控件的状态过渡", "notes", ".notes-filter", "transition"],
  ["motion", "note-card", "transition", "文章卡悬停过渡", "notes", ".note-card", "transition"],
  ["motion", "note-image", "transition", "文章卡封面缓动", "notes", ".note-card-cover img", "transition"],
  ["motion", "project-tint", "transition", "作品渐变显隐过渡", "portfolio", ".portfolio-project-link::before", "transition"],
  ["motion", "project-art", "transition", "作品截图拼贴缓动", "portfolio", ".portfolio-project-art", "transition"],
  ["motion", "dock-spring", "transition", "侧边 Dock 展开弹簧曲线", "portfolio", ".portfolio-dock", "--dock-spring"],
]) token(group, name, type, description, file, selector, property);

token("effect", "project-tint", "percentage", "作品色的渐变混合强度", "portfolio", ".portfolio-project-link", "--project-tint-strength", { dark: ".theme-dark .portfolio-project-link" });
token("effect", "project-gradient", "gradient", "悬停渐变方向和停止点", "portfolio", ".portfolio-project-link::before", "background");

const entries = Object.values(tokens).flatMap(Object.values);
const variables = (key) => entries.filter((item) => item[key]).map((item) => `  ${item.css}: ${item[key]};`).join("\n");
const data = { name: "Lex Studio Design System", version: 1, defaultTheme: "light", tokens };
const json = JSON.stringify(data, null, 2);
const css = [":root {", variables("value"), "}", "", ":root[data-theme=\"dark\"],", ":root.theme-dark {", variables("dark"), "}", ""].join("\n");
const output = {
  "tokens.json": `${json}\n`,
  "tokens.css": css,
  "tokens.data.js": `globalThis.lexDesignTokens = ${json};\n`,
};

for (const [filename, content] of Object.entries(output)) {
  const path = new URL(`../public/design-system/${filename}`, import.meta.url);
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== content) throw new Error(`${filename} is outdated. Run node scripts/design-system.mjs`);
  } else {
    writeFileSync(path, content);
  }
}

console.log(`Lex Studio: ${entries.length} design tokens`);
