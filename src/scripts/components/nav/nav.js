import './nav.scss';

import Emitter from 'es6-event-emitter';
import { elementCurrentStyle } from '../../utils';

class Nav extends Emitter {
  constructor() {
    super();
    this.soundPlayer;
    this.salutations = document.getElementsByClassName('salutations');
    this.buttons = document.querySelectorAll('.sidebar.left .main-btn');
    this.bizerkButtons = document.getElementsByClassName('main-btn bizerk');
    this.testimonialButtons = document.getElementsByClassName('left-add1');
    window.addEventListener('resize', () => {
      this.autoSizeText();
    });
    this.autoSizeText();
  }

  init(soundPlayer) {
    this.soundPlayer = soundPlayer;
    for (let i = 0; i < this.salutations.length; i++) {
      this.salutations[i].addEventListener('click', () => {
        this.soundPlayer.play('salutations');
      });
    }
    for (let i = 0; i < this.bizerkButtons.length; i++) {
      this.bizerkButtons[i].addEventListener('click', () => {
        this.trigger('nav:testimonial', {
          project: 'Office Webcam',
          role: 'Field Audio Seminar Host',
          video: 'wcvxuVmf2EA',
          loop: true,
        });
      });
    }

    for (let i = 0; i < this.testimonialButtons.length; i++) {
      this.testimonialButtons[i].addEventListener('click', () => {
        this.trigger('nav:testimonial', {
          project: 'Best Gig Ever',
          role: 'Total Professional',
          video: '01agkvzV7Jk',
        });
      });
    }
  }

  autoSizeText() {
    let el;
    let i;
    let len;
    let results;

    if (this.buttons.length < 0) {
      return;
    }
    results = [];
    for (i = 0, len = this.buttons.length; i < len; i++) {
      el = this.buttons[i];
      results.push(
        (function(el) {
          let resizeText;
          let results1;
          resizeText = function() {
            let elNewFontSize;
            const currentFontSize = elementCurrentStyle(el, 'font-size');
            elNewFontSize = `${parseInt(currentFontSize.slice(0, -2)) - 1}px`;
            el.style.fontSize = elNewFontSize;
          };

          while (el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight) {
            resizeText();
          }
          return results1;
        })(el)
      );
    }
    return results;
  }
}

export default Nav;
