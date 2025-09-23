import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import { DownloadCloudIcon, BookAudio } from "lucide-react";

type ModDisplayProps = {
    selectedMod: any,
    setShowDesc: (e: boolean) => void,
    setShowDownloadVersionSelector: (e: boolean) => void,
}

export default function ModDisplay({selectedMod, setShowDesc, setShowDownloadVersionSelector}:ModDisplayProps){
    return (
      <LiquidGlass className="w-[25%] max-w-[30%]">
        {(selectedMod) && 
            <div>
              <h3 className="text-xl font-bold mb-2">{selectedMod.title}</h3>
              <img src={selectedMod.icon_url} width={256} height={256}></img>
              <div className="m-2 flex space-x-2">
                <LiquidGlassButton className="flex  bg-opacity-25 bg-green-500" onClick={() => setShowDownloadVersionSelector(true)}><DownloadCloudIcon> </DownloadCloudIcon></LiquidGlassButton>
                <LiquidGlassButton className="flex" onClick={() => setShowDesc(true)}><BookAudio></BookAudio></LiquidGlassButton>
              </div>
              <p dangerouslySetInnerHTML={{__html: selectedMod.description}}></p>
            </div>
        }
      </LiquidGlass>
    )
}