import './videoPlayer.scss';

const onPlayerReady = event => {
  event.target.playVideo();
};

class VideoPlayer {
  constructor() {
    this.ytPlayer = null;
    this.scrollPosition = 0;
    this.prevScrollPosition = 0;
    this.scrollStep = 10;
    this.ytReady = false;
    this.vimeoPlayer = false;
    this.playerContainer = document.getElementById('player-container');
    this.stopButton = document.getElementById('stop-player');
    this.videoCopy = document.getElementById('vid-copy');
    this.bizerkMode = false;
    this.loop = false;
    this.contentData = [
      {
        project: 'Love Your Curls',
        role: 'Boom Operator',
        video: 'bSKRN3w0m1w',
      },
      {
        project: 'Like I Can',
        role: 'Playback Engineer',
        video: 'xeugznpGKPA',
      },
      {
        project: 'Good as Gold',
        role: 'Sound Mixer',
        video: 'X9Rsa_se_qs',
      },
      {
        project: "VH1's Black Ink Crew",
        role: 'Sound Mixer',
        video: '_V7R4b7BNbA',
      },
      {
        project: 'Empress Of: Google Play Music',
        role: 'Audio Engineer',
        video: 'hQfKtU2WROs',
      },
      {
        project: 'Milk Makeup Looks "Boho"',
        role: 'Sound Mixer',
        video: 'ttbH775Oy5A',
      },
      {
        project: 'Samsung',
        role: 'Sound Mixer',
        video: 'wYe3o_k7G1o',
      },
      {
        project: 'Edgar Allan Poe\'s "Berenice"',
        role: 'Sound Mixer',
        video: 'qL5I-2pPghc',
      },
      {
        project: 'Clash Royale: Elite Workout Tape (VHS)',
        role: 'Sound Mixer & Playback',
        video: 'XOWW0dYpCvA',
      },
      {
        project: 'An Interview with Dr. Paul Stoffels, Chief Scientific Officer of Johnson & Johnson',
        role: 'Sound Mixer',
        video: 'W-OSoQr8_9s',
      },
      {
        project: 'DRAM - Google Play Live at the Milk Jam Room',
        role: 'Sound Mixer',
        video: 'LiJZlYqQPw0',
      },
      {
        project: 'Vogu  e',
        role: 'Sound Mixer & Voiceover',
        video: 209432689,
        type: 'vimeo',
      },
      {
        project: 'VICELAND Hate Thy Neighbor',
        role: 'Sound Mixer',
        video: 'c1sWR_vIrZo',
      },
      {
        project: 'WIRED',
        role: 'Sound Mixer',
        video: '5Pf19jV1NYw',
      },
      {
        project: 'ESPN',
        role: 'Sound Mixer',
        video: 'liTHLjkAWAI',
      },
      {
        project: 'Showtime',
        role: 'Sound Mixer',
        video: 'mk8kt15bX3Y',
      },
      {
        project: 'Pentatonix',
        role: 'Audio Engineer',
        video: 'yO9snUMvRuU',
      },
      {
        project: 'CNN Travel',
        role: 'Sound Mixer',
        video: 'vWz1rzsWUBQ',
      },
      {
        project: 'Lifetime',
        role: 'Sound Mixer',
        video: 275773497,
        type: 'vimeo',
      },
      {
        project: 'Complex',
        role: 'Sound Mixer',
        video: 'Ks66IcQK-Jc',
        startSeconds: 445,
      },
      {
        project: 'Rihanna Secret Show',
        role: 'Sound Mixer',
        video: 499203979,
        type: 'vimeo',
      },
      {
        project: 'Vanity Fair',
        role: 'Sound Mixer',
        video: 'LZJy2cBlho8',
      },
      {
        project: 'Ryuichi Sakamoto: Coda',
        role: 'Sound Mixer',
        video: 'Fl-pKw5n0mI',
      },
      {
        project: 'Vanity Fair',
        role: 'Sound Mixer',
        video: 'sitVNGixBn0',
      },
      {
        project: 'Audible',
        role: 'Sound Mixer',
        video: 264503259,
        type: 'vimeo',
      },
      {
        project: 'Xerox',
        role: 'Sound Mixer',
        video: 'Pzs-6UnsPJw',
      },
      {
        project: 'United',
        role: 'Sound Mixer',
        video: 'cyQ2impmcf4',
      },
      {
        project: 'Nas',
        role: 'Sound Mixer',
        video: 'HOJgralVcrs',
      },
      {
        project: 'Allure',
        role: 'Sound Mixer',
        video: 't4vMuinr50Q',
      },
      {
        project: 'Kendrick Lamar',
        role: 'Sound Mixer',
        video: 'Xhppc0wrw4Y',
      },
      {
        project: 'Sunset Park',
        role: 'Sound Editor',
        video: 'm6vjKL9aiK4',
      },
      {
        project: 'Fuse',
        role: 'Sound Mixer',
        video: 'qmBmQjvipQk',
      },
      {
        project: 'KITH',
        role: 'Sound Mixer',
        video: '720212116',
        type: 'vimeo',
      },
      {
        project: 'John Mayer',
        role: 'Sound Mixer',
        video: 'GP6ioc2Rx1k',
      },
      {
        project: 'Tidal',
        role: 'Sound Mixer',
        video: 'lnn7fHDtRPw',
      },
      {
        project: 'Ed Sheeran',
        role: 'Sound Mixer',
        video: 'IyfKR6QtTbA',
      },
      {
        project: 'Wired',
        role: 'Sound Mixer',
        video: 'sYSXyxEh8Sc',
      },
    ];
  }

  init() {
    window.onYouTubeIframeAPIReady = () => {
      this.ytReady = true;
    };

    const list = document.querySelectorAll('#videos .item');
    for (let i = 0, len = list.length; i < len; i++) {
      list[i].addEventListener('click', event => {
        const videoIndex = parseInt(event.currentTarget.dataset.index, 10);
        this.playVideo(this.contentData[videoIndex]);
      });
    }
    // TODO: replace this with hammer.js
    // $('#stop-player').on("tap", (event) => {
    //   this.stopVideo();
    // });
    this.stopButton.addEventListener('click', () => {
      this.stopVideo();
    });

    this.playerContainer.addEventListener('click', event => {
      if (event.target.className === 'video-container') {
        this.stopVideo();
      }
    });
  }

  animate() {
    const delta = Math.abs(window.scrollY - this.scrollPosition);
    this.scrollStep = delta / 10 > 100 ? delta / 10 : 120;
    if (delta < this.scrollStep || delta === 0) {
      window.scroll(0, this.scrollPosition);
      cancelAnimationFrame(this.animate);
    } else {
      let sign = 1;
      if (window.scrollY > this.scrollPosition) {
        sign = -1;
      }
      window.scroll(0, window.scrollY + sign * this.scrollStep);
      requestAnimationFrame(() => {
        this.animate();
      });
    }
  }

  playVideo(videoData) {
    this.loop = false;
    if (videoData.loop !== undefined) {
      this.loop = videoData.loop;
    }
    if (this.playerContainer.style.display === '' || this.playerContainer.style.display === 'none') {
      this.playerContainer.style.display = 'block';
      this.scrollPosition = 0;
      this.prevScrollPosition = window.scrollY;
      if (this.bizerkMode) {
        window.scroll(0, 0);
      } else {
        this.animate();
      }

      if (videoData.type !== undefined && videoData.type === 'vimeo') {
        this.ytPlayer = false;
        if (!this.vimeoPlayer) {
          // eslint-disable-next-line no-undef
          this.vimeoPlayer = new Vimeo.Player('player', {
            id: videoData.video,
            width: 640,
            autoplay: true,
            loop: true,
          });
        } else {
          this.vimeoPlayer.loadVideo(videoData.video);
        }
      } else {
        this.vimeoPlayer = false;
        const startSeconds = videoData.startSeconds || 0;
        if (!this.ytPlayer) {
          // eslint-disable-next-line no-undef
          this.ytPlayer = new YT.Player('player', {
            height: 480,
            width: 640,
            loop: 1,
            color: 'red',
            theme: 'light',
            videoId: videoData.video,
            startSeconds,
            events: {
              onReady: event => {
                onPlayerReady(event);
              },
              onStateChange: event => {
                this.onPlayerStateChange(event);
              },
            },
          });
        } else {
          this.ytPlayer.stopVideo();
          this.ytPlayer.loadVideoById({
            videoId: videoData.video,
            startSeconds,
          });
        }
      }

      this.videoCopy.innerHTML = `${videoData.role} : Salvatore Barra`;
    }
  }

  onPlayerStateChange(event) {
    // eslint-disable-next-line no-undef
    if (event.data === YT.PlayerState.ENDED) {
      if (this.bizerkMode) {
        const index = Math.floor(Math.random() * this.contentData.length);
        if (this.contentData[index].type === undefined) this.ytPlayer.loadVideoById(this.contentData[index].video);
      } else if (!this.loop) {
        this.stopVideo();
      } else {
        event.target.playVideo();
      }
    }
  }

  bizerk() {
    this.stopButton.style.display = 'none';
    this.bizerkMode = true;
    const index = Math.floor(Math.random() * this.contentData.length);
    this.playVideo(this.contentData[index]);
  }

  stopVideo() {
    if (this.ytPlayer) {
      this.ytPlayer.destroy();
      this.ytPlayer = false;
    }
    if (this.vimeoPlayer) {
      this.vimeoPlayer.pause();
      this.vimeoPlayer.destroy();
      this.vimeoPlayer = false;
    }
    this.playerContainer.style.display = 'none';
    this.scrollPosition = this.prevScrollPosition;
    this.scrollStep = 4;
    this.animate();
  }
}

export default VideoPlayer;
