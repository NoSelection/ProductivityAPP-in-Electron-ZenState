# UI Redesign Plan

## Phase 1: Preparation & Scaffolding
- [ ] Create `src/components/layout` directory.
- [ ] Create `Sidebar.tsx` component (mocked interactions first).
- [ ] Create `Stage.tsx` component (container for views).
- [ ] Create new `MainLayout.tsx` assembling Sidebar + Stage.

## Phase 2: Migration
- [ ] Update `App.tsx` to use the new `MainLayout`.
- [ ] Refactor `Dashboard.tsx` to be the "Home" view (simplified).
- [ ] Create route wrappers for `Timer`, `MediaDeck`, `QuestLog` so they can be standalone pages in the `Stage`.

## Phase 3: Polish & Integration
- [ ] Move "Focus Shield" logic to the Sidebar or a global context hook that visualizes it in the Layout.
- [ ] Re-implement the "Hyper Background" in the new Layout.
- [ ] Ensure `NeuralCodex` fits perfectly in the new Stage (it was already kind of full-screen).

## Phase 4: Cleanup
- [ ] Remove old `Layout.tsx`.
- [ ] Remove unused styles or components from the old grid system.
