class Bizerk {
  constructor(soundPlayer) {
    this.soundPlayer = soundPlayer;
  }

  bizerk() {
    const keys = Object.keys(this.soundPlayer.soundList);
    this.listCount = keys.length;
    keys.forEach(key => {
      const source = this.soundPlayer.play(key);
      source.onended = () => {
        this.soundEnded(key);
      };
    });

    const img0 = document.getElementById('img0');
    const img1 = document.getElementById('img1');
    const drum1 = document.getElementById('drum1');
    const drum2 = document.getElementById('drum2');
    const caption = document.getElementById('caption');
    const sal = document.getElementsByClassName('sal');
    const mic = document.getElementById('mic');
    const leftAdd1 = document.getElementsByClassName('left-add1');
    const leftAdd2 = document.getElementsByClassName('left-add2');
    const betterCall = document.getElementById('better-call');
    const header = document.getElementsByTagName('header')[0];

    img0.classList.add('bizerk');
    img1.classList.add('bizerk');

    drum1.classList.add('bizerk');
    drum2.classList.add('bizerk');

    mic.classList.add('bizerk');

    caption.classList.add('bizerk');

    betterCall.classList.add('bizerk');

    for (let i = 0; i < sal.length; i++) {
      sal[i].classList.add('bizerk');
    }

    for (let i = 0; i < leftAdd1.length; i++) {
      leftAdd1[i].classList.add('bizerk');
    }

    for (let i = 0; i < leftAdd2.length; i++) {
      leftAdd2[i].classList.add('bizerk');
    }

    header.classList.add('bg');

    setTimeout(() => {
      document.body.className = 'bg';
    }, 250);
  }

  soundEnded(key) {
    setTimeout(() => {
      const source = this.soundPlayer.play(key);
      source.onended = () => {
        this.soundEnded(key);
      };
    }, Math.random() * 500);
  }
}

export default Bizerk;
