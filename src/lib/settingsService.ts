export interface Settings {
    [category: string]: {
        [key: string]: unknown
    }
}

export const settingsService = {
    async getAll(): Promise<Settings> {
        // Browser Fallback
        if (!window.neuralDb) {
            const stored = localStorage.getItem('zen-settings')
            if (!stored) return {}
            try {
                return JSON.parse(stored)
            } catch {
                return {}
            }
        }

        const rawSettings = await window.neuralDb.getSettings()
        const settings: Settings = {}

        rawSettings.forEach((row: { category: string; key: string; value: string }) => {
            if (!settings[row.category]) {
                settings[row.category] = {}
            }
            try {
                settings[row.category][row.key] = JSON.parse(row.value)
            } catch {
                settings[row.category][row.key] = row.value
            }
        })

        return settings
    },

    async set(category: string, key: string, value: unknown): Promise<void> {
        // Browser Fallback
        if (!window.neuralDb) {
            const stored = localStorage.getItem('zen-settings')
            let settings: Settings = {}
            if (stored) {
                try {
                    settings = JSON.parse(stored)
                } catch {
                    settings = {}
                }
            }
            if (!settings[category]) settings[category] = {}
            settings[category][key] = value
            localStorage.setItem('zen-settings', JSON.stringify(settings))
            return
        }

        await window.neuralDb.saveSetting(category, key, value)
    }
}
