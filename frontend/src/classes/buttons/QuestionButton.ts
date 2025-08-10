import { EVENTS } from '../../constants';
import { EventDispatcher } from '../../utils/eventDispatcher';

export default class QuestionButton extends Phaser.GameObjects.Sprite {
  private emitter: EventDispatcher;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'questionButton');
    this.emitter = EventDispatcher.getInstance();

    // Create the info panel (hidden by default)
    const infoPanelHtml = `
    <div id="infoPanel" style="width: 1307px; height:855px; background:rgba(1,1,1,0.88); padding: 20px; border: 1px solid black; display:none; flex-direction:column; z-index:10; pointer-events:all; user-select:none;">
      <div style="display:flex; justify-content:end">
        <img id="closeButton" src="assets/closeButton.png" alt="close"/>
      </div>
      <div style="overflow-y: auto; color:#ffffff; font-size:1.125rem; padding:1.25rem;">
        <h1 style="color:#FFAD00;  font-size:1.5rem; font-weight:800">HOW TO PLAY</h2>
        <div style="display:flex; flex-direction:column; gap:2rem">
            <div >
              <h2 style="color:#FDE54A; font-size:1.25rem">PLAY MODE AND BALANCE</h2>
              <ul style="display:flex; flex-direction:column;gap:0.75rem;">
                <li>Your balance is seen in balance box</li>
                <li>You can choose to play 1 line or 3 line. </li>
              </ul>
            </div>
                
            <div>
              <h2 style=" color:#FDE54A; font-size:1.25rem">PLAYING DIFFERENT LINES</h2>
              <ul style="display:flex; flex-direction:column;gap:0.75rem;">
                <li>This game has 1 and 3 play lines, depending on the number of rows.</li>
                <li>The result of center row is evaluated if you play 1 line and all the row is evluated if you play 3 line. </li>
                <li>The BET is the line value multiplied by $1.</li>
                <li>To set the line, use the '-' and '+' buttons.</li>
              </ul>
            </div>
        </div>

        <h1 style="color:#FFAD00;  font-size:1.5rem; font-weight:800">PAYTABLE</h2>
        <div style="display:flex; flex-direction:column; gap:2rem">
            <div>
              <h2 style="color:#FDE54A; font-size:1.25rem">PAYOUTS</h2>
              <ul style="display:flex; flex-direction:column;gap:0.75rem;">
                <li>Winning combinations start from the leftmost reel and the symbols have to be consecutive along a payline.</li>
                <li>Only the highest win pays on each payline.</li>
              </ul>
            </div>
                
            <div>
              <h2 style=" color:#FDE54A; font-size:1.25rem">FREE GAMES</h2>
              <ul style="display:flex; flex-direction:column;gap:0.75rem;">
                <li>During FREE GAMES the reels are spun automatically using the same COIN value as per the spin that won the FREE GAMES.</li>
              </ul>
            </div>
        </div>
      </div>  
    </div>
   `;
    const infoPanel = this.scene.add
      .dom(300, 165)
      .createFromHTML(infoPanelHtml); //980, 610

    (infoPanel.getChildByID('closeButton') as HTMLElement).addEventListener(
      'click',
      () => {
        (infoPanel.getChildByID('infoPanel') as HTMLElement).style.display =
          'none';
        this.emitter.emit(
          EVENTS.DISABLEHUDBUTTONS.KEY,
          EVENTS.DISABLEHUDBUTTONS.FALSE
        );
      }
    );

    this.setInteractive();
    this.on('pointerdown', () => {
      (infoPanel.getChildByID('infoPanel') as HTMLElement).style.display =
        'flex';
      this.emitter.emit(
        EVENTS.DISABLEHUDBUTTONS.KEY,
        EVENTS.DISABLEHUDBUTTONS.TRUE
      );
    });
  }
}
