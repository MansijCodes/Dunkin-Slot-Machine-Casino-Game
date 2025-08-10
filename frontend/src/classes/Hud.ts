import { EVENTS, hud } from '../constants';
import { EventDispatcher } from '../utils/eventDispatcher';
import Balance from './hudComponents/Balance';
import Bet from './hudComponents/Bet';
import InfoButton from './buttons/InfoButton';
import { SpeakerButton } from './buttons/SpeakerButton';
import { SpinButton } from './buttons/SpinButton';
import Message from './hudComponents/Message';
import QuestionButton from './buttons/QuestionButton';

export class Hud extends Phaser.GameObjects.Container {
  private emitter: EventDispatcher;
  public spinButton: SpinButton;
  public betComponent: Bet;
  public balanceComponent: Balance;
  public messageContainer: Message;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    scene.add.existing(this);
    this.createHudComponents();

    //handle visibility of hud
    this.emitter = EventDispatcher.getInstance();
    this.emitter.on(EVENTS.HUDVISIBILITY.KEY, (param: string) => {
      switch (param) {
        case EVENTS.HUDVISIBILITY.TRUE:
          this.setVisible(true);
          break;
        case EVENTS.HUDVISIBILITY.FALSE:
          this.setVisible(false);
          break;
        default:
          this.setVisible(true);
          break;
      }
    });

    //handle disability of hud buttons
    this.emitter.on(EVENTS.DISABLEHUDBUTTONS.KEY, (param: string) => {
      switch (param) {
        case EVENTS.DISABLEHUDBUTTONS.TRUE:
          this.emitter.emit(EVENTS.DISABLESPIN.KEY, EVENTS.DISABLESPIN.TRUE);
          this.emitter.emit(
            EVENTS.DISABLEBETBUTTON.KEY,
            EVENTS.DISABLEBETBUTTON.TRUE
          );
          this.emitter.emit(
            EVENTS.DISABLEINFOBUTTON.KEY,
            EVENTS.DISABLEINFOBUTTON.TRUE
          );
          break;
        case EVENTS.DISABLEHUDBUTTONS.FALSE:
          this.emitter.emit(EVENTS.DISABLESPIN.KEY, EVENTS.DISABLESPIN.FALSE);
          this.emitter.emit(
            EVENTS.DISABLEBETBUTTON.KEY,
            EVENTS.DISABLEBETBUTTON.FALSE
          );
          this.emitter.emit(
            EVENTS.DISABLEINFOBUTTON.KEY,
            EVENTS.DISABLEINFOBUTTON.FALSE
          );
          break;
      }
    });
  }

  private createHudComponents(): void {
    const img = this.scene.add.image(0, 0, 'hudBar');
    this.add(img);
    this.addSpin();
    this.addSpeaker();
    this.addMessage();
    this.addBalanceComponent();
    this.addBetComponent();
    this.addInfoButton();
    this.addQuestionButton();
    this.addLine();
  }

  private addSpin(): void {
    const spinBtnX = 480;
    const spinBtnY = 0;
    this.spinButton = new SpinButton(this.scene, spinBtnX, spinBtnY);
    this.add(this.spinButton);
  }

  private addSpeaker(): void {
    const speakerBtnX = 615;
    const speakerBtnY = 0;
    const speakerButton = new SpeakerButton(
      this.scene,
      speakerBtnX,
      speakerBtnY
    );
    this.add(speakerButton);
  }

  private addMessage(): void {
    this.messageContainer = new Message(this.scene, 150, 0);
    this.add(this.messageContainer);
  }

  private addBalanceComponent(): void {
    this.balanceComponent = new Balance(this.scene, -hud.width / 2 + 322, 0);
    this.add(this.balanceComponent);
  }

  private addBetComponent(): void {
    this.betComponent = new Bet(this.scene, -hud.width / 2 + 80, 0);
    this.add(this.betComponent);
  }

  private addInfoButton(): void {
    const infoButton = new InfoButton(this.scene, -hud.width / 2 + 10, 0);
    this.add(infoButton);
  }

  private addQuestionButton(): void {
    const questionButton = new QuestionButton(this.scene, 570, 0);
    this.add(questionButton);
  }

  private addLine(): void {
    const line = this.scene.add.image(593, 0, 'line');
    this.add(line);
  }
}
