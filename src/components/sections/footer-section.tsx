export function FooterSection() {
  return (
    <footer className="px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-6xl border-t border-white/10 pt-10">
        <div className="flex flex-col gap-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Lex Studio.</p>
          <p>Crafted with motion, restraint and intent.</p>
        </div>
      </div>
    </footer>
  );
}
