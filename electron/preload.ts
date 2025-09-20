import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  launchMinecraft: (playerName: string) => ipcRenderer.send("launch-minecraft", playerName),
  onMessage: (callback: (data: any) => void) => {
    ipcRenderer.on("message", (_event, data) => callback(data)); // testing purposes
  },
});
