import React from "react"
import { Search } from "lucide-react"

type LiquidGlassInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export default function LiquidGlassInput({
  className = "",
  ...rest
}: LiquidGlassInputProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
      <input
        {...rest}
        className={`w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/30 ${className}`}
      />
    </div>
  )
}
