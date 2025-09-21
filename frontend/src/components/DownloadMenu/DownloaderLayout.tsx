import { useState } from "react";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import TutlaWindow from "../TutlaWindow";
import MarkdownReader from "../MarkdownReader";
import LiquidGlassDropdown from "../LiquidGlass/LiquidGlassDropDown";
import {  notify } from "../LiquidGlass/Notification";
import ModDisplay from "./ModDisplay";
import ModSearch from "./ModSearch";

type DownloaderLayoutProps = {
    config: any;
}

export default function DownloaderLayout({config}: DownloaderLayoutProps) {
  
  const [mods, setMods] = useState<any[]>([]);
  
  const [showDownloadVersionSelector, setShowDownloadVersionSelector] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState<any>({})
  const [selectedVersion, setSelectedVersion] = useState<string>("")


  const [showDesc, setShowDesc] = useState(false);
  const [modDescription, setmodDesc] = useState("");

  const [selectedMod, setSelectedMod] = useState<any | null>(null);


  async function install(link: string){
    window.electronAPI.downloadMod(link)
  }

  // modrinth api

  async function getModFromModrinth(modId: string | number) {
    let modIdStr: number
    if (typeof modId === "string") {
        modIdStr = parseInt(modId)
    } else{
        modIdStr = modId
    }
    const mod = mods[modIdStr]
    console.log(mod, modIdStr)
    try {
        const response = await fetch(`https://api.modrinth.com/v2/project/${mod.slug}`)
        if (!response.ok) throw new Error("Failed to fetch mod")
        const modData = await response.json()
        setmodDesc(modData.body)
        setSelectedMod(modData)
        console.log(selectedMod)
    } catch (err) {
        console.error("Error fetching mod:", err);
    }
    try {
      const response = await fetch(`https://api.modrinth.com/v2/project/${mod.slug}/version`)
      if (!response.ok) throw new Error("Failed to fetch mod versions")
      const vers = await response.json()
      setDownloadOptions(vers)
      console.log(vers)
    
    } catch (err){
      console.error("Error fetching mod versions:", err);
    }
  }

  return (
    <div className="flex space-x-2 w-full">
      <ModDisplay selectedMod={selectedMod} setShowDesc={setShowDesc} setShowDownloadVersionSelector={setShowDownloadVersionSelector}>
       </ModDisplay>

      <ModSearch mods={mods} setMods={setMods}  getModFromModrinth={getModFromModrinth}></ModSearch>
      <TutlaWindow open={showDesc} onClose={() => setShowDesc(false)} title="Description" zindex="51">
        <div className="prose prose-content h-[50vh] overflow-y-scroll overflow-x-clip">
          <MarkdownReader markdown={modDescription}></MarkdownReader>
        </div>
      </TutlaWindow>
      <TutlaWindow
        open={showDownloadVersionSelector}
        onClose={() => setShowDownloadVersionSelector(false)}
        title="Select Version"
        zindex="52"
      >
        <div className="flex space-x-2">
          {downloadOptions.length > 0 && (
            <LiquidGlassDropdown
              label="Choose Version"
              className="cursor-target"
              optionClassName="cursor-target"
              options={downloadOptions.reduce((acc: Record<string, number>, option: any, idx: number) => {
                if (option.game_versions.includes(config.minecraft_version)){
                  acc[option.version_number] = idx
                }
                
                return acc
              }, {})}
              onSelect={(idx) => {
                const file = downloadOptions[idx]?.files?.[0]
                if (file) setSelectedVersion(file.url)
              }}
            />
          )}
          <LiquidGlassButton className="bg-green-500" onClick={() => {
            if (selectedVersion !== ""){
              setShowDownloadVersionSelector(false)
              install(selectedVersion)
              setSelectedVersion("")
              notify({ message: `Installing ${selectedMod.title}`, duration: 4000})
            }
            
            }}>Download</LiquidGlassButton>
        </div>
      </TutlaWindow>

    </div>
  );
}
