import { useEffect, useState } from "react";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import Setting from "./Setting";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";
import { User } from "lucide-react";
import LiquidGlassDropdown from "../LiquidGlass/LiquidGlassDropDown";
import { notify } from "../LiquidGlass/Notification";

type SettingsLayoutProps = {
    config: any;
    setConfig: (conf: any) => void
}

export default function SettingsLayout({ config, setConfig }: SettingsLayoutProps) {
  const categories = ["General", "Minecraft", "JVM"]
  const [currentCategory, setCurrentCategory] = useState("General");

  const [mcVersions, setMcVersions] = useState<{ [key: string]: string }>({
    [config.minecraft_version]: config.minecraft_version,
  });
  const [fabricLoaders, setFabricLoaders] = useState<any>({[config.fabric_loader]: config.fabric_loader});

  async function getLatestFabricLoader(mcVersion: string) {
        const url = `https://meta.fabricmc.net/v2/versions/loader/${mcVersion}`;
        const response = await fetch(url);
        const loaders = await response.json();
        let eeeeeeeeeee = {[config.fabric_loader]: config.fabric_loader}
        for (let i in loaders){
            const lo = loaders[i].loader.version
            eeeeeeeeeee[lo] = lo
            setFabricLoaders(eeeeeeeeeee)
        }
        return eeeeeeeeeee;
    }


  async function fetchMinecraftVersions(){
    try {
        const resp = await fetch("https://mc-versions-api.net/api/java")
        let e: { [key: string]: string }  = {}
        const res = await resp.json()
        for (let i in res.result){
            const eh = res.result[i]
            e[eh] = eh
        }
        return e
    } catch (err){
        console.error("Couldn't fetch minecraft versions: ", err)
        notify({message: "Failed to fetch Minecraft versions"})
        return mcVersions
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const versions = await fetchMinecraftVersions();
      setMcVersions(versions);
      setFabricLoaders(await getLatestFabricLoader(config.minecraft_version))
    };
    fetchData();
  }, []);
  

  const [playerName, setPlayerName] = useState<string>(config.player);
  const [minecraftVersion, setMinecraftVersion] = useState<string>(config.minecraft_version);
  const [fabricLoaderVersion, setFabricLoaderVersion] = useState<string>(config.fabric_loader);
  const [minRam, setMinRam] = useState(config.minRam);
  const [maxRam, setMaxRam] = useState(config.maxRam)
  return (
    <div className="flex space-x-2">
        <LiquidGlass className="w-[33%] p-[1vw]">
            {categories.map((category, index) => (
                <LiquidGlassButton key={index} className={`w-full mb-2 ${category === currentCategory ? "border-4" : ""}`} onClick={()=>setCurrentCategory(category)}>{category}</LiquidGlassButton>
            ))}
        </LiquidGlass>
        <div className="flex flex-col space-y-2 w-full">
            <LiquidGlass className="flex flex-col h-[20vh] overflow-y-scroll">
                {(() => {
                    switch (currentCategory) {
                    case "Minecraft":
                        return <>WIP</>
                    case "JVM": 
                        return <>
                            <Setting label="Minimum RAM">
                                <input type="range" min={1} max={128}  onChange={(e) => setMinRam(Number(e.target.value))}></input><p>{minRam}</p>
                            </Setting>
                            <Setting label="Maximum RAM">
                                <input type="range" min={minRam} max={128} onChange={(e) => setMaxRam(Number(e.target.value))}></input><span>{maxRam}</span>
                            </Setting>
                        </>
                    default:
                        return <>
                            <Setting label="Player Name">
                                <LiquidGlassInput 
                                value={playerName} 
                                icon={User} 
                                onChange={(e) => {setPlayerName(e.target.value); console.log(e.target.value)}}
                                onKeyDown={(e) => {
                                    const regex = /^[a-zA-Z0-9_]$/;
                                    if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                    e.preventDefault();
                                    }
                                }} 
                                className="cursor-target w-64"   
                                ></LiquidGlassInput>
                            </Setting>
                            <Setting label="Minecraft Version">
                                <LiquidGlassDropdown label={minecraftVersion}
                                options={mcVersions}
                                onSelect={async (e) => {
                                    setMinecraftVersion(e)
                                    setFabricLoaders(await getLatestFabricLoader(e))
                                }}
                                >

                                </LiquidGlassDropdown>
                            </Setting>
                            <Setting label="Fabric Loader">
                                <LiquidGlassDropdown label={fabricLoaderVersion}
                                options={fabricLoaders}
                                onSelect={async (e) => {
                                    setFabricLoaderVersion(e)
                                }}>

                                </LiquidGlassDropdown>
                            </Setting>
                        </>;
                    }
                })()}
            </LiquidGlass>

            <LiquidGlassButton
                className="px-2 py-1 bg-emerald-500 rounded"
                onClick={() => setConfig({ ...config, player: playerName, minecraft_version: minecraftVersion, minRam: minRam, maxRam: maxRam })}
            >
                Update Config
            </LiquidGlassButton>  
        </div>
    </div>
    
  );
}
