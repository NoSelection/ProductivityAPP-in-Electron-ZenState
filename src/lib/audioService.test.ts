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

// Mock Web Audio API
class MockAnalyser {
  getByteFrequencyData = vi.fn()
  connect = vi.fn()
  frequencyBinCount = 128
}

class MockAudioContext {
  createAnalyser = vi.fn().mockReturnValue(new MockAnalyser())
  createMediaElementSource = vi.fn().mockReturnValue({ connect: vi.fn() })
  state = 'running'
  resume = vi.fn().mockResolvedValue(undefined)
}

// @ts-expect-error mocking Audio for tests
global.Audio = MockAudio
// @ts-expect-error mocking AudioContext for tests
global.AudioContext = MockAudioContext
// @ts-expect-error mocking webkitAudioContext for tests
global.webkitAudioContext = MockAudioContext

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    audioService.pause() 
  })

  it('should play a sound by ID', () => {
    audioService.play('rain')
    const audioInstance = audioService.getAudioInstance()
    expect(audioInstance!.src).toContain('/audio/rain.mp3')
    expect(audioInstance!.loop).toBe(true)
    expect(audioInstance!.play).toHaveBeenCalled()
  })

  it('should provide frequency data', () => {
    audioService.play('rain')
    const data = audioService.getFrequencyData()
    expect(data).toBeInstanceOf(Uint8Array)
  })
})