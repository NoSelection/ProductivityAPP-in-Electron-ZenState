import Database from 'better-sqlite3'
import { app, ipcMain } from 'electron'
import path from 'node:path'

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
    tags: string[] | string
    createdAt?: number
    updatedAt?: number
}

let db: Database.Database | null = null

export function initDb() {
    const dbPath = path.join(app.getPath('userData'), 'zenstate.db')
    db = new Database(dbPath)

    // Create Tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS quests (
            id TEXT PRIMARY KEY,
            text TEXT,
            completed INTEGER,
            createdAt INTEGER
        );

        CREATE TABLE IF NOT EXISTS stats (
            key TEXT PRIMARY KEY,
            value TEXT
        );

        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            content TEXT
        );

        CREATE TABLE IF NOT EXISTS settings (
            category TEXT,
            key TEXT,
            value TEXT,
            PRIMARY KEY (category, key)
        );

        CREATE TABLE IF NOT EXISTS codex (
            id TEXT PRIMARY KEY,
            title TEXT,
            content TEXT,
            tags TEXT,
            createdAt INTEGER,
            updatedAt INTEGER
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            duration INTEGER,
            timestamp INTEGER
        );
    `)

    console.log('Neural Core (SQLite) initialized at:', dbPath)

    // --- IPC Handlers ---

    // Sessions (Timer)
    ipcMain.handle('db:saveSession', (_, duration: number) => {
        if (!db) return null
        const id = Math.random().toString(36).substr(2, 9)
        return db.prepare('INSERT INTO sessions (id, duration, timestamp) VALUES (?, ?, ?)').run(id, duration, Date.now())
    })

    ipcMain.handle('db:getSessions', () => {
        if (!db) return []
        return db.prepare('SELECT * FROM sessions ORDER BY timestamp DESC').all()
    })

    // Quests
    ipcMain.handle('db:getQuests', () => {
        if (!db) return []
        return db.prepare('SELECT * FROM quests ORDER BY createdAt DESC').all()
    })

    ipcMain.handle('db:saveQuests', (_, quests: Quest[]) => {
        if (!db) return { success: false }
        const deleteStmt = db.prepare('DELETE FROM quests')
        const insertStmt = db.prepare('INSERT INTO quests (id, text, completed, createdAt) VALUES (?, ?, ?, ?)')

        const transaction = db.transaction((items: Quest[]) => {
            deleteStmt.run()
            for (const item of items) {
                insertStmt.run(item.id, item.text, item.completed ? 1 : 0, item.createdAt || Date.now())
            }
        })
        transaction(quests)
        return { success: true }
    })

    // Stats
    ipcMain.handle('db:getStats', () => {
        if (!db) return []
        return db.prepare('SELECT * FROM stats').all()
    })

    ipcMain.handle('db:saveStat', (_, key: string, value: unknown) => {
        if (!db) return null
        return db.prepare('INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)').run(key, JSON.stringify(value))
    })

    // Notes (Brain Dump)
    ipcMain.handle('db:getNotes', () => {
        if (!db) return ''
        const row = db.prepare('SELECT content FROM notes WHERE id = 1').get() as { content: string } | undefined
        return row ? row.content : ''
    })

    ipcMain.handle('db:saveNotes', (_, content: string) => {
        if (!db) return null
        return db.prepare('INSERT OR REPLACE INTO notes (id, content) VALUES (1, ?)').run(content)
    })

    // Settings
    ipcMain.handle('db:getSettings', () => {
        if (!db) return []
        return db.prepare('SELECT * FROM settings').all()
    })

    ipcMain.handle('db:saveSetting', (_, category: string, key: string, value: unknown) => {
        if (!db) return null
        return db.prepare('INSERT OR REPLACE INTO settings (category, key, value) VALUES (?, ?, ?)').run(category, key, JSON.stringify(value))
    })

    // Codex
    ipcMain.handle('db:getCodexNotes', () => {
        if (!db) return []
        return db.prepare('SELECT * FROM codex ORDER BY updatedAt DESC').all()
    })

    ipcMain.handle('db:saveCodexNote', (_, note: CodexNote) => {
        if (!db) return null
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO codex (id, title, content, tags, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        return stmt.run(
            note.id,
            note.title,
            note.content,
            JSON.stringify(note.tags),
            note.createdAt || Date.now(),
            note.updatedAt || Date.now()
        )
    })

    ipcMain.handle('db:deleteCodexNote', (_, id: string) => {
        if (!db) return null
        return db.prepare('DELETE FROM codex WHERE id = ?').run(id)
    })
}

export function closeDb() {
    if (db) {
        db.close()
        db = null
    }
}
