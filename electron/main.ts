import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import * as path from "path";
import LauncherCore from "minecraft-launcher-core";
const { Client, Authenticator } = LauncherCore;
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// util

const MINECRAFT_DIR = process.platform === "win32"
  ? path.join(process.env.APPDATA || ".", ".trueclient")
  : path.join(process.env.HOME || ".", ".trueclient");

const CONF_FILE_NAME = "trueclient.json";
const CONFIG_FILE = path.join(MINECRAFT_DIR, CONF_FILE_NAME);

function ensureAppDir(subDir: string) {
  const dir = path.join(MINECRAFT_DIR, subDir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function betterReadONG(filePath: string, defaultContent = ''): string {
  filePath = path.join(MINECRAFT_DIR, filePath)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
  }
  return fs.readFileSync(filePath, 'utf-8');
}

// init shi

ensureAppDir("")
const default_conf = 
{
  "minecraft_version": "1.21.4",
  "type": "release",
  "fabric_loader": "0.16.7",
  "fabric_installer": "1.0.1"
}

let config: any = JSON.parse(
  betterReadONG(CONF_FILE_NAME, JSON.stringify(default_conf, null, 2))
);


// now shi




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



// launcher shi


const launcher = new Client();


ipcMain.on("launch-minecraft", async (_event, playerName: string) => {
  console.log(playerName)
  mainWindow?.webContents.send("message", { text: "launching..." });
  try {
    const opts = {
      authorization: Authenticator.getAuth(playerName || "Player"),
      root: MINECRAFT_DIR,
      version: {
        number: config.minecraft_version || default_conf.minecraft_version,
        type:  config.type || default_conf.type,
      },
      fabric: {
        loader:  config.fabric_loader ||  default_conf.fabric_loader,
        installer: config.fabric_installer || default_conf.fabric_installer
      },
      memory: { min: "2G", max: "4G" }
    };

    launcher.launch(opts);

    launcher.on("debug", (e) => console.log("[DEBUG]", e));
    launcher.on("data", (e) => console.log("[DATA]", e.toString()));
    launcher.on("progress", (e) => console.log("[PROGRESS]", e));
    launcher.on("close", (code) => console.log(`Minecraft exited with code ${code}`));

  } catch (err) {
    console.error("Launch failed:", err);
  }
});

ipcMain.on("bconfig", async (config: any | null = null) => {
  if (config){
    fs.writeFileSync(CONFIG_FILE, config);
  } else {
    config = betterReadONG(CONF_FILE_NAME)
  }
  mainWindow?.webContents.send("config", { text: JSON.parse(config) });
});

