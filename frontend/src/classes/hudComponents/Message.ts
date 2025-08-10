export default class Message extends Phaser.GameObjects.Container {
  public text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    const message = this.scene.add.sprite(0, 0, 'messageComponent');
    this.add(message);
    this.text = this.scene.add
      .text(0, 0, 'GOOD LUCK!', {
        color: '#ffffff',
        fontSize: '36px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.add(this.text);
  }
}
