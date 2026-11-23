export type DailyQuote = {
  zh: string;
  en: string;
};

const openings = [
  "心有微光",
  "眼里有光",
  "心里有海",
  "脚下有路",
  "手上有事",
  "梦里有山",
  "风来有信",
  "花开有时",
  "山高有路",
  "水深有舟",
  "日子有光",
  "生活有解",
  "前路有灯",
  "身边有暖",
  "抬头有星",
  "低头有花",
  "平常有趣",
  "慢慢有甜",
  "清晨有风",
  "黄昏有光",
  "雨后有晴",
  "冬去有春",
  "远行有伴",
  "归来有灯",
  "书里有路",
  "茶里有闲",
  "歌里有海",
  "镜头有光",
  "画里有梦",
  "字里有心",
  "路上有歌",
  "船上有风",
  "云上有光",
  "星下有梦",
  "春来有信",
  "夏至有风",
  "秋深有果",
  "冬至有暖",
  "忙里有闲",
  "静里有光",
  "难里有解",
  "慢里有甜",
  "今天有光",
  "明天有风",
  "此刻有暖",
  "未来有光",
  "愿你有梦",
  "愿路有花",
  "愿心有岸",
  "愿爱有回音",
  "走过的路有光",
  "读过的书有路",
  "看过的海有风",
  "爱过的人有暖",
  "做过的事有果",
  "留下的字有光",
  "拍下的瞬间有温度",
  "写下的心愿有回响",
  "未走的路有风景",
  "明天的自己有方向",
  "平凡的日子有光",
] as const;

const endings = [
  "步步皆向远方",
  "日日都有回响",
  "岁岁自有答案",
  "处处皆见风景",
  "事事终有归处",
  "慢慢皆有回甘",
] as const;

const openingsEn = [
  "A little light within",
  "A spark in your eyes",
  "An ocean in your heart",
  "A road beneath your feet",
  "Work within reach",
  "A mountain in your dreams",
  "A promise in the wind",
  "A season for every bloom",
  "A way over every mountain",
  "A boat for every deep water",
  "Light in the everyday",
  "A way through every day",
  "A lamp on the road ahead",
  "Warmth close by",
  "Stars when you look up",
  "Flowers when you look down",
  "Wonder in the ordinary",
  "Sweetness in the slow",
  "Wind in the morning",
  "Light at dusk",
  "Clear skies after rain",
  "Spring after winter",
  "Company on the journey",
  "A light when you come home",
  "A path in every book",
  "Leisure in every cup",
  "An ocean in every song",
  "Light in every frame",
  "A dream in every drawing",
  "Heart in every word",
  "A song along the road",
  "Wind in the sails",
  "Light above the clouds",
  "Dreams beneath the stars",
  "A promise in spring",
  "A breeze at midsummer",
  "Fruit in late autumn",
  "Warmth at midwinter",
  "Stillness inside the busy",
  "Light inside the quiet",
  "A way through the hard",
  "Sweetness inside the slow",
  "Light in today",
  "Wind in tomorrow",
  "Warmth in this moment",
  "Light in what comes next",
  "May your dreams find you",
  "May your road bloom",
  "May your heart find shore",
  "May your love echo back",
  "Light on the road behind",
  "A path in every book you read",
  "Wind on every sea you see",
  "Warmth in everyone you love",
  "Fruit in everything you make",
  "Light in every word you leave",
  "Warmth in every moment you capture",
  "An echo for every wish you write",
  "Scenery on the road not taken",
  "Direction for the self you'll become",
  "Light in ordinary days",
] as const;

const endingsEn = [
  "every step leads farther",
  "every day finds its echo",
  "every year holds its answer",
  "every place reveals a view",
  "everything finds its way home",
  "everything grows sweeter with time",
] as const;

export const dailyQuotes: DailyQuote[] = openings.flatMap((opening, openingIndex) =>
  endings.map((ending, endingIndex) => ({
    zh: `${opening}，${ending}`,
    en: `${openingsEn[openingIndex]}, ${endingsEn[endingIndex]}.`,
  })),
);

const shanghaiDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dayMs = 86_400_000;

export function getDailyQuote(date = new Date()): DailyQuote {
  const parts = Object.fromEntries(
    shanghaiDate
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<"year" | "month" | "day", number>;
  const dayOfYear = Math.floor(
    (Date.UTC(parts.year, parts.month - 1, parts.day) - Date.UTC(parts.year, 0, 1)) / dayMs,
  );
  const yearShift = (parts.year * 17) % dailyQuotes.length;
  return dailyQuotes[(dayOfYear + yearShift) % dailyQuotes.length];
}
