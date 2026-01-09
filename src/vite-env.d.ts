/// <reference types="vite/client" />

interface Quest {
  id: string
  text: string
  completed: boolean | number
  createdAt?: number
}

interface CodexNote {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt?: number
  updatedAt?: number
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
  neuralDb: {
    getQuests: () => Promise<Quest[]>
    saveQuests: (quests: Quest[]) => Promise<void>
    getStats: () => Promise<Record<string, unknown>>
    saveStat: (key: string, value: unknown) => Promise<void>
    getNotes: () => Promise<string>
    saveNotes: (content: string) => Promise<void>
    getSettings: () => Promise<{ category: string; key: string; value: string }[]>
    saveSetting: (category: string, key: string, value: unknown) => Promise<void>
    getCodexNotes: () => Promise<CodexNote[]>
    saveCodexNote: (note: CodexNote) => Promise<void>
    deleteCodexNote: (id: string) => Promise<void>
    saveSession: (duration: number) => Promise<void>
    getSessions: () => Promise<{ id: string, duration: number, timestamp: number }[]>
  }
}