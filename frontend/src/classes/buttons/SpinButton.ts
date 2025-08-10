import { EVENTS } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';

export class SpinButton extends Phaser.GameObjects.Image {
  private emitter: EventDispatcher;
  public scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'spin');
    this.scene = scene;
    this.setInteractive();
    this.emitter = EventDispatcher.getInstance();

    //handle spinning of reel and trigger event disable hud buttons
    this.emitter.on(EVENTS.SPIN.KEY, (param: string) => {
      switch (param) {
        case EVENTS.SPIN.START:
          this.emitter.emit(
            EVENTS.DISABLEHUDBUTTONS.KEY,
            EVENTS.DISABLEHUDBUTTONS.TRUE
          );
          break;
        case EVENTS.SPIN.STOP:
          this.emitter.emit(
            EVENTS.DISABLEHUDBUTTONS.KEY,
            EVENTS.DISABLEHUDBUTTONS.FALSE
          );
          break;
        default:
          break;
      }
    });

    //handle disabling spin
    this.emitter.on(EVENTS.DISABLESPIN.KEY, (params: string) => {
      switch (params) {
        case EVENTS.DISABLESPIN.TRUE:
          this.disableInteractive();
          this.setTexture('spinDisable');
          break;
        case EVENTS.DISABLESPIN.FALSE:
          this.setInteractive();
          this.setTexture('spin');
          break;
        default:
          break;
      }
    });
    this.on('pointerover', () => {
      this.setTexture('spinHover');
    });
    this.on('pointerout', () => {
      this.setTexture('spin');
    });
    this.on('pointerdown', () => {
      this.emitter.emit(EVENTS.SPIN.KEY, EVENTS.SPIN.START);
    });
  }
}
