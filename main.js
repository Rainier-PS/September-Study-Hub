// main.js
const path = require("path");
const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Pick correct icon per platform
  const iconPath = process.platform === "win32"
    ? path.join(__dirname, "build", "icon.ico")
    : process.platform === "darwin"
      ? path.join(__dirname, "build", "icon.icns")
      : path.join(__dirname, "build", "icons", "512x512.png");

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
