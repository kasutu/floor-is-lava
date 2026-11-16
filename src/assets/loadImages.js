const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve(image);
    };
    image.src = src;
  });

/** Loads every image in a name -> path map and resolves to name -> Image. */
export const loadImages = async (paths) => {
  const entries = await Promise.all(
    Object.entries(paths).map(async ([name, src]) => [name, await loadImage(src)])
  );
  return Object.fromEntries(entries);
};
