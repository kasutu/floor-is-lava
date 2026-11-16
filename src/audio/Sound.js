/** Thin wrapper around an HTMLAudioElement. */
export class Sound {
  constructor({ src, loop = false }) {
    this.audio = new Audio(src);
    this.audio.preload = 'auto';
    this.audio.loop = loop;
  }

  play() {
    // browsers reject play() before user interaction; that's not fatal
    this.audio.play()?.catch(() => {});
  }

  playFromStart() {
    this.rewind();
    this.play();
  }

  stop() {
    this.audio.pause();
  }

  rewind() {
    this.audio.currentTime = 0;
  }
}

/** Builds a name -> Sound map from config. */
export const createSounds = (soundConfig) =>
  Object.fromEntries(
    Object.entries(soundConfig).map(([name, cfg]) => [name, new Sound(cfg)])
  );
