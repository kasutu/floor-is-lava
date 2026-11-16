import { SpriteAnimation } from '../graphics/SpriteAnimation.js';
import { drawSpriteFrame } from '../graphics/drawSpriteFrame.js';

/** Player state + its own drawing. Movement and collisions live in physics/. */
export class Player {
  constructor(config, canvasWidth, images) {
    this.config = config;
    this.images = images; // { left, right }

    this.width = config.size;
    this.height = config.size;
    this.x = Math.trunc(canvasWidth / 2 - config.size / 2);
    this.y = Math.trunc(config.spawnOffsetY - config.size / 2);
    this.oldX = 0;
    this.oldY = 0;
    this.velX = 0;
    this.velY = 0;

    this.isJumping = false;
    this.isOnFloor = false;
    this.isUnder = false;
    this.isOutSide = false;
    this.isOnPlatform = false;
    this.isAirborne = false;

    this.animation = new SpriteAnimation(config.sprite);
  }

  update() {
    this.animation.tick();
  }

  draw(ctx) {
    const image = this.velX > 0 ? this.images.right : this.images.left;
    drawSpriteFrame(ctx, image, this.config.sprite, this.config.sprite.frameX, this.animation.frameY, {
      x: Math.floor(this.x),
      y: Math.floor(this.y + this.config.drawOffsetY),
      width: this.width,
      height: this.height,
    });
  }
}
