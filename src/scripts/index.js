import '../stylesheets/style.scss';

import Header from './components/header/header';
import Fitness from './components/fitness/fitness';
import AudioBuffers from './components/audioBuffer';
import Nav from './components/nav/nav';
import Bizerk from './components/bizerk';
import Particles from './components/particles/particles';

let bizerk;
let particlesPlaying = false;
let sounds;

const header = new Header();
const nav = new Nav();
const particles = new Particles();
const fitness = new Fitness();

function onAudioLoad() {
  header.init(sounds);
  nav.init(sounds);
  // fitness.init(sounds);
  bizerk = new Bizerk(sounds);
  header.on('nav:bizerk', () => {
    bizerk.bizerk();
    fitness.bizerk();
  });
  nav.on('filter', category => {
    fitness.filter(category);
  });
}

function init() {
  window.scroll(0, 0);
  sounds.load();

  header.on('header:startGL', () => {
    if (!particlesPlaying) {
      particles.analyzer = sounds.analyzer;
      particles.play();
      particlesPlaying = true;
    }
  });
}

sounds = new AudioBuffers(onAudioLoad);
init();
