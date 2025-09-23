import { Trash } from "lucide-react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";

export default function ModList() {
  return (
    <LiquidGlass className="w-full h-full flex flex-col space-y-3">
      <LiquidGlassInput className="w-full cursor-target" placeholder="Search mods..." />
      <LiquidGlass className="flex-1 overflow-y-auto divide-y divide-white/10 space-y-2">

        <LiquidGlass className="flex items-center justify-between p-3">
          <span className="text-white/90 font-medium">Another Mod</span>
          <button className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition cursor-target">
            <Trash className="w-4 h-4" />
          </button>
        </LiquidGlass>
      </LiquidGlass>
    </LiquidGlass>
  );
}
