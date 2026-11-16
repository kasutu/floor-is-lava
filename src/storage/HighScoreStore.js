/** Persists the best score. Storage is injected (defaults to localStorage). */
export class HighScoreStore {
  constructor(key, storage = window.localStorage) {
    this.key = key;
    this.storage = storage;
    this.best = Number.parseInt(storage.getItem(key), 10) || 0;
  }

  get value() {
    return this.best;
  }

  submit(score) {
    const whole = Math.trunc(score);
    if (whole > this.best) {
      this.best = whole;
      this.storage.setItem(this.key, String(whole));
    }
  }

  reset() {
    this.best = 0;
    this.storage.setItem(this.key, '0');
  }
}
