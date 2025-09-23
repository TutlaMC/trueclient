import React from "react";

type LiquidGlassProps = {
    children: React.ReactNode,
    className?: string
}

export default function LiquidGlass({ children, className = "" }: LiquidGlassProps) {
  return (
    <div
      className={`relative backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 bg-white/5 ${className}`}
    >
      {children}
    </div>
  )
}
