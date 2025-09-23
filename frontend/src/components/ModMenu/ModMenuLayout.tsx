import { useState } from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import DownloaderLayout from "./DownloaderLayout";
import ModList from "./ModList";

type ModeMenuLayoutProps = {
    config: any;
    modsList: any;
}

export default function ModMenuLayout({config, modsList}: ModeMenuLayoutProps) {
  const mods = ["Manage", "Download"]
  const [currentPage, setCurrentPage] = useState(mods[0])
  return (
    <div>
        
        <LiquidGlass className="flex mb-2 h-[5vh] max-h-[8vh] p-2 space-x-5 justify-right items-center pl-5">
            {mods.map((mod, idx) => (
                <div className={`cursor-target text-sm font-semibold text-white ${mod === currentPage ? "border-b-4" : ""}`} onClick={() => setCurrentPage(mods[idx])}>
                    {mods[idx]}
                </div>
     
        ))}
        </LiquidGlass>
        <div className="flex h-[50vh] max-h-[50vh] ">
            {(() => {
                switch (currentPage) {
                    case "Download":
                            return <DownloaderLayout config={config}></DownloaderLayout>
                    case "Manage":
                        return <>
                            <ModList mods={modsList}>
                                
                            </ModList>
                        </>
                    default:
                        return <>
                            how the fuck did you get here
                        </>;
                }
            })()}
        </div>
        
        
        
    </div>
    
  );
}