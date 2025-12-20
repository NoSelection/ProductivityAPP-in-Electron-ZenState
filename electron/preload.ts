import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('neuralDb', {
  getQuests: () => ipcRenderer.invoke('db:getQuests'),
  saveQuests: (quests: any[]) => ipcRenderer.invoke('db:saveQuests', quests),
  getStats: () => ipcRenderer.invoke('db:getStats'),
  saveStat: (key: string, value: any) => ipcRenderer.invoke('db:saveStat', key, value),
  getNotes: () => ipcRenderer.invoke('db:getNotes'),
  saveNotes: (content: string) => ipcRenderer.invoke('db:saveNotes', content),
  getSettings: () => ipcRenderer.invoke('db:getSettings'),
  saveSetting: (category: string, key: string, value: any) => ipcRenderer.invoke('db:saveSetting', category, key, value),
  getCodexNotes: () => ipcRenderer.invoke('db:getCodexNotes'),
  saveCodexNote: (note: any) => ipcRenderer.invoke('db:saveCodexNote', note),
  deleteCodexNote: (id: string) => ipcRenderer.invoke('db:deleteCodexNote', id),
})
