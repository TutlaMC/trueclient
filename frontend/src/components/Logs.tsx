import { Trash } from "lucide-react";
import LiquidGlass from "./LiquidGlass/LiquidGlass";
import { useEffect, useRef } from "react";

type LogsProps = {
    logs: string
    setLogs: (e: string) => void
}


export default function Logs({logs, setLogs}: LogsProps){
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [logs]);

    return (
        
            <LiquidGlass className="bg-black/25 h-full">
                <div ref={ref} className="overflow-y-scroll overflow-x-clip h-[50vw] font-mono">
                <button onClick={() => setLogs("")} className="fixed bottom-2 right-8 m-5 px-2 py-2 rounded-full bg-red-400 border-white hover:bg-gray-600 transition cursor-target">
                    <Trash />
                </button>
                <div dangerouslySetInnerHTML={{__html: logs}}></div>
                </div>
            </LiquidGlass>
       
    )
}