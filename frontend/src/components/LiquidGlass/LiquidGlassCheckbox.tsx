import React from "react"

type LiquidGlassCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  className?: string
}

export default function LiquidGlassCheckbox({
  label,
  className = "",
  ...rest
}: LiquidGlassCheckboxProps) {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer select-none ${className}`}>
      <input
        type="checkbox"
        {...rest}
        className="w-5 h-5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white accent-white shadow-inner focus:outline-none focus:ring-2 focus:ring-white/30 cursor-target"
      />
      {label && <span className="text-white/80">{label}</span>}
    </label>
  )
}
