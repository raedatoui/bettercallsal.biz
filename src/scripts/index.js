import '../stylesheets/style.scss';

import Header from './components/header/header';
import VideoPlayer from './components/videos/videoPlayer';
import Fitness from './components/fitness/fitness';
import AudioBuffers from './components/audioBuffer';
import Nav from './components/nav/nav';
import Bizerk from './components/bizerk';
import Particles from './components/particles/particles';

(() => {
  const header = new Header();

  const videoPlayer = new VideoPlayer();

  const nav = new Nav();

  let bizerk;

  const particles = new Particles();
  const fitness = new Fitness();

  let particlesPlaying = false;
  let sounds;

  function onAudioLoad() {
    header.init(sounds);
    nav.init(sounds);
    bizerk = new Bizerk(sounds);
    header.on('nav:bizerk', () => {
      bizerk.bizerk();
      videoPlayer.bizerk();
    });
    nav.on('filter', category => {
      fitness.filter(category);
    });
  }

  sounds = new AudioBuffers(onAudioLoad);

  function init() {
    window.scroll(0, 0);
    videoPlayer.init();
    sounds.load();

    header.on('header:startGL', () => {
      if (!particlesPlaying) {
        particles.analyzer = sounds.analyzer;
        particles.play();
        particlesPlaying = true;
      }
    });
  }

  init();
})();
