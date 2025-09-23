// preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  appVersion: () => process.versions.electron,
});
