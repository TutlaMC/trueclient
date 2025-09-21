import type React from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";

type SettingProps = {
    label: string,
    children: React.ReactNode
}

export default function Setting({ label, children }: SettingProps) {
  return (
    <LiquidGlass>
        <div className="flex flex-col space-y-2 w-full">
            <span>{label}</span>
            {children}
        </div>
    </LiquidGlass>
    
  );
}
