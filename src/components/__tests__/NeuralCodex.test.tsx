import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NeuralCodex } from '../NeuralCodex'
import { BrowserRouter } from 'react-router-dom'

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, ...props }: any) => (
            <div className={className} onClick={onClick} {...props}>{children}</div>
        )
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7)
    }
})

// Mocks for neuralDb
const mockGetCodexNotes = vi.fn()
const mockSaveCodexNote = vi.fn()
const mockDeleteCodexNote = vi.fn()
const mockGetStats = vi.fn().mockResolvedValue([])
const mockGetQuests = vi.fn().mockResolvedValue([])
const mockGetNotes = vi.fn().mockResolvedValue('')

vi.stubGlobal('neuralDb', {
    getCodexNotes: mockGetCodexNotes,
    saveCodexNote: mockSaveCodexNote,
    deleteCodexNote: mockDeleteCodexNote,
    getStats: mockGetStats,
    getQuests: mockGetQuests,
    getNotes: mockGetNotes,
    saveStat: vi.fn(),
    saveQuests: vi.fn(),
    saveNotes: vi.fn(),
    getSettings: vi.fn().mockResolvedValue([]),
    saveSetting: vi.fn(),
})

// Mock settingsService
vi.mock('../../lib/settingsService', () => ({
    settingsService: {
        getAll: vi.fn().mockResolvedValue({})
    }
}))

describe('NeuralCodex', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default notes return
        mockGetCodexNotes.mockResolvedValue([
            { id: '1', title: 'Alpha Note', content: 'Content 1', tags: '["tag1"]', createdAt: 100, updatedAt: 100 },
            { id: '2', title: 'Beta Note', content: 'Content 2', tags: '["tag2"]', createdAt: 200, updatedAt: 200 }
        ])
    })

    it('renders the sidebar and search input', async () => {
        render(
            <BrowserRouter>
                <NeuralCodex />
            </BrowserRouter>
        )

        expect(screen.getByPlaceholderText('SEARCH CODEX...')).toBeDefined()
        // Should show "No Data Found" initially or notes after load
        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
        })
    })

    it('filters notes based on search query', async () => {
        render(
            <BrowserRouter>
                <NeuralCodex />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
            expect(screen.getByText('Beta Note')).toBeDefined()
        })

        const searchInput = screen.getByPlaceholderText('SEARCH CODEX...')
        fireEvent.change(searchInput, { target: { value: 'Alpha' } })

        expect(screen.getAllByText('Alpha Note')).toBeDefined()
        expect(screen.queryByText('Beta Note')).toBeNull()
    })

    it('toggles to edit mode when a note is clicked', async () => {
        render(
            <BrowserRouter>
                <NeuralCodex />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
        })

        // Click on the first note
        fireEvent.click(screen.getByText('Alpha Note'))

        // Check if Editor placeholder appears
        await waitFor(() => {
            expect(screen.getByText('NEURAL EDITOR')).toBeDefined()
            expect(screen.getByText('TITLE: Alpha Note')).toBeDefined()
        })
    })

    it('creates a new note when add button is clicked', async () => {
        render(
            <BrowserRouter>
                <NeuralCodex />
            </BrowserRouter>
        )

        await waitFor(() => screen.getByPlaceholderText('SEARCH CODEX...'))

        const addButton = screen.getByLabelText('Create Note')
        fireEvent.click(addButton)

        // Check if saveCodexNote was called
        await waitFor(() => {
            expect(mockSaveCodexNote).toHaveBeenCalled()
        })

        // Ideally we should also check if the new note appears in the list (if we updated the state), 
        // but checking the spy is enough for now given we are creating it optimistically.
    })
})
