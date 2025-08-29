import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  launchMinecraft: (playerName: string) => ipcRenderer.send("launch-minecraft", playerName)
});
