import { Howl, Howler } from 'howler';

class CategoryPlayer {
  constructor(playList) {
    this.playList = playList;
    this.category = null;
  }

  /**
   * Play a song in the playlist.
   * @param  {string} idx Index of the song in the playlist (leave empty to play the first or current).
   */
  play(category, volume=null) {
    let sound;
    const data = this.playList[category];

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
      // eslint-disable-next-line no-multi-assign
      sound = data.howl = new Howl({
        src: [data.file],
        volume: 1.0,
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        loop: true,
        onplay: () => {},
        onload: () => {},
        onend: () => {},
        onpause: () => {},
        onstop: () => {},
        onseek: () => {},
      });
    }
    // Begin playing the sound.
    sound.play();
    // Keep track of the index we are currently playing.
    this.category = category;
    if (volume)
      sound.volume(volume);
  }

  /**
   * Pause the currently playing track.
   */
  pause() {
    // Get the Howl we want to manipulate.
    const sound = this.playList[this.category].howl;
    // Pause the sound.
    sound.pause();
  }

  toggle() {
    const sound = this.playList[this.category].howl;
    if (sound.playing()) sound.pause();
    else sound.play();
  }

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume(val) {
    // Update the global volume (affecting all Howls).
    Howler.volume(val);
  }
}

export default CategoryPlayer;
