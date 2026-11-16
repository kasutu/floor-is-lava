/**
 * Translates raw keyboard events into game controls (held state)
 * and one-shot actions (callbacks). Bindings are injected from config.
 */
export class KeyboardInput {
  constructor({ controls, actions }, target = window) {
    this.target = target;
    this.controlByCode = KeyboardInput.invert(controls);
    this.actionByCode = KeyboardInput.invert(actions);
    this.state = Object.fromEntries(Object.keys(controls).map((c) => [c, false]));
    this.handlers = new Map();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  static invert(bindings) {
    const map = new Map();
    Object.entries(bindings).forEach(([name, codes]) => {
      codes.forEach((code) => map.set(code, name));
    });
    return map;
  }

  attach() {
    this.target.addEventListener('keydown', this.onKeyDown);
    this.target.addEventListener('keyup', this.onKeyUp);
  }

  detach() {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
  }

  onAction(name, handler) {
    this.handlers.set(name, handler);
  }

  isHeld(control) {
    return this.state[control];
  }

  /** Forget a held control until it is pressed again (e.g. one jump per press). */
  release(control) {
    this.state[control] = false;
  }

  onKeyDown(event) {
    const control = this.controlByCode.get(event.code);
    const action = this.actionByCode.get(event.code);
    if (control || action) event.preventDefault();

    if (control) this.state[control] = true;
    if (action && !event.repeat) this.handlers.get(action)?.();
  }

  onKeyUp(event) {
    const control = this.controlByCode.get(event.code);
    if (control) this.state[control] = false;
  }
}
