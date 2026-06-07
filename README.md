# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # XOR Code — Frontend

  This folder contains the frontend for XOR Code, a modern collaborative development platform built with React, TypeScript and Vite. The backend is a separate Node.js service (not read or included here); the frontend expects a typical REST/WebSocket API provided by that backend.

  ## Key features (frontend)
  - Routing & layout with `react-router-dom` — pages: Dashboard, Editor, Chat, Pull Requests, Issues, AI Assistant, Analytics, Deployments.
  - Command palette with global keyboard shortcut (Cmd/Ctrl+K).
  - Code editor integration via `@monaco-editor/react`.
  - State management with `zustand`.
  - Drag-and-drop with `@dnd-kit`.
  - Animations via `framer-motion` and charts with `recharts`.
  - TailwindCSS for styling.

  ## Tech stack
  - React 19 + TypeScript
  - Vite (development and build tool)
  - TailwindCSS
  - Zustand for small global state
  - Monaco Editor integration

  ## Quick start (frontend only)
  Prerequisites: Node.js 18+ and npm (or yarn/pnpm).

  Install dependencies:

  ```bash
  cd Frontend
  npm install
  ```

  Run development server:

  ```bash
  npm run dev
  ```

  Open: http://localhost:5173 (Vite default)

  Build for production:

  ```bash
  npm run build
  ```

  Preview production build locally:

  ```bash
  npm run preview
  ```

  Lint the codebase:

  ```bash
  npm run lint
  ```

  ## Environment / Backend
  This README focuses on the frontend. The app expects a separate Node.js backend (API). Common environment notes:
  - Configure the backend base URL in the frontend where API calls are made (check `src/utils` or hooks).
  - If the backend runs on `http://localhost:5000`, allow CORS and configure the frontend to call that base URL.

  ## Project structure (important files)
  - `index.html` — application entry ([index.html](index.html)).
  - `src/main.tsx` — app bootstrap ([src/main.tsx](src/main.tsx)).
  - `src/App.tsx` — router and top-level routes ([src/App.tsx](src/App.tsx)).
  - `src/pages/` — page components (Dashboard, Editor, Chat, AIAssistant, etc.).
  - `src/components/layout/` — main layout and navigation.
  - `src/components/CommandPalette.tsx` — global command palette.
  - `src/store/appStore.ts` — global state (Zustand).
  - `vite.config.ts` — Vite + plugins configuration ([vite.config.ts](vite.config.ts)).
  - `package.json` — scripts and deps ([package.json](package.json)).

  ## Scripts (from `package.json`)
  - `dev` — run Vite dev server
  - `build` — build (runs `tsc -b` then `vite build`)
  - `preview` — preview production build
  - `lint` — run ESLint

  ## Notes for contributors
  - Frontend is TypeScript-first; keep types accurate and run `npm run build` locally.
  - Lint before committing: `npm run lint`.
  - Keep UI changes modular; pages are under `src/pages` and shared components under `src/components`.

  ## Where to add backend integration
  - The frontend calls backend APIs from utility files or hooks. Add or update API base URLs there and use the backend's routes (Node.js) accordingly.

  ## License
  See repository root for license information.

  ---
  If you want, I can also:
  - add environment variable docs for API base URL,
  - create a quick `.env.example` in `Frontend/`, or
  - update the root README to reference this frontend README.
