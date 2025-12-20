import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initDb, closeDb } from './database'
import Database from 'better-sqlite3'
import { app } from 'electron'
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

  it('should correctly close the database', () => {
    initDb()
    closeDb()
    // If we can't run a query, it's closed. 
    // We don't have direct access to 'db' variable, but we can check if file is unlockable.
    if (fs.existsSync(path.join(testDataDir, 'zenstate.db'))) {
      fs.rmSync(path.join(testDataDir, 'zenstate.db')) // Should not throw EBUSY
    }
  })
})
