import type React from "react";

type SettingProps = {
    label: string,
    children: React.ReactNode
}

export default function Setting({ label, children }: SettingProps) {
  return (
    <div>
        <div className="flex items-center justify-between w-full mb-2">
            <span>{label}</span>
            <div className="flex space-x-2">
              {children}
            </div>
        </div>
    </div>
    
  );
}
