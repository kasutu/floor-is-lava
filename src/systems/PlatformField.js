import { Platform } from '../entities/Platform.js';

/** Owns the set of platforms: creates the first one, spawns, moves and culls them. */
export class PlatformField {
  constructor(config, canvasWidth, image, random = Math.random) {
    this.config = config;
    this.canvasWidth = canvasWidth;
    this.image = image;
    this.random = random;
    this.reset();
  }

  reset() {
    this.platforms = [this.createInitial()];
    this.spawnTimer = 0;
    this.spawnInterval = this.config.spawn.interval;
  }

  createInitial() {
    const { width, baseSpeed, initial } = this.config;
    return new Platform({
      x: Math.trunc(this.canvasWidth / 2 - width / 2),
      y: initial.y,
      config: this.config,
      image: this.image,
      speedFor: () => baseSpeed,
    });
  }

  createSpawned() {
    const { baseSpeed, scoreSpeedDivisor, spawn } = this.config;
    return new Platform({
      x: this.random() * (this.canvasWidth - spawn.horizontalMargin) + spawn.minX,
      y: spawn.y,
      config: this.config,
      image: this.image,
      speedFor: (score) => baseSpeed + score / scoreSpeedDivisor,
    });
  }

  update(player, score) {
    const { spawn } = this.config;

    this.spawnTimer += 1;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      // leave bigger gaps when the player is near the top
      this.spawnInterval =
        player.y < spawn.highPlayerThresholdY ? spawn.highPlayerInterval : spawn.interval;
      this.platforms.push(this.createSpawned());
    }

    this.platforms.forEach((platform) => platform.update(score));
    this.platforms = this.platforms.filter((platform) => platform.y <= spawn.despawnY);
  }

  draw(ctx) {
    this.platforms.forEach((platform) => platform.draw(ctx));
  }

  [Symbol.iterator]() {
    return this.platforms[Symbol.iterator]();
  }
}
