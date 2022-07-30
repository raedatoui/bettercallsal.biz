import * as utils from 'audio-buffer-utils';

class AudioBuffers {
  constructor(callback) {
    this.soundList = null;
    this.onload = callback;
    this.loadCount = 0;
    this.listCount = 0;
    this.context = null;
    this.analyzer = null;
    this.createContext();
    this.createUrlList();
  }

  createContext() {
    if (this.context === null) {
      const ContextClass =
        window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext;

      if (ContextClass) {
        this.context = new ContextClass();
      }
      if (this.context) {
        this.analyzer = this.context.createAnalyser();
        this.analyzer.fftSize = 1024;
      }
    }
  }

  createUrlList() {
    this.soundList = {
      airhorn: {
        url: '/audio/airhorn.wav',
        source: '',
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
      phoneRing: {
        url: '/audio/phone-ring.wav',
        source: null,
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
      salutations: {
        url: '/audio/salutations.wav',
        source: null,
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
      bettercallquick: {
        url: '/audio/bettercallquick.wav',
        source: null,
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
      truck: {
        url: '/audio/hard-horn.mp3',
        source: '',
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
      hardRing: {
        url: '/audio/hard-ring.mp3',
        source: '',
        buffer: null,
        startedAt: 0,
        pausedAt: 0,
      },
    };
  }

  load() {
    const keys = Object.keys(this.soundList);
    this.listCount = keys.length;
    keys.forEach(key => {
      this.loadBuffer(key, this.soundList[key]);
    });
  }

  loadBuffer(sound, obj) {
    // Load buffer asynchronously
    const request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.async = false;
    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      this.context.decodeAudioData(
        request.response,
        buffer => {
          if (!buffer) {
            console.error(`error decoding file data: ${obj.url}`);
            return;
          }

          this.soundList[sound].buffer = buffer;
          if (sound === 'airhorn') {
            this.soundList.airhorn2 = {
              source: '',
              buffer: utils.clone(buffer),
              startedAt: 0,
              pausedAt: 0,
            };
          }
          if (sound === 'truck') {
            this.soundList.truck2 = {
              source: '',
              buffer: utils.clone(buffer),
              startedAt: 0,
              pausedAt: 0,
            };
          }

          if (++this.loadCount === this.listCount) {
            this.onload();
          }
        },
        error => {
          console.error('decodeAudioData error', error);
        }
      );
    };
    request.onerror = () => {
      console.error('BufferLoader: XHR error');
    };
    request.open('GET', obj.url, true);
    request.send();
  }

  updateBuffers(buffers) {
    this.buffers = buffers;
  }

  getBuffers() {
    return this.buffers;
  }

  play(sound) {
    const obj = this.soundList[sound];
    const source = this.context.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = obj.buffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    // source.connect(this.context.destination);
    // connect analyser
    // connect them up into a chain
    source.connect(this.analyzer);
    this.analyzer.connect(this.context.destination);
    // start the source playing
    source.start(0, obj.pausedAt);
    obj.startedAt = this.context.currentTime - obj.pausedAt;
    obj.source = source;
    return source;
  }

  stop(sound) {
    const obj = this.soundList[sound];
    if (!obj.source) {
      console.warn('cant stop source!');
      return;
    }
    obj.source.disconnect();
    obj.source.stop(0);
    obj.startedAt = 0;
    obj.pausedAt = 0;
  }

  pause(sound) {
    const obj = this.soundList[sound];
    if (!obj.source) {
      console.warn('cant pause source!');
      return;
    }
    let elapsed = this.context.currentTime - obj.startedAt;
    this.stop(sound);
    if (elapsed > obj.buffer.duration) {
      elapsed = 0;
    }
    obj.pausedAt = elapsed;
  }
}

export default AudioBuffers;
