/**
 * Composition root: builds every dependency from CONFIG and wires them together.
 */
import { CONFIG } from './config.js';
import { Game } from './Game.js';
import { loadImages } from './assets/loadImages.js';
import { createSounds } from './audio/Sound.js';
import { KeyboardInput } from './input/KeyboardInput.js';
import { HighScoreStore } from './storage/HighScoreStore.js';
import { Player } from './entities/Player.js';
import { Lava } from './entities/Lava.js';
import { Background } from './entities/Background.js';
import { PlayerController } from './physics/PlayerController.js';
import { CollisionSystem } from './physics/CollisionSystem.js';
import { PlatformField } from './systems/PlatformField.js';
import { Score } from './systems/Score.js';
import { Hud } from './ui/Hud.js';
import { Menu } from './ui/Menu.js';
import { DebugRenderer } from './debug/DebugRenderer.js';

const setupCanvas = ({ selector, width, height, background }) => {
  const canvas = document.querySelector(selector);
  canvas.width = width;
  canvas.height = height;
  canvas.style.background = background;
  return canvas.getContext('2d');
};

const main = async () => {
  const ctx = setupCanvas(CONFIG.canvas);
  const { width, height } = CONFIG.canvas;

  const images = await loadImages(CONFIG.assets.images);
  const sounds = createSounds(CONFIG.assets.sounds);

  const input = new KeyboardInput(CONFIG.input);
  const highScores = new HighScoreStore(CONFIG.storage.highScoreKey);
  const menu = new Menu(CONFIG.ui);

  const game = new Game({
    config: CONFIG,
    ctx,
    createPlayer: () =>
      new Player(CONFIG.player, width, { left: images.playerLeft, right: images.playerRight }),
    controllerFor: (onJump) => new PlayerController(CONFIG.physics, input, { onJump }),
    platforms: new PlatformField(CONFIG.platform, width, images.platform),
    lava: new Lava(CONFIG.lava, images.lava),
    background: new Background(CONFIG.background, images.background),
    collisions: new CollisionSystem({ width, height }),
    score: new Score(),
    highScores,
    hud: new Hud(CONFIG.hud),
    menu,
    sounds,
    debug: new DebugRenderer(CONFIG.debug, { width, height }),
  });

  input.onAction('pause', () => game.togglePause());
  input.onAction('resetHighScore', () => game.resetHighScore());
  input.attach();

  menu.onPlay(() => game.play());
  menu.onPause(() => game.pause());
  menu.onRestart(() => game.restart());

  menu.setScores(game.scores);
  game.renderIdle();
};

main();
