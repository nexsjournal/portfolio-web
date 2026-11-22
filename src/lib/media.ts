const WECHAT_IMAGE_HOSTS = ["mmbiz.qpic.cn", "mmbiz.qlogo.cn"];

export function isWechatImage(src?: string) {
  if (!src) return false;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && (
      WECHAT_IMAGE_HOSTS.includes(url.hostname)
      || url.hostname.endsWith(".qpic.cn")
    );
  } catch {
    return false;
  }
}

export function safeImageSrc(src?: string) {
  if (!src || !isWechatImage(src)) return src;
  return `/api/media?url=${encodeURIComponent(src)}`;
}
