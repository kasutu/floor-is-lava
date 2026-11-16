/** In-canvas score display. */
export class Hud {
  constructor(config) {
    this.config = config;
  }

  draw(ctx, { score, highScore }) {
    const { font, color, score: s, highScore: h } = this.config;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(`${s.label}: ${Math.trunc(score)}`, s.x, s.y);
    ctx.fillText(`${h.label}: ${Math.trunc(highScore)}`, h.x, h.y);
  }
}
