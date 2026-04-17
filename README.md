# agency-manager

> [中文](./README.zh-CN.md)

AI Agency Manager — A desktop application for managing AI agents, LLM configs, and MCP servers.

## Features

- **Agents** — Create, edit, and organize AI agent configurations
- **LLM Configs** — Manage LLM provider settings and API keys
- **MCP Servers** — Configure and switch between MCP (Model Context Protocol) servers
- **Teams** — Group agents into collaborative teams
- **Templates** — Reusable prompt and configuration templates
- **CLIs** — Manage command-line tool integrations
- **Settings** — Application preferences and theme switching
- **Bilingual UI** — English / 简体中文 support built-in

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron 28
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: sql.js (SQLite in WASM)
- **I18n**: Custom React i18n context

## Quick Start

```bash
# Install dependencies
npm install

# Start the dev server (Vite + Electron)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
agency-manager/
├── electron/           # Electron main & preload scripts
│   ├── database/       # SQLite schema & seed data
│   ├── ipc/            # IPC handlers (agents, llm, mcp, etc.)
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── features/       # Feature modules (agents, llm, mcp, teams, etc.)
│   ├── shared/         # Shared components, styles, i18n
│   ├── App.tsx
│   └── main.tsx
├── dist-electron/      # Compiled Electron output
└── README.md
```

## License

[MIT](./LICENSE)
