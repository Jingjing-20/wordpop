import Phaser from "phaser";
import type { Round, WordItem } from "./words";

export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 620;

const BALLOON_COLORS = [0xff5d8f, 0xffc93c, 0x36c9c6, 0x8b6cf0];

const SLOTS = [
  { x: 245, y: 190 },
  { x: 655, y: 190 },
  { x: 245, y: 440 },
  { x: 655, y: 440 },
];

type Balloon = {
  container: Phaser.GameObjects.Container;
  item: WordItem;
  bob?: Phaser.Tweens.Tween;
};

export class PopScene extends Phaser.Scene {
  onAnswer: ((payload: { correct: boolean; word: string }) => void) | null = null;
  private balloons: Balloon[] = [];
  private target: WordItem | null = null;
  private locked = true;
  private ready = false;
  private pending: Round | null = null;

  constructor() {
    super("pop");
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
    this.ready = true;
    if (this.pending) {
      const p = this.pending;
      this.pending = null;
      this.startRound(p);
    }
  }

  startRound(round: Round) {
    if (!this.ready) {
      this.pending = round;
      return;
    }
    this.clearBalloons();
    this.target = round.target;
    this.locked = false;

    round.choices.forEach((item, i) => {
      const slot = SLOTS[i]!;
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length]!;
      const container = this.add.container(slot.x, slot.y);

      const shadow = this.add.ellipse(0, 118, 150, 26, 0x000000, 0.12);
      const body = this.add.circle(0, 0, 96, color);
      body.setStrokeStyle(8, 0xffffff, 0.85);
      const shine = this.add.circle(-32, -36, 24, 0xffffff, 0.35);
      const emoji = this.add
        .text(0, -6, item.emoji, { fontSize: "88px" })
        .setOrigin(0.5)
        .setResolution(2);
      const string = this.add.rectangle(0, 118, 4, 42, 0xffffff, 0.6);

      container.add([shadow, string, body, shine, emoji]);
      container.setSize(200, 200);
      container.setScale(0);
      container.setData("item", item);
      body.setInteractive({ useHandCursor: true });

      this.tweens.add({
        targets: container,
        scale: 1,
        ease: "Back.easeOut",
        duration: 420,
        delay: i * 70,
      });

      const bob = this.tweens.add({
        targets: container,
        y: slot.y - 14,
        duration: 1400 + i * 130,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 120,
      });

      body.on("pointerdown", () => this.handlePick(item, container));

      this.balloons.push({ container, item, bob });
    });
  }

  private handlePick(item: WordItem, container: Phaser.GameObjects.Container) {
    if (this.locked || !this.target) return;

    if (item.word === this.target.word) {
      this.locked = true;
      this.pop(container);
      this.balloons
        .filter((b) => b.container !== container)
        .forEach((b) => {
          this.tweens.add({
            targets: b.container,
            alpha: 0.25,
            scale: 0.85,
            duration: 250,
          });
        });
      this.onAnswer?.({ correct: true, word: item.word });
    } else {
      this.tweens.add({
        targets: container,
        x: container.x - 16,
        duration: 60,
        yoyo: true,
        repeat: 3,
        ease: "Sine.easeInOut",
      });
      this.tweens.add({
        targets: container,
        alpha: 0.45,
        duration: 200,
        yoyo: true,
      });
      this.onAnswer?.({ correct: false, word: item.word });
    }
  }

  private pop(container: Phaser.GameObjects.Container) {
    const { x, y } = container;
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      const spark = this.add.circle(
        x,
        y,
        Phaser.Math.Between(6, 12),
        BALLOON_COLORS[i % BALLOON_COLORS.length]!,
      );
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * Phaser.Math.Between(120, 200),
        y: y + Math.sin(angle) * Phaser.Math.Between(120, 200),
        alpha: 0,
        scale: 0.2,
        duration: 620,
        ease: "Cubic.easeOut",
        onComplete: () => spark.destroy(),
      });
    }
    this.tweens.add({
      targets: container,
      scale: 1.35,
      alpha: 0,
      duration: 240,
      ease: "Back.easeIn",
    });
  }

  clearBalloons() {
    this.tweens.killAll();
    this.balloons.forEach((b) => b.container.destroy());
    this.balloons = [];
    this.locked = true;
  }
}
