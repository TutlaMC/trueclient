import LiquidGlass from "../LiquidGlass/LiquidGlass";
import DownloaderLayout from "./DownloaderLayout";

type ModeMenuLayoutProps = {
    config: any;
}

export default function ModMenuLayout({config}: ModeMenuLayoutProps) {
  
  return (
    <div>
        <LiquidGlass className="flex-col mb-2 h-[5vh]">
            select
        </LiquidGlass>
        <DownloaderLayout config={config}>
        </DownloaderLayout>
    </div>
    
  );
}