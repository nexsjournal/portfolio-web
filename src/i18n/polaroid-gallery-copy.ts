export const polaroidGalleryCopy = {
  zh: {
    kicker: "MOMENTS IN TIME",
    title: "时间记住了我们",
    description: "按下快门的那一刻，时间替我们记住了彼此。下次同框，希望你已抵达想去的地方。",
    count: (count: number) => `${count} 个瞬间`,
    empty: "这里还空着。去按下一次快门，把我们的此刻留在这里。",
    emptyUnconfigured: "合影墙的存储还没有开启，照片暂时无法保存。请在环境变量里配置 Blob 存储后再试。",
    cta: "去拍一张",
    back: "回到快门响起的地方",
    alt: "访客与阿雷 IP 形象的 Aqua 风格合影",
  },
  en: {
    kicker: "MOMENTS IN TIME",
    title: "Time Remembered Us",
    description: "The moment the shutter fell, time remembered us both. Next time we share a frame, I hope you've arrived where you wanted to go.",
    count: (count: number) => `${count} ${count === 1 ? "moment" : "moments"}`,
    empty: "This wall is still waiting for its first moment. Press the shutter and leave ours here.",
    emptyUnconfigured: "Guest wall storage isn't enabled yet, so photos can't be saved. Configure Blob storage in your environment variables and try again.",
    cta: "Take a photo",
    back: "Back to where the shutter rings",
    alt: "An Aqua-style photo of a visitor with Lex's IP character",
  },
} as const;
