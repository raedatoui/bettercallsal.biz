import '../stylesheets/style.scss';

import Header from './components/header/header';
import VideoPlayer from './components/videos/videoPlayer';
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

  let particlesPlaying = false;

  const sounds = new AudioBuffers(onAudioLoad);

  function onAudioLoad() {
    header.init(sounds);
    nav.init(sounds);
    bizerk = new Bizerk(sounds);
    header.on('nav:bizerk', () => {
      bizerk.bizerk();
      videoPlayer.bizerk();
    });
    nav.on('nav:testimonial', videoData => {
      videoPlayer.playVideo(videoData);
    });
  }

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
