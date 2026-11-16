/** Cycles through vertical frames of a sprite sheet every N ticks. */
export class SpriteAnimation {
  constructor({ frameCount, ticksPerFrame, frameOffsetY = 0 }) {
    this.frameCount = frameCount;
    this.ticksPerFrame = ticksPerFrame;
    this.frameOffsetY = frameOffsetY;
    this.frameIndex = 0;
    this.counter = 0;
  }

  get frameY() {
    return this.frameOffsetY + this.frameIndex;
  }

  tick() {
    this.counter += 1;
    if (this.counter > this.ticksPerFrame) {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.counter = 0;
    }
  }
}
