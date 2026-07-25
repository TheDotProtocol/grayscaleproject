# Project Grayscale — Desktop (Tauri)

Wraps the Next.js web app in a native desktop shell.

## Prerequisites

```bash
rustup default stable
```

## Run

```bash
cd apps/desktop
pnpm install
pnpm dev
```

## Why Tauri over Electron

- **Smaller binary** (~10MB vs ~150MB)
- **Lower memory** — uses system WebView
- **Free** — no licensing cost
- **Security** — Rust backend, explicit IPC
