import clsx from 'clsx'

export default function Card({ className, children }: any) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/5 shadow-soft backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
