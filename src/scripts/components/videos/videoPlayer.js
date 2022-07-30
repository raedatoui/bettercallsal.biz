import './videoPlayer.scss';
import { loadExternalJson } from '../../utils';

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
    this.videoContainer = document.getElementById('videos');
    this.videoExtraCopy = document.getElementById('video-extra');
    this.bizerkMode = false;
    this.loop = false;
    this.contentData = [];
  }

  init() {
    window.onYouTubeIframeAPIReady = () => {
      this.ytReady = true;
    };

    loadExternalJson('https://storage.googleapis.com/bettercallsal.biz/bizwork.json', data => {
      this.contentData = data;

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

      this.contentData.forEach((v, i) => {
        this.createVideo(v, i);
      });
      const list = document.querySelectorAll('#videos .item');
      for (let i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener('click', event => {
          const videoIndex = parseInt(event.currentTarget.dataset.index, 10);
          this.playVideo(this.contentData[videoIndex]);
        });
      }
    });
  }

  createVideo(video, idx) {
    const projectContainer = document.createElement('div');
    projectContainer.classList.add('box');

    const videoItem = document.createElement('div');
    videoItem.classList.add('item');
    videoItem.classList.add('right');
    videoItem.dataset.index = idx;

    const videoImage = document.createElement('img');
    videoImage.src = `/images/videos/${video.image}`;
    videoItem.appendChild(videoImage);

    const videoTitle = document.createElement('div');
    videoTitle.classList.add('vid-title');
    videoTitle.innerHTML = video.project;
    videoItem.appendChild(videoTitle);

    projectContainer.appendChild(videoItem);
    this.videoContainer.appendChild(projectContainer);
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

      if (videoData.videoType === 'vimeo') {
        this.ytPlayer = false;
        if (!this.vimeoPlayer) {
          // eslint-disable-next-line no-undef
          this.vimeoPlayer = new Vimeo.Player('player', {
            id: videoData.videoId,
            width: 640,
            autoplay: true,
            loop: true,
          });
        } else {
          this.vimeoPlayer.loadVideo(videoData.videoId);
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
            videoId: videoData.videoId,
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
            videoId: videoData.videoId,
            startSeconds,
          });
        }
      }

      this.videoCopy.innerHTML = `${videoData.role} : Sal Barra`;
      if (videoData.views !== undefined)
        this.videoExtraCopy.innerHTML = `Views: ${videoData.views.toLocaleString('en-US')}`;
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
