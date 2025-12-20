import { describe, it, expect, vi, beforeEach } from 'vitest'
import { audioService } from './audioService'

// Mock HTMLAudioElement
class MockAudio {
  src = ''
  loop = false
  volume = 1
  play = vi.fn().mockResolvedValue(undefined)
  pause = vi.fn()
  constructor(src: string) {
    this.src = src
  }
}

// @ts-ignore
global.Audio = MockAudio

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    audioService.pause() // Reset state
  })

  it('should play a sound by ID', () => {
    audioService.play('rain')
    // @ts-ignore
    const audioInstance = audioService.getAudioInstance()
    expect(audioInstance.src).toContain('/audio/rain.mp3')
    expect(audioInstance.loop).toBe(true)
    expect(audioInstance.play).toHaveBeenCalled()
  })

  it('should pause the current sound', () => {
    audioService.play('rain')
    audioService.pause()
    // @ts-ignore
    const audioInstance = audioService.getAudioInstance()
    expect(audioInstance.pause).toHaveBeenCalled()
  })

  it('should update volume', () => {
    audioService.play('rain')
    audioService.setVolume(0.5)
    // @ts-ignore
    const audioInstance = audioService.getAudioInstance()
    expect(audioInstance.volume).toBe(0.5)
  })
})
