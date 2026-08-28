export type WordItem = { word: string; emoji: string };

export type Difficulty = "easy" | "medium" | "hard";

export const WORD_SETS: Record<Difficulty, WordItem[]> = {
  easy: [
    { word: "cat", emoji: "🐱" },
    { word: "dog", emoji: "🐶" },
    { word: "cow", emoji: "🐮" },
    { word: "pig", emoji: "🐷" },
    { word: "duck", emoji: "🦆" },
    { word: "fish", emoji: "🐟" },
    { word: "bee", emoji: "🐝" },
    { word: "frog", emoji: "🐸" },
    { word: "sun", emoji: "☀️" },
    { word: "star", emoji: "⭐" },
    { word: "ball", emoji: "⚽" },
    { word: "hat", emoji: "🎩" },
  ],
  medium: [
    { word: "apple", emoji: "🍎" },
    { word: "banana", emoji: "🍌" },
    { word: "carrot", emoji: "🥕" },
    { word: "bread", emoji: "🍞" },
    { word: "cheese", emoji: "🧀" },
    { word: "flower", emoji: "🌻" },
    { word: "rabbit", emoji: "🐰" },
    { word: "monkey", emoji: "🐵" },
    { word: "rocket", emoji: "🚀" },
    { word: "guitar", emoji: "🎸" },
    { word: "pencil", emoji: "✏️" },
    { word: "umbrella", emoji: "☂️" },
  ],
  hard: [
    { word: "elephant", emoji: "🐘" },
    { word: "butterfly", emoji: "🦋" },
    { word: "dinosaur", emoji: "🦕" },
    { word: "helicopter", emoji: "🚁" },
    { word: "strawberry", emoji: "🍓" },
    { word: "watermelon", emoji: "🍉" },
    { word: "lighthouse", emoji: "🗼" },
    { word: "telescope", emoji: "🔭" },
    { word: "crocodile", emoji: "🐊" },
    { word: "penguin", emoji: "🐧" },
    { word: "backpack", emoji: "🎒" },
    { word: "sandwich", emoji: "🥪" },
  ],
};

export const ROUND_SECONDS: Record<Difficulty, number> = {
  easy: 90,
  medium: 90,
  hard: 75,
};

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = a;
  }
  return copy;
}

export type Round = { target: WordItem; choices: WordItem[] };

export function makeRound(difficulty: Difficulty, avoid?: string): Round {
  const pool = WORD_SETS[difficulty].filter((w) => w.word !== avoid);
  const choices = shuffle(pool).slice(0, 4);
  const target = choices[Math.floor(Math.random() * choices.length)] as WordItem;
  return { target, choices: shuffle(choices) };
}
