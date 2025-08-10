import { EVENTS } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';
import BetButton from '../buttons/BetButton';

export default class Bet extends Phaser.GameObjects.Container {
  public bet: number;
  private betText: Phaser.GameObjects.Text;
  private plusButton: BetButton;
  private minusButton: BetButton;
  private emitter: EventDispatcher;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    const container = this.scene.add
      .sprite(0, 0, 'betComponent')
      .setOrigin(0, 0.5);

    this.bet = 3;
    this.add(container);
    this.addMinus();
    this.addPlus();
    this.updateButtonState();
    this.addBetText();

    //update buttonStates
    this.emitter = EventDispatcher.getInstance();
    this.emitter.on(EVENTS.UPDATEBETBUTTONSTATES.KEY, (params: string) => {
      if (params === EVENTS.UPDATEBETBUTTONSTATES.TRUE) {
        this.updateButtonState();
      }
    });
  }

  private addMinus(): void {
    this.minusButton = new BetButton(
      this.scene,
      10,
      3,
      'minusButton',
      'minusButtonHover'
    );
    this.minusButton.on('pointerdown', () => {
      this.decreaseBet();
    });
    this.add(this.minusButton);
  }

  private addPlus(): void {
    this.plusButton = new BetButton(
      this.scene,
      177,
      3,
      'plusButton',
      'plusButtonHover'
    );
    this.plusButton.on('pointerdown', () => {
      this.increaseBet();
    });
    this.add(this.plusButton);
  }

  private addBetText(): void {
    const betTitle = this.scene.add
      .text(65, 0, 'LINES', {
        color: '#ffffff',
        fontSize: '22px',
        //fontFamily: 'Quicksand',
        fontStyle: 'bold',
        align: 'center,',
      })
      .setOrigin(0, 0.5);
    this.add(betTitle);
    this.betText = this.scene.add
      .text(140, 0, `${this.bet}`, {
        color: '#ffd200',
        fontSize: '22px',
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0, 0.5);
    this.add(this.betText);
  }

  private increaseBet(): void {
    this.bet = 3;
    this.updateBetText();
    this.updateButtonState();
  }
  private decreaseBet(): void {
    if (this.bet > 1) {
      this.bet = 1;
      this.updateBetText();
      this.updateButtonState();
    }
  }
  private updateBetText(): void {
    this.betText.setText(`${this.bet}`);
  }

  private updateButtonState(): void {
    if (this.bet == 1) {
      this.minusButton.disableInteractive();
      this.minusButton.setAlpha(0.5);
    } else {
      this.minusButton.setInteractive();
      this.minusButton.setAlpha(1);
    }

    if (this.bet == 3) {
      this.plusButton.disableInteractive();
      this.plusButton.setAlpha(0.5);
    } else {
      this.plusButton.setInteractive();
      this.plusButton.setAlpha(1);
    }
  }
}
