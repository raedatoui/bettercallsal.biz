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
    this.hardHat = this.leftImage.classList.contains('hard');
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
      let className = 'img fadein';
      if (this.hardHat) className = 'img fadein hard';
      this.salImages[i].className = className;
    }

    setTimeout(() => {
      this.betterCallHeader.style.animation = 'neon1 3s linear';
      for (let i = 0; i < this.salImages.length; i++) {
        let className = 'img hover';
        if (this.hardHat) className = 'img hover hard';
        this.salImages[i].className = className;
      }
      setTimeout(() => {
        for (let i = 0; i < this.salImages.length; i++) {
          let className = 'img';
          if (this.hardHat) className = 'img hard';
          this.salImages[i].className = className;
        }
        this.betterCallHeader.style.animation = '';
        this.setupAirHorns();
      }, 3000);
    }, 350);
  }

  playAirHorn(index) {
    const f = this.hardHat ? 'truck' : 'airhorn';
    const sound = index === 1 ? f : `${f}2`;
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
      this.soundPlayer.stop(this.hardHat ? 'truck' : 'airhorn');
    });

    this.leftImage.addEventListener('mouseleave', () => {
      this.soundPlayer.pause(this.hardHat ? 'truck2' : 'airhorn2');
    });
  }

  dance() {
    document.body.scrollTop = 0;
    const ring = this.soundPlayer.play('phoneRing');

    ring.onended = () => {
      let className = 'img';
      if (this.hardHat) className = 'img hard';
      this.leftImage.className = className;
      this.rightImage.className = className;
      this.betterCallHeader.style.animation = '';
    };

    let className = 'img hover';
    if (this.hardHat) className = 'img hover hard';
    this.leftImage.className = className;
    this.rightImage.className = className;
    this.betterCallHeader.style.animation = 'neon1 3s linear';
  }
}
export default Header;
