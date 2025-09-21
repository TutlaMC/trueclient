import { useState } from "react"

type LiquidGlassDropdownProps = {
  label: string
  options: Record<string, any>
  onSelect?: (value: string) => void
  className?: string
  optionClassName?: string
}

export default function LiquidGlassDropdown({ label, options, onSelect, className = "", optionClassName="" }: LiquidGlassDropdownProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(label)

  function handleSelect(key: string, value: any) {
    setSelected(key)
    setOpen(false)
    onSelect?.(value)
  }

  return (
    <div className={`relative inline-block w-48 ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 rounded-2xl shadow-xl border border-white/20 backdrop-blur-2xl bg-white/10 text-white"
      >
        {selected}
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-2xl shadow-xl border border-white/20 backdrop-blur-2xl bg-white/10 text-white z-10">
          {Object.entries(options).map(([key, value]) => (
            <div
              key={key}
              onClick={() => handleSelect(key, value)}
              className={`px-4 py-2 hover:bg-white/20 cursor-pointer rounded-2xl ${optionClassName}`}
            >
              {key}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
