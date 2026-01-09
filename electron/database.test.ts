import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initDb, closeDb } from './database'
import Database from 'better-sqlite3'
import { ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

// Create a unique test directory for each test run
const testId = Math.random().toString(36).substring(7)
const testDataDir = path.join(os.tmpdir(), `zenstate-test-${testId}`)

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn().mockImplementation(() => testDataDir)
  },
  ipcMain: {
    handle: vi.fn()
  }
}))

describe('Database', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure test directory exists
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true })
    }
  })

  afterEach(() => {
    closeDb()
    // Clean up test directory
    if (fs.existsSync(testDataDir)) {
      try {
        fs.rmSync(testDataDir, { recursive: true, force: true })
      } catch {
        // Ignore cleanup errors
      }
    }
  })

  it('should initialize the database with the settings table', () => {
    initDb()

    const dbPath = path.join(testDataDir, 'zenstate.db')
    expect(fs.existsSync(dbPath)).toBe(true)

    const db = new Database(dbPath)
    try {
      const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'").get() as { name: string } | undefined

      expect(table).toBeDefined()
      expect(table!.name).toBe('settings')
    } finally {
      db.close()
    }
  })

  it('should initialize the database with the codex table', () => {
    initDb()

    const dbPath = path.join(testDataDir, 'zenstate.db')
    const db = new Database(dbPath)
    try {
      const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='codex'").get() as { name: string } | undefined

      expect(table).toBeDefined()
      expect(table!.name).toBe('codex')
    } finally {
      db.close()
    }
  })

  it('should correctly close the database', () => {
    initDb()
    closeDb()
    // If we get here without error, the test passes
    expect(true).toBe(true)
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

    type IpcHandler = (_event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => unknown
    const saveHandler = vi.mocked(ipcMain.handle).mock.calls.find(call => call[0] === 'db:saveCodexNote')?.[1] as IpcHandler | undefined
    const getHandler = vi.mocked(ipcMain.handle).mock.calls.find(call => call[0] === 'db:getCodexNotes')?.[1] as IpcHandler | undefined

    expect(saveHandler).toBeDefined()
    expect(getHandler).toBeDefined()

    if (!saveHandler || !getHandler) return

    const note = {
      id: 'test-id',
      title: 'Test Note',
      content: '# Content',
      tags: ['test'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    saveHandler({} as Electron.IpcMainInvokeEvent, note)

    const notes = getHandler({} as Electron.IpcMainInvokeEvent) as { id: string; title: string; tags: string }[]
    expect(notes.length).toBe(1)
    expect(notes[0].id).toBe('test-id')
    expect(notes[0].title).toBe('Test Note')
    expect(JSON.parse(notes[0].tags)).toEqual(['test'])
  })
})
