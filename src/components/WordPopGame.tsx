import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PopScene } from "@/game/PopScene";
import { makeRound, ROUND_SECONDS, type Difficulty, type Round } from "@/game/words";
import { sfx, speak } from "@/game/sfx";

type Phase = "start" | "playing" | "over";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy · short words",
  medium: "Medium · everyday words",
  hard: "Hard · long words",
};

export function WordPopGame() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<PopScene | null>(null);
  const roundRef = useRef<Round | null>(null);
  const phaseRef = useRef<Phase>("start");

  const [phase, setPhase] = useState<Phase>("start");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS.easy);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [pops, setPops] = useState<{ id: number; text: string; good: boolean }[]>([]);

  phaseRef.current = phase;

  const nextRound = useCallback((diff: Difficulty, avoid?: string) => {
    const r = makeRound(diff, avoid);
    roundRef.current = r;
    setRound(r);
    sceneRef.current?.startRound(r);
    window.setTimeout(() => speak(r.target.word), 350);
  }, []);

  const handleAnswer = useCallback(
    (payload: { correct: boolean; word: string }) => {
      if (phaseRef.current !== "playing") return;
      const target = roundRef.current?.target.word ?? "";

      if (payload.correct) {
        sfx.correct();
        setFlash("correct");
        setCorrectCount((c) => c + 1);
        setStreak((s) => {
          const next = s + 1;
          setScore((sc) => sc + 10 + Math.min(next - 1, 5) * 2);
          setPops((p) => [
            ...p,
            {
              id: Date.now(),
              text: next > 1 ? `+${10 + Math.min(next - 1, 5) * 2} · ${next}x` : "+10",
              good: true,
            },
          ]);
          return next;
        });
        window.setTimeout(() => {
          if (phaseRef.current === "playing") nextRound(difficulty, target);
        }, 850);
      } else {
        sfx.wrong();
        setFlash("wrong");
        setStreak(0);
        setMissed((m) => (m.includes(target) ? m : [...m, target]));
        setPops((p) => [...p, { id: Date.now(), text: "Try again!", good: false }]);
        window.setTimeout(() => speak(target), 300);
      }
      window.setTimeout(() => setFlash(null), 420);
    },
    [difficulty, nextRound],
  );

  // Mount Phaser once
  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;
    const scene = new PopScene();
    sceneRef.current = scene;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: false,
      },
      scene: [scene],
    });
    gameRef.current = game;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  // Bind the latest answer handler to the scene
  useEffect(() => {
    if (sceneRef.current) sceneRef.current.onAnswer = handleAnswer;
  }, [handleAnswer]);

  // Countdown
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          sfx.finish();
          sceneRef.current?.clearBalloons();
          setPhase("over");
          setScore((s) => {
            setBest((b) => Math.max(b, s));
            return s;
          });
          return 0;
        }
        if (t <= 6) sfx.tick();
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (pops.length === 0) return;
    const id = window.setTimeout(() => setPops((p) => p.slice(1)), 900);
    return () => window.clearTimeout(id);
  }, [pops]);

  const startGame = (diff: Difficulty) => {
    sfx.unlock();
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setMissed([]);
    setTimeLeft(ROUND_SECONDS[diff]);
    setPhase("playing");
    phaseRef.current = "playing";
    nextRound(diff);
  };

  const totalTime = ROUND_SECONDS[difficulty];

  return (
    <div className="relative mx-auto w-full max-w-5xl px-2 sm:px-4 pb-4 sm:pb-10">
      <div className="rounded-3xl sm:rounded-4xl border-4 border-card bg-card/80 p-2 sm:p-3 md:p-5 shadow-[0_10px_0_-4px_var(--shadow-chunky)] sm:shadow-[0_20px_0_-4px_var(--shadow-chunky)]">
        {/* HUD */}
        <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-secondary px-3 sm:px-4 py-1.5 sm:py-2 font-display clamp-hud-text text-secondary-foreground">
            ⭐ <span className="tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-accent px-3 sm:px-4 py-1.5 sm:py-2 font-display clamp-hud-text text-accent-foreground">
            🔥 <span className="tabular-nums">{streak}</span>
          </div>
          <div className="ml-auto flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 sm:flex-none sm:min-w-[9rem]">
            <span className="font-display clamp-hud-text text-foreground shrink-0">⏱</span>
            <div className="h-3 sm:h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${(timeLeft / totalTime) * 100}%` }}
                transition={{ ease: "linear", duration: 0.4 }}
              />
            </div>
            <span className="w-6 sm:w-8 text-right font-display tabular-nums clamp-hud-text text-foreground shrink-0">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
          <AnimatePresence mode="wait">
            <motion.button
              key={round?.target.word ?? "idle"}
              type="button"
              onClick={() => round && speak(round.target.word)}
              initial={{ y: -14, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex items-center gap-2 sm:gap-3 rounded-full bg-primary px-4 sm:px-6 py-2.5 sm:py-3 font-display clamp-word-btn text-primary-foreground shadow-[0_4px_0_0_var(--shadow-chunky)] sm:shadow-[0_6px_0_0_var(--shadow-chunky)] transition-transform active:translate-y-1 active:shadow-none"
            >
              <span aria-hidden>🔊</span>
              {phase === "playing" && round ? round.target.word : "Word Pop"}
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Canvas */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[image:var(--gradient-sky)]">
          <div ref={hostRef} className="flex aspect-[9/6.2] w-full items-center justify-center" />

          <AnimatePresence>
            {flash && (
              <motion.div
                key={flash}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl ${
                  flash === "correct" ? "bg-success/25" : "bg-destructive/20"
                }`}
              />
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 top-3 sm:top-6 flex flex-col items-center gap-1 sm:gap-2">
            <AnimatePresence>
              {pops.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 20, opacity: 0, scale: 0.7 }}
                  animate={{ y: -10, opacity: 1, scale: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  className={`rounded-full px-3 sm:px-5 py-1 sm:py-2 font-display clamp-pop-text ${
                    p.good
                      ? "bg-success text-success-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {p.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {phase === "start" && (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-5 bg-[image:var(--gradient-sky)] px-3 sm:px-6 py-4 sm:py-6 text-center overflow-y-auto"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                  className="clamp-emoji-lg"
                >
                  🎈
                </motion.div>
                <h2 className="font-display clamp-h2 text-foreground">Word Pop!</h2>
                <p className="max-w-sm font-body clamp-body text-foreground/80">
                  Listen to the word, then pop the balloon with the matching picture.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <motion.button
                      key={d}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startGame(d)}
                      className="rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-3 font-display clamp-btn-text text-primary-foreground shadow-[0_4px_0_0_var(--shadow-chunky)] sm:shadow-[0_6px_0_0_var(--shadow-chunky)]"
                    >
                      {d === "easy" ? "🐣" : d === "medium" ? "🐬" : "🦁"} {d}
                    </motion.button>
                  ))}
                </div>
                <p className="font-body text-xs sm:text-sm text-foreground/60">
                  {DIFFICULTY_LABEL[difficulty]}
                </p>
              </motion.div>
            )}

            {phase === "over" && (
              <motion.div
                key="over"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 bg-[image:var(--gradient-sky)] px-3 sm:px-6 py-4 sm:py-6 text-center overflow-y-auto"
              >
                <motion.div
                  initial={{ rotate: -12, scale: 0.6 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 12 }}
                  className="clamp-emoji-lg"
                >
                  🎉
                </motion.div>
                <h2 className="font-display clamp-h2 text-foreground">Great job!</h2>
                <p className="font-body clamp-body text-foreground/80">
                  You popped <strong>{correctCount}</strong> words and scored{" "}
                  <strong>{score}</strong> points.
                </p>
                {best > 0 && (
                  <p className="font-body text-xs sm:text-sm text-foreground/60">
                    Best score: {best}
                  </p>
                )}
                {missed.length > 0 && (
                  <div className="max-w-sm w-full">
                    <p className="font-body text-xs sm:text-sm text-foreground/70">
                      Words to practise:
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                      {missed.map((w) => (
                        <button
                          key={w}
                          onClick={() => speak(w)}
                          className="rounded-full bg-accent px-3 sm:px-4 py-1 sm:py-1.5 font-display text-sm sm:text-base text-accent-foreground"
                        >
                          🔊 {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-1 sm:mt-2 flex flex-wrap justify-center gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame(difficulty)}
                    className="rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-3 font-display clamp-btn-text text-primary-foreground shadow-[0_4px_0_0_var(--shadow-chunky)] sm:shadow-[0_6px_0_0_var(--shadow-chunky)]"
                  >
                    Play again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase("start")}
                    className="rounded-full bg-secondary px-4 sm:px-6 py-2 sm:py-3 font-display clamp-btn-text text-secondary-foreground shadow-[0_4px_0_0_var(--shadow-chunky)] sm:shadow-[0_6px_0_0_var(--shadow-chunky)]"
                  >
                    Change level
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
