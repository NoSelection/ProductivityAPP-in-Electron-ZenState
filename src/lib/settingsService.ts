export interface Settings {
    [category: string]: {
        [key: string]: any
    }
}

export const settingsService = {
    async getAll(): Promise<Settings> {
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
        // @ts-ignore
        await window.neuralDb.saveSetting(category, key, value)
    }
}
