"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import type { NoteSummary } from "@/content/notes";

type Session = { configured: boolean; authenticated: boolean; user?: string };
type Mode = "url" | "html" | "text";
type ImportResult = { title: string; url: string; images: number };

const modeLabels: Record<Mode, string> = {
  url: "公众号链接",
  html: "完整 HTML",
  text: "纯文本",
};

export function StudioPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("url");
  const [value, setValue] = useState("");
  const [type, setType] = useState("article");
  const [tags, setTags] = useState("");
  const [imageMode, setImageMode] = useState<"link" | "upload">("link");
  const [canonicalSelf, setCanonicalSelf] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [notes, setNotes] = useState<NoteSummary[]>([]);

  const loadNotes = useCallback(async () => {
    const response = await fetch("/api/studio/notes", { cache: "no-store" });
    if (response.status === 401) {
      setSession({ configured: true, authenticated: false });
      return;
    }
    if (!response.ok) return;
    const data = await response.json() as { notes: NoteSummary[] };
    setNotes(data.notes);
  }, []);

  useEffect(() => {
    fetch("/api/studio/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<Session>)
      .then((data) => {
        setSession(data);
        if (data.authenticated) void loadNotes();
      })
      .catch(() => setError("无法连接后台服务。"));
  }, [loadNotes]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "登录失败。");
      setPassword("");
      setSession({ configured: true, authenticated: true, user });
      await loadNotes();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败。");
    } finally {
      setBusy(false);
    }
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/studio/import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          value,
          type,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          canonicalSelf,
          imageMode,
        }),
      });
      const data = await response.json() as { error?: string; title?: string; url?: string; images?: number };
      if (response.status === 401) {
        setSession({ configured: true, authenticated: false });
        throw new Error("登录已过期，请重新登录。");
      }
      if (!response.ok) throw new Error(data.error ?? "发布失败。");
      setResult({ title: data.title ?? "", url: data.url ?? "/notes", images: data.images ?? 0 });
      setValue("");
      await loadNotes();
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "发布失败。");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    setSession({ configured: true, authenticated: false });
    setNotes([]);
  }

  async function remove(slug: string, title: string) {
    if (!window.confirm(`删除「${title}」？前台会立即下线。`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/studio/notes/${encodeURIComponent(slug)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "删除失败。");
      await loadNotes();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "删除失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="studio-page">
      <header className="studio-header">
        <Link href="/" className="studio-brand">Lex Studio</Link>
        <span>内容发布</span>
        {session?.authenticated ? <button type="button" onClick={logout}>退出</button> : null}
      </header>

      {!session ? (
        <section className="studio-card studio-loading" aria-live="polite">正在连接后台…</section>
      ) : !session.configured ? (
        <section className="studio-card">
          <p className="studio-kicker">SETUP REQUIRED</p>
          <h1>还差登录环境变量</h1>
          <p>在 Vercel 项目设置中添加 <code>STUDIO_USER</code>、<code>STUDIO_PASSWORD</code> 和 <code>STUDIO_SESSION_SECRET</code>，再重新部署。</p>
        </section>
      ) : !session.authenticated ? (
        <section className="studio-card studio-login">
          <p className="studio-kicker">PRIVATE DESK</p>
          <h1>进入发布台</h1>
          <p>输入管理员账号和密码。这里只有你能进入，页面不会被搜索引擎收录。</p>
          <form onSubmit={login}>
            <label>
              账号
              <input
                value={user}
                onChange={(event) => setUser(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                autoFocus
                placeholder="lex"
                required
              />
            </label>
            <label>
              管理员密码
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="studio-primary" disabled={busy}>{busy ? "验证中…" : "进入后台"}</button>
          </form>
        </section>
      ) : (
        <>
          <section className="studio-card">
            <div className="studio-card-heading">
              <div>
                <p className="studio-kicker">PUBLISH INSTANTLY</p>
                <h1>发布一篇文章</h1>
                <p>粘贴公众号链接或全文，解析后直接写入站点，不触发重新部署。</p>
              </div>
              <span className="studio-live">Blob 已连接</span>
            </div>

            <form className="studio-form" onSubmit={publish}>
              <div className="studio-modes" role="group" aria-label="内容格式">
                {(Object.keys(modeLabels) as Mode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={mode === item}
                    onClick={() => setMode(item)}
                  >
                    {modeLabels[item]}
                  </button>
                ))}
              </div>

              <label className="studio-field">
                <span>{mode === "url" ? "文章链接" : mode === "html" ? "粘贴完整 HTML" : "粘贴纯文本"}</span>
                {mode === "url" ? (
                  <input
                    type="url"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="https://mp.weixin.qq.com/s/..."
                    required
                  />
                ) : (
                  <textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    rows={mode === "html" ? 12 : 10}
                    placeholder={mode === "html" ? "<div id=\"js_content\">…</div>" : "标题\n\n正文第一段…"}
                    required
                  />
                )}
              </label>

              <div className="studio-fields">
                <label className="studio-field">
                  <span>内容类型</span>
                  <select value={type} onChange={(event) => setType(event.target.value)}>
                    <option value="article">文章</option>
                    <option value="event">活动</option>
                    <option value="video">视频</option>
                    <option value="note">短记</option>
                  </select>
                </label>
                <label className="studio-field">
                  <span>标签，用逗号分隔</span>
                  <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="产品方法, 独立开发" />
                </label>
                <label className="studio-field">
                  <span>正文图片</span>
                  <select value={imageMode} onChange={(event) => setImageMode(event.target.value as "link" | "upload")}>
                    <option value="link">保留公众号链接，更快</option>
                    <option value="upload">转存到 Blob，更稳</option>
                  </select>
                </label>
              </div>

              {mode === "url" ? (
                <label className="studio-check">
                  <input type="checkbox" checked={canonicalSelf} onChange={(event) => setCanonicalSelf(event.target.checked)} />
                  以网站作为 canonical，而不是公众号原文
                </label>
              ) : null}

              <div className="studio-submit-row">
                <button type="submit" className="studio-primary" disabled={busy}>
                  {busy ? "正在解析并发布…" : "解析并立即发布"}
                </button>
                <span>{imageMode === "link" ? "通常几秒完成" : "图片多时可能需要几十秒"}</span>
              </div>
            </form>

            {error ? <p className="studio-message studio-error" role="alert">{error}</p> : null}
            {result ? (
              <div className="studio-message studio-success">
                <span>已发布「{result.title}」，{result.images} 张正文图片。</span>
                <Link href={result.url} target="_blank">查看前台 ↗</Link>
              </div>
            ) : null}
          </section>

          <section className="studio-card">
            <div className="studio-card-heading">
              <div>
                <p className="studio-kicker">PUBLISHED FROM STUDIO</p>
                <h2>后台文章</h2>
              </div>
              <span>{notes.length} 篇</span>
            </div>
            {notes.length ? (
              <ul className="studio-note-list">
                {notes.map((note) => (
                  <li key={note.slug}>
                    <div>
                      <Link href={`/notes/${note.slug}`} target="_blank">{note.title}</Link>
                      <span>{note.date} · {note.tags.join(" / ") || "无标签"}</span>
                    </div>
                    <button type="button" onClick={() => remove(note.slug, note.title)} disabled={busy}>删除</button>
                  </li>
                ))}
              </ul>
            ) : <p className="studio-empty">还没有通过后台发布的文章。</p>}
          </section>
        </>
      )}
    </main>
  );
}
