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

    const soundCloudEmbed = document.getElementById('soundcloud');
    const img0 = document.getElementById('img0');
    const img1 = document.getElementById('img1');
    const drum1 = document.getElementById('drum1');
    const drum2 = document.getElementById('drum2');
    const caption = document.getElementById('caption');
    const sal = document.getElementById('sal');
    const mic = document.getElementById('mic');
    const leftAdd1 = document.getElementsByClassName('left-add1');
    const leftAdd2 = document.getElementsByClassName('left-add2');
    const betterCall = document.getElementById('better-call');
    const header = document.getElementsByTagName('header')[0];
    const middle = document.getElementsByClassName('middle')[0];

    soundCloudEmbed.src =
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/235645795&amp;auto_play=true';

    img0.className = 'img bizerk';
    drum2.className = 'bizerk';
    sal.className = 'bizerk';
    mic.className = 'bizerk';
    caption.className = 'bizerk';
    for (let i = 0; i < leftAdd1.length; i++) {
      leftAdd1[i].className = 'left-add left-add1 bizerk';
    }
    betterCall.className = 'bizerk';
    setTimeout(() => {
      drum1.className = 'bizerk';
      img1.className = 'img bizerk';
      for (let i = 0; i < leftAdd2.length; i++) {
        leftAdd2[i].className = 'left-add left-add2 bizerk';
      }
    }, 500);

    header.className = 'bg';
    setTimeout(() => {
      document.body.className = 'bg';
      setTimeout(() => {
        middle.className = 'eight columns middle bg';
      });
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
