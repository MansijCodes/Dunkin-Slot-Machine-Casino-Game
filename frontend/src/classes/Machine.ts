import { EVENTS, machine, reel, slotsKey, slotsKey2 } from '../constants';
import Reel from './Reel';
import { EventDispatcher } from '../utils/eventDispatcher';

export default class Machine {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private reels: Array<Reel>;
  public resultSlots: Array<Array<string>>;
  public graphicsArray: Array<Phaser.GameObjects.Graphics>;
  private emitter: EventDispatcher;

  private spinTimeoutId: number | null;
  private pauseTime: number = 0;
  private remainingTime: number = 0;
  private isSpinning: boolean;
  private gotFreeSpin: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.reels = [];
    this.graphicsArray = [];
    this.emitter = EventDispatcher.getInstance();
    this.emitter.on(EVENTS.ANIMATION.KEY, (param: string) => {
      if (param == EVENTS.ANIMATION.FALSE) {
        this.removeAnimations();
      }
    });

    this.addMachineComponents();
    this.setupVisibilityChangeHandler();
  }

  private setupVisibilityChangeHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Game is losing focus
        if (this.spinTimeoutId) {
          clearTimeout(this.spinTimeoutId);
          this.spinTimeoutId = null;
          this.pauseTime = Date.now();
        }
      } else {
        // Game is regaining focus
        if (this.remainingTime > 0 && this.isSpinning) {
          const elapsedTime = Date.now() - this.pauseTime;
          this.remainingTime = Math.max(0, this.remainingTime - elapsedTime);
          if (this.remainingTime - elapsedTime > 0) {
            this.spinTimeoutId = this.setSpinTimeout(
              this.gotFreeSpin,
              this.remainingTime
            ); //Stop after remaining time
          } else {
            this.stopSpin(this.gotFreeSpin); // Stop immediately if the time has already passed
          }
        }
      }
    });
  }
  private setSpinTimeout(gotFreeSpin: boolean, delay: number) {
    return setTimeout(() => {
      this.stopSpin(gotFreeSpin);
    }, delay);
  }

  public addMachineComponents(): void {
    this.scene.add.sprite(this.x, this.y, 'slotMachine').setOrigin(0.5);
    this.addReels();
  }

  private addReels(): void {
    let x = this.x - machine.width / 2;
    let y = this.y - machine.height / 2 + 25;
    for (let i = 0; i < reel.reelsCount; i++) {
      let slotKeys = i < 2 ? slotsKey : slotsKey2;
      this.reels.push(new Reel(this.scene, x, y, slotKeys));
      x += reel.width + reel.reelOffset;
    }
  }

  public startSpin(gotFreeSpin: boolean): void {
    this.removeAnimations(); //remove existing animation if present
    this.isSpinning = true;
    this.gotFreeSpin = gotFreeSpin;

    this.reels.forEach((reel) => reel.startSpin());
    // setTimeout(() => {
    //   this.stopSpin(isFreeSpin);
    // }, machine.stopDelay);
    this.remainingTime = machine.stopDelay;
    this.spinTimeoutId = this.setSpinTimeout(gotFreeSpin, machine.stopDelay);
  }

  private stopSpin(gotFreeSpin: boolean): void {
    this.isSpinning = false;

    this.reels.forEach((reel, i) =>
      reel.stopSpin(this.resultSlots[i], machine.reelStopDelay * i)
    );
    setTimeout(
      () =>
        !gotFreeSpin && this.emitter.emit(EVENTS.SPIN.KEY, EVENTS.SPIN.STOP), //enable hud buttons only when the result dont have freeSpin
      machine.reelStopDelay * (reel.reelsCount + 2)
    );
  }

  private removeAnimations(): void {
    //remove the highlighting lines
    this.graphicsArray?.forEach((graphics) => graphics.destroy());
    this.graphicsArray = [];

    //set slot scale to default
    this.reels.forEach((reel) =>
      reel.slots.forEach((slot) => {
        this.scene.tweens.killTweensOf(slot);
      })
    );
  }

  public setResultSlots(resultSlots: Array<Array<string>>) {
    this.resultSlots = resultSlots;
  }

  public animateWinLine(
    lines: { start?: number; length: number; line: string }[],
    rowIndex: number
  ): void {
    lines.forEach((line) => {
      let graphics = this.scene.add.graphics({
        lineStyle: { width: 5, color: 0xffffff },
      });
      this.graphicsArray.push(graphics);

      let offsetX = this.x - machine.width / 2 + 20;
      if (line?.line == 'partial' && line.start)
        offsetX = this.x - machine.width / 2 + 20 + reel.width * line.start;

      if (line?.line == 'full') {
        graphics.strokeRoundedRect(
          this.x - machine.width / 2 + 20,
          this.y - machine.height / 2 + 40 + reel.slotSize * rowIndex,
          reel.width * line.length - 40, //rect width
          200, //rect height
          5 //radius of rounded corners
        );
      } else {
        graphics.strokeRoundedRect(
          offsetX,
          this.y - machine.height / 2 + 40 + reel.slotSize * rowIndex,
          reel.width * line.length - 40,
          200,
          5
        );
      }

      //add tween for slots: Scale slots for line
      for (
        let reelIndex = line.start!;
        reelIndex < line.start! + line.length;
        reelIndex++
      ) {
        this.scaleSlot(reelIndex, rowIndex);
      }

      //add tween for win border line
      this.scene.tweens.add({
        targets: graphics,
        alpha: 0.5,
        ease: 'Linear',
        duration: 500,
        repeat: 5,
        yoyo: true,
        onComplete: () => graphics.destroy(),
      });
    });
  }

  public scaleSlot(reelIndex: number, rowIndex: number): void {
    const slot = this.reels[reelIndex].getSlottoScale(rowIndex);
    this.scene.tweens.add({
      targets: slot,
      scaleX: 1.5,
      scaleY: 1.4,
      yoyo: true,
      duration: 500,
      repeat: 5,
      ease: 'Linear',
    });
  }
}
