/** DOM overlay menu: shows scores and exposes button events. */
export class Menu {
  constructor(ids, doc = document) {
    this.root = doc.getElementById(ids.menuId);
    this.scoreEl = doc.getElementById(ids.scoreId);
    this.highScoreEl = doc.getElementById(ids.highScoreId);
    this.playButton = doc.getElementById(ids.playButtonId);
    this.pauseButton = doc.getElementById(ids.pauseButtonId);
    this.restartButton = doc.getElementById(ids.restartButtonId);
  }

  onPlay(handler) {
    this.playButton.addEventListener('click', handler);
  }

  onPause(handler) {
    this.pauseButton.addEventListener('click', handler);
  }

  onRestart(handler) {
    this.restartButton.addEventListener('click', handler);
  }

  setScores({ score, highScore }) {
    this.scoreEl.textContent = Math.trunc(score);
    this.highScoreEl.textContent = Math.trunc(highScore);
  }

  show(scores) {
    if (scores) this.setScores(scores);
    this.root.style.display = 'flex';
  }

  hide() {
    this.root.style.display = 'none';
    // drop focus so keyboard input doesn't re-trigger the last button
    document.activeElement?.blur?.();
  }
}
