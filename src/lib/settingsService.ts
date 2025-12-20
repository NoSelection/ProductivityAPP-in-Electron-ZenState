export interface Settings {
    [category: string]: {
        [key: string]: any
    }
}

export const settingsService = {
    async getAll(): Promise<Settings> {
        // Browser Fallback
        if (!window.neuralDb) {
            const stored = localStorage.getItem('zen-settings')
            return stored ? JSON.parse(stored) : {}
        }

        // @ts-ignore
        const rawSettings = await window.neuralDb.getSettings()
        const settings: Settings = {}

        rawSettings.forEach((row: any) => {
            if (!settings[row.category]) {
                settings[row.category] = {}
            }
            try {
                settings[row.category][row.key] = JSON.parse(row.value)
            } catch (e) {
                settings[row.category][row.key] = row.value
            }
        })

        return settings
    },

    async set(category: string, key: string, value: any): Promise<void> {
        // Browser Fallback
        if (!window.neuralDb) {
            const stored = localStorage.getItem('zen-settings')
            const settings = stored ? JSON.parse(stored) : {}
            if (!settings[category]) settings[category] = {}
            settings[category][key] = value
            localStorage.setItem('zen-settings', JSON.stringify(settings))
            return
        }

        // @ts-ignore
        await window.neuralDb.saveSetting(category, key, value)
    }
}
