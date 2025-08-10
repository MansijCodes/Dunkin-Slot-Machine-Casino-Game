import { screenHeight, screenWidth } from './constants';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

/*
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://localhost:5500') {
    return;
  }
  if (event.data.type === 'authenticate') {
    console.log('Authentication token received:', event.data.token);
  }
});
const message = {
  type: 'game-event',
  data: 'player-scored',
  score: 100,
};
window.parent.postMessage(message, 'http://localhost:5500');
*/

export default new Game(config);
