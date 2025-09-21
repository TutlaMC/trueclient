import React from "react"

type LiquidGlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

export default function LiquidGlassButton({
  className = "",
  children,
  ...rest
}: LiquidGlassButtonProps) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-inner hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition cursor-target ${className}`}
    >
      {children}
    </button>
  )
}
