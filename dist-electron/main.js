import { app, ipcMain, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
const __filename$2 = fileURLToPath(import.meta.url);
path.dirname(__filename$2);
let db;
function initDb() {
  const dbPath = path.join(app.getPath("userData"), "zenstate.db");
  db = new Database(dbPath);
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
    `);
  console.log("Neural Core (SQLite) initialized at:", dbPath);
  ipcMain.handle("db:getQuests", () => {
    return db.prepare("SELECT * FROM quests ORDER BY createdAt DESC").all();
  });
  ipcMain.handle("db:saveQuests", (_, quests) => {
    const deleteStmt = db.prepare("DELETE FROM quests");
    const insertStmt = db.prepare("INSERT INTO quests (id, text, completed, createdAt) VALUES (?, ?, ?, ?)");
    const transaction = db.transaction((items) => {
      deleteStmt.run();
      for (const item of items) {
        insertStmt.run(item.id, item.text, item.completed ? 1 : 0, item.createdAt || Date.now());
      }
    });
    transaction(quests);
    return { success: true };
  });
  ipcMain.handle("db:getStats", () => {
    return db.prepare("SELECT * FROM stats").all();
  });
  ipcMain.handle("db:saveStat", (_, key, value) => {
    return db.prepare("INSERT OR REPLACE INTO stats (key, value) VALUES (?, ?)").run(key, JSON.stringify(value));
  });
  ipcMain.handle("db:getNotes", () => {
    const row = db.prepare("SELECT content FROM notes WHERE id = 1").get();
    return row ? row.content : "";
  });
  ipcMain.handle("db:saveNotes", (_, content) => {
    return db.prepare("INSERT OR REPLACE INTO notes (id, content) VALUES (1, ?)").run(content);
  });
  ipcMain.handle("db:getSettings", () => {
    return db.prepare("SELECT * FROM settings").all();
  });
  ipcMain.handle("db:saveSetting", (_, category, key, value) => {
    return db.prepare("INSERT OR REPLACE INTO settings (category, key, value) VALUES (?, ?, ?)").run(category, key, JSON.stringify(value));
  });
  ipcMain.handle("db:getCodexNotes", () => {
    return db.prepare("SELECT * FROM codex ORDER BY updatedAt DESC").all();
  });
  ipcMain.handle("db:saveCodexNote", (_, note) => {
    const stmt = db.prepare(`
            INSERT OR REPLACE INTO codex (id, title, content, tags, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
    return stmt.run(
      note.id,
      note.title,
      note.content,
      JSON.stringify(note.tags),
      note.createdAt || Date.now(),
      note.updatedAt || Date.now()
    );
  });
  ipcMain.handle("db:deleteCodexNote", (_, id) => {
    return db.prepare("DELETE FROM codex WHERE id = ?").run(id);
  });
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    // Frameless window
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  initDb();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
