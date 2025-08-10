export class SpeakerButton extends Phaser.GameObjects.Image {
  public scene: Phaser.Scene;
  private music:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'speakerOn');
    this.scene = scene;
    this.setInteractive();
    this.music = this.scene.sound.add('music', { loop: true });
    this.music.play();
    this.on('pointerdown', () => {
      this.toggleSound();
    });
  }

  private toggleSound() {
    if (this.texture.key === 'speakerOn') {
      this.setTexture('speakerOff');
      this.music.pause();
    } else {
      this.setTexture('speakerOn');
      this.music.play();
    }
  }
}
