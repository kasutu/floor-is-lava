import { drawSpriteFrame } from '../graphics/drawSpriteFrame.js';

/**
 * A falling platform.
 * `speedFor(score)` is injected so different platforms can move differently
 * without subclassing (the first platform ignores score, spawned ones don't).
 */
export class Platform {
  constructor({ x, y, config, image, speedFor }) {
    this.x = x;
    this.y = y;
    this.oldY = y;
    this.width = config.width;
    this.height = config.height;
    this.sprite = config.sprite;
    this.image = image;
    this.speedFor = speedFor;
  }

  update(score) {
    this.oldY = this.y;
    this.y += this.speedFor(score);
  }

  draw(ctx) {
    drawSpriteFrame(ctx, this.image, this.sprite, this.sprite.frameX, this.sprite.frameY, {
      x: Math.trunc(this.x),
      y: Math.trunc(this.y),
      width: this.width,
      height: this.height,
    });
  }
}
