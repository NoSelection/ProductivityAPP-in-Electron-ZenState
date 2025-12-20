import Database from 'better-sqlite3'
import { app, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db: any

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
    `)

    console.log('Neural Core (SQLite) initialized at:', dbPath)

    // --- IPC Handlers ---

    // Quests
    ipcMain.handle('db:getQuests', () => {
        return db.prepare('SELECT * FROM quests ORDER BY createdAt DESC').all()
    })

    ipcMain.handle('db:saveQuests', (_, quests: any[]) => {
        const deleteStmt = db.prepare('DELETE FROM quests')
        const insertStmt = db.prepare('INSERT INTO quests (id, text, completed, createdAt) VALUES (?, ?, ?, ?)')

        const transaction = db.transaction((items: any[]) => {
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
        return db.prepare('SELECT * FROM stats').all()
    })

    ipcMain.handle('db:saveStat', (_, key: string, value: any) => {
        return db.prepare('INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)').run(key, JSON.stringify(value))
    })

    // Notes (Brain Dump)
    ipcMain.handle('db:getNotes', () => {
        const row: any = db.prepare('SELECT content FROM notes WHERE id = 1').get()
        return row ? row.content : ''
    })

    ipcMain.handle('db:saveNotes', (_, content: string) => {
        return db.prepare('INSERT OR REPLACE INTO notes (id, content) VALUES (1, ?)').run(content)
    })
}
