/**
 * Central game configuration.
 *
 * Every tunable number, asset path, key binding and text style lives here so
 * that gameplay can be adjusted without touching any game logic.
 */

const deepFreeze = (obj) => {
  Object.values(obj).forEach((value) => {
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj);
};

export const CONFIG = deepFreeze({
  canvas: {
    selector: 'canvas',
    width: 1000,
    height: 500,
    background: 'black',
  },

  loop: {
    // fixed simulation step in ms
    stepMs: 13,
    // cap on accumulated lag so a long stall can't trigger thousands of steps
    maxLagMs: 250,
  },

  physics: {
    gravity: 0.7,
    friction: 0.85,
    airborneFriction: 0.92,
    horizontalAcceleration: 1.5,
    movementSpeed: 5.5,
    jumpHeight: 2.9,
  },

  player: {
    size: 32 * 1.8,
    // spawn above the screen so the player falls onto the first platform
    spawnOffsetY: -100,
    // sprite is drawn slightly lower than the hitbox
    drawOffsetY: 5,
    sprite: {
      width: 500,
      height: 500,
      frameX: 0,
      frameCount: 6,
      frameOffsetY: 0,
      ticksPerFrame: 15,
    },
  },

  platform: {
    width: 200,
    height: 200,
    baseSpeed: 1,
    // new platforms get faster as the score grows: speed + score / divisor
    scoreSpeedDivisor: 100,
    sprite: {
      width: 1000,
      height: 1000,
      frameX: 0,
      frameY: 0.29,
    },
    initial: {
      // centred horizontally, near the top of the screen
      y: 10,
    },
    spawn: {
      y: -80,
      minX: 15,
      // x is picked in [minX, canvasWidth - horizontalMargin + minX)
      horizontalMargin: 300,
      // platforms below this y are removed
      despawnY: 500,
      // frames between spawns
      interval: 90,
      // longer gap when the player has climbed close to the top
      highPlayerInterval: 175,
      highPlayerThresholdY: 100,
    },
  },

  lava: {
    x: 1,
    y: 470,
    tileWidth: 150,
    tileHeight: 50,
    tileSpacing: 50,
    tileCount: 18,
    // the player dies once their y passes this line
    deathY: 430,
    sprite: {
      width: 640,
      height: 480,
      frameX: 0,
      frameCount: 6,
      frameOffsetY: 0.33,
      ticksPerFrame: 15,
    },
  },

  background: {
    x: -1,
    y: -1,
    width: 1001,
    height: 501,
    sprite: {
      width: 720,
      height: 480,
      frameX: 0,
      frameY: 0,
    },
  },

  scoring: {
    // points earned for every simulation step spent landing on a platform
    pointsPerLanding: 0.05,
  },

  hud: {
    font: '20px monospace',
    color: 'white',
    score: { label: 'SCORE', x: 10, y: 30 },
    highScore: { label: 'HIGH SCORE', x: 10, y: 60 },
  },

  storage: {
    highScoreKey: 'highScore',
  },

  assets: {
    images: {
      playerLeft: './spriteSheet/Character_ghos_left.png',
      playerRight: './spriteSheet/Character_ghost_Right.png',
      lava: './spriteSheet/LavaSpritesheet.png',
      platform: './spriteSheet/Dirt_Lava_2.png',
      background: './spriteSheet/Background1.png',
    },
    sounds: {
      jump: { src: './SFX/jump.wav', loop: false },
      gameOver: { src: './SFX/gameOver.wav', loop: false },
      music: { src: './SFX/bgMusic.mp3', loop: true },
    },
  },

  // KeyboardEvent.code values
  input: {
    controls: {
      up: ['ArrowUp', 'KeyW', 'Space'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
    },
    actions: {
      pause: ['KeyP'],
      resetHighScore: ['KeyR'],
    },
  },

  ui: {
    menuId: 'mainMenu',
    scoreId: 'score',
    highScoreId: 'highScore',
    playButtonId: 'playButton',
    pauseButtonId: 'pauseButton',
    restartButtonId: 'restartButton',
  },

  debug: {
    enabled: false,
    font: '15px monospace',
    color: 'white',
    dataX: 800,
    lineColor: 'grey',
    trackColor: 'blue',
  },
});
