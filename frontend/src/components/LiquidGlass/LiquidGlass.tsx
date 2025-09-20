import React from "react";

type LiquidGlassProps = {
    children: React.ReactNode,
    className?: string
}

export default function LiquidGlass({children, className=""}:LiquidGlassProps){
    return (
        <div className={`relative backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 ${className || "bg-white/10"}`}>
        
        <div className="text-white">{children}</div>
      </div>
    )
}