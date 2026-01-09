import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { NeuralCodex } from '../NeuralCodex'

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, layoutId, ...props }: { children?: React.ReactNode; className?: string; onClick?: () => void; layoutId?: string; [key: string]: unknown }) => (
            <div className={className} onClick={onClick} data-layoutid={layoutId} {...props}>{children}</div>
        )
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
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

// Mock settingsService
vi.mock('../../lib/settingsService', () => ({
    settingsService: {
        getAll: vi.fn().mockResolvedValue({})
    }
}))

// Mock useNeuralStorage
vi.mock('../../hooks/useNeuralStorage', () => ({
    useNeuralStorage: <T,>(_key: string, initialValue: T) => [initialValue, vi.fn()]
}))

describe('NeuralCodex', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Setup window.neuralDb mock
        // @ts-expect-error - mocking window.neuralDb for tests
        window.neuralDb = {
            getCodexNotes: mockGetCodexNotes,
            saveCodexNote: mockSaveCodexNote,
            deleteCodexNote: mockDeleteCodexNote,
            getStats: vi.fn().mockResolvedValue([]),
            getQuests: vi.fn().mockResolvedValue([]),
            getNotes: vi.fn().mockResolvedValue(''),
            saveStat: vi.fn(),
            saveQuests: vi.fn(),
            saveNotes: vi.fn(),
            getSettings: vi.fn().mockResolvedValue([]),
            saveSetting: vi.fn(),
        }

        // Default notes return
        mockGetCodexNotes.mockResolvedValue([
            { id: '1', title: 'Alpha Note', content: 'Content 1', tags: '["tag1"]', createdAt: 100, updatedAt: 100 },
            { id: '2', title: 'Beta Note', content: 'Content 2', tags: '["tag2"]', createdAt: 200, updatedAt: 200 }
        ])
    })

    afterEach(() => {
        cleanup()
    })

    it('renders the sidebar and search input', async () => {
        render(<NeuralCodex />)

        expect(screen.getByPlaceholderText(/search codex/i)).toBeDefined()
        // Should show notes after load
        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
        })
    })

    it('filters notes based on search query', async () => {
        render(<NeuralCodex />)

        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
            expect(screen.getByText('Beta Note')).toBeDefined()
        })

        const searchInput = screen.getByPlaceholderText(/search codex/i)
        fireEvent.change(searchInput, { target: { value: 'Alpha' } })

        expect(screen.getByText('Alpha Note')).toBeDefined()
        expect(screen.queryByText('Beta Note')).toBeNull()
    })

    it('toggles to edit mode when a note is clicked', async () => {
        render(<NeuralCodex />)

        await waitFor(() => {
            expect(screen.getByText('Alpha Note')).toBeDefined()
        })

        // Click on the first note
        fireEvent.click(screen.getByText('Alpha Note'))

        // Check if Editor area is shown (look for editor-related elements)
        await waitFor(() => {
            // The editor shows a textarea with placeholder "Write..."
            expect(screen.getByPlaceholderText('Write...')).toBeDefined()
        })
    })

    it('creates a new note when add button is clicked', async () => {
        render(<NeuralCodex />)

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/search codex/i)).toBeDefined()
        })

        // Find the add button (it's next to the search input)
        const buttons = screen.getAllByRole('button')
        // The first button in the header area is likely the add button
        const addButton = buttons[0]
        fireEvent.click(addButton)

        // Check if saveCodexNote was called
        await waitFor(() => {
            expect(mockSaveCodexNote).toHaveBeenCalled()
        })
    })
})
