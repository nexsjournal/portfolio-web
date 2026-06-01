import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;
let refreshBound = false;

export function registerGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  registered = true;
  bindScrollTriggerRefresh();
}

/** 与全站 Framer 缓动 [0.22, 1, 0.36, 1] 接近 */
export const SITE_EASE = "power3.out";

/** 元素顶部到达视口 92% 处时触发（比 88% 更易命中页底区块） */
export const SCROLL_START = "top 92%";

export const REVEAL_ITEM_CLASS = "gsap-reveal-item";

/** 图片/字体加载后重算 ScrollTrigger，避免 production 页高变化导致触发点失效 */
export function bindScrollTriggerRefresh() {
  if (refreshBound || typeof window === "undefined") return;
  refreshBound = true;

  const refresh = () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  window.addEventListener("load", refresh);
  window.addEventListener("resize", refresh, { passive: true });
}

/** 已在视口内但仍被 gsap.set 隐藏的元素，立即补播入场（常见于页底 footer 等） */
export function revealIfAlreadyInView(
  el: HTMLElement,
  to: gsap.TweenVars,
) {
  ScrollTrigger.refresh();

  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
  const opacity = Number(gsap.getProperty(el, "opacity"));

  if (inView && opacity < 0.05) {
    gsap.to(el, { ...to, overwrite: "auto" });
  }
}

export function revealBatchIfAlreadyInView(
  items: HTMLElement[],
  to: gsap.TweenVars,
) {
  ScrollTrigger.refresh();

  const pending = items.filter((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
    const opacity = Number(gsap.getProperty(el, "opacity"));
    return inView && opacity < 0.05;
  });

  if (pending.length) {
    gsap.to(pending, { ...to, overwrite: "auto" });
  }
}
