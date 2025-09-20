import React, { useState, useEffect, useRef } from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";

export default function DownloaderLayout() {
  const lastSearch = useRef("");
  const [mods, setMods] = useState<any[]>([]);
  const [searchQuery, setName] = useState("");


  const [selectedMod, setSelectedMod] = useState({});

  async function search(query: string) {
    try {
      const response = await fetch(
        `https://api.modrinth.com/v2/search?query=${query}&limit=10`
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
      <LiquidGlass className="w-[25%] max-w-[25%]">
        {selectedMod && 
            <div>{selectedMod.title}</div>
        }
      </LiquidGlass>

      <LiquidGlass className="w-[75%]">
        <LiquidGlassInput
          placeholder="spoofer"
          value={searchQuery}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="container space-y-2 h-full overflow-y-scroll mt-2">
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
    </div>
  );
}
