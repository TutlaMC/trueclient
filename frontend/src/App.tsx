import { useState, useEffect } from "react"
import TargetCursor from "./components/TargetCursor"
import Prism from './components/Background';
import { Play, Settings, Download, StopCircle, LogsIcon, Library} from "lucide-react";
import TutlaWindow from "./components/TutlaWindow";
import DownloaderLayout from "./components/ModMenu/DownloaderLayout";
import { notify } from "./components/LiquidGlass/Notification";
import SettingsLayout from "./components/Settings/SettingsLayout";
import Logs from "./components/Logs";
import ModMenuLayout from "./components/ModMenu/ModMenuLayout";

const State = {
  IDLE: 0,
  LAUNCHING: 1,
  INSTALLING_MAIN: 2,
  INSTALLING_MOD: 3,
} as const;

type State = typeof State[keyof typeof State];

export default function App() {
  const [config, setConfig] = useState<any>({});
  const [logs, setLogs] = useState("No Minecraft Session")
  const [modsList, setModsList] = useState([])

  const [status, setStatus] = useState<State>(State.IDLE);

  const [openSettings, setOpenSettings] = useState(false);
  const [openModDownloader, setOpenModDownloader] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);

  useEffect(() => {
    if ((window as any)._listenersAdded) return;
    (window as any)._listenersAdded = true;

    window.electronAPI.onMessage((data) => notify({ message: data.text }));
    window.electronAPI.onConfig((data) => setConfig(JSON.parse(data.config)));
    window.electronAPI.sendLog((wlogs) => setLogs(prev => prev + "\n" + wlogs.text));
    window.electronAPI.recieveMods((mods) => setModsList(mods))

    window.electronAPI.bconfig();
    window.electronAPI.getMods();
    console.log(modsList)
  }, []);



  const launchGame = async () => {
    setStatus(State.LAUNCHING)
    window.electronAPI.launchMinecraft(config.player)
  }

  const stopGame = () => {
    setStatus(State.IDLE)
    window.electronAPI.stopMinecraft()
    setLogs("No Minecraft Session")
  }
  


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />
      <div style={{ width: '100%', height: '100%', position: 'fixed' }}>
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={1.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />

        
        
      </div>
      <div className="w-screen relative flex items-center justify-center h-full text-white">
        <div className="w-full max-w-md p-6 rounded shadow-xl bg-black/50 space-y-2">
          <h1 className="text-3xl font-bold text-center mb-2 text-emerald-400">
            TrueClient
          </h1>
          <div className="flex flex-row items-center justify-center gap-3">
            
            <button onClick={() => setOpenSettings(true)} className="px-2 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition cursor-target">
              <Settings></Settings>
            </button>
            {
              status == State.IDLE ? 
              <button onClick={launchGame} className="px-2 py-2 rounded-full bg-emerald-500 hover:bg-emerald-250 transition cursor-target">
                <Play></Play>
              </button> 
              : <button onClick={stopGame} className="px-2 py-2 rounded-full bg-red-500 hover:bg-emerald-250 transition cursor-target">
                <StopCircle></StopCircle>
              </button> 
            }
            <button className="px-2 py-2 rounded-full bg-yellow-500 hover:bg-gray-600 transition cursor-target" onClick={() =>setOpenModDownloader(true)}>
              <Library></Library>
            </button>            
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <button className="px-2 py-2 rounded-full bg-black/50 border-white hover:bg-gray-600 transition cursor-target" onClick={() =>setOpenLogs(true)}>
              <LogsIcon></LogsIcon>
            </button>
          </div>
        </div>
      </div>

      <TutlaWindow open={openModDownloader} onClose={() => setOpenModDownloader(false)} title="Mod Downloader">
          <ModMenuLayout config={config}>
          </ModMenuLayout>
      </TutlaWindow>

      <TutlaWindow open={openSettings} onClose={() => setOpenSettings(false)} title="Settings">
         <SettingsLayout config={config} setConfig={(newConfig: any) => {
            setConfig(newConfig);
            console.log(newConfig)
            window.electronAPI.bconfig(newConfig); 
          }}>
          </SettingsLayout> 
      </TutlaWindow>
      <TutlaWindow open={openLogs} onClose={() => setOpenLogs(false)} title="Logs">
          <Logs logs={logs} setLogs={setLogs}></Logs>
      </TutlaWindow> 
    </div>
  )
}
