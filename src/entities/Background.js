import { drawSpriteFrame } from '../graphics/drawSpriteFrame.js';

/** Static background image. */
export class Background {
  constructor(config, image) {
    this.config = config;
    this.image = image;
  }

  update() {}

  draw(ctx) {
    const { x, y, width, height, sprite } = this.config;
    drawSpriteFrame(ctx, this.image, sprite, sprite.frameX, sprite.frameY, {
      x: Math.trunc(x),
      y: Math.trunc(y),
      width,
      height,
    });
  }
}
