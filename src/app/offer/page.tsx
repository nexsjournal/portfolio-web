/* 此页面为内部使用，不在导航中展示入口，仅通过 /offer 直达 */
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const OFFERS = [
  {
    code: "XMEF67MYN7KELLJJET",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=XMEF67MYN7KELLJJET",
    price: "128",
  },
  {
    code: "HH6NHJHELEYKAL3HYW",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=HH6NHJHELEYKAL3HYW",
    price: "128",
  },
  {
    code: "WJ6TYN888AH6NFHKYR",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=WJ6TYN888AH6NFHKYR",
    price: "128",
  },
  {
    code: "T4KHNXF64X8W8MXMF8",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=T4KHNXF64X8W8MXMF8",
    price: "128",
  },
  {
    code: "WMKY4HJKTKPNFN7XYX",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=WMKY4HJKTKPNFN7XYX",
    price: "128",
  },
  {
    code: "73LFTKP48TEN7L38JX",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=73LFTKP48TEN7L38JX",
    price: "128",
  },
  {
    code: "6FL46F7KNNXTPPTYKM",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=6FL46F7KNNXTPPTYKM",
    price: "128",
  },
  {
    code: "64T7XTR68KK73PAXL8",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=64T7XTR68KK73PAXL8",
    price: "128",
  },
  {
    code: "A7Y8H4XHNKHHMEEFHY",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=A7Y8H4XHNKHHMEEFHY",
    price: "128",
  },
  {
    code: "JH8XJPXTYHX63YREWY",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=JH8XJPXTYHX63YREWY",
    price: "128",
  },
  {
    code: "ETENK48MH7ML33WY4L",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=ETENK48MH7ML33WY4L",
    price: "128",
  },
  {
    code: "KXX44T84JRN6M7EXME",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=KXX44T84JRN6M7EXME",
    price: "128",
  },
  {
    code: "WARJJFJWYHR4K3XX7K",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=WARJJFJWYHR4K3XX7K",
    price: "128",
  },
  {
    code: "W6PKF8HFRTTMK446XJ",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=W6PKF8HFRTTMK446XJ",
    price: "128",
  },
  {
    code: "8WPYKA744YMJN3L4PY",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=8WPYKA744YMJN3L4PY",
    price: "128",
  },
  {
    code: "R6FT64RHH6FYXJ4PHR",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=R6FT64RHH6FYXJ4PHR",
    price: "128",
  },
  {
    code: "KX47LK8F7EREPP4NWR",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=KX47LK8F7EREPP4NWR",
    price: "128",
  },
  {
    code: "WW6EW4PMAL7YKWRWXP",
    url: "https://apps.apple.com/redeem?ctx=offercodes&id=6773985059&code=WW6EW4PMAL7YKWRWXP",
    price: "128",
  },
];

export default function OfferPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col gap-6 px-4 pb-12 pt-28 text-[color:var(--foreground)]">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Internal
        </p>
        <h1 className="section-title text-2xl">
          实时海拔计-终身会员优惠码
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          使用后请记得勾选后面的状态，方便后去使用者查看
        </p>
        <div className="mt-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/80 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-base font-semibold text-[color:var(--foreground)]">
            使用说明
          </p>
          <ol className="mt-3 space-y-2.5">
            {[
              "打开 App Store。",
              "点击右上角你的个人头像。",
              "点击「兑换礼品卡或代码」(Redeem Gift Card or Code)。",
              "选择「手动输入代码」，把优惠码粘贴进去。",
              "点击右上角的「兑换」即可。",
            ].map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]/15 text-xs font-bold text-[color:var(--primary)]">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-6 text-[color:var(--foreground)]/90 sm:text-[15px]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/90 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)_auto] items-center gap-3 border-b border-[color:var(--border)] bg-black/10 px-4 py-3 text-xs font-medium text-[color:var(--muted)] sm:px-6">
          <span>兑换码</span>
          <span className="hidden sm:inline">兑换链接</span>
          <span className="text-right">价格 / 状态</span>
        </div>

        <ul className="divide-y divide-[color:var(--border)]">
          {OFFERS.map((offer) => (
            <li
              key={offer.code}
              className="group flex flex-col gap-3 px-4 py-3 text-sm text-[color:var(--foreground)] transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:px-6"
            >
              <OfferRow {...offer} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function OfferRow(props: (typeof OFFERS)[number]) {
  const [used, setUsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-sm font-semibold tracking-wide sm:text-base",
              used
                ? "text-[color:var(--muted)] line-through opacity-60"
                : "text-[color:var(--foreground)]",
            )}
          >
            {props.code}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors",
              used
                ? "text-[color:var(--muted)] hover:bg-white/[0.06] hover:text-[color:var(--foreground)]"
                : "text-[color:var(--muted)] hover:bg-[color:var(--primary)]/10 hover:text-[color:var(--primary)]",
            )}
            aria-label={copied ? "已复制" : "复制兑换码"}
            title={copied ? "已复制" : "复制兑换码"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <a
          href={props.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "w-fit text-[11px] underline-offset-2 transition-colors sm:text-xs",
            used
              ? "cursor-pointer text-[color:var(--muted)]/70 hover:text-[color:var(--muted)]"
              : "cursor-pointer text-[color:var(--muted)] hover:text-[color:var(--primary)]",
          )}
        >
          打开 App Store 兑换链接
        </a>
      </div>

      <div className="mt-1 flex items-center justify-between gap-3 sm:mt-0 sm:w-64 sm:justify-end">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums sm:text-base",
            used
              ? "text-[color:var(--muted)] line-through opacity-70"
              : "text-amber-400",
          )}
        >
          ￥{props.price}
        </span>

        <label className="inline-flex items-center gap-2 text-[11px] sm:text-xs">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-primary)]"
            checked={used}
            onChange={(e) => setUsed(e.target.checked)}
          />
          <span className={used ? "text-[color:var(--muted)]" : ""}>
            {used ? "已使用" : "未使用"}
          </span>
        </label>
      </div>
    </>
  );
}

