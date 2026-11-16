/**
 * Fixed-timestep game loop.
 * Knows nothing about the game itself: it just calls `update` at a fixed rate
 * and `render` once per animation frame.
 */
export class GameLoop {
  constructor({
    stepMs,
    maxLagMs,
    update,
    render,
    requestFrame = (cb) => window.requestAnimationFrame(cb),
    cancelFrame = (id) => window.cancelAnimationFrame(id),
    now = () => performance.now(),
  }) {
    this.stepMs = stepMs;
    this.maxLagMs = maxLagMs;
    this.update = update;
    this.render = render;
    this.requestFrame = requestFrame;
    this.cancelFrame = cancelFrame;
    this.now = now;

    this.running = false;
    this.frameId = null;
    this.lastTime = 0;
    this.lag = 0;
    this.tick = this.tick.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    // reset timing so time spent paused/in menus isn't simulated
    this.lastTime = this.now();
    this.lag = 0;
    this.frameId = this.requestFrame(this.tick);
  }

  stop() {
    this.running = false;
    if (this.frameId !== null) this.cancelFrame(this.frameId);
    this.frameId = null;
  }

  tick(time) {
    if (!this.running) return;

    this.lag += Math.max(0, time - this.lastTime);
    this.lag = Math.min(this.lag, this.maxLagMs);
    this.lastTime = time;

    while (this.lag >= this.stepMs && this.running) {
      this.update();
      this.lag -= this.stepMs;
    }

    this.render();

    if (this.running) this.frameId = this.requestFrame(this.tick);
  }
}
