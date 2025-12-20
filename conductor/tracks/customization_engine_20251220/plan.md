# Track Plan: Deep Customization Engine

## Phase 1: Foundation & Persistence
- [x] Task: Update SQLite database schema to support granular settings storage. 6d21b8b
- [x] Task: Create backend IPC handlers in `main.ts` for reading/writing configuration. 0fcd996
- [x] Task: Implement a robust settings service in the frontend to interface with the main process. 41ef077
- [x] Task: Conductor - User Manual Verification 'Foundation & Persistence' (Protocol in workflow.md) [checkpoint: c5f5ca4]

## Phase 2: Core Customization UI
- [x] Task: Build the Timer Configuration interface in `SettingsPanel.tsx`. 6d76134
- [x] Task: Implement the XP & Progression settings UI. 8949abc
- [x] Task: Create the Visual Identity/Theme customization controls. d36dbfb
- [ ] Task: Conductor - User Manual Verification 'Core Customization UI' (Protocol in workflow.md)

## Phase 3: Integration & Reactivity
- [ ] Task: Integrate Customization Engine with `Timer.tsx` to use user-defined protocols.
- [ ] Task: Update `ThemeContext.tsx` to apply visual identity settings in real-time.
- [ ] Task: Verify XP gain logic reflects user-defined difficulty multipliers in the `Dashboard.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Integration & Reactivity' (Protocol in workflow.md)
