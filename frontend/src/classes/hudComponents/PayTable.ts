import { EVENTS, screenHeight, screenWidth } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';

export default class PayTable extends Phaser.GameObjects.Container {
  private emitter: EventDispatcher;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.emitter = EventDispatcher.getInstance();

    const bg = scene.add
      .rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.8)
      .setOrigin(0.5);
    this.add(bg);

    const payTable = this.scene.add.sprite(0, -50, 'payTable');
    this.add(payTable);

    const backButton = this.scene.add.sprite(
      screenWidth / 2 - 280,
      screenHeight / 2 - 80,
      'backButton'
    );
    backButton.setInteractive();
    this.add(backButton);
    backButton.on('pointerdown', () => {
      this.setVisible(false);
      this.emitter.emit(EVENTS.HUDVISIBILITY.KEY, EVENTS.HUDVISIBILITY.TRUE);
    });
  }
}
