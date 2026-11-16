import { GameLoop } from './core/GameLoop.js';

const State = Object.freeze({
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  OVER: 'over',
});

/**
 * Orchestrates one game session. All collaborators are injected,
 * so each can be swapped or tested independently.
 */
export class Game {
  constructor({
    config,
    ctx,
    createPlayer,
    controllerFor,
    platforms,
    lava,
    background,
    collisions,
    score,
    highScores,
    hud,
    menu,
    sounds,
    debug,
  }) {
    this.config = config;
    this.ctx = ctx;
    this.createPlayer = createPlayer;
    this.controllerFor = controllerFor;
    this.platforms = platforms;
    this.lava = lava;
    this.background = background;
    this.collisions = collisions;
    this.score = score;
    this.highScores = highScores;
    this.hud = hud;
    this.menu = menu;
    this.sounds = sounds;
    this.debug = debug;

    this.player = createPlayer();
    this.controller = controllerFor(() => this.sounds.jump.playFromStart());
    this.state = State.READY;

    this.loop = new GameLoop({
      ...config.loop,
      update: () => this.update(),
      render: () => this.render(),
    });
  }

  get scores() {
    return { score: this.score.value, highScore: this.highScores.value };
  }

  /* ---------- state transitions ---------- */

  play() {
    if (this.state === State.RUNNING) return;
    if (this.state === State.OVER) this.reset();

    this.state = State.RUNNING;
    this.menu.hide();
    this.sounds.music.play();
    this.loop.start();
  }

  pause() {
    if (this.state !== State.RUNNING) return;
    this.state = State.PAUSED;
    this.loop.stop();
    this.sounds.music.stop();
    this.menu.show(this.scores);
  }

  togglePause() {
    if (this.state === State.RUNNING) this.pause();
    else if (this.state === State.PAUSED) this.play();
  }

  restart() {
    this.loop.stop();
    this.reset();
    this.state = State.READY;
    this.play();
  }

  gameOver() {
    this.state = State.OVER;
    this.loop.stop();
    this.sounds.music.stop();
    this.sounds.gameOver.playFromStart();
    this.menu.show(this.scores);
  }

  reset() {
    this.player = this.createPlayer();
    this.platforms.reset();
    this.score.reset();
    this.sounds.music.rewind();
  }

  resetHighScore() {
    this.highScores.reset();
    this.menu.setScores(this.scores);
  }

  /* ---------- simulation ---------- */

  update() {
    const { player } = this;

    this.controller.update(player);
    this.highScores.submit(this.score.value);

    this.collisions.constrainToWorld(player);
    for (const platform of this.platforms) {
      if (this.collisions.resolvePlatform(player, platform)) {
        this.score.add(this.config.scoring.pointsPerLanding);
      }
    }

    this.platforms.update(player, this.score.value);
    player.update();
    this.lava.update();

    if (this.lava.hasConsumed(player)) this.gameOver();
  }

  render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.background.draw(ctx);
    this.platforms.draw(ctx);
    this.player.draw(ctx);
    this.lava.draw(ctx);
    this.hud.draw(ctx, this.scores);
    this.debug.draw(ctx, { player: this.player, platforms: this.platforms });
  }

  /** Draws the idle screen shown before the first play. */
  renderIdle() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.background.draw(this.ctx);
  }
}
