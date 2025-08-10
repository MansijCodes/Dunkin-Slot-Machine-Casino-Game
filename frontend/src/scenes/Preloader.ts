import { Scene } from 'phaser';
import { screenHeight, screenWidth } from '../constants';
import WebFontFile from '../WebFontFile';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add
      .image(screenWidth / 2, screenHeight / 2, 'background')
      .setOrigin(0.5)
      .setScale(2);

    //  A simple progress bar. This is the outline of the bar.
    this.add
      .rectangle(screenWidth / 2, screenHeight / 2, 468, 32)
      .setStrokeStyle(1, 0xffffff)
      .setOrigin(0.5);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(
      screenWidth / 2 - 230,
      screenHeight / 2,
      4,
      28,
      0xffffff
    );

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');
    this.load.image('logo', 'logo.png');
    this.load.image('baseBg', 'baseBackgroundImage.png');
    this.load.image('slotMachine', 'slotMachine.png');
    this.load.image('mk', 'mk.png');
    this.load.image('bk', 'bk.png');
    this.load.image('cl', 'cl.png');
    this.load.image('ic', 'ic.png');
    this.load.image('sw', 'sw.png');
    this.load.image('spin', 'hud/spin.png');
    this.load.image('spinHover', 'hud/spinHover.png');
    this.load.image('spinDisable', 'hud/disableSpin.png');
    this.load.image('hudBar', 'hud/hudBar.png');
    this.load.image('speakerOn', 'hud/speaker-on.png');
    this.load.image('speakerOff', 'hud/speaker-off.png');
    this.load.audio('music', [
      'hud/audio/synthwavehouse.ogg',
      'hud/audio/synthwavehouse.wav',
    ]);
    this.load.image('messageComponent', 'hud/goodLuckComponent.png');
    this.load.image('balanceComponent', 'hud/balanceComponent.png');
    this.load.image('betComponent', 'hud/betComponent.png');
    this.load.image('infoButton', 'hud/infoButton.png');
    this.load.image('infoButtonHover', 'hud/infoButtonHover.png');
    this.load.image('minusButton', 'hud/minusButton.png');
    this.load.image('minusButtonHover', 'hud/minusButtonHover.png');
    this.load.image('plusButton', 'hud/plusButton.png');
    this.load.image('plusButtonHover', 'hud/plusButtonHover.png');
    this.load.image('questionButton', 'hud/question.png');
    this.load.image('line', 'hud/line.png');
    this.load.image('payTable', 'paytable.png');
    this.load.image('backButton', 'backButton.png');
    this.load.image('freeSpin', 'freeSpin.png');
    this.load.image('goldBg', 'goldBg.png');

    this.load.addFile(new WebFontFile(this.load, 'Rammetto One'));
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('Game');
  }
}
