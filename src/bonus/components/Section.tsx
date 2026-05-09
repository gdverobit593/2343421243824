import clsx from 'clsx'

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  className,
  children,
}: any) {
  return (
    <section id={id} className={clsx('py-14 md:py-20', className)}>
      <div className="mx-auto w-full max-w-6xl px-4">
        {(eyebrow || title || subtitle) && (
          <div className="mb-10">
            {eyebrow && (
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
