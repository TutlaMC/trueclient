import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import * as path from "path";
import LauncherCore from "minecraft-launcher-core";
const { Client, Authenticator } = LauncherCore;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let mainWindow: BrowserWindow | null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  if (process.env.NODE_ENV === "dev") {
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../frontend/dist/index.html"))
  }
}

app.whenReady().then(createWindow)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const MINECRAFT_DIR = process.platform === "win32"
  ? path.join(process.env.APPDATA || ".", ".trueclient")
  : path.join(process.env.HOME || ".", ".trueclient");

const launcher = new Client();

ipcMain.on("launch-minecraft", async (_event, playerName: string) => {
  console.log(playerName)
  try {
    const opts = {
      authorization: Authenticator.getAuth(playerName || "Player"),
      root: MINECRAFT_DIR,
      version: {
        number: "1.21.1",
        type: "release"
      },
      fabric: {
        loader: "0.16.7",
        installer: "1.0.1"
      },
      memory: { min: "2G", max: "4G" }
    };

    launcher.launch(opts);

    //launcher.on("debug", (e) => console.log("[DEBUG]", e));
    //launcher.on("data", (e) => console.log("[DATA]", e.toString()));
    //launcher.on("progress", (e) => console.log("[PROGRESS]", e));
    launcher.on("close", (code) => console.log(`Minecraft exited with code ${code}`));

  } catch (err) {
    console.error("Launch failed:", err);
  }
});

