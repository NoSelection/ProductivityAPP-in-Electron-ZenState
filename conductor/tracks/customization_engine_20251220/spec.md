# Track Spec: Deep Customization Engine

## Overview
This track focuses on building the foundational customization engine for ZenState. It allows users to define their own focus protocols, gain mechanics for XP, and visual theme parameters.

## Functional Requirements
- **Focus Protocol Config:** Create/Edit/Delete custom timers (work, short break, long break, cycles).
- **XP Progression Logic:** Define difficulty multipliers and XP gain rates.
- **Visual Theme Settings:** Control over transparency, organic easing speeds, and mood-based color presets.
- **Persistence:** Save all configurations to the SQLite database via the Electron main process.

## Technical Considerations
- Use `SettingsPanel.tsx` as the primary UI entry point.
- Implement database schema updates in `database.ts` to support settings persistence.
- Ensure the `ThemeContext.tsx` is updated to react to these new customization settings.
