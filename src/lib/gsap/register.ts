import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  registered = true;
}

/** 与全站 Framer 缓动 [0.22, 1, 0.36, 1] 接近 */
export const SITE_EASE = "power3.out";

export const SCROLL_START = "top 88%";

export const REVEAL_ITEM_CLASS = "gsap-reveal-item";
