# 🎈 Word Pop ESL

A vibrant, fast-paced ESL (English as a Second Language) listening and vocabulary mini-game designed for kids and early learners.

Listen to the spoken English word, identify the matching picture, and pop the floating balloon before time runs out!

---

## ✨ Features

- 🎧 **Interactive Audio & Speech Synthesis**: Uses the Web Speech API to clearly pronounce vocabulary words with child-friendly pitch and pacing.
- 🎈 **Phaser 2D Balloon Physics**: Smooth balloon bobbing animations, particle explosions, confetti, and satisfying pop interactions powered by Phaser.
- 🔊 **Zero-Asset Web Audio SFX**: Custom programmatic sound effects (correct chimes, buzzers, countdown ticks, celebration melodies) synthesized via the Web Audio API without external audio dependencies.
- 🎯 **3 Difficulty Tiers**:
  - **Easy** (90s): Foundational 3-letter & short vocabulary words (*cat, dog, sun, star, frog, etc.*).
  - **Medium** (90s): Common everyday items and food (*apple, banana, rocket, guitar, rabbit, etc.*).
  - **Hard** (75s): Multi-syllable and descriptive words (*elephant, dinosaur, telescope, helicopter, etc.*).
- 🔥 **Streak & Combo Multiplier**: Encourages accuracy with increasing bonus points for consecutive correct pops.
- 📊 **Post-Round Review**: Displays total score, accuracy, streak records, and a list of missed words to reinforce learning.
- 📱 **Responsive & Accessible**: Works seamlessly on desktop, tablet, and mobile touchscreens with automatic canvas scaling.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing & Full-stack Architecture**: [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router)
- **Game Engine**: [Phaser 4](https://phaser.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components & Icons**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## 🚀 Getting Started

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

4. Open your browser and navigate to the local URL (typically `http://localhost:3000` or `http://localhost:5173`).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with HMR |
| `npm run build` | Compiles and builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm run format` | Formats all code files using Prettier |

---

## 📂 Project Structure

```text
wordpop/
├── public/                 # Static public assets and icons
├── src/
│   ├── components/         # React UI components & game containers
│   │   ├── ui/             # Radix & Tailwind design system components
│   │   └── WordPopGame.tsx # Main game UI, timer, scoring & overlay logic
│   ├── game/               # Core game engine logic & assets
│   │   ├── PopScene.ts     # Phaser game scene, balloon physics & particle FX
│   │   ├── sfx.ts          # Web Audio synthesizer & Web Speech synthesis
│   │   └── words.ts        # Vocabulary dictionaries, difficulties & round generator
│   ├── routes/             # TanStack file-based routing
│   │   ├── __root.tsx      # Root application layout & head metadata
│   │   └── index.tsx       # Landing page mounting Word Pop
│   ├── router.tsx          # Router configuration
│   ├── server.ts           # Nitro server entry point
│   ├── start.ts            # TanStack Start configuration
│   └── styles.css          # Global CSS & Tailwind configuration
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & TanStack Start plugins
```

---

## 🎮 How to Play

1. **Select a Difficulty**: Choose between **Easy**, **Medium**, or **Hard**.
2. **Listen Carefully**: The game will speak the target English word. You can click the audio button to replay the word at any time.
3. **Pop the Balloon**: Click or tap the balloon displaying the matching picture/emoji.
4. **Build Your Streak**: Answer quickly and accurately to increase your combo multiplier!
5. **Review Your Vocabulary**: At the end of the round, review any words you missed to practice pronunciation and spelling.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
