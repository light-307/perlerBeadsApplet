# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Perler Bead Pixel Art mini-program (拼豆像素画小程序) — a creative tool for designing pixel-style bead patterns on mobile. Users draw on a grid, manage artworks, and browse templates. Built with Taro 4 + Vue 3 + TypeScript, primarily targeting WeChat mini-programs.

## Commands

```bash
# Install dependencies (pnpm preferred)
pnpm install

# Development (WeChat mini-program with watch mode)
npm run dev:weapp

# Production build (does NOT change the version)
npm run build:weapp

# Version bump: patch / minor / major
npm run bump:patch
npm run bump:minor
npm run bump:major

# Other platforms: dev:alipay, dev:swan, dev:tt, dev:qq, dev:h5

# Lint
npx eslint src/
npx stylelint "src/**/*.scss"
```

After building, open the project root in WeChat Developer Tools. The `appid` in `project.config.json` must be set to your own AppID.

## Architecture

### Framework & Tooling
- **Taro 4.1.11** cross-platform framework with **Vite 4** compiler
- **Vue 3** Composition API with **Pinia** state management
- **Sass** for styles, **TypeScript** throughout
- Path alias: `@/` maps to `src/`, `@components/` maps to `src/components/`

### Page Routing (`src/app.config.ts`)
Pages: `editor` (pixel art editor), `profile` (artwork gallery), `home` (templates, currently commented out), `saveForm`, `settings`, `detail`, `debug`. Custom tab bar with two tabs: profile and editor.

### State Management (`src/stores/`)
- `editorTemp` — temporary editor state (grid data, tool selections)
- `user` — user authentication and profile data

### Key Utilities (`src/utils/`)
- `pixelArt.ts` — core pixel art logic (rendering/export/import, pattern image generation)
- `colorData.ts` — the 5-brand color-code mapping table (205 hex entries)
- `colorUtils.ts` — color-code lookup, palette building, contrast color helpers
- `request/` — API service factory with typed REST service generators, interceptors (implemented but unused by pages)
- `storage.ts` — local storage wrappers
- `base64.ts` — ArrayBuffer ↔ Base64 conversion

### Components
- `MIcon` — Material Design Icons wrapper component

## Documentation
Project docs live in `docs/` (Chinese filenames): `docs/开发文档.md` is the full developer guide, `docs/images/` holds the screenshots referenced by the README.

## Versioning & Release
- The version follows semver and lives in `package.json` (`version`) plus `.env.production` (`TARO_APP_VERSION`, shown on the settings page). `scripts/bump-version.js` writes both, so never edit them by hand.
- Bumping is explicit (`npm run bump:patch|minor|major`); building does not touch the version, so `package.json`, the git tag and the version uploaded to WeChat always agree.
- Release flow: bump on `dev` → PR into `main` → tag `vX.Y.Z` on `main` and push the tag → publish a GitHub Release → upload to WeChat with the same version number.
- `v0.1.0` is the fork baseline; from `v0.2.0` on, this repo and `perler-beads-ai` share one version scheme.

## Conventions
- Design width is 750px with automatic px-to-rpx transformation via Taro's postcss plugin
- Output goes to `dist/` directory
- The UI language is Chinese
