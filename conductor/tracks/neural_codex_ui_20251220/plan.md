# Track Plan: Neural Codex UI

## Phase 1: Data Layer & Sidebar
- [x] Task: Update SQLite schema to support rich notes with titles, tags, and timestamps. 446cd55
- [x] Task: Create IPC handlers for CRUD operations on notes and tags. 1acec1a
- [~] Task: Build the searchable Minimalist Sidebar in `NeuralCodex.tsx`.
- [ ] Task: Write unit tests for note filtering and search logic.
- [ ] Task: Conductor - User Manual Verification 'Data Layer & Sidebar' (Protocol in workflow.md)

## Phase 2: Markdown Editor & Zen Mode
- [ ] Task: Integrate a lightweight Markdown editor (e.g., simple textarea with preview or a focused lib).
- [ ] Task: Implement 'Zen Writing Mode' state and UI toggles.
- [ ] Task: Ensure real-time saving/persistence during editing.
- [ ] Task: Write tests for editor state management and Markdown rendering.
- [ ] Task: Conductor - User Manual Verification 'Markdown Editor & Zen Mode' (Protocol in workflow.md)

## Phase 3: Neural Atmosphere & Polish
- [ ] Task: Build the dynamic 'Neural Background' component using Canvas or Framer Motion.
- [ ] Task: Link background node reactivity to typing events.
- [ ] Task: Apply active theme colors and "Fluid & Ethereal" transitions across the Codex.
- [ ] Task: Verify performance during rapid typing.
- [ ] Task: Conductor - User Manual Verification 'Neural Atmosphere & Polish' (Protocol in workflow.md)
