import { useState } from "react";
import LiquidGlassButton from "../LiquidGlass/LiquidGlassButton";
import Setting from "./Setting";
import LiquidGlass from "../LiquidGlass/LiquidGlass";
import LiquidGlassInput from "../LiquidGlass/LiquidGlassInput";

type SettingsLayoutProps = {
    config: any;
    setConfig: (conf: any) => void
}

export default function SettingsLayout({ config, setConfig }: SettingsLayoutProps) {
  const [conf, setConf] = useState(JSON.parse(JSON.stringify(config)));

  const [playerName, setPlayerName] = useState<string>(conf.player);
  return (
    <div className="flex space-x-2">
        <LiquidGlass className="w-[20%]">
            <span>e</span>
        </LiquidGlass>
        <div className="flex flex-col space-y-2 w-full">
            <pre className="text-sm text-white/80">{JSON.stringify(config, null, 2)}</pre>
            <div>
                <Setting label="Player Name">
                    <LiquidGlassInput onChange={(e) => {setPlayerName(e.target.value); console.log(e.target.value)}}></LiquidGlassInput>
                </Setting>
            </div>

            <LiquidGlassButton
                className="px-2 py-1 bg-emerald-500 rounded"
                onClick={() => setConfig({ ...config, player: playerName })}
            >
                Update Config
            </LiquidGlassButton>  
        </div>
    </div>
    
  );
}
