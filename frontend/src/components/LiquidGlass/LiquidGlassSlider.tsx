import { useState } from "react"

type LiquidGlassSliderProps = {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  onChange?: (val: [number, number]) => void
  className?: string
}

export default function LiquidGlassSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
}: LiquidGlassSliderProps) {
  const [internal, setInternal] = useState<[number, number]>(value || [min, max])

  const updateValue = (newVal: [number, number]) => {
    setInternal(newVal)
    onChange?.(newVal)
  }

  const percent = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className={`relative w-full h-12 ${className}`}>
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-inner" />
      
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-emerald-400/70 rounded-full shadow-lg"
        style={{
          left: `${percent(internal[0])}%`,
          right: `${100 - percent(internal[1])}%`,
        }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal[0]}
        onChange={(e) =>
          updateValue([Math.min(Number(e.target.value), internal[1] - step), internal[1]])
        }
        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
        style={{ zIndex: internal[0] > internal[1] - step ? 5 : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal[1]}
        onChange={(e) =>
          updateValue([internal[0], Math.max(Number(e.target.value), internal[0] + step)])
        }
        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer"
      />

      <div className="flex justify-between text-xs text-white/60 mt-8">
        <span>{internal[0]}</span>
        <span>{internal[1]}</span>
      </div>
    </div>
  )
}
