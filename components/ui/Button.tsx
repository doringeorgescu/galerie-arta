import { clsx } from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className, children, ...props }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        variant === 'primary' && 'bg-accent text-canvas hover:bg-accent-light disabled:opacity-50',
        variant === 'ghost' && 'border border-muted text-ink hover:border-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
