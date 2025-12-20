"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("neuralDb", {
  getQuests: () => electron.ipcRenderer.invoke("db:getQuests"),
  saveQuests: (quests) => electron.ipcRenderer.invoke("db:saveQuests", quests),
  getStats: () => electron.ipcRenderer.invoke("db:getStats"),
  saveStat: (key, value) => electron.ipcRenderer.invoke("db:saveStat", key, value),
  getNotes: () => electron.ipcRenderer.invoke("db:getNotes"),
  saveNotes: (content) => electron.ipcRenderer.invoke("db:saveNotes", content),
  getSettings: () => electron.ipcRenderer.invoke("db:getSettings"),
  saveSetting: (category, key, value) => electron.ipcRenderer.invoke("db:saveSetting", category, key, value)
});
