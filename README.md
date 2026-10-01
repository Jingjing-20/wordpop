# Word Pop ESL - Interactive Vocabulary Game

---

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-5865F2?style=for-the-badge&logo=phaser&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white)

---

A vibrant, fast-paced ESL (English as a Second Language) listening and vocabulary mini-game designed for kids and early learners. Listen to the spoken English word, identify the matching picture, and pop the floating balloon before time runs out!

---

## Features

- **Interactive Audio & Speech Synthesis** - Uses the Web Speech API to clearly pronounce vocabulary words with child-friendly pitch and pacing
- **Phaser 2D Balloon Physics** - Smooth balloon bobbing animations, particle explosions, confetti, and satisfying pop interactions
- **Zero-Asset Web Audio SFX** - Custom programmatic sound effects (correct chimes, buzzers, countdown ticks, celebration melodies) synthesized via the Web Audio API
- **3 Difficulty Tiers** - Easy (90s), Medium (90s), and Hard (75s) with progressive vocabulary complexity
- **Streak & Combo Multiplier** - Encourages accuracy with increasing bonus points for consecutive correct pops
- **Post-Round Review** - Displays total score, accuracy, streak records, and a list of missed words to reinforce learning
- **Responsive & Accessible** - Works seamlessly on desktop, tablet, and mobile touchscreens with automatic canvas scaling

---

## Built With

- **React 19** - UI component library
- **TypeScript** - Type-safe programming language
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **Phaser 4** - 2D game engine
- **Vite** - Build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **shadcn/ui** - Re-usable component library

---

## Getting Started

### Prerequisites

Ensure you have one of the following package managers installed:
- [Node.js](https://nodejs.org/) (v18+) with `npm` / `pnpm` / `yarn`
- or [Bun](https://bun.sh/)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd c:\ESL_Mini_Games\wordpop
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. Open your browser and navigate to the local URL (typically `http://localhost:3000` or `http://localhost:5173`)

---

## Available Scripts

| Command           | Description                                             |
| :---------------- | :------------------------------------------------------ |
| `npm run dev`     | Runs the app in development mode with HMR               |
| `npm run build`   | Compiles and builds the production bundle               |
| `npm run preview` | Previews the production build locally                   |
| `npm run lint`    | Runs ESLint to check for code quality and syntax issues |
| `npm run format`  | Formats all code files using Prettier                   |

---

## How to Play

1. **Select a Difficulty** - Choose between **Easy**, **Medium**, or **Hard**
2. **Listen Carefully** - The game will speak the target English word. You can click the audio button to replay the word at any time
3. **Pop the Balloon** - Click or tap the balloon displaying the matching picture/emoji
4. **Build Your Streak** - Answer quickly and accurately to increase your combo multiplier
5. **Review Your Vocabulary** - At the end of the round, review any words you missed to practice pronunciation and spelling
