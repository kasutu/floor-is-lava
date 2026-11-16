import { SpriteAnimation } from '../graphics/SpriteAnimation.js';
import { drawSpriteFrame } from '../graphics/drawSpriteFrame.js';

/** Animated lava strip along the bottom of the screen. */
export class Lava {
  constructor(config, image) {
    this.config = config;
    this.image = image;
    this.animation = new SpriteAnimation(config.sprite);
  }

  hasConsumed(entity) {
    return entity.y > this.config.deathY;
  }

  update() {
    this.animation.tick();
  }

  draw(ctx) {
    const { x, y, tileWidth, tileHeight, tileSpacing, tileCount, sprite } = this.config;
    for (let i = 0; i < tileCount; i += 1) {
      drawSpriteFrame(ctx, this.image, sprite, sprite.frameX, this.animation.frameY, {
        x: i * tileSpacing + Math.trunc(x),
        y: Math.trunc(y),
        width: tileWidth,
        height: tileHeight,
      });
    }
  }
}
