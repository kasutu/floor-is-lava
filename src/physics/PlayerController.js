/**
 * Applies input, friction and gravity to the player.
 * Depends only on an input abstraction exposing isHeld()/release().
 */
export class PlayerController {
  constructor(physics, input, { onJump = () => {} } = {}) {
    this.physics = physics;
    this.input = input;
    this.onJump = onJump;
  }

  update(player) {
    const p = this.physics;

    if (this.input.isHeld('up') && !player.isJumping && player.isOnFloor) {
      player.isJumping = true;
      player.velY = -p.movementSpeed * p.jumpHeight;
      this.input.release('up');
      this.onJump();
    }

    if (player.isJumping) {
      player.isOnFloor = false;
      player.isAirborne = true;
    }

    if (this.input.isHeld('left')) player.velX -= p.horizontalAcceleration;
    if (this.input.isHeld('right')) player.velX += p.horizontalAcceleration;

    if (player.isJumping || player.isAirborne) {
      player.velX *= p.airborneFriction;
    } else {
      player.velX *= p.friction;
      player.isAirborne = false;
    }

    player.velY += p.gravity;

    player.oldX = player.x;
    player.oldY = player.y;
    player.y += player.velY;
    player.x += player.velX;
  }
}
