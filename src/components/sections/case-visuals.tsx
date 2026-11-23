"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import type { CaseChapter } from "@/content/case-studies";
import type { Product } from "@/content/products";

type Lang = "zh" | "en";

type SceneProps = {
  chapter: CaseChapter;
  lang: Lang;
};

const accents: Record<string, string> = {
  echosnap: "#2f9e75",
  "travel-route": "#3f7fb8",
  altitudeshot: "#2f8f76",
  flowdo: "#6e60db",
  "aray-studio": "#1e8fb3",
  colpix: "#24c98b",
  mycelia: "#ef8b3c",
  "folovibe-key": "#24c98b",
};

const sceneTags: Record<string, Record<string, { zh: string; en: string }>> = {
  echosnap: {
    problem: { zh: "1,284 张照片，只做一个决定", en: "1,284 photos, one decision" },
    swipe: { zh: "左右保留，上滑删除", en: "Keep sideways, delete upward" },
    system: { zh: "分组、影历、空间收益", en: "Groups, timeline, storage saved" },
    shipped: { zh: "上线之后继续打磨", en: "Live, then keep refining" },
  },
  "travel-route": {
    problem: { zh: "路线不该只留在截图里", en: "A route is more than screenshots" },
    edit: { zh: "地点 → 顺序 → 动画", en: "Places → order → motion" },
    motion: { zh: "节点决定节奏", en: "Stops set the rhythm" },
    share: { zh: "把旅程带走", en: "Take the trip with you" },
  },
  altitudeshot: {
    problem: { zh: "山顶没有时间翻菜单", en: "No time for menus at the summit" },
    read: { zh: "海拔先读，数据后置", en: "Altitude first, context second" },
    card: { zh: "照片 + 地点 + 海拔 + 时间", en: "Photo + place + altitude + time" },
    outdoors: { zh: "强光、移动、手套", en: "Sun, motion, gloves" },
  },
  flowdo: {
    problem: { zh: "记一件事，不该先填表", en: "Capture shouldn't start with a form" },
    capture: { zh: "一次唤出，记下就走", en: "One summon, then back to work" },
    system: { zh: "任务与句子，各有归处", en: "A home for every kind of thought" },
    local: { zh: "数据留在这台设备", en: "Data stays on the device" },
  },
  "aray-studio": {
    problem: { zh: "四个 App → 一条路径", en: "Four apps → one path" },
    flow: { zh: "停止录制，时间线已就绪", en: "Stop recording, timeline ready" },
    wysiwyg: { zh: "同一条渲染路径", en: "One render path" },
    offline: { zh: "音频不上传", en: "Audio never uploads" },
  },
  colpix: {
    problem: { zh: "存下来，却找不回来", en: "Saved, then lost" },
    capture: { zh: "看到就收，不离开网页", en: "Capture without leaving the page" },
    organize: { zh: "集合、标签、颜色、搜索", en: "Collections, tags, color, search" },
    local: { zh: "图库就是你的文件夹", en: "Your library is your folder" },
  },
  mycelia: {
    problem: { zh: "每一步都在重新开始", en: "Every step restarts" },
    flow: { zh: "一条内容，走到复盘", en: "One idea, through review" },
    local: { zh: "准备可以自动，发布必须可见", en: "Prepare automatically, publish visibly" },
    overview: { zh: "九个平台，一处管理", en: "Nine platforms, one desk" },
  },
  "folovibe-key": {
    voice: { zh: "按住说话，松开输入", en: "Hold to talk, release to input" },
    agent: { zh: "连接 Agent 会话", en: "Agent sessions" },
    captions: { zh: "实时字幕与翻译", en: "Live captions & translation" },
    usage: { zh: "用量与额度一目了然", en: "Usage at a glance" },
  },
};

function text(lang: Lang, zh: string, en: string) {
  return lang === "zh" ? zh : en;
}

export function CaseVisual({ chapter, product, lang }: { chapter: CaseChapter; product: Product; lang: Lang }) {
  const accent = accents[product.slug] ?? accents.echosnap;
  const tag = sceneTags[product.slug]?.[chapter.id] ?? chapter.aside;
  const style = { "--scene-accent": accent } as CSSProperties;

  return (
    <div
      className={`case-visual case-story case-story-${product.slug}`}
      data-scene={chapter.id}
      style={style}
      role="img"
      aria-label={lang === "zh" ? `${chapter.title.zh} 图示` : `${chapter.title.en} illustration`}
    >
      <div className="cs-canvas" aria-hidden>
        {product.slug === "echosnap" ? <RePhotoScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "travel-route" ? <TravelScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "altitudeshot" ? <AltitudeScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "flowdo" ? <FlowDoScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "aray-studio" ? <ARayScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "colpix" ? <ColpixScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "mycelia" ? <MyceliaScene chapter={chapter} lang={lang} /> : null}
        {product.slug === "folovibe-key" ? <FoloVibeScene chapter={chapter} product={product} /> : null}
      </div>
      <span className="cs-tag">{text(lang, tag.zh, tag.en)}</span>
    </div>
  );
}

function RePhotoScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "swipe") return <RePhotoSwipe lang={lang} />;
  if (chapter.id === "system") return <RePhotoSystem lang={lang} />;
  if (chapter.id === "shipped") return <RePhotoShipped lang={lang} />;
  return <RePhotoProblem lang={lang} />;
}

function RePhotoProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-rp-problem">
      <div className="cs-rp-window">
        <div className="cs-rp-window-head">
          <span>1,284</span>
          <em>{text(lang, "张照片", "photos")}</em>
          <i />
        </div>
        <div className="cs-rp-grid" aria-hidden>
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </div>
        <div className="cs-rp-focus">
          <svg viewBox="0 0 240 154" aria-hidden>
            <defs>
              <linearGradient id="rp-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d5e9e0" />
                <stop offset="1" stopColor="#f4d9bf" />
              </linearGradient>
            </defs>
            <rect width="240" height="154" fill="url(#rp-sky)" />
            <circle cx="182" cy="46" r="20" fill="#f7c98b" opacity=".8" />
            <path d="M0 126 48 88l33 20 43-48 44 58 31-19 41 27v28H0Z" fill="#5a8979" />
            <path d="m81 108 43-48 44 58-28-14-17 12-18-14Z" fill="#3f6d60" opacity=".8" />
            <path d="M0 135c37-12 67 4 102-4 39-9 72-1 138 4v19H0Z" fill="#244e44" />
          </svg>
          <span>{text(lang, "只看这一张", "One photo")}</span>
        </div>
        <span className="cs-rp-one-decision">{text(lang, "一个决定", "one decision")}</span>
      </div>
    </div>
  );
}

function RePhotoSwipe({ lang }: { lang: Lang }) {
  return (
    <div className="cs-rp-swipe">
      <div className="cs-rp-swipe-stage">
        <i className="cs-rp-ghost cs-rp-ghost-a" aria-hidden />
        <i className="cs-rp-ghost cs-rp-ghost-b" aria-hidden />
        <div className="cs-rp-swipe-photo">
          <svg viewBox="0 0 220 286" aria-hidden>
            <defs>
              <linearGradient id="rp-photo-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b9d7e0" />
                <stop offset=".56" stopColor="#e8d7bd" />
                <stop offset="1" stopColor="#e4b98e" />
              </linearGradient>
            </defs>
            <rect width="220" height="286" fill="url(#rp-photo-sky)" />
            <circle cx="162" cy="68" r="27" fill="#f7ce91" opacity=".86" />
            <path d="M0 218 53 159l36 34 54-79 77 103v69H0Z" fill="#426d67" />
            <path d="m143 114 77 103v69h-55l-27-51Z" fill="#2f5753" opacity=".78" />
            <path d="M0 243c44-12 79 2 121-5 38-7 68-2 99 3v45H0Z" fill="#1d3f3b" />
          </svg>
          <span className="cs-rp-photo-chip">2026 · 11 · 21</span>
        </div>
        <svg className="cs-rp-swipe-hints" viewBox="0 0 360 300" aria-hidden>
          <path d="M70 172c-15-2-27-9-36-20m0 0 10 1m-10-1 3-9" />
          <path d="M290 172c15-2 27-9 36-20m0 0-10 1m10-1-3-9" />
          <path d="M180 54c-2-15-9-27-20-36m0 0 1 10m-1-10-9 3" />
        </svg>
      </div>
      <div className="cs-rp-actions">
        <span data-kind="keep">← {text(lang, "保留", "Keep")}</span>
        <span data-kind="delete">↑ {text(lang, "删除", "Delete")}</span>
        <span data-kind="undo">↺ {text(lang, "撤销", "Undo")}</span>
      </div>
    </div>
  );
}

function RePhotoSystem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-rp-system">
      <div className="cs-rp-system-window">
        <div className="cs-rp-system-head">
          <span>{text(lang, "清理进度", "Cleanup progress")}</span>
          <em>2026</em>
        </div>
        <div className="cs-rp-groups">
          {[
            [text(lang, "截屏", "Screenshots"), "234", 76],
            [text(lang, "相似照片", "Similar"), "32", 42],
            [text(lang, "重复项目", "Duplicates"), "108", 61],
          ].map(([label, value, width]) => (
            <div key={String(label)}>
              <i />
              <span>{label}</span>
              <em>{value}</em>
              <b style={{ "--bar": `${width}%` } as CSSProperties} />
            </div>
          ))}
        </div>
        <div className="cs-rp-months" aria-hidden>
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </div>
        <div className="cs-rp-months-label">
          <span>JAN</span>
          <span>DEC</span>
        </div>
      </div>
      <div className="cs-rp-gauge">
        <svg viewBox="0 0 132 132" aria-hidden>
          <circle cx="66" cy="66" r="52" />
          <circle className="cs-rp-gauge-value" cx="66" cy="66" r="52" pathLength="100" />
        </svg>
        <strong>24<small>%</small></strong>
        <span>{text(lang, "空间收益", "saved")}</span>
      </div>
    </div>
  );
}

function RePhotoShipped({ lang }: { lang: Lang }) {
  return (
    <div className="cs-rp-shipped">
      <div className="cs-rp-beforeafter">
        <div>
          <span>1,284</span>
          <div className="cs-rp-mini-grid" aria-hidden>
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
          </div>
          <em>{text(lang, "之前", "before")}</em>
        </div>
        <svg viewBox="0 0 80 32" aria-hidden>
          <path d="M4 16h64m0 0-10-8m10 8-10 8" />
        </svg>
        <div>
          <span>906</span>
          <div className="cs-rp-mini-grid is-after" aria-hidden>
            {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
          </div>
          <em>{text(lang, "之后", "after")}</em>
        </div>
      </div>
      <div className="cs-rp-store-card">
        <div className="cs-rp-app-icon" aria-hidden>
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="19" />
            <path d="m32 12 4 16 16 4-16 4-4 16-4-16-16-4 16-4Z" />
          </svg>
        </div>
        <div>
          <strong>RePhoto</strong>
          <span>★★★★★</span>
          <em>App Store · 2026</em>
        </div>
        <i>{text(lang, "已上线", "Live")}</i>
      </div>
    </div>
  );
}

function TravelScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "edit") return <TravelEdit lang={lang} />;
  if (chapter.id === "motion") return <TravelMotion lang={lang} />;
  if (chapter.id === "share") return <TravelShare lang={lang} />;
  return <TravelProblem lang={lang} />;
}

function TravelProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-travel-problem">
      <div className="cs-travel-map">
        <svg viewBox="0 0 500 320" aria-hidden>
          <path className="cs-tl-contour" d="M-30 72c76-48 139 2 209-20s119-42 194-3 104 20 153 3" />
          <path className="cs-tl-contour" d="M-26 116c67-37 124-6 186-25s127-33 192 2 104 19 157 5" />
          <path className="cs-tl-contour" d="M-32 236c74 34 132 8 198 23s131 26 193 1 113-16 166 2" />
          <path className="cs-tl-route" d="M78 246c47-15 78-57 123-61 49-4 76 41 123 8 31-22 51-65 101-85" />
          <circle className="cs-tl-stop cs-tl-stop-1" cx="78" cy="246" r="5" />
          <circle className="cs-tl-stop cs-tl-stop-2" cx="201" cy="185" r="5" />
          <circle className="cs-tl-stop cs-tl-stop-3" cx="324" cy="193" r="5" />
          <circle className="cs-tl-stop cs-tl-stop-4" cx="425" cy="108" r="5" />
        </svg>
        <span className="cs-tl-pin cs-tl-pin-1">{text(lang, "北京", "PEK")}</span>
        <span className="cs-tl-pin cs-tl-pin-2">{text(lang, "南京", "NKG")}</span>
        <span className="cs-tl-pin cs-tl-pin-3">{text(lang, "上海", "SHA")}</span>
        <div className="cs-tl-snapshot cs-tl-snapshot-a" aria-hidden><i /><i /><i /></div>
        <div className="cs-tl-snapshot cs-tl-snapshot-b" aria-hidden><i /><i /></div>
        <div className="cs-tl-snapshot cs-tl-snapshot-c" aria-hidden><i /></div>
        <div className="cs-tl-map-foot">
          <span>{text(lang, "路线还散落在截图里", "The route is still scattered")}</span>
          <em>1,284 KM</em>
        </div>
      </div>
    </div>
  );
}

function TravelEdit({ lang }: { lang: Lang }) {
  return (
    <div className="cs-travel-edit">
      <div className="cs-tl-stops">
        <div className="cs-tl-stops-head">
          <span>{text(lang, "路线节点", "Stops")}</span>
          <em>03</em>
        </div>
        <div className="cs-tl-stop-row is-active">
          <i>⠿</i><span>01</span><strong>{text(lang, "北京", "Beijing")}</strong><em>{text(lang, "起点", "Start")}</em>
        </div>
        <div className="cs-tl-stop-row is-moving">
          <i>⠿</i><span>02</span><strong>{text(lang, "南京", "Nanjing")}</strong><em>1d 04h</em>
        </div>
        <div className="cs-tl-stop-row">
          <i>⠿</i><span>03</span><strong>{text(lang, "上海", "Shanghai")}</strong><em>{text(lang, "终点", "End")}</em>
        </div>
        <div className="cs-tl-add-stop">＋ {text(lang, "添加地点", "Add a stop")}</div>
      </div>
      <div className="cs-tl-edit-map">
        <svg viewBox="0 0 260 290" aria-hidden>
          <path className="cs-tl-edit-contour" d="M-20 78c53-33 91 20 139 9s63-43 161-11" />
          <path className="cs-tl-edit-contour" d="M-30 206c55 24 111-8 154 11s76 25 162 6" />
          <path className="cs-tl-edit-route" d="M67 220c16-49 61-64 78-91 13-21 31-27 53-42" pathLength={1} />
          <circle cx="67" cy="220" r="6" />
          <circle cx="145" cy="129" r="6" />
          <circle cx="198" cy="87" r="6" />
        </svg>
        <span className="cs-tl-order-chip">01 → 02 → 03</span>
      </div>
    </div>
  );
}

function TravelMotion({ lang }: { lang: Lang }) {
  return (
    <div className="cs-travel-motion">
      <div className="cs-tl-player">
        <div className="cs-tl-player-screen">
          <svg viewBox="0 0 480 270" aria-hidden>
            <rect width="480" height="270" fill="#dce9f1" />
            <path className="cs-tl-map-shadow" d="M-20 61c76-35 146 4 201-18s139-31 203 13 84 27 125 16v219H0Z" />
            <path className="cs-tl-motion-route" d="M63 211c59-18 67-83 134-87 49-3 67 50 108 14 34-30 53-69 113-84" pathLength="1" />
            <circle className="cs-tl-motion-start" cx="63" cy="211" r="6" />
            <circle className="cs-tl-motion-end" cx="418" cy="54" r="7" />
            <g className="cs-tl-plane">
              <path d="m0-12 5 8 12 2-11 4-2 9-4-8-9-2 7-5Z" />
            </g>
          </svg>
          <span className="cs-tl-player-label">{text(lang, "路线动画", "Route film")}</span>
          <span className="cs-tl-player-time">00:24</span>
        </div>
        <div className="cs-tl-player-controls">
          <i className="cs-tl-play" aria-hidden />
          <div><i /></div>
          <span>00:12 / 00:24</span>
        </div>
      </div>
      <div className="cs-tl-frames" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <i key={index} style={{ "--i": index } as CSSProperties}>
            <b />
          </i>
        ))}
      </div>
    </div>
  );
}

function TravelShare({ lang }: { lang: Lang }) {
  return (
    <div className="cs-travel-share">
      <div className="cs-tl-phone">
        <div className="cs-tl-phone-screen">
          <svg viewBox="0 0 176 300" aria-hidden>
            <rect width="176" height="300" fill="#e7f0f6" />
            <path d="M23 236c28-19 24-55 53-70s51 19 78-43" />
            <path className="cs-tl-phone-route" d="M23 236c28-19 24-55 53-70s51 19 78-43" />
            <circle cx="23" cy="236" r="4" />
            <circle cx="154" cy="123" r="4" />
          </svg>
          <span className="cs-tl-play-big" aria-hidden />
          <em>{text(lang, "24 秒旅程", "24 sec journey")}</em>
        </div>
      </div>
      <div className="cs-tl-export-sheet">
        <span>{text(lang, "导出", "Export")}</span>
        <strong>TravelRoute.mp4</strong>
        <em>1080p · 24s · 24 fps</em>
        <div className="cs-tl-share-nodes">
          <i>{text(lang, "相册", "Photos")}</i>
          <i>{text(lang, "聊天", "Chat")}</i>
          <i>{text(lang, "社媒", "Social")}</i>
        </div>
        <div className="cs-tl-progress"><i /></div>
      </div>
    </div>
  );
}

function AltitudeScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "read") return <AltitudeRead lang={lang} />;
  if (chapter.id === "card") return <AltitudeCard lang={lang} />;
  if (chapter.id === "outdoors") return <AltitudeOutdoors lang={lang} />;
  return <AltitudeProblem lang={lang} />;
}

function AltitudeProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-alt-problem">
      <svg className="cs-alt-peak" viewBox="0 0 520 300" aria-hidden>
        <path d="M-20 300V244l74-81 47 38 49-91 69 84 42-39 60 87 38-32 51 89 44-53 78 94v60Z" />
        <path className="cs-alt-snow" d="m101 163 49-91 36 43-18-7-13 16-12-5-13 22Z" />
        <path className="cs-alt-snow" d="m341 124 42-39 27 39-13-4-9 10-10-5-10 12Z" />
        <circle cx="419" cy="63" r="27" />
      </svg>
      <div className="cs-alt-menus">
        <div><span>01</span>{text(lang, "海拔", "Altitude")}</div>
        <div><span>02</span>{text(lang, "气压", "Pressure")}</div>
        <div><span>03</span>{text(lang, "方向", "Bearing")}</div>
      </div>
      <div className="cs-alt-problem-readout">
        <span>{text(lang, "到达那一刻", "At the summit")}</span>
        <strong>2,371<small>m</small></strong>
        <em>{text(lang, "数据不该藏在三层菜单里", "Not three menus deep")}</em>
      </div>
    </div>
  );
}

function AltitudeRead({ lang }: { lang: Lang }) {
  return (
    <div className="cs-alt-read">
      <div className="cs-alt-dial">
        <svg viewBox="0 0 240 240" aria-hidden>
          <circle className="cs-alt-dial-ring" cx="120" cy="120" r="101" />
          <circle className="cs-alt-dial-inner" cx="120" cy="120" r="82" />
          <g className="cs-alt-ticks">
            {Array.from({ length: 24 }, (_, index) => (
              <line key={index} x1="120" y1="20" x2="120" y2={index % 3 === 0 ? "33" : "27"} transform={`rotate(${index * 15} 120 120)`} />
            ))}
          </g>
          <path className="cs-alt-needle" d="M120 126V54" />
          <circle cx="120" cy="120" r="7" />
        </svg>
        <div className="cs-alt-readout">
          <span>ALTITUDE · LIVE</span>
          <strong>2,371<small>m</small></strong>
          <em>{text(lang, "四姑娘山 · 幺妹峰", "Siguniang · Peak IV")}</em>
        </div>
      </div>
      <div className="cs-alt-read-rows">
        <div><span>GPS</span><strong>30.5°N 102.9°E</strong></div>
        <div><span>{text(lang, "气压", "Pressure")}</span><strong>620 hPa</strong></div>
        <div><span>{text(lang, "方向", "Bearing")}</span><strong>NE · 042°</strong></div>
      </div>
    </div>
  );
}

function AltitudeCard({ lang }: { lang: Lang }) {
  return (
    <div className="cs-alt-card">
      <div className="cs-alt-photo">
        <svg viewBox="0 0 420 300" aria-hidden>
          <defs>
            <linearGradient id="alt-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#bddbe5" />
              <stop offset=".55" stopColor="#f1d7b6" />
              <stop offset="1" stopColor="#dfb582" />
            </linearGradient>
          </defs>
          <rect width="420" height="300" fill="url(#alt-sky)" />
          <circle cx="318" cy="75" r="34" fill="#fff3cc" opacity=".78" />
          <path d="M0 242 85 151l53 55 72-106 88 118 57-48 65 72v58H0Z" fill="#44675e" />
          <path d="m210 100 88 118-35-17-20 19-24-24-22 13Z" fill="#eff2e5" opacity=".9" />
          <path d="M0 262c76-11 126 5 194-2s129-8 226 4v36H0Z" fill="#243f3a" />
        </svg>
        <span className="cs-alt-photo-pin" aria-hidden>
          <i />
        </span>
        <div className="cs-alt-photo-meta">
          <span>{text(lang, "幺妹峰 · 登顶", "Peak IV · Summit")}</span>
          <strong>2,371<small>m</small></strong>
          <em>30.5°N / 102.9°E</em>
        </div>
      </div>
      <div className="cs-alt-card-aside">
        <span>SUMMIT PIN</span>
        <strong>2026.11.21</strong>
        <em>07:42</em>
        <div className="cs-alt-card-chip">GPS + BARO</div>
      </div>
    </div>
  );
}

function AltitudeOutdoors({ lang }: { lang: Lang }) {
  return (
    <div className="cs-alt-outdoors">
      <div className="cs-alt-sun" aria-hidden />
      <div className="cs-alt-strong-screen">
        <div className="cs-alt-strong-head">
          <span>{text(lang, "实时海拔", "LIVE ALTITUDE")}</span>
          <div><i>中</i><i className="is-on">EN</i></div>
        </div>
        <strong>2,371<small>m</small></strong>
        <div className="cs-alt-strong-rows">
          <span>30.5°N</span><span>620 hPa</span><span>NE 042°</span>
        </div>
        <div className="cs-alt-strong-timeline" aria-hidden>
          <i /><i /><i /><i /><i />
        </div>
      </div>
      <div className="cs-alt-glove">
        <span>{text(lang, "强光可读", "SUNLIGHT READABLE")}</span>
        <strong>AA</strong>
      </div>
    </div>
  );
}

function FlowDoScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "capture") return <FlowDoCapture lang={lang} />;
  if (chapter.id === "system") return <FlowDoSystem lang={lang} />;
  if (chapter.id === "local") return <FlowDoLocal lang={lang} />;
  return <FlowDoProblem lang={lang} />;
}

function FlowDoProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-flow-problem">
      <div className="cs-flow-form-window">
        <div className="cs-flow-form-head">
          <span>{text(lang, "新建待办", "New task")}</span>
          <em>ESC</em>
        </div>
        <div className="cs-flow-gates" aria-hidden>
          <i>{text(lang, "项目", "Project")}</i>
          <i>{text(lang, "标签", "Tags")}</i>
          <i>{text(lang, "优先级", "Priority")}</i>
        </div>
        <div className="cs-flow-capture-input">
          <span>{text(lang, "先写下要做的事…", "Write the thing down…")}</span>
          <b>⌘ ↩</b>
        </div>
        <div className="cs-flow-form-note">
          <span>{text(lang, "录入，不该先填一张表", "Capture shouldn't start with a form")}</span>
          <i>→</i>
        </div>
      </div>
    </div>
  );
}

function FlowDoCapture({ lang }: { lang: Lang }) {
  return (
    <div className="cs-flow-capture">
      <div className="cs-flow-menubar">
        <span className="cs-flow-menubar-app">FlowDo</span>
        <span>{text(lang, "今天", "Today")}</span>
        <span>{text(lang, "看板", "Board")}</span>
        <em>09:41</em>
      </div>
      <div className="cs-flow-quick">
        <div className="cs-flow-shortcut"><kbd>⌥</kbd><kbd>Space</kbd></div>
        <div className="cs-flow-quick-input">
          <i />
          <span>{text(lang, "把今天过清楚一点", "A clearer way through today")}</span>
          <b className="cs-flow-caret" />
        </div>
        <div className="cs-flow-quick-meta">
          <span>Today</span><span>09:41</span><em>Esc</em>
        </div>
      </div>
      <div className="cs-flow-capture-task">
        <i />
        <span>{text(lang, "完成详情页动效", "Finish the case visuals")}</span>
      </div>
      <div className="cs-flow-capture-hint">
        <span>{text(lang, "一次唤出", "One summon")}</span>
        <i>→</i>
        <span>{text(lang, "回到手头", "back to work")}</span>
      </div>
    </div>
  );
}

function FlowDoSystem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-flow-system">
      <div className="cs-flow-phone">
        <div className="cs-flow-phone-notch" aria-hidden />
        <div className="cs-flow-phone-screen">
          <div className="cs-flow-screen-head">
            <span>{text(lang, "今天", "Today")}</span>
            <em>11 · 21</em>
          </div>
          <div className="cs-flow-task-card">
            <i />
            <span>{text(lang, "整理产品截图", "Tidy the product shots")}</span>
          </div>
          <div className="cs-flow-task-card is-done">
            <i />
            <span>{text(lang, "回复合作邮件", "Reply to the collaboration")}</span>
          </div>
          <div className="cs-flow-quote-card">
            <span>“</span>
            <p>{text(lang, "把常用的动作做短。", "Shorten the common path.")}</p>
          </div>
          <div className="cs-flow-tabs" aria-hidden>
            <i className="is-active">Today</i><i>Board</i><i>Quotes</i><i>Journal</i><i>Settings</i>
          </div>
        </div>
      </div>
      <div className="cs-flow-system-cards">
        <div><span>BOARD</span><strong>{text(lang, "今天", "Today")}</strong><i /></div>
        <div><span>QUOTES</span><strong>{text(lang, "句子", "Saved")}</strong><i /></div>
        <div><span>JOURNAL</span><strong>{text(lang, "手账", "Journal")}</strong><i /></div>
      </div>
    </div>
  );
}

function FlowDoLocal({ lang }: { lang: Lang }) {
  return (
    <div className="cs-flow-local">
      <div className="cs-flow-device">
        <div className="cs-flow-device-screen">
          <div className="cs-flow-device-lock" aria-hidden>
            <svg viewBox="0 0 48 48">
              <rect x="12" y="21" width="24" height="18" rx="5" />
              <path d="M17 21v-4a7 7 0 0 1 14 0v4" />
            </svg>
          </div>
          <strong>{text(lang, "数据留在这台设备", "Data stays on this device")}</strong>
          <span>{text(lang, "不需要账户，不上传", "No account. No upload.")}</span>
          <div className="cs-flow-device-pills"><i>JSON</i><i>LOCAL</i><i>PRIVATE</i></div>
        </div>
        <div className="cs-flow-device-base" aria-hidden />
      </div>
      <div className="cs-flow-backup">
        <span>backup.json</span>
        <strong>{text(lang, "随时带走", "yours to take")}</strong>
        <i />
      </div>
      <div className="cs-flow-no-cloud">
        <svg viewBox="0 0 64 64" aria-hidden>
          <path d="M20 46h28a10 10 0 0 0 2-20 16 16 0 0 0-29-5 12 12 0 0 0-1 25Z" />
          <path d="m12 12 40 40" />
        </svg>
        <span>{text(lang, "无云端", "NO CLOUD")}</span>
      </div>
    </div>
  );
}

function ARayScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "flow") return <ARayFlow lang={lang} />;
  if (chapter.id === "wysiwyg") return <ARayWysiwyg lang={lang} />;
  if (chapter.id === "offline") return <ARayOffline lang={lang} />;
  return <ARayProblem lang={lang} />;
}

function ARayProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-aray-problem">
      <div className="cs-aray-scatter">
        <div className="cs-aray-mini is-1"><span>●</span><strong>{text(lang, "录屏", "Record")}</strong></div>
        <div className="cs-aray-mini is-2"><span>✂</span><strong>{text(lang, "剪辑", "Edit")}</strong></div>
        <div className="cs-aray-mini is-3"><span>Aa</span><strong>{text(lang, "字幕", "Captions")}</strong></div>
        <div className="cs-aray-mini is-4"><span>↗</span><strong>{text(lang, "导出", "Export")}</strong></div>
        <svg className="cs-aray-converge" viewBox="0 0 420 330" aria-hidden>
          <path d="M65 80c69 7 86 55 126 76m-61-27-11 26 27 4" />
          <path d="M44 210c87-7 103-18 147-27m-33 4-18 17 16 16" />
          <path d="M374 85c-81 7-104 45-171 73m31-18-16 17 15 19" />
          <path d="M390 231c-92-16-110-10-174-40m44 8-9 24 22 8" />
        </svg>
      </div>
      <div className="cs-aray-suite">
        <div className="cs-aray-suite-bar"><i /><i /><i /><span>ARay Studio</span><em>00:24:16</em></div>
        <div className="cs-aray-suite-body">
          <div className="cs-aray-suite-preview"><i /><b /></div>
          <div className="cs-aray-suite-timeline">
            <i /><i /><i /><i />
          </div>
        </div>
      </div>
      <div className="cs-aray-onepath">
        <span>{text(lang, "一条路径", "ONE PATH")}</span>
        <strong>Record → Cut → Caption → Export</strong>
      </div>
    </div>
  );
}

function ARayFlow({ lang }: { lang: Lang }) {
  return (
    <div className="cs-aray-flow">
      <div className="cs-aray-recorder">
        <span><i /> REC</span>
        <strong>00:24:16</strong>
        <em>{text(lang, "屏幕 · 麦克风 · 摄像头", "Screen · Mic · Camera")}</em>
      </div>
      <div className="cs-aray-editor">
        <div className="cs-aray-preview">
          <div className="cs-aray-preview-inner">
            <svg viewBox="0 0 300 160" aria-hidden>
              <rect width="300" height="160" fill="#22363c" />
              <circle cx="248" cy="38" r="23" fill="#37585d" />
              <path d="M0 140 72 82l48 30 52-55 39 48 36-23 53 39v39H0Z" fill="#315b59" />
              <path d="m172 57 39 48-30-10-15 13-14-17Z" fill="#78a797" opacity=".72" />
            </svg>
            <i className="cs-aray-preview-play" aria-hidden />
          </div>
        </div>
        <div className="cs-aray-timeline">
          <div className="cs-aray-ruler"><span>00:00</span><span>00:12</span><span>00:24</span></div>
          <div className="cs-aray-waveform" aria-hidden>
            {Array.from({ length: 28 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
          </div>
          <div className="cs-aray-track"><i /><i /><i /></div>
          <div className="cs-aray-track is-caption"><i /><i /></div>
          <div className="cs-aray-playhead" aria-hidden />
        </div>
      </div>
      <div className="cs-aray-editor-caption">
        <span>{text(lang, "停止录制", "Stop recording")}</span>
        <i>→</i>
        <strong>{text(lang, "时间线已经准备好", "timeline is ready")}</strong>
      </div>
    </div>
  );
}

function ARayWysiwyg({ lang }: { lang: Lang }) {
  return (
    <div className="cs-aray-wysiwyg">
      <div className="cs-aray-render-panel is-preview">
        <span>{text(lang, "预览", "PREVIEW")}</span>
        <div className="cs-aray-render-frame">
          <svg viewBox="0 0 220 124" aria-hidden>
            <rect width="220" height="124" fill="#18343c" />
            <circle cx="181" cy="30" r="16" fill="#3b6566" />
            <path d="M0 108 52 65l34 23 39-45 27 34 28-18 40 30v35H0Z" fill="#315f5b" />
            <path d="m125 43 27 34-22-7-11 9-10-12Z" fill="#85b1a1" opacity=".72" />
          </svg>
        </div>
        <em>FRAME 0624</em>
      </div>
      <div className="cs-aray-engine">
        <div className="cs-aray-engine-ring" aria-hidden>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" />
            <path d="M60 27a33 33 0 1 1-31 23" pathLength={1} />
            <path d="m35 41 7 10 12-4" />
          </svg>
        </div>
        <span>{text(lang, "同一合成器", "ONE COMPOSITOR")}</span>
        <strong>RENDER</strong>
      </div>
      <div className="cs-aray-render-panel is-export">
        <span>{text(lang, "导出", "EXPORT")}</span>
        <div className="cs-aray-render-frame">
          <svg viewBox="0 0 220 124" aria-hidden>
            <rect width="220" height="124" fill="#18343c" />
            <circle cx="181" cy="30" r="16" fill="#3b6566" />
            <path d="M0 108 52 65l34 23 39-45 27 34 28-18 40 30v35H0Z" fill="#315f5b" />
            <path d="m125 43 27 34-22-7-11 9-10-12Z" fill="#85b1a1" opacity=".72" />
          </svg>
        </div>
        <em>FRAME 0624</em>
      </div>
      <div className="cs-aray-match"><i>✓</i> {text(lang, "所见即所得", "WYSIWYG")}</div>
    </div>
  );
}

function ARayOffline({ lang }: { lang: Lang }) {
  return (
    <div className="cs-aray-offline">
      <div className="cs-aray-laptop">
        <div className="cs-aray-laptop-screen">
          <div className="cs-aray-subtitle-window">
            <svg viewBox="0 0 320 180" aria-hidden>
              <rect width="320" height="180" fill="#13252c" />
              <path d="M0 154 74 94l45 31 55-58 41 50 33-24 72 51v36H0Z" fill="#28484e" />
            </svg>
            <span className="cs-aray-subtitle">字幕留在本机，不上传音频。</span>
            <i className="cs-aray-lock" aria-hidden>
              <svg viewBox="0 0 32 32"><rect x="8" y="14" width="16" height="12" rx="3" /><path d="M11 14v-3a5 5 0 0 1 10 0v3" /></svg>
            </i>
          </div>
          <div className="cs-aray-local-wave" aria-hidden>
            {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
          </div>
        </div>
        <div className="cs-aray-laptop-base" aria-hidden />
      </div>
      <div className="cs-aray-offline-side">
        <span>{text(lang, "本机识别", "ON-DEVICE")}</span>
        <strong>Whisper</strong>
        <em>{text(lang, "音频不出 Mac", "audio stays on the Mac")}</em>
        <div className="cs-aray-export-files"><i>MP4</i><i>GIF</i><i>SRT</i></div>
      </div>
      <div className="cs-aray-no-upload">
        <svg viewBox="0 0 60 60" aria-hidden>
          <path d="M18 42h26a9 9 0 0 0 2-18 15 15 0 0 0-26-5 11 11 0 0 0-2 23Z" />
          <path d="m10 10 40 40" />
        </svg>
        <span>{text(lang, "不上传", "NO UPLOAD")}</span>
      </div>
    </div>
  );
}

function ColpixScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "capture") return <ColpixCapture lang={lang} />;
  if (chapter.id === "organize") return <ColpixOrganize lang={lang} />;
  if (chapter.id === "local") return <ColpixLocal lang={lang} />;
  return <ColpixProblem lang={lang} />;
}

function ColpixProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-cp-problem">
      <div className="cs-cp-browser-card">
        <div className="cs-cp-bar"><i /><i /><i /><span>inspiration.studio</span></div>
        <div className="cs-cp-browser-grid" aria-hidden>
          {Array.from({ length: 6 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
        </div>
        <span className="cs-cp-cursor" aria-hidden>↖</span>
      </div>
      <div className="cs-cp-scatter" aria-hidden>
        <div><span>DOWNLOADS</span><i /><i /><i /></div>
        <div><span>DESKTOP</span><i /><i /></div>
        <div><span>BOOKMARKS</span><i /><i /><i /></div>
      </div>
      <span className="cs-cp-lost">?</span>
      <div className="cs-cp-problem-note">
        <span>{text(lang, "保存 ≠ 找到", "SAVED ≠ FOUND")}</span>
        <strong>{text(lang, "三个地方，没有一套索引。", "Three places, no shared index.")}</strong>
      </div>
    </div>
  );
}

function ColpixCapture({ lang }: { lang: Lang }) {
  return (
    <div className="cs-cp-capture">
      <div className="cs-cp-web">
        <div className="cs-cp-bar"><i /><i /><i /><span>visual-library / space</span></div>
        <div className="cs-cp-web-grid" aria-hidden>
          {Array.from({ length: 6 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
        </div>
        <span className="cs-cp-web-chip">{text(lang, "建筑光影", "Architecture")}.jpg</span>
      </div>
      <div className="cs-cp-tray">
        <span>{text(lang, "可图 · 空间参考", "Colpix · Spaces")}</span>
        <strong>{text(lang, "拖到这里收藏", "Drop to save")}</strong>
        <i aria-hidden />
      </div>
      <span className="cs-cp-drag-card" aria-hidden>＋</span>
      <svg className="cs-cp-drag-route" viewBox="0 0 420 260" aria-hidden>
        <path d="M112 155c54 53 139 48 186 12" />
      </svg>
      <div className="cs-cp-capture-note">
        <span>{text(lang, "采集发生在浏览现场", "Capture in context")}</span>
        <em>{text(lang, "拖拽 / 右键 / Alt 点击 / 截图", "Drag / right click / Alt-click / screenshot")}</em>
      </div>
    </div>
  );
}

function ColpixOrganize({ lang }: { lang: Lang }) {
  return (
    <div className="cs-cp-organize">
      <div className="cs-cp-organize-window">
        <div className="cs-cp-bar"><i /><i /><i /><span>{text(lang, "全部素材", "All items")}</span><b>137</b></div>
        <div className="cs-cp-organize-body">
          <div className="cs-cp-sidebar">
            <span>{text(lang, "集合", "Collections")}</span>
            <i className="is-on">{text(lang, "空间参考", "Spaces")}</i>
            <i>{text(lang, "品牌灵感", "Brand")}</i>
            <span>{text(lang, "标签", "Tags")}</span>
            <i>{text(lang, "建筑", "Architecture")}</i>
            <i>{text(lang, "暖调", "Warm")}</i>
          </div>
          <div className="cs-cp-organize-grid" aria-hidden>
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} className={index === 1 ? "is-selected" : ""} style={{ "--i": index } as CSSProperties}>
                {index === 1 ? <b>{text(lang, "建筑 + 暖调", "Arch + Warm")}</b> : null}
              </i>
            ))}
          </div>
        </div>
      </div>
      <div className="cs-cp-filter-card">
        <span>⌕ {text(lang, "搜索名称、备注、来源", "Search name, note, source")}</span>
        <div><i /><i /><i /><i /><i /></div>
      </div>
      <span className="cs-cp-swatch">{text(lang, "近似色", "near color")}</span>
    </div>
  );
}

function ColpixLocal({ lang }: { lang: Lang }) {
  return (
    <div className="cs-cp-local">
      <div className="cs-cp-finder">
        <div className="cs-cp-bar"><i /><i /><i /><span>Finder</span><b>{text(lang, "可图图库", "Colpix Library")}</b></div>
        <div className="cs-cp-path">Macintosh HD › {text(lang, "图片", "Pictures")} › {text(lang, "可图图库", "Colpix Library")}</div>
        <div className="cs-cp-folder-row"><i aria-hidden>▱</i><strong>images</strong><em>3.2 GB</em></div>
        <div className="cs-cp-folder-row"><i aria-hidden>▱</i><strong>items</strong><em>metadata</em></div>
        <div className="cs-cp-folder-row"><i aria-hidden>▱</i><strong>.cangtu/index.db</strong><em>local</em></div>
        <div className="cs-cp-files">
          <span>coast.webp</span>
          <span>ridge.jpg</span>
          <span>glass.png</span>
        </div>
      </div>
      <div className="cs-cp-local-notes">
        <span>{text(lang, "本地优先", "LOCAL FIRST")}</span>
        <strong>{text(lang, "图库 = 文件夹", "Library = folder")}</strong>
        <em>{text(lang, "备份就是复制整个目录", "Backup by copying the folder")}</em>
        <div><i>NO ACCOUNT</i><i>ONE ORIGINAL</i><i>FINDER READY</i></div>
      </div>
      <div className="cs-cp-hash"><span>SHA-1</span><strong>{text(lang, "只存一份", "one copy")}</strong></div>
    </div>
  );
}

function MyceliaScene({ chapter, lang }: SceneProps) {
  if (chapter.id === "flow") return <MyceliaFlow lang={lang} />;
  if (chapter.id === "local") return <MyceliaLocal lang={lang} />;
  if (chapter.id === "overview") return <MyceliaOverview lang={lang} />;
  return <MyceliaProblem lang={lang} />;
}

function MyceliaProblem({ lang }: { lang: Lang }) {
  return (
    <div className="cs-my-problem">
      <div className="cs-my-platforms" aria-hidden>
        <div><span>{text(lang, "公众号", "WeChat")}</span><i /><i /><i /></div>
        <div><span>{text(lang, "小红书", "RED")}</span><i /><i /></div>
        <div><span>{text(lang, "抖音", "Douyin")}</span><i /><i /><i /><i /></div>
        <div><span>{text(lang, "B 站", "Bilibili")}</span><i /><i /></div>
      </div>
      <svg className="cs-my-broken" viewBox="0 0 460 300" aria-hidden>
        <path d="M120 95c45 32 68 49 109 58" />
        <path d="M346 107c-48 23-71 31-110 49" />
        <path d="M116 225c47-28 72-44 113-55" />
        <path d="M350 229c-53-33-76-48-117-61" />
      </svg>
      <div className="cs-my-rework">
        <span>{text(lang, "1 个想法", "1 idea")}</span>
        <strong>5 <small>{text(lang, "次改写", "rewrites")}</small></strong>
        <em>{text(lang, "4 个后台", "4 dashboards")}</em>
      </div>
      <div className="cs-my-problem-note">
        <span>{text(lang, "不是内容不够", "NOT A CONTENT PROBLEM")}</span>
        <strong>{text(lang, "是每一步都在重新开始。", "Every step restarts.")}</strong>
      </div>
    </div>
  );
}

function MyceliaFlow({ lang }: { lang: Lang }) {
  const steps = [
    [text(lang, "选题", "Ideate"), text(lang, "账号数据", "account data")],
    [text(lang, "AI 助手", "AI assistant"), text(lang, "5 个版本", "5 versions")],
    [text(lang, "创作", "Draft"), text(lang, "存进稿库", "saved draft")],
    [text(lang, "日历", "Calendar"), text(lang, "排期发布", "scheduled")],
  ];
  return (
    <div className="cs-my-flow">
      <div className="cs-my-flow-rail">
        {steps.map(([title, detail], index) => (
          <div key={title} className={index === 1 ? "is-ai" : ""}>
            <span>0{index + 1}</span>
            <strong>{title}</strong>
            <em>{detail}</em>
            {index < steps.length - 1 ? <i aria-hidden>→</i> : null}
          </div>
        ))}
      </div>
      <div className="cs-my-flow-preview">
        <div className="cs-my-flow-head">
          <span>{text(lang, "一条内容", "ONE IDEA")}</span>
          <em>AI · 5 versions</em>
        </div>
        <div className="cs-my-version"><span>公众号</span><i /><i /><i /></div>
        <div className="cs-my-version"><span>小红书</span><i /><i /></div>
        <div className="cs-my-version"><span>抖音</span><i /><i /><i /></div>
        <div className="cs-my-flow-saved">✓ {text(lang, "已存入稿库", "Saved to drafts")}</div>
      </div>
    </div>
  );
}

function MyceliaLocal({ lang }: { lang: Lang }) {
  const accounts = [
    ["人造人十号", "WeChat"],
    ["一只阿雷", "RED"],
    ["一只阿雷", "Douyin"],
    ["一只阿雷", "Bilibili"],
  ];
  return (
    <div className="cs-my-local">
      <div className="cs-my-mac">
        <div className="cs-my-mac-bar"><i /><i /><i /><span>{text(lang, "小菌丝 · 账号", "Mycelia · Accounts")}</span></div>
        <div className="cs-my-mac-body">
          <div className="cs-my-account-list">
            {accounts.map(([name, platform], index) => (
              <div key={`${name}-${platform}`} className={index === 0 ? "is-active" : ""}>
                <i style={{ "--account": index } as CSSProperties} />
                <span>{name}<em>{platform}</em></span>
              </div>
            ))}
          </div>
          <div className="cs-my-local-pane">
            <div className="cs-my-lock" aria-hidden>
              <svg viewBox="0 0 48 48"><rect x="12" y="21" width="24" height="18" rx="5" /><path d="M17 21v-4a7 7 0 0 1 14 0v4" /></svg>
            </div>
            <strong>{text(lang, "账号与内容留在本机", "Accounts and content stay local")}</strong>
            <span>{text(lang, "每个账号使用独立浏览器环境", "Isolated browser environment per account")}</span>
            <div><i>COOKIE LOCAL</i><i>KEYCHAIN</i><i>NO SYNC</i></div>
          </div>
        </div>
      </div>
      <div className="cs-my-publish-check">
        <span>{text(lang, "发布前", "BEFORE PUBLISH")}</span>
        <strong>{text(lang, "由你确认", "YOU CONFIRM")}</strong>
        <i>✓</i>
      </div>
      <div className="cs-my-shell">ISOLATED SHELL · 01</div>
    </div>
  );
}

function MyceliaOverview({ lang }: { lang: Lang }) {
  const platforms = [
    text(lang, "公众号", "WeChat"),
    text(lang, "小红书", "RED"),
    text(lang, "抖音", "Douyin"),
    text(lang, "视频号", "Channels"),
    text(lang, "B 站", "Bilibili"),
    text(lang, "快手", "Kuaishou"),
    text(lang, "微博", "Weibo"),
    text(lang, "知乎", "Zhihu"),
    text(lang, "头条", "Toutiao"),
  ];
  return (
    <div className="cs-my-overview">
      <div className="cs-my-overview-head">
        <div><span>{text(lang, "总览", "Overview")}</span><strong>1,788,977</strong><em>{text(lang, "合计粉丝", "followers")}</em></div>
        <div className="cs-my-overview-growth">
          <span>+24,635</span>
          <em>{text(lang, "近 7 天", "last 7 days")}</em>
        </div>
      </div>
      <div className="cs-my-platform-grid">
        {platforms.map((name, index) => (
          <div key={name} style={{ "--i": index } as CSSProperties}>
            <span>{name}</span>
            <b>{[320, 573, 144, 1980, 5110, 1432, 98, 420, 964][index]}</b>
            <i />
          </div>
        ))}
      </div>
      <svg className="cs-my-overview-chart" viewBox="0 0 420 120" aria-hidden>
        <path d="M0 103h420M0 71h420M0 39h420M0 7h420" />
        <path className="cs-my-chart-line" d="M8 97 52 92 95 82 137 87 181 66 224 71 267 54 310 60 353 33 411 24" pathLength={1} />
        <path className="cs-my-chart-fill" d="M8 97 52 92 95 82 137 87 181 66 224 71 267 54 310 60 353 33 411 24V118H8Z" />
      </svg>
    </div>
  );
}

function FoloVibeScene({ chapter, product }: { chapter: CaseChapter; product: Product }) {
  const shots = product.screenshots ?? [];
  const main = shots[chapter.shots[0] ?? 0];
  const side = shots[chapter.shots[1] ?? 1] ?? main;
  if (!main) return null;

  const sticker = chapter.id === "agent" || chapter.id === "captions"
    ? "/assets/hero/project-stickers/folovibe-translate.png"
    : "/assets/hero/project-stickers/folovibe-voice.png";
  const screenCopy: Record<string, string> = {
    voice: "USB\n> READY_\nHOLD OK TO TALK\nTIME // 23:41",
    agent: "SWITCH APP\nGhostty\nChrome\nXcode\nFinder\nMail",
    captions: "LIVE\nego lite\n中文 ↔ English\nCC",
    usage: "CODEX\nTODAY 43,051,522\n5H LEFT 63%\nWEEK LEFT 7%",
  };

  return (
    <div className="cs-fv-scene">
      <span className="cs-fv-glow" aria-hidden />
      {side ? (
        <Image className="cs-fv-poster is-side" src={side} alt="" width={1086} height={1448} sizes="(max-width: 760px) 40vw, 220px" />
      ) : null}
      <Image className="cs-fv-poster is-main" src={main} alt="" width={1086} height={1448} sizes="(max-width: 760px) 52vw, 280px" />
      <Image className="cs-fv-sticker" src={sticker} alt="" width={220} height={220} />
      <span className="cs-fv-screen" lang="en">{screenCopy[chapter.id] ?? "USB\n> READY_"}</span>
    </div>
  );
}
