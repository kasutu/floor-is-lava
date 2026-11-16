/**
 * Maps the fixed logical world onto a canvas of any on-screen size.
 *
 * The canvas is sized to the largest rectangle with the world's aspect ratio
 * that fits its container (letterboxed), its backing store uses the device
 * pixel ratio for sharpness, and the context transform scales world units to
 * pixels. Game code keeps drawing in world coordinates and never sees the
 * real resolution.
 */
export class Viewport {
  constructor({ canvas, container, world, pixelArt = true, onResize = () => {} }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.container = container;
    this.world = world;
    this.pixelArt = pixelArt;
    this.onResize = onResize;
    this.scale = 1;
    this.resize = this.resize.bind(this);
  }

  attach() {
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(this.container);
    // catches devicePixelRatio changes (browser zoom, moving between monitors)
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  detach() {
    this.observer?.disconnect();
    window.removeEventListener('resize', this.resize);
  }

  availableSize() {
    const style = getComputedStyle(this.container);
    const canvasStyle = getComputedStyle(this.canvas);
    const px = (v) => Number.parseFloat(v) || 0;
    const borderX = px(canvasStyle.borderLeftWidth) + px(canvasStyle.borderRightWidth);
    const borderY = px(canvasStyle.borderTopWidth) + px(canvasStyle.borderBottomWidth);
    return {
      width: this.container.clientWidth - px(style.paddingLeft) - px(style.paddingRight) - borderX,
      height: this.container.clientHeight - px(style.paddingTop) - px(style.paddingBottom) - borderY,
    };
  }

  resize() {
    const { width: worldW, height: worldH } = this.world;
    const available = this.availableSize();
    this.scale = Math.max(0.1, Math.min(available.width / worldW, available.height / worldH));

    const cssW = Math.floor(worldW * this.scale);
    const cssH = Math.floor(worldH * this.scale);
    const dpr = window.devicePixelRatio || 1;

    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    // resizing the backing store clears it and resets context state
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);

    this.ctx.setTransform(this.canvas.width / worldW, 0, 0, this.canvas.height / worldH, 0, 0);
    this.ctx.imageSmoothingEnabled = !this.pixelArt;

    this.onResize();
  }

  /** Converts a client (mouse/touch) position to world coordinates. */
  toWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left - this.canvas.clientLeft) / this.canvas.clientWidth) * this.world.width,
      y: ((clientY - rect.top - this.canvas.clientTop) / this.canvas.clientHeight) * this.world.height,
    };
  }
}
