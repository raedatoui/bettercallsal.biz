import './header.scss';

import Emitter from 'es6-event-emitter';

class Header extends Emitter {
  constructor() {
    super();
    this.betterCallHeader = document.getElementById('better-call');
    this.lawBreakers = document.getElementById('law-breakers');
    this.mic = document.getElementById('mic');
    this.salImages = document.getElementsByClassName('img');
    this.leftImage = document.getElementById('img0');
    this.rightImage = document.getElementById('img1');
    this.soundPlayer = null;
  }

  init(soundPlayer) {
    this.soundPlayer = soundPlayer;
    this.betterCallHeader.addEventListener('click', () => {
      this.dance();
    });

    // TODO: move from header
    this.lawBreakers.addEventListener('click', () => {
      window.open('mailto:salltj@gmail.com');
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
    const sound = index === 1 ? 'airhorn' : 'airhorn2';
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
      this.soundPlayer.stop('airhorn');
    });

    this.leftImage.addEventListener('mouseleave', () => {
      this.soundPlayer.pause('airhorn2');
    });
  }

  dance() {
    document.body.scrollTop = 0;
    const ring = this.soundPlayer.play('phoneRing');

    ring.onended = () => {
      this.leftImage.className = 'img';
      this.rightImage.className = 'img';
      this.betterCallHeader.style.animation = '';
    };

    this.leftImage.className = 'img hover';
    this.rightImage.className = 'img hover';
    this.betterCallHeader.style.animation = 'neon1 3s linear';
  }
}
export default Header;
