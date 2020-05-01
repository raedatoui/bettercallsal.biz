import './nav.scss';

import Emitter from 'es6-event-emitter';

class Nav extends Emitter {
  constructor() {
    super();
    this.soundPlayer = null;

    this.buttons = document.querySelectorAll('.menu .main-btn');
  }

  init(soundPlayer) {
    this.soundPlayer = soundPlayer;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].addEventListener('click', event => {
        this.trigger('filter', event.target.dataset.cat);
      });
    }
  }
}

export default Nav;
