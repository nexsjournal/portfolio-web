globalThis.lexDesignTokens = {
  "name": "Lex Studio Design System",
  "version": 1,
  "defaultTheme": "light",
  "tokens": {
    "color": {
      "paper": {
        "type": "color",
        "value": "#f8fafc",
        "dark": "#11171c",
        "css": "--portfolio-paper",
        "description": "页面底色",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-paper",
          "darkSelector": ".theme-dark"
        }
      },
      "panel": {
        "type": "color",
        "value": "#fff",
        "dark": "#182127",
        "css": "--portfolio-panel",
        "description": "卡片和浮层底色",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-panel",
          "darkSelector": ".theme-dark"
        }
      },
      "ink": {
        "type": "color",
        "value": "#0c131b",
        "dark": "#eef4f8",
        "css": "--portfolio-ink",
        "description": "标题与正文",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-ink",
          "darkSelector": ".theme-dark"
        }
      },
      "muted": {
        "type": "color",
        "value": "#5d6670",
        "dark": "#b0bbc3",
        "css": "--portfolio-muted",
        "description": "摘要与次要文字",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-muted",
          "darkSelector": ".theme-dark"
        }
      },
      "line": {
        "type": "color",
        "value": "#e2e6eb",
        "dark": "#35434f",
        "css": "--portfolio-line",
        "description": "细分隔线与边框",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-line",
          "darkSelector": ".theme-dark"
        }
      },
      "accent": {
        "type": "color",
        "value": "#215a68",
        "dark": "#a9dce3",
        "css": "--portfolio-accent",
        "description": "链接、焦点与强调",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-accent",
          "darkSelector": ".theme-dark"
        }
      },
      "highlight": {
        "type": "color",
        "value": "#e9f1f4",
        "dark": "#233c45",
        "css": "--portfolio-highlight",
        "description": "选项衬底与淡色区域",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-highlight",
          "darkSelector": ".theme-dark"
        }
      },
      "on-accent": {
        "type": "color",
        "value": "#fff",
        "dark": "#11262b",
        "css": "--portfolio-on-accent",
        "description": "实色强调上的前景",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-on-accent",
          "darkSelector": ".theme-dark"
        }
      }
    },
    "aqua": {
      "primary-bg": {
        "type": "gradient",
        "value": "linear-gradient(180deg, #bfe0ff 0%, #5da8f5 42%, #1e6cc9 50%, #3186e6 78%, #98d3ff 100%)",
        "dark": "linear-gradient(180deg, #4c7fbe 0%, #2f5f9f 42%, #1f4c86 50%, #2a5f9e 78%, #4f86c7 100%)",
        "css": "--aqua-primary-bg",
        "description": "蓝色主按钮底色",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-primary-bg",
          "darkSelector": ".theme-dark"
        }
      },
      "primary-edge": {
        "type": "color",
        "value": "#1c5fb8",
        "dark": "#0a2a50",
        "css": "--aqua-primary-edge",
        "description": "蓝色主按钮描边",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-primary-edge",
          "darkSelector": ".theme-dark"
        }
      },
      "primary-ink": {
        "type": "color",
        "value": "#fff",
        "dark": "#f7fbff",
        "css": "--aqua-primary-ink",
        "description": "蓝色主按钮前景",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-primary-ink",
          "darkSelector": ".theme-dark"
        }
      },
      "primary-shadow": {
        "type": "shadow",
        "value": "inset 0 1px 1px rgb(255 255 255 / .9), inset 0 1px 3px rgb(255 255 255 / .35), inset 0 -4px 8px rgb(255 255 255 / .45), 0 1px 3px rgb(20 60 130 / .35)",
        "dark": "inset 0 1px 1px rgb(255 255 255 / .35), inset 0 1px 3px rgb(255 255 255 / .18), inset 0 -4px 8px rgb(255 255 255 / .12), 0 1px 3px rgb(0 0 0 / .5)",
        "css": "--aqua-primary-shadow",
        "description": "蓝色按钮内外阴影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-primary-shadow",
          "darkSelector": ".theme-dark"
        }
      },
      "primary-text-shadow": {
        "type": "shadow",
        "value": "0 1px 2px rgb(8 34 72 / .55), 0 0 1px rgb(8 34 72 / .45)",
        "dark": "0 1px 2px rgb(0 0 0 / .55)",
        "css": "--aqua-primary-text-shadow",
        "description": "蓝色按钮文字阴影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-primary-text-shadow",
          "darkSelector": ".theme-dark"
        }
      },
      "silver-bg": {
        "type": "gradient",
        "value": "linear-gradient(180deg, #ffffff 0%, #f4f5f7 45%, #d7dbe1 52%, #eceef1 100%)",
        "dark": "linear-gradient(180deg, #3a3f47 0%, #2c3037 45%, #20242a 52%, #32373e 100%)",
        "css": "--aqua-silver-bg",
        "description": "银色次级控件底色",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-silver-bg",
          "darkSelector": ".theme-dark"
        }
      },
      "silver-edge": {
        "type": "color",
        "value": "#858b94",
        "dark": "#5b626c",
        "css": "--aqua-silver-edge",
        "description": "银色次级控件描边",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-silver-edge",
          "darkSelector": ".theme-dark"
        }
      },
      "silver-ink": {
        "type": "color",
        "value": "#2e343c",
        "dark": "#edf2f8",
        "css": "--aqua-silver-ink",
        "description": "银色次级控件前景",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-silver-ink",
          "darkSelector": ".theme-dark"
        }
      },
      "silver-shadow": {
        "type": "shadow",
        "value": "inset 0 1px 1px rgb(255 255 255 / .95), inset 0 1px 0 rgb(255 255 255 / .6), inset 0 -1px 1px rgb(255 255 255 / .7), 0 1px 2px rgb(20 60 130 / .2)",
        "dark": "inset 0 1px 1px rgb(255 255 255 / .18), inset 0 -1px 1px rgb(0 0 0 / .35), 0 1px 2px rgb(0 0 0 / .45)",
        "css": "--aqua-silver-shadow",
        "description": "银色控件内外阴影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-silver-shadow",
          "darkSelector": ".theme-dark"
        }
      },
      "silver-text-shadow": {
        "type": "shadow",
        "value": "0 1px 0 rgb(255 255 255 / .9)",
        "dark": "0 1px 1px rgb(0 0 0 / .5)",
        "css": "--aqua-silver-text-shadow",
        "description": "银色控件文字阴影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-silver-text-shadow",
          "darkSelector": ".theme-dark"
        }
      },
      "gloss": {
        "type": "gradient",
        "value": "linear-gradient(180deg, rgb(255 255 255 / .85), rgb(255 255 255 / .26) 50%, rgb(255 255 255 / .02))",
        "dark": "linear-gradient(180deg, rgb(255 255 255 / .5), rgb(255 255 255 / .12) 55%, transparent)",
        "css": "--aqua-gloss",
        "description": "Aqua 上沿高光",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--aqua-gloss",
          "darkSelector": ".theme-dark"
        }
      }
    },
    "project": {
      "rephoto": {
        "type": "color",
        "value": "#4ab48c",
        "css": "--lex-project-rephoto",
        "description": "归影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project",
          "property": "--project-color"
        }
      },
      "travel-route": {
        "type": "color",
        "value": "#70acd2",
        "css": "--lex-project-travel-route",
        "description": "旅迹时光",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"travel-route\"]",
          "property": "--project-color"
        }
      },
      "altitudeshot": {
        "type": "color",
        "value": "#bc98e0",
        "css": "--lex-project-altitudeshot",
        "description": "实时海拔计",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"altitudeshot\"]",
          "property": "--project-color"
        }
      },
      "flowdo": {
        "type": "color",
        "value": "#7567e8",
        "css": "--lex-project-flowdo",
        "description": "FlowDo",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"flowdo\"]",
          "property": "--project-color"
        }
      },
      "aray-studio": {
        "type": "color",
        "value": "#31a8c9",
        "css": "--lex-project-aray-studio",
        "description": "ARay Studio",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"aray-studio\"]",
          "property": "--project-color"
        }
      },
      "colpix": {
        "type": "color",
        "value": "#35c98c",
        "css": "--lex-project-colpix",
        "description": "可图",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"colpix\"]",
          "property": "--project-color"
        }
      },
      "mycelia": {
        "type": "color",
        "value": "#f08a3c",
        "css": "--lex-project-mycelia",
        "description": "小菌丝",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project[data-project=\"mycelia\"]",
          "property": "--project-color"
        }
      }
    },
    "note": {
      "event-bg": {
        "type": "color",
        "value": "#f2e9d8",
        "dark": "#3a3020",
        "css": "--lex-note-event-bg",
        "description": "活动徽标底色",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-event",
          "property": "background",
          "darkSelector": ".theme-dark .note-type-event"
        }
      },
      "event-ink": {
        "type": "color",
        "value": "#7a5722",
        "dark": "#e8c98d",
        "css": "--lex-note-event-ink",
        "description": "活动徽标文字",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-event",
          "property": "color",
          "darkSelector": ".theme-dark .note-type-event"
        }
      },
      "video-bg": {
        "type": "color",
        "value": "#f3e5e5",
        "dark": "#3a2525",
        "css": "--lex-note-video-bg",
        "description": "视频徽标底色",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-video",
          "property": "background",
          "darkSelector": ".theme-dark .note-type-video"
        }
      },
      "video-ink": {
        "type": "color",
        "value": "#8a3c3c",
        "dark": "#e8a3a3",
        "css": "--lex-note-video-ink",
        "description": "视频徽标文字",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-video",
          "property": "color",
          "darkSelector": ".theme-dark .note-type-video"
        }
      },
      "note-bg": {
        "type": "color",
        "value": "#e7efe9",
        "dark": "#203329",
        "css": "--lex-note-note-bg",
        "description": "短记徽标底色",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-note",
          "property": "background",
          "darkSelector": ".theme-dark .note-type-note"
        }
      },
      "note-ink": {
        "type": "color",
        "value": "#35604a",
        "dark": "#a7d2b6",
        "css": "--lex-note-note-ink",
        "description": "短记徽标文字",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-type-note",
          "property": "color",
          "darkSelector": ".theme-dark .note-type-note"
        }
      }
    },
    "font": {
      "font": {
        "type": "fontFamily",
        "value": "\"Inter\", \"Noto Sans SC\", \"PingFang SC\", system-ui, sans-serif",
        "css": "--portfolio-font",
        "description": "界面及正文",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-font"
        }
      },
      "serif": {
        "type": "fontFamily",
        "value": "\"Cormorant Garamond\", Georgia, serif",
        "css": "--portfolio-serif",
        "description": "英文衬线、编号与签名",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-serif"
        }
      },
      "hand": {
        "type": "fontFamily",
        "value": "\"Lemi ChunXu WanXing\", \"Ma Shan Zheng\", cursive",
        "css": "--portfolio-hand",
        "description": "人物签名、便签等手写质感",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-hand"
        }
      }
    },
    "layout": {
      "content": {
        "type": "dimension",
        "value": "56.25rem",
        "css": "--portfolio-width",
        "description": "首页、作品与 Notes 列表内容宽度",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-width"
        }
      },
      "chrome": {
        "type": "dimension",
        "value": "1240px",
        "css": "--lex-layout-chrome",
        "description": "内页顶栏最大宽度",
        "source": {
          "file": "src/app/case-study.css",
          "selector": ".case-page",
          "property": "--case-max"
        }
      },
      "chrome-height": {
        "type": "dimension",
        "value": "76px",
        "css": "--lex-layout-chrome-height",
        "description": "内页顶栏基准高度",
        "source": {
          "file": "src/app/case-study.css",
          "selector": ".case-page",
          "property": "--case-chrome-h"
        }
      },
      "article": {
        "type": "dimension",
        "value": "min(100% - var(--portfolio-gutter) * 2, 48rem)",
        "css": "--lex-layout-article",
        "description": "文章正文流体宽度（上限 48rem）",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-article",
          "property": "width"
        }
      },
      "dialog": {
        "type": "dimension",
        "value": "min(32rem, calc(100% - 2rem))",
        "css": "--lex-layout-dialog",
        "description": "弹窗流体宽度（上限 32rem）",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog",
          "property": "width"
        }
      },
      "story-height": {
        "type": "dimension",
        "value": "26rem",
        "css": "--lex-layout-story-height",
        "description": "首页桌面故事卡基准高度",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-story-stack",
          "property": "--story-card-height"
        }
      }
    },
    "space": {
      "gutter": {
        "type": "dimension",
        "value": "clamp(1.125rem, 4vw, 2rem)",
        "css": "--portfolio-gutter",
        "description": "页面两侧流体边距",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-gutter"
        }
      },
      "story-peek": {
        "type": "dimension",
        "value": "0.875rem",
        "css": "--lex-space-story-peek",
        "description": "故事叠卡间距与露边",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-story-stack",
          "property": "--story-peek"
        }
      },
      "section": {
        "type": "dimension",
        "value": "clamp(3.25rem, 6.5vw, 5.25rem)",
        "css": "--lex-space-section",
        "description": "首页区块上留白",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-section",
          "property": "margin-block-start"
        }
      },
      "note-grid": {
        "type": "dimension",
        "value": "clamp(1rem, 2vw, 1.5rem)",
        "css": "--lex-space-note-grid",
        "description": "文章卡网格间距",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-list",
          "property": "gap"
        }
      },
      "note-card-inset": {
        "type": "dimension",
        "value": "clamp(1rem, 2vw, 1.4rem)",
        "css": "--lex-space-note-card-inset",
        "description": "文章卡正文内边距",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card-body",
          "property": "padding"
        }
      },
      "note-card-content": {
        "type": "dimension",
        "value": "0.6rem",
        "css": "--lex-space-note-card-content",
        "description": "文章卡正文区行组间距",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card-body",
          "property": "gap"
        }
      },
      "tag-gap": {
        "type": "dimension",
        "value": "0.375rem",
        "css": "--lex-space-tag-gap",
        "description": "项目标签间距",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-tags",
          "property": "gap"
        }
      },
      "control-gap": {
        "type": "dimension",
        "value": "0.5rem",
        "css": "--lex-space-control-gap",
        "description": "主按钮图标与文字间距",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-action",
          "property": "gap"
        }
      },
      "dialog-inset": {
        "type": "dimension",
        "value": "clamp(1.25rem, 5vw, 2rem)",
        "css": "--lex-space-dialog-inset",
        "description": "弹窗内部留白",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog-content",
          "property": "padding"
        }
      }
    },
    "radius": {
      "panel": {
        "type": "dimension",
        "value": "24px",
        "css": "--portfolio-radius",
        "description": "卡片、封面与弹窗主圆角",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ":root",
          "property": "--portfolio-radius"
        }
      },
      "pill": {
        "type": "dimension",
        "value": "999px",
        "css": "--lex-radius-pill",
        "description": "按钮、类型徽标与筛选项",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-action",
          "property": "border-radius"
        }
      },
      "note-tag": {
        "type": "dimension",
        "value": "5px",
        "css": "--lex-radius-note-tag",
        "description": "文章普通标签",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-tags span",
          "property": "border-radius"
        }
      },
      "photo": {
        "type": "dimension",
        "value": "15px",
        "css": "--lex-radius-photo",
        "description": "联系卡的照片边框",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-contact-scene",
          "property": "border-radius"
        }
      }
    },
    "type": {
      "intro-title": {
        "type": "dimension",
        "value": "1.55rem",
        "css": "--lex-type-intro-title",
        "description": "首页姓名标题",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-intro h1",
          "property": "font-size"
        }
      },
      "case-title": {
        "type": "dimension",
        "value": "clamp(2.25rem, 5.2vw, 3.35rem)",
        "css": "--lex-type-case-title",
        "description": "案例主标题",
        "source": {
          "file": "src/app/case-study.css",
          "selector": ".case-hero h1",
          "property": "font-size"
        }
      },
      "notes-title": {
        "type": "dimension",
        "value": "clamp(2rem, 4vw, 2.8rem)",
        "css": "--lex-type-notes-title",
        "description": "文章列表主标题",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-index-hero h1",
          "property": "font-size"
        }
      },
      "article-title": {
        "type": "dimension",
        "value": "clamp(2rem, 4.8vw, 3.4rem)",
        "css": "--lex-type-article-title",
        "description": "文章详情主标题",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-article-header h1",
          "property": "font-size"
        }
      },
      "section-title": {
        "type": "dimension",
        "value": "clamp(1.375rem, 2.6vw, 1.5rem)",
        "css": "--lex-type-section-title",
        "description": "首页区块标题",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-heading h2",
          "property": "font-size"
        }
      },
      "note-card-title": {
        "type": "dimension",
        "value": "clamp(1.1rem, 1.7vw, 1.3rem)",
        "css": "--lex-type-note-card-title",
        "description": "文章卡标题",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card h2",
          "property": "font-size"
        }
      },
      "body": {
        "type": "dimension",
        "value": "1rem",
        "css": "--lex-type-body",
        "description": "作品简述",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project-copy p",
          "property": "font-size"
        }
      },
      "prose": {
        "type": "dimension",
        "value": "clamp(0.98rem, 1.35vw, 1.06rem)",
        "css": "--lex-type-prose",
        "description": "文章正文",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-prose",
          "property": "font-size"
        }
      },
      "prose-leading": {
        "type": "number",
        "value": "1.85",
        "css": "--lex-type-prose-leading",
        "description": "文章正文行高",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-prose",
          "property": "line-height"
        }
      },
      "meta": {
        "type": "dimension",
        "value": "0.72rem",
        "css": "--lex-type-meta",
        "description": "文章卡日期等元信息",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card-meta",
          "property": "font-size"
        }
      }
    },
    "control": {
      "primary-height": {
        "type": "dimension",
        "value": "42px",
        "css": "--lex-control-primary-height",
        "description": "Aqua 主按钮最小高度",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-action",
          "property": "min-height"
        }
      },
      "close-size": {
        "type": "dimension",
        "value": "44px",
        "css": "--lex-control-close-size",
        "description": "弹窗圆形关闭按钮",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog-close",
          "property": "width"
        }
      },
      "focus": {
        "type": "stroke",
        "value": "2px solid var(--portfolio-accent)",
        "css": "--lex-control-focus",
        "description": "控件键盘焦点描边",
        "source": {
          "file": "src/app/case-study.css",
          "selector": ".case-page :is(a, button):focus-visible",
          "property": "outline"
        }
      },
      "focus-offset": {
        "type": "dimension",
        "value": "4px",
        "css": "--lex-control-focus-offset",
        "description": "控件键盘焦点描边偏移",
        "source": {
          "file": "src/app/case-study.css",
          "selector": ".case-page :is(a, button):focus-visible",
          "property": "outline-offset"
        }
      }
    },
    "image": {
      "note-cover": {
        "type": "ratio",
        "value": "16 / 10",
        "css": "--lex-image-note-cover",
        "description": "文章列表封面",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card-cover",
          "property": "aspect-ratio"
        }
      },
      "article-cover": {
        "type": "ratio",
        "value": "16 / 9",
        "css": "--lex-image-article-cover",
        "description": "文章详情封面",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-article-cover",
          "property": "aspect-ratio"
        }
      },
      "contact-print": {
        "type": "ratio",
        "value": "var(--scene-ratio, 1.65)",
        "css": "--lex-image-contact-print",
        "description": "联系卡照片默认比例",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-contact-scene",
          "property": "aspect-ratio"
        }
      }
    },
    "effect": {
      "dialog-shadow": {
        "type": "shadow",
        "value": "0 18px 50px rgb(12 19 27 / .23)",
        "css": "--lex-effect-dialog-shadow",
        "description": "浮层阴影",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog",
          "property": "box-shadow"
        }
      },
      "dialog-scrim": {
        "type": "color",
        "value": "rgb(12 19 27 / .3)",
        "css": "--lex-effect-dialog-scrim",
        "description": "浮层遮罩",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog::backdrop",
          "property": "background"
        }
      },
      "dialog-blur": {
        "type": "filter",
        "value": "blur(4px)",
        "css": "--lex-effect-dialog-blur",
        "description": "浮层背景虚化",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dialog::backdrop",
          "property": "backdrop-filter"
        }
      },
      "project-tint": {
        "type": "percentage",
        "value": "28%",
        "dark": "18%",
        "css": "--lex-effect-project-tint",
        "description": "作品色的渐变混合强度",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project-link",
          "property": "--project-tint-strength",
          "darkSelector": ".theme-dark .portfolio-project-link"
        }
      },
      "project-gradient": {
        "type": "gradient",
        "value": "linear-gradient(180deg, color-mix(in srgb, var(--project-color) var(--project-tint-strength), transparent), transparent 56%)",
        "css": "--lex-effect-project-gradient",
        "description": "悬停渐变方向和停止点",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project-link::before",
          "property": "background"
        }
      }
    },
    "motion": {
      "action": {
        "type": "transition",
        "value": "filter 150ms ease, transform 150ms ease",
        "css": "--lex-motion-action",
        "description": "主按钮悬停与按下过渡",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-action",
          "property": "transition"
        }
      },
      "filter": {
        "type": "transition",
        "value": "color 160ms ease, background-color 160ms ease, border-color 160ms ease",
        "css": "--lex-motion-filter",
        "description": "筛选控件的状态过渡",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".notes-filter",
          "property": "transition"
        }
      },
      "note-card": {
        "type": "transition",
        "value": "border-color 200ms ease, transform 200ms ease",
        "css": "--lex-motion-note-card",
        "description": "文章卡悬停过渡",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card",
          "property": "transition"
        }
      },
      "note-image": {
        "type": "transition",
        "value": "transform 500ms ease",
        "css": "--lex-motion-note-image",
        "description": "文章卡封面缓动",
        "source": {
          "file": "src/app/notes.css",
          "selector": ".note-card-cover img",
          "property": "transition"
        }
      },
      "project-tint": {
        "type": "transition",
        "value": "opacity 350ms ease",
        "css": "--lex-motion-project-tint",
        "description": "作品渐变显隐过渡",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project-link::before",
          "property": "transition"
        }
      },
      "project-art": {
        "type": "transition",
        "value": "transform 620ms cubic-bezier(.22, 1, .36, 1)",
        "css": "--lex-motion-project-art",
        "description": "作品截图拼贴缓动",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-project-art",
          "property": "transition"
        }
      },
      "dock-spring": {
        "type": "transition",
        "value": "720ms linear(0, 0.006 0.7%, 0.043 2.1%, 0.131 4.2%, 0.297 7.7%, 0.545 14%, 0.75 22%, 0.904 36%, 0.978 56%, 1.003 68%, 0.999 84%, 1)",
        "css": "--lex-motion-dock-spring",
        "description": "侧边 Dock 展开弹簧曲线",
        "source": {
          "file": "src/app/portfolio.css",
          "selector": ".portfolio-dock",
          "property": "--dock-spring"
        }
      }
    }
  }
};
