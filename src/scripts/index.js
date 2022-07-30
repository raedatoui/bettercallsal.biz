import '../stylesheets/style.scss';

import Header from './components/header/header';
import VideoPlayer from './components/videos/videoPlayer';
import AudioBuffers from './components/audioBuffer';
import Nav from './components/nav/nav';
import Bizerk from './components/bizerk';
import Particles from './components/particles/particles';

(() => {
  const header = new Header();
  const nav = new Nav();
  const particles = new Particles();

  let bizerk;
  let sounds;
  let videoPlayer;
  const hard = document.getElementById('img0').classList.contains('hard');
  if (!hard) videoPlayer = new VideoPlayer();

  let particlesPlaying = false;

  function onAudioLoad() {
    header.init(sounds);
    nav.init(sounds);
    bizerk = new Bizerk(sounds);
    header.on('nav:bizerk', () => {
      bizerk.bizerk();
      if (videoPlayer) videoPlayer.bizerk();
    });
    nav.on('nav:testimonial', videoData => {
      console.log(videoData);
      if (videoPlayer) videoPlayer.playVideo(videoData);
    });
  }

  sounds = new AudioBuffers(onAudioLoad);

  function init() {
    window.scroll(0, 0);
    if (videoPlayer) videoPlayer.init();
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
