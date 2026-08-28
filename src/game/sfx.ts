let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, start: number, duration: number, type: OscillatorType = "sine") {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.22, audio.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.05);
}

export const sfx = {
  unlock: () => getCtx(),
  correct: () => {
    blip(660, 0, 0.14, "triangle");
    blip(880, 0.09, 0.18, "triangle");
    blip(1320, 0.18, 0.22, "triangle");
  },
  wrong: () => {
    blip(300, 0, 0.16, "sine");
    blip(220, 0.12, 0.22, "sine");
  },
  tick: () => blip(1000, 0, 0.05, "square"),
  finish: () => {
    [523, 659, 784, 1046].forEach((f, i) => blip(f, i * 0.12, 0.3, "triangle"));
  },
};

export function speak(word: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.8;
  utter.pitch = 1.2;
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
}
