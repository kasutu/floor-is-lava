/** Optional visual debugging aids. Enable with CONFIG.debug.enabled. */
export class DebugRenderer {
  constructor(config, { width, height }) {
    this.config = config;
    this.width = width;
    this.height = height;
  }

  draw(ctx, { player, platforms }) {
    if (!this.config.enabled) return;
    this.drawBoundaries(ctx, player);
    for (const platform of platforms) {
      this.drawBoundaries(ctx, platform);
      this.drawTrack(ctx, player, platform);
    }
    this.drawPlayerData(ctx, player);
  }

  line(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // distance between two objects
  drawTrack(ctx, a, b) {
    this.line(
      ctx,
      a.x + a.width / 2,
      a.oldY + a.height,
      b.x + b.width / 2,
      b.oldY,
      this.config.trackColor
    );
  }

  // full-screen lines along an object's edges
  drawBoundaries(ctx, t) {
    const color = this.config.lineColor;
    const left = Math.trunc(t.x);
    const right = Math.trunc(t.x + t.width);
    const top = Math.trunc(t.y);
    const bottom = Math.trunc(t.y + t.height);
    this.line(ctx, left, 0, left, this.height, color);
    this.line(ctx, right, 0, right, this.height, color);
    this.line(ctx, 0, top, this.width, top, color);
    this.line(ctx, 0, bottom, this.width, bottom, color);
  }

  drawPlayerData(ctx, player) {
    const { font, color, dataX } = this.config;
    ctx.font = font;
    ctx.fillStyle = color;
    const rows = [
      `isAirborne: ${player.isAirborne}`,
      `isOnPlatform: ${player.isOnPlatform}`,
      `isUnder: ${player.isUnder}`,
      `isOutSide: ${player.isOutSide}`,
      `onFloor: ${player.isOnFloor}`,
      `isJumping: ${player.isJumping}`,
      `player: x: ${Math.trunc(player.x)} y: ${Math.trunc(player.y)}`,
      `CAN JUMP? ${!player.isJumping && player.isOnFloor}`,
    ];
    rows.forEach((text, i) => ctx.fillText(text, dataX, 20 * (i + 1)));
  }
}
