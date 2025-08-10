import { Scene } from 'phaser';
import { EVENTS, machine, reel, screenHeight, screenWidth } from '../constants';
import Machine from '../classes/Machine';
import { EventDispatcher } from '../utils/eventDispatcher';
import { spinResult } from '../api/spinResult';
import { Hud } from '../classes/Hud';

export class Game extends Scene {
  protected background: Phaser.GameObjects.Image;
  protected machine: Machine;
  protected emitter: EventDispatcher;
  protected hud: Hud;
  private freeSpinImage: Phaser.GameObjects.Sprite;
  private winText: Phaser.GameObjects.Text;
  private goldBg: Phaser.GameObjects.Sprite;
  private freeSpinText: Phaser.GameObjects.Text | null;

  private remainingTime: number;
  private spinTimeoutId: number | null;
  private pauseTime: number;
  private winLines: {
    winLines: Array<
      Array<{ line: string; length: number; start: number; payout: number }>
    >;
    winSum: number;
    freeSpin: boolean;
  };
  private isSpinning: boolean = false;
  private spinResultTimeoutId: number;
  private freeSpinCounterStartTimeout: number;

  constructor() {
    super('Game');
    this.emitter = EventDispatcher.getInstance();
    this.emitter.on(EVENTS.SPIN.KEY, (param: string) => {
      if (param === EVENTS.SPIN.START) {
        this.runMachine();
      }
    });

    this.setupVisibilityChangeHandle();
  }

  private setupVisibilityChangeHandle(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        //on Game loosing focus
        if (this.spinTimeoutId) {
          clearTimeout(this.spinTimeoutId);
          this.spinTimeoutId = null;
          this.pauseTime = Date.now();
        }
      } else {
        //on Game regaining focus
        if (this.remainingTime > 0 && this.isSpinning) {
          const elapsedTime = Date.now() - this.pauseTime;
          this.remainingTime = Math.max(0, this.remainingTime - elapsedTime);

          if (this.remainingTime > 0) {
            this.spinTimeoutId = this.setSpinTimeout(this.remainingTime);
          } else {
            setTimeout(() => this.finishSpin(), 3000);
          }
        }
      }
    });
  }

  public create(): void {
    this.background = this.add
      .image(screenWidth / 2, screenHeight / 2, 'baseBg')
      .setOrigin(0.5);
    this.background.setAlpha(1);

    this.addMachine();
    this.addHud();
  }

  private addMachine(): void {
    this.machine = new Machine(this, screenWidth / 2, screenHeight / 2 - 50);
  }

  private addHud(): void {
    this.hud = new Hud(this, screenWidth / 2, screenHeight - 90);
  }

  private clearPreviousResults = () => {
    this.winText && this.winText.destroy();
    this.goldBg && this.goldBg.destroy();
    this.freeSpinImage && this.freeSpinImage.destroy();
    this.freeSpinText && this.freeSpinText.destroy();
  };

  private setSpinTimeout(delay: number): number {
    return setTimeout(() => {
      this.finishSpin();
    }, delay);
  }

  private finishSpin(): void {
    this.isSpinning = false;
    this.spinTimeoutId = null;
    this.animateResults(this.winLines?.winLines);

    this.hud.balanceComponent.updateBalance(this.winLines?.winSum);

    //send updated balance to operator
    const message = {
      type: 'spinResult',
      balance: this.hud.balanceComponent.balance,
    };
    window.parent.postMessage(message, 'http://localhost:5500');

    this.winLines?.winSum
      ? this.animateWinSum(this.winLines?.winSum)
      : this.hud.messageContainer.text.setText(`GOOD LUCK!`);
    this.spinResultTimeoutId = setTimeout(() => {
      if (this.winLines?.winSum && this.winLines?.freeSpin) {
        this.displayWinPopup(this.winLines?.winSum);
        this.freeSpinCounterStartTimeout = setTimeout(() => {
          this.winLines.freeSpin && this.freeSpinCounter();
        }, 1000);
        //setTimeout(() => this.freeSpin(), 4000);
      } else if (this.winLines?.winSum) {
        this.displayWinPopup(this.winLines?.winSum);
      } else if (this.winLines?.freeSpin) {
        this.freeSpinImage = this.add.sprite(
          screenWidth / 2,
          screenHeight / 2,
          'freeSpin'
        );
        this.freeSpinImage.setScale(0.1);
        this.tweens.add({
          targets: this.freeSpinImage,
          scaleX: 1,
          scaleY: 1,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            this.freeSpinImage && this.freeSpinImage.destroy();
            this.freeSpinCounter();
          },
        });
        //setTimeout(() => this.freeSpin(), 4000);
      }
    }, 1000);
  }

  private freeSpinCounter(): void {
    const startingText = this.add
      .text(screenWidth / 2, screenHeight / 2 - 100, 'Free Spin Starts in', {
        color: '#FFAD00',
        fontSize: '53px',
        fontFamily: 'Rammetto One',
      })
      .setOrigin(0.5)
      .setStroke('#642E7D', 14)
      .setShadow(0, 0, '#EE00FF', 14, true, true);
    const countdownFreeSpinText = this.add
      .text(screenWidth / 2, screenHeight / 2, '3', {
        color: '#FFAD00',
        fontSize: '116px',
        fontFamily: 'Rammetto One',
      })
      .setOrigin(0.5)
      .setScale(0.5)
      .setStroke('#642E7D', 14)
      .setShadow(0, 0, '#EE00FF', 10, true, true);
    this.tweens.add({
      targets: countdownFreeSpinText,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Linear',
    });

    const countdownTimeline = this.add.timeline([
      {
        at: 1100,
        run: () => countdownFreeSpinText.setScale(0.5).setText('2'),
        tween: {
          targets: countdownFreeSpinText,
          scaleX: 1,
          scaleY: 1,
          duration: 1000,
          ease: 'Linear',
        },
      },
      {
        at: 2200,
        run: () => countdownFreeSpinText.setScale(0.5).setText('1'),
        tween: {
          targets: countdownFreeSpinText,
          scaleX: 1,
          scaleY: 1,
          duration: 1000,
          ease: 'Linear',
        },
      },
      {
        at: 3600,
        run: () => {
          startingText.destroy();
          countdownFreeSpinText.destroy();
          this.freeSpin();
        },
      },
    ]);
    countdownTimeline.play();
  }

  private async runMachine(): Promise<void> {
    this.clearPreviousResults();
    clearTimeout(this.spinResultTimeoutId); //clear result display's timeouts
    clearTimeout(this.freeSpinCounterStartTimeout);

    const res = await spinResult(1, this.hud.betComponent.bet, false);
    //console.log(res);
    const { result, winLines } = res;
    this.winLines = winLines;

    this.machine.setResultSlots(result);
    this.machine.startSpin(winLines?.freeSpin);
    this.hud.messageContainer.text.setText(`GOOD LUCK!`);

    this.hud.balanceComponent.updateBalance(-this.hud.betComponent.bet);

    this.remainingTime =
      machine.stopDelay + machine.reelStopDelay * (reel.reelsCount + 2); //total spin duration
    this.isSpinning = true;
    this.spinTimeoutId = this.setSpinTimeout(this.remainingTime);
  }

  private async freeSpin(): Promise<void> {
    this.clearPreviousResults();

    const res = await spinResult(1, this.hud.betComponent.bet, true);
    //console.log(res);
    const { result, winLines } = res;
    this.winLines = winLines;
    this.machine.setResultSlots(result);

    this.machine.startSpin(false);
    this.hud.messageContainer.text.setText(`GOOD LUCK!`);

    this.remainingTime =
      machine.stopDelay + machine.reelStopDelay * (reel.reelsCount + 2); //total spin duration
    this.isSpinning = true;
    this.spinTimeoutId = this.setSpinTimeout(this.remainingTime);
  }

  private displayWinPopup(winSum: number): void {
    this.goldBg = this.add
      .sprite(screenWidth / 2, screenHeight / 2, 'goldBg')
      .setOrigin(0.5)
      .setScale(0.1);
    this.winText = this.add
      .text(screenWidth / 2, screenHeight / 2, `+ $${winSum}`, {
        color: '#FFAD00',
        fontSize: '106px',
        fontFamily: 'Rammetto One',
      })
      .setOrigin(0.5)
      .setScale(0.1)
      .setStroke('#642E7D', 8)
      .setShadow(0, 0, '#EE00FF', 8.5, true, true);

    //free spin + win amount
    this.freeSpinText = this.winLines.freeSpin
      ? this.add
          .text(screenWidth / 2, screenHeight / 2 - 110, 'FREE SPIN', {
            color: '#FFAD00',
            fontSize: '106px',
            fontFamily: 'Rammetto One',
          })
          .setOrigin(0.5)
          .setScale(0.1)
          .setStroke('#642E7D', 8)
          .setShadow(0, 0, '#EE00FF', 8.5, true, true)
      : null;

    // Tween to scale the win and free spin text from small to large
    this.tweens.add({
      targets: [this.winText, this.goldBg, this.freeSpinText],
      scaleX: 1, // Final scale in X direction
      scaleY: 1, // Final scale in Y direction
      duration: 1000, // 1 second duration for scaling up
      ease: 'Power2',
      onComplete: () => {
        this.winText && this.winText.destroy();
        this.goldBg && this.goldBg.destroy();
        this.freeSpinText && this.freeSpinText.destroy();
      },
    });

    // setTimeout(() => {
    //   this.winText && this.winText.destroy();
    //   this.goldBg && this.goldBg.destroy();
    // }, 3000);
  }

  private animateResults(
    winLines: {
      line: string;
      start: number;
      length: number;
      payout?: number;
    }[][]
  ): void {
    winLines.forEach((line, i) => {
      if (line !== null && line.length != 0) {
        this.machine.animateWinLine(line, i);
      }
    });
  }

  //animate win sum in message container
  private animateWinSum(winSum: number): void {
    const incrementDuration = 25;
    const increments = winSum;
    let currentSum = 0;

    this.tweens.addCounter({
      from: 0,
      to: winSum,
      duration: increments * incrementDuration,
      ease: 'Linear',
      onUpdate: (tween) => {
        currentSum = Math.floor(tween.getValue());
        this.hud.messageContainer.text.setText(`Win: $${currentSum}`);
      },
      onComplete: () => {
        this.hud.messageContainer.text.setText(`Win: $${winSum}`);
      },
    });
  }
}
