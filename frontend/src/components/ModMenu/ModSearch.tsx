/*



*/
{/* ever felt like life was shit? i felt it here */}

import { useRef, useState, useEffect } from "react";

import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";

type ModSearchProps = {
    setMods: (e: any[]) => void,
    mods: any[],
    getModFromModrinth: (modId: string | number) => void
}



export default function ModSearch({setMods, mods,    getModFromModrinth}:ModSearchProps){
  const lastSearch = useRef("");
  const [searchQuery, setQuery] = useState("");

  async function search(query: string) {
    try {
      const response = await fetch(
        `https://api.modrinth.com/v2/search?query=${query}&limit=20&facet=[[versions:1.19.4]]&project_type=mod`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      const data = await response.json();
      setMods(data.hits || []);
    } catch (err) {
      console.error("Error fetching mods:", err);
      setMods([]);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const query = searchQuery.trim();
        if (query && query !== lastSearch.current) {
          lastSearch.current = query;
          search(query);
        }
      }
  };

  useEffect(() => {
    search("spoofer");
  }, []);
  return (
      <LiquidGlass className=" w-[90%] max-h-[80%] relative flex flex-col"> 
        <LiquidGlassInput
          placeholder="spoofer"
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex-1 space-y-2 max-h-[50vh] overflow-y-scroll mt-2">
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
    )
}