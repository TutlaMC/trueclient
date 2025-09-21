import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  launchMinecraft: (playerName: string) => ipcRenderer.send("launch-minecraft", playerName),
  onMessage: (callback: (data: any) => void) => {
    ipcRenderer.on("message", (_event, data) => callback(data));
  },
  bconfig: (config: any | null = null) => ipcRenderer.send("bconfig", config),
  onConfig: (callback: (data: any) => void) => {
    ipcRenderer.on("config", (_event, data) => callback(data));
  },
  stopMinecraft: ()  => ipcRenderer.send("stop-minecraft"),
  downloadMod: (link: string) => ipcRenderer.send("downloadMod", link),
});
