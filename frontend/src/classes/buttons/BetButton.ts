import { EVENTS } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';

export default class BetButton extends Phaser.GameObjects.Image {
  private emitter: EventDispatcher;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    defaultButtton: string,
    hover: string
  ) {
    super(scene, x, y, defaultButtton);
    this.setOrigin(0, 0.5);
    this.setInteractive();
    this.on('pointerover', () => {
      this.setTexture(hover);
    });
    this.on('pointerout', () => {
      this.setTexture(defaultButtton);
    });

    //disable bet buttons
    this.emitter = EventDispatcher.getInstance();
    this.emitter.on(EVENTS.DISABLEBETBUTTON.KEY, (params: string) => {
      switch (params) {
        case EVENTS.DISABLEBETBUTTON.TRUE:
          this.disableInteractive();
          this.setAlpha(0.5);
          break;
        case EVENTS.DISABLEBETBUTTON.FALSE:
          this.setInteractive();
          this.emitter.emit(
            EVENTS.UPDATEBETBUTTONSTATES.KEY,
            EVENTS.UPDATEBETBUTTONSTATES.TRUE
          ); //listened at Bet
          break;
        default:
          this.setInteractive();
          break;
      }
    });
  }
}
