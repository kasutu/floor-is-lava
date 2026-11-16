/** World-bounds and player/platform collision resolution. */
export class CollisionSystem {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
  }

  constrainToWorld(player) {
    // bottom border
    if (player.y + player.height >= this.height) {
      player.y = this.height - player.height;
      player.velY = 0;
      player.isOnFloor = true;
      player.isJumping = false;
      player.isAirborne = false;
    }

    // left border
    if (player.x <= 0) player.x = 0;

    // right border
    if (player.x + player.width >= this.width) {
      player.x = this.width - player.width;
    }
  }

  /**
   * Resolves a collision with one platform.
   * @returns {boolean} true if the player is standing on the platform this step
   */
  resolvePlatform(player, platform) {
    // is the player under the platform?
    player.isUnder =
      player.x >= platform.x &&
      player.x <= platform.x + platform.width &&
      player.y >= platform.y;

    // cliff detection
    if (
      player.x + player.width <= platform.x ||
      (player.x >= platform.x + platform.width && !player.isUnder)
    ) {
      player.isOnPlatform = false;
      player.isOutSide = true;
    } else if (!player.isUnder) {
      player.isOnPlatform = true;
      player.isOnFloor = true;
      player.isOutSide = false;
    } else {
      player.isOutSide = false;
    }

    if (player.isOutSide) return false;

    // landing: crossed the platform's top edge this step
    if (
      player.y + player.height > platform.y &&
      player.oldY + player.height <= platform.y
    ) {
      player.y = platform.y - player.height;
      player.velY = 0;
      player.isJumping = false;
      player.isAirborne = false;
      player.isOnFloor = true;
      player.isUnder = false;
      player.isOnPlatform = true;
      player.isOutSide = false;
      return true;
    }

    return false;
  }
}
