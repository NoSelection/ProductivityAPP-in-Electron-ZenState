# ZenState

A high-fidelity minimalist focus OS designed to help you achieve deep work and flow states.

![ZenState Dashboard](screenshots/Screenshot%202026-01-19%20172201.png)

## Features

### Sanctuary (Dashboard)
Your personal command center with widgets for timer, ambient sounds, and task directives - all in one view.

![Dashboard Grid](screenshots/Screenshot%202026-01-19%20172600.png)

### Focus Timer
Pomodoro-style timer with customizable sessions. Track your focus sessions and build consistency.

![Timer Widget](screenshots/Screenshot%202026-01-19%20172440.png)

### Frequency (Ambient Sounds)
Immersive ambient soundscapes to enhance concentration. Choose from rainfall, white noise, and more.

![Frequency Page](screenshots/Screenshot%202026-01-19%20172306.png)

### Quests (Directives)
Manage your tasks and directives with a clean, distraction-free interface.

![Quests Page](screenshots/Screenshot%202026-01-19%20172231.png)

### Codex
Your personal knowledge base and journal. Capture thoughts and ideas as you work.

![Codex Page](screenshots/Screenshot%202026-01-19%20172250.png)

### Themes
Multiple visual themes to match your mood and environment.

![Settings - Themes](screenshots/Screenshot%202026-01-19%20172416.png)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Desktop**: Electron
- **Database**: Better-SQLite3
- **Build**: Vite + electron-builder

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zenstate.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint codebase |

## Project Structure

```
src/
├── components/
│   ├── atoms/       # Basic UI components
│   ├── layout/      # Layout components
│   └── widgets/     # Feature widgets
├── features/        # Feature modules
├── layout/          # App layouts
└── pages/           # Page components
```

## License

MIT

---

*Built with focus, for focus.*
