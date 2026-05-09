export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} Старт в крипте с 1000₽
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="text-sm text-slate-300 underline decoration-white/20 underline-offset-4 hover:text-slate-100"
            >
              Политика
            </button>
            <button
              type="button"
              className="text-sm text-slate-300 underline decoration-white/20 underline-offset-4 hover:text-slate-100"
            >
              Контакты
            </button>
          </div>
        </div>
        <div className="mt-6 text-xs leading-relaxed text-slate-500">
          Дисклеймер: информация на странице не является инвестиционной рекомендацией.
          Торговля криптоактивами связана с риском потери средств.
        </div>
      </div>
    </footer>
  )
}
