/** Fullscreen toggle for an element (with the WebKit-prefixed fallback). */
export class Fullscreen {
  constructor(element = document.documentElement, doc = document) {
    this.element = element;
    this.doc = doc;
  }

  get isActive() {
    return Boolean(this.doc.fullscreenElement || this.doc.webkitFullscreenElement);
  }

  enter() {
    const request = this.element.requestFullscreen || this.element.webkitRequestFullscreen;
    return request?.call(this.element)?.catch?.(() => {});
  }

  exit() {
    const exit = this.doc.exitFullscreen || this.doc.webkitExitFullscreen;
    return exit?.call(this.doc)?.catch?.(() => {});
  }

  toggle() {
    return this.isActive ? this.exit() : this.enter();
  }
}
