/** Draws one frame of a sprite sheet into a destination rectangle. */
export const drawSpriteFrame = (ctx, image, sprite, frameX, frameY, dest) => {
  ctx.drawImage(
    image,
    sprite.width * frameX,
    sprite.height * frameY,
    sprite.width,
    sprite.height,
    dest.x,
    dest.y,
    dest.width,
    dest.height
  );
};
