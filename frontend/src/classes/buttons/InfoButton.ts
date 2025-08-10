import { EVENTS, screenHeight, screenWidth } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';
import PayTable from '../hudComponents/PayTable';

export default class InfoButton extends Phaser.GameObjects.Image {
  private emitter: EventDispatcher;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'infoButton');
    this.setOrigin(0, 0.5);
    this.setInteractive();

    this.emitter = EventDispatcher.getInstance();

    const payTable = new PayTable(scene, screenWidth / 2, screenHeight / 2);
    payTable.setVisible(false);

    this.on('pointerover', () => {
      this.setTexture('infoButton');
    });

    this.on('pointerout', () => {
      this.setTexture('infoButtonHover');
    });

    this.on('pointerdown', () => {
      payTable.setVisible(true);
      this.emitter.emit(EVENTS.HUDVISIBILITY.KEY, EVENTS.HUDVISIBILITY.FALSE);
      this.emitter.emit(EVENTS.ANIMATION.KEY, EVENTS.ANIMATION.FALSE);
    });

    //disable info button
    this.emitter.on(EVENTS.DISABLEINFOBUTTON.KEY, (params: string) => {
      switch (params) {
        case EVENTS.DISABLEINFOBUTTON.TRUE:
          this.disableInteractive();
          this.setAlpha(0.5);
          break;
        case EVENTS.DISABLEINFOBUTTON.FALSE:
          this.setInteractive();
          this.setAlpha(1);
          break;
        default:
          this.setInteractive();
          this.setAlpha(1);
          break;
      }
    });
  }
}
