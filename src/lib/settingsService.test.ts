import { describe, it, expect, vi, beforeEach } from 'vitest'
import { settingsService } from './settingsService'

const mockNeuralDb = {
  getSettings: vi.fn(),
  saveSetting: vi.fn()
}

// @ts-ignore
global.window = { neuralDb: mockNeuralDb }
// @ts-ignore
global.neuralDb = mockNeuralDb

describe('SettingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch settings from the backend and parse them', async () => {
    mockNeuralDb.getSettings.mockResolvedValue([
      { category: 'focus', key: 'duration', value: '25' }
    ])

    const settings = await settingsService.getAll()
    expect(settings).toEqual({ focus: { duration: 25 } })
    expect(mockNeuralDb.getSettings).toHaveBeenCalled()
  })

  it('should save a setting to the backend', async () => {
    await settingsService.set('focus', 'duration', 30)
    expect(mockNeuralDb.saveSetting).toHaveBeenCalledWith('focus', 'duration', 30)
  })
})
