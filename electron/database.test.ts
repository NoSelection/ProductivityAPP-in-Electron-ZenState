import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initDb, closeDb } from './database'
import Database from 'better-sqlite3'
import { ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn().mockReturnValue('./test-data')
  },
  ipcMain: {
    handle: vi.fn()
  }
}))

describe('Database', () => {
  const testDataDir = './test-data'

  beforeEach(() => {
    vi.clearAllMocks()
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir)
    }
  })

  afterEach(() => {
    closeDb()
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true })
    }
  })

  it('should initialize the database with the settings table', () => {
    initDb()
    
    const dbPath = path.join(testDataDir, 'zenstate.db')
    const db = new Database(dbPath)
    try {
      const table: any = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'").get()
      
      expect(table).toBeDefined()
      expect(table.name).toBe('settings')
    } finally {
      db.close()
    }
  })

  it('should initialize the database with the codex table', () => {
    initDb()
    
    const dbPath = path.join(testDataDir, 'zenstate.db')
    const db = new Database(dbPath)
    try {
      const table: any = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='codex'").get()
      
      expect(table).toBeDefined()
      expect(table.name).toBe('codex')
    } finally {
      db.close()
    }
  })

  it('should correctly close the database', () => {
    initDb()
    closeDb()
    if (fs.existsSync(path.join(testDataDir, 'zenstate.db'))) {
      fs.rmSync(path.join(testDataDir, 'zenstate.db'))
    }
  })

  it('should register settings IPC handlers', () => {
    initDb()
    
    expect(ipcMain.handle).toHaveBeenCalledWith('db:getSettings', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('db:saveSetting', expect.any(Function))
  })

  it('should register codex IPC handlers', () => {
    initDb()
    
    expect(ipcMain.handle).toHaveBeenCalledWith('db:getCodexNotes', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('db:saveCodexNote', expect.any(Function))
    expect(ipcMain.handle).toHaveBeenCalledWith('db:deleteCodexNote', expect.any(Function))
  })

  it('should handle db:saveCodexNote and db:getCodexNotes correctly', () => {
    initDb()
    
    const saveHandler: any = vi.mocked(ipcMain.handle).mock.calls.find(call => call[0] === 'db:saveCodexNote')![1]
    const getHandler: any = vi.mocked(ipcMain.handle).mock.calls.find(call => call[0] === 'db:getCodexNotes')![1]
    
    const note = {
        id: 'test-id',
        title: 'Test Note',
        content: '# Content',
        tags: ['test'],
        createdAt: Date.now(),
        updatedAt: Date.now()
    }

    saveHandler({} as any, note)
    
    const notes = getHandler({} as any) as any[]
    expect(notes.length).toBe(1)
    expect(notes[0].id).toBe('test-id')
    expect(notes[0].title).toBe('Test Note')
    expect(JSON.parse(notes[0].tags)).toEqual(['test'])
  })
})