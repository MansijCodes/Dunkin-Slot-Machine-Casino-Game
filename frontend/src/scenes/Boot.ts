import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    this.load.image('background', 'assets/bg.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
