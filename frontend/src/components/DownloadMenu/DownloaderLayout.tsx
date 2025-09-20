import React, { useState, useEffect, useRef } from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import { BookAudio, DownloadCloudIcon } from "lucide-react";
import TutlaWindow from "../TutlaWindow";
import MarkdownReader from "../MarkdownReader";

export default function DownloaderLayout() {
  const lastSearch = useRef("");
  const [mods, setMods] = useState<any[]>([]);
  const [searchQuery, setName] = useState("");

  const [showDesc, setShowDesc] = useState(false);
  const [modDescription, setmodDesc] = useState("");


  const [selectedMod, setSelectedMod] = useState<any | null>(null);

  async function search(query: string) {
    try {
      const response = await fetch(
        `https://api.modrinth.com/v2/search?query=${query}&limit=20`
      );
      const data = await response.json();
      setMods(data.hits || []);
    } catch (err) {
      console.error("Error fetching mods:", err);
      setMods([]);
    }
  }

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

  }

  useEffect(() => {
    search("spoofer");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = searchQuery.trim();
      if (query && query !== lastSearch.current) {
        lastSearch.current = query;
        search(query);
      }
    }
  };

  return (
    <div className="flex space-x-2 w-full">
      <LiquidGlass className="w-[25%] max-w-[30%]">
        {(selectedMod) && 
            <div>
              <h3 className="text-xl font-bold mb-2">{selectedMod.title}</h3>
              <img src={selectedMod.icon_url} width={256} height={256}></img>
              <div className="m-2 flex space-x-2">
                <LiquidGlassButton className="flex  bg-opacity-25 bg-green-500 cursor-target"><DownloadCloudIcon> </DownloadCloudIcon></LiquidGlassButton>
                <LiquidGlassButton className="flex cursor-target" onClick={() => setShowDesc(true)}><BookAudio></BookAudio></LiquidGlassButton>
              </div>
              
              <p dangerouslySetInnerHTML={{__html: selectedMod.description}}></p>
              
            </div>
            
            
        }
      </LiquidGlass>

      <LiquidGlass className="w-[75%]"> {/* ever felt like life was shit? i felt it here */}
        <LiquidGlassInput
          placeholder="spoofer"
          value={searchQuery}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex-1 space-y-2 max-h-[70vh] overflow-y-scroll mt-2">
          {mods.map((mod, idx) => (
            <div className="cursor-target" onClick={() => getModFromModrinth(idx)}>
                <LiquidGlass key={idx} className="p-3" >
                <div className="text-sm font-semibold text-white">
                    {mod.title || mod.slug}
                </div>
                <div className="text-xs text-white/60">{mod.description}</div>
                </LiquidGlass>
            </div>
            
          ))}
        </div>
      </LiquidGlass>
      <TutlaWindow open={showDesc} onClose={() => setShowDesc(false)} title="Description" zindex="51">
        <div className="prose prose-content h-[50vh] overflow-y-scroll overflow-x-clip">
          <MarkdownReader markdown={modDescription}></MarkdownReader>
        </div>
      </TutlaWindow>
    </div>
  );
}
