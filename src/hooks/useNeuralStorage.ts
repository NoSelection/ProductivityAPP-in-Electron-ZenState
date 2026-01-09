import { useState, useEffect } from 'react'

interface Quest {
    id: string
    text: string
    completed: boolean | number
    createdAt?: number
}

interface StatRow {
    key: string
    value: string
}

interface CodexNote {
    id: string
    title: string
    content: string
    tags: string[]
    createdAt?: number
    updatedAt?: number
}

interface SettingRow {
    category: string
    key: string
    value: string
}

// Declare the neuralDb interface for TypeScript
declare global {
    interface Window {
        neuralDb: {
            getQuests: () => Promise<Quest[]>
            saveQuests: (quests: Quest[]) => Promise<{ success: boolean }>
            getStats: () => Promise<StatRow[]>
            saveStat: (key: string, value: unknown) => Promise<unknown>
            getNotes: () => Promise<string>
            saveNotes: (content: string) => Promise<unknown>
            getSettings: () => Promise<SettingRow[]>
            saveSetting: (category: string, key: string, value: unknown) => Promise<unknown>
            // Codex
            getCodexNotes: () => Promise<CodexNote[]>
            saveCodexNote: (note: CodexNote) => Promise<unknown>
            deleteCodexNote: (id: string) => Promise<unknown>
        }
    }
}

export function useNeuralStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue)
    const [isInitialized, setIsInitialized] = useState(false)

    // Load data and handle migration from localStorage
    useEffect(() => {
        async function loadData() {
            try {
                // Browser Fallback: No neuralDb
                if (!window.neuralDb) {
                    const item = window.localStorage.getItem(key)
                    if (item) {
                        setStoredValue(JSON.parse(item))
                    } else {
                        setStoredValue(initialValue)
                    }
                    setIsInitialized(true)
                    return
                }

                // Electron Mode: Use SQLite (neuralDb)
                let data: T | null = null

                // 1. Try to get from SQLite
                if (key === 'zen-quests') {
                    data = await window.neuralDb.getQuests() as T
                } else if (key === 'zen-brain-dump') {
                    data = await window.neuralDb.getNotes() as T
                } else {
                    const stats = await window.neuralDb.getStats()
                    const stat = stats.find((s) => s.key === key)
                    data = stat ? JSON.parse(stat.value) : null
                }

                // 2. Migration Check: If SQLite is empty, check localStorage
                if ((data === null || (Array.isArray(data) && data.length === 0) || data === '')) {
                    const localItem = window.localStorage.getItem(key)
                    if (localItem !== null) {
                        console.log(`Migrating ${key} from localStorage to SQLite...`)
                        const parsedLocal = JSON.parse(localItem)

                        // Save to SQLite immediately
                        if (key === 'zen-quests') {
                            await window.neuralDb.saveQuests(parsedLocal)
                        } else if (key === 'zen-brain-dump') {
                            await window.neuralDb.saveNotes(parsedLocal)
                        } else {
                            await window.neuralDb.saveStat(key, parsedLocal)
                        }

                        setStoredValue(parsedLocal)
                        window.localStorage.removeItem(key)
                    } else {
                        setStoredValue(initialValue)
                    }
                } else {
                    setStoredValue(data)
                }
            } catch (error) {
                console.error('Failed to load neural data:', error)
                setStoredValue(initialValue)
            } finally {
                setIsInitialized(true)
            }
        }

        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    const setValue = async (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)

            // Browser Fallback: Persist to localStorage
            if (!window.neuralDb) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
                return
            }

            // Electron Mode: Persist to SQLite
            if (key === 'zen-quests') {
                await window.neuralDb.saveQuests(valueToStore as Quest[])
            } else if (key === 'zen-brain-dump') {
                await window.neuralDb.saveNotes(valueToStore as string)
            } else {
                await window.neuralDb.saveStat(key, valueToStore)
            }
        } catch (error) {
            console.error('Failed to save neural data:', error)
        }
    }

    return [storedValue, setValue, isInitialized] as const
}
