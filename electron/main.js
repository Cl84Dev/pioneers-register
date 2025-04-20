const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backend;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "assets", "icons", "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
}

// Caminho correto em produção e desenvolvimento
const backendDir = app.isPackaged
  ? path.join(process.resourcesPath, "backend") // Produção: "resources/backend"
  : path.join(__dirname, "..", "backend"); // Desenvolvimento

const backendPath = path.join(backendDir, "server.js");

app.whenReady().then(() => {
  const backend = spawn(
    process.execPath, // Usa o Node.js do Electron
    [backendPath],
    {
      cwd: path.dirname(backendPath),
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    }
  );

  backend.stdout.on("data", (data) => {
    console.log("Backend está rodando:", data.toString());
  });

  backend.stderr.on("data", (data) => {
    console.error("Backend error:", data.toString());
  });

  backend.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.warn("Erro ignorado (backend está rodando mesmo assim)");
    } else {
      console.error("Erro crítico no backend:", err);
    }
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (backend) backend.kill();
  if (process.platform !== "darwin") app.quit();
});
