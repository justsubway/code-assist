import { PropsWithChildren, ButtonHTMLAttributes } from 'react'

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">{children}</div>
}

export function CardContent({ children }: PropsWithChildren) {
  return <div className="p-4 sm:p-6">{children}</div>
}

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-500/90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors ${className}`}
    />
  )
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden" aria-label="Πρόοδος">
      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}
