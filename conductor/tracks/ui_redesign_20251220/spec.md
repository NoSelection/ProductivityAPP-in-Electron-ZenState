# UI Redesign Specification: The Zen Command Center

## Vision
To replace the rigid, grid-locked interface with a fluid, modular "Command Center" layout. The goal is "One Tool, One Focus" while maintaining quick access to everything via a persistent sidebar.

## Architecture

### 1. The Shell (MainLayout)
*   **Sidebar (Left):**
    *   Collapsed/Expanded state (Icon vs Label).
    *   **Primary Nav:** Dashboard (Home), Focus (Timer), Codex (Notes), Media (Audio), Quests (Tasks).
    *   **Secondary Nav (Bottom):** Settings, User Profile/Status.
*   **The Stage (Main Content):**
    *   Occupies the rest of the screen.
    *   **Dashboard View:** A high-level summary (Greeting, Quick Stats, Active Task).
    *   **Tool View:** Full-screen dedicated view for the active tool (e.g., just the Timer, just the Codex).

### 2. Component Refactoring
*   **Layout.tsx:** Replace the Top Header + Bottom Bar model with the Sidebar model.
    *   *Retain:* The "Hyper Background" and "Scanlines" (maybe tone them down or make them optional/contextual).
    *   *Remove:* The floating bottom control bar. Move "Focus Shield" and "Reset" to the Sidebar or a specific "Focus" tool view.
*   **Dashboard.tsx:**
    *   Convert from a hardcoded grid of *all* widgets to a "Summary" view.
    *   Example: "Good Morning. You have 3 Quests. Focus is at 0 minutes."
*   **Widgets:**
    *   `Timer`, `MediaDeck`, `NeuralCodex` need to be able to live in the "Stage" independently.

## Visual Style
*   **Glassmorphism:** Keep the frosted glass aesthetic but improve contrast.
*   **Neon Accents:** Use color to indicate state (e.g., Sidebar border glows when Focus is active).
*   **Animations:** Smooth page transitions (Framer Motion) between Stage views.
