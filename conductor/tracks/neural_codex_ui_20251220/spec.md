# Track Spec: Neural Codex UI

## Overview
This track implements the primary interface for the 'Neural Codex,' ZenState's built-in personal knowledge management system. It aims to transform the current placeholder into a sophisticated, high-fidelity environment for students and creatives to capture and organize their insights.

## Functional Requirements
- **Minimalist Sidebar:** A clean, searchable list of note titles on the left, which can be collapsed to maximize editing space.
- **Markdown Editor:** A rich text editor supporting standard Markdown syntax with a live preview or seamless rendering.
- **Tagging System:** Ability to add and filter notes by multiple tags for fluid organization.
- **Zen Writing Mode:** A toggleable state that hides the sidebar and all Dashboard UI elements, leaving only the editor and a subtle focus indicator.
- **Neural Atmosphere:**
    - A dynamic background effect featuring subtle, floating nodes that shift and react gently to typing activity.
    - Integration with the active neon theme colors.
- **Persistence:** All notes, tags, and metadata must be persisted to the SQLite database via the existing IPC bridge.

## Non-Functional Requirements
- **Ethereal Transitions:** Switching between notes or entering Zen Mode should use smooth, "Fluid & Ethereal" animations (Framer Motion).
- **Latency-Free Typing:** The UI and background effects must remain responsive and performant even during rapid text entry.

## Acceptance Criteria
- User can create, edit, and search for notes via the sidebar.
- Markdown formatting is correctly rendered in the editor.
- Zen Writing Mode successfully hides all peripheral UI elements.
- The background nodes respond to user interaction (typing).
- All data persists across application restarts.

## Out of Scope
- Bi-directional linking (planned for a future track).
- Image uploads or complex file attachments.
- Collaborative editing or cloud sync.
