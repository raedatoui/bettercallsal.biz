import './header.scss';

import Emitter from 'es6-event-emitter';
import { SPINNNG_SAL } from '../../utils';

class Header extends Emitter {
  constructor() {
    super();
    this.betterCallHeader = document.getElementById('better-call');
    this.lawBreakers = document.getElementById('law-breakers');
    this.mic = document.getElementById('mic');
    this.salImages = document.getElementsByClassName('img');
    this.leftImage = document.getElementById('img0');
    this.rightImage = document.getElementById('img1');
    this.clickHere = document.getElementsByClassName('click-here')[0];
    this.soundPlayer = null;
  }

  init(soundPlayer) {
    this.soundPlayer = soundPlayer;
    this.betterCallHeader.addEventListener('click', () => {
      this.dance();
    });

    this.clickHere.addEventListener('click', () => {
      this.dance();
    });

    // TODO: move from header
    this.lawBreakers.addEventListener('click', () => {
      this.dance();
    });

    this.mic.addEventListener('click', () => {
      this.trigger('nav:bizerk');
      this.trigger('header:startGL');
    });

    for (let i = 0; i < this.salImages.length; i++) {
      this.salImages[i].classList.remove('start');
      this.salImages[i].classList.add('fadein');
    }

    setTimeout(() => {
      this.betterCallHeader.style.animation = 'neon1 3s linear';
      for (let i = 0; i < this.salImages.length; i++) {
        this.salImages[i].classList.add('hover');
        this.salImages[i].classList.remove('fadein');
      }
      setTimeout(() => {
        for (let i = 0; i < this.salImages.length; i++) {
          this.salImages[i].classList.remove('hover');
        }
        this.betterCallHeader.style.animation = '';
        this.setupAirHorns();
      }, 3000);
    }, 350);
  }

  playAirHorn(index) {
    const sound = index === 1 ? SPINNNG_SAL : `${SPINNNG_SAL}2`;
    this.soundPlayer.play(sound);
  }

  setupAirHorns() {
    for (let i = 0; i < this.salImages.length; i++) {
      ['mouseenter', 'click'].forEach(action => {
        this.salImages[i].addEventListener(action, () => {
          this.playAirHorn(i);
        });
      });
    }

    this.rightImage.addEventListener('mouseleave', () => {
      this.soundPlayer.stop(SPINNNG_SAL);
    });

    this.leftImage.addEventListener('mouseleave', () => {
      this.soundPlayer.pause(`${SPINNNG_SAL}2`);
    });
  }

  dance() {
    document.body.scrollTop = 0;
    const ring = this.soundPlayer.play('phoneRing');

    ring.onended = () => {
      this.leftImage.classList.remove('hover');
      this.rightImage.classList.remove('hover');
      this.betterCallHeader.style.animation = '';
    };

    this.leftImage.classList.add('hover');
    this.rightImage.classList.add('hover');
    this.betterCallHeader.style.animation = 'neon1 3s linear';
  }
}
export default Header;
