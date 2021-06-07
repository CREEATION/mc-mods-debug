# Minecraft Mods Debug

Debug Minecraft Mods by Process of Elimination (soon™)

---

| Statements                                                            | Branches                                                           | Functions                                                         | Lines                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |

---

# Screenshots

![mc-mods-debug-1 1 0_VGjvGKIQXQ](https://user-images.githubusercontent.com/3277769/120900935-fe7c6c00-c637-11eb-8745-ed3976995292.png)

# Development

1. clone/download repo
1. install dependencies
   1. [See Tauri Docs](https://tauri.studio/en/docs/getting-started/intro#setting-up-your-environment)
   1. [Visual Studio](https://visualstudio.microsoft.com) (Build Tools C++, CMake)
   1. [Microsoft Edge Webview 2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)
1. run Visual Studio
   1. open project directory
   1. `npm i` in Visual Studio terminal
   1. close when finished
1. finally, `npm run tauri-dev` in your favorite code editor/terminal

# Commands

## Check local Tauri Installation

> `npm run tauri info`

## Run Tests

> `npm test`

## Generate Test Coverage Report

> `npm run test-coverage`

## Generate App Icons

> `npm run tauri-icon`

## Start Development Server + Livereload

> `npm run tauri-dev`

## Build Executables

> `npm run tauri-build`
