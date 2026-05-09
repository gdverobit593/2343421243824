import clsx from 'clsx'

export default function Button({
  as: Comp = 'button',
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: any) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 disabled:opacity-60 disabled:pointer-events-none'

  const variants: any = {
    primary:
      'bg-gradient-to-b from-cyan-400 to-indigo-500 text-slate-950 shadow-soft hover:brightness-110 active:brightness-95',
    secondary:
      'bg-white/8 text-slate-100 border border-white/10 shadow-soft hover:bg-white/10',
    ghost: 'text-slate-100 hover:bg-white/8',
  }

  const sizes: any = {
    md: 'h-12 px-5 text-base',
    lg: 'h-14 px-7 text-base md:text-lg',
    sm: 'h-10 px-4 text-sm',
  }

  return (
    <Comp
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
