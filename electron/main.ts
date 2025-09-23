import { fabric } from "tomate-loaders";
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import * as path from "path";
import LauncherCore from "minecraft-launcher-core";
const { Client, Authenticator } = LauncherCore;
import fs from 'fs';
import https from 'https';

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

function downloadFile(url: string, outputPath: string) {
  const file = fs.createWriteStream(outputPath);
  https.get(url, (res) => {
    res.pipe(file);
    file.on("finish", () => {
      file.close();
    });
  }).on("error", (err) => {
    fs.unlinkSync(outputPath);
    console.error("Download error:", err.message);
  });
}



// init shi

ensureAppDir("")
const MODS_DIR = ensureAppDir("mods");
const default_conf = 
{
  "player": "TrueClientOnTop",
  "minecraft_version": "1.21.4",
  "type": "release",
  "fabric_loader": "0.16.7",
  "fabric_installer": "1.0.1",
  "minRam":4,
  "maxRam": 8
}

let client_config: any = JSON.parse(
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
  mainWindow.setMenuBarVisibility(false);


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

const minecraftWrapper = {
  process: null as any,
  spawned: null as Promise<void> | null,
  spawnedResolve: null as (() => void) | null
};

// listen once for the spawn event
launcher.on("spawn", (childProcess) => {
  minecraftWrapper.process = childProcess;

  childProcess.on("close", (code: number) => {
    console.log(`Minecraft exited with code ${code}`);
    minecraftWrapper.process = null;
  });

  if (minecraftWrapper.spawnedResolve) {
    minecraftWrapper.spawnedResolve();
    minecraftWrapper.spawned = null;
    minecraftWrapper.spawnedResolve = null;
  }
});



ipcMain.on("launch-minecraft", async (_event, playerName: string) => {
  mainWindow?.webContents.send("message", { text: "Launching Minecraft..." });

  const launchConfig = await fabric.getMCLCLaunchConfig({
    gameVersion: client_config.minecraft_version || default_conf.minecraft_version,
    rootPath: MINECRAFT_DIR,
  });
  
  const opts = {
    ...launchConfig,
    authorization: Authenticator.getAuth(playerName || default_conf.player),
    memory: { min: `${client_config.minRam}G`, max: `${client_config.maxRam}G` }
  };

  launcher.launch(opts);

  launcher.on("debug", (e) => mainWindow?.webContents.send("sendLog", { text: "[DEBUG] "+e }));
  launcher.on("data", (e) => mainWindow?.webContents.send("sendLog", { text: e }));
  launcher.on("progress", (e) => {mainWindow?.webContents.send("sendLog", { text: "[PROGRESS] "+`Task ${e.task}/${e.total} of ${e.type}` });});
});

ipcMain.on("stop-minecraft", async () => {
  
});

ipcMain.on("bconfig", async (_event, config: any | null = null) => {
  if (config){
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 4));
  } else {
    config = betterReadONG(CONF_FILE_NAME)
  }
  console.log(config)
  mainWindow?.webContents.send("config", { config: config });
});

ipcMain.on("downloadMod", async (_event, link: string) => {
  const match = link.match(/[^\\/]+\.jar\b/);
  const filename = match ? match[0] : "mod.jar";
  const filePath = path.join(MODS_DIR, filename);
  downloadFile(link, filePath);
});

ipcMain.on("getMods", (_event) => {
  const files = fs.readdirSync(MODS_DIR)
  mainWindow?.webContents.send("recieveMods", { mods: files});
})

ipcMain.on("deleteMod", (_event, mod) => {
  fs.unlinkSync(path.join(MODS_DIR, mod));
  mainWindow?.webContents.send("message", { text: `Deleted ${mod}`});
})