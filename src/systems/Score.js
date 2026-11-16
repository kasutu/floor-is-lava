/** Current run's score. */
export class Score {
  constructor() {
    this.value = 0;
  }

  add(points) {
    this.value += points;
  }

  reset() {
    this.value = 0;
  }

  get whole() {
    return Math.trunc(this.value);
  }
}
