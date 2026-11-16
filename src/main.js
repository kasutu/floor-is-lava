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
import { Viewport } from './graphics/Viewport.js';
import { Fullscreen } from './ui/Fullscreen.js';

const main = async () => {
  const { display, world } = CONFIG;
  const { width, height } = world;

  const canvas = document.querySelector(display.canvasSelector);
  canvas.style.background = display.background;
  const viewport = new Viewport({
    canvas,
    container: document.querySelector(display.containerSelector),
    world,
    pixelArt: display.pixelArt,
  });
  const { ctx } = viewport;
  const fullscreen = new Fullscreen();

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
  input.onAction('toggleFullscreen', () => fullscreen.toggle());
  input.attach();

  menu.onPlay(() => game.play());
  menu.onPause(() => game.pause());
  menu.onRestart(() => game.restart());
  menu.onFullscreen(() => fullscreen.toggle());

  menu.setScores(game.scores);
  viewport.onResize = () => game.redraw();
  viewport.attach();
};

main();
