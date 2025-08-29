import { useState } from "react"
import TargetCursor from "./components/TargetCursor"
import Prism from './components/Background';
import { Play, Settings, Download, StopCircle} from "lucide-react";

const State = {
  IDLE: 0,
  LAUNCHING: 1,
  INSTALLING_MAIN: 2,
  INSTALLING_MOD: 3,
} as const;

type State = typeof State[keyof typeof State];

export default function App() {
  const [status, setStatus] = useState<State>(State.IDLE);

  const launchGame = async () => {
    setStatus(State.LAUNCHING)
    const result = window.electronAPI.launchMinecraft("weeb")
    console.log(result)
  }

  const stopGame = () => {
    setStatus(State.IDLE)
    window.electronAPI.launchMinecraft("weeb")
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
        <div className="w-full max-w-md p-6 rounded shadow-xl bg-black/50">
          <h1 className="text-3xl font-bold text-center mb-4 text-emerald-400">
            TrueClient
          </h1>
          <div className="flex flex-row items-center justify-center gap-3">
            {
              status == State.IDLE ? 
              <button onClick={launchGame} className="px-2 py-2 rounded-full bg-emerald-500 hover:bg-emerald-250 transition cursor-target">
                <Play></Play>
              </button> 
              : <button onClick={stopGame} className="px-2 py-2 rounded-full bg-red-500 hover:bg-emerald-250 transition cursor-target">
                <StopCircle></StopCircle>
              </button> 
            }
            <button className="px-2 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition cursor-target">
              <Settings></Settings>
            </button>
            <button className="px-2 py-2 rounded-full bg-yellow-500 hover:bg-gray-600 transition cursor-target">
              <Download></Download>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
