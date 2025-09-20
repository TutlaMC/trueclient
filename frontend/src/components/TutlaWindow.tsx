import React from 'react'
import { X } from 'lucide-react'
import LiquidGlass from './LiquidGlass/LiquidGlass'

type WindowProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  zindex?: string
}

export default function TutlaWindow({ open, onClose, title, children, className="", zindex="50" }: WindowProps) {
  if (!open) return null
  
  return (
    <div className={`fixed inset-0 z-${zindex} flex items-center justify-center bg-black/40 backdrop-blur-sm ${className} `} >
      
      <LiquidGlass className={`w-[90%]`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 transition cursor-target"
        >
          <X size={18} className="text-white" />
        </button>

        {title && <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>}

        <div className="target w-full">{children}</div>
      </LiquidGlass>
    </div>
  )
}
