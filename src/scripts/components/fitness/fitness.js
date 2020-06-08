import Emitter from 'es6-event-emitter';
import '../videos/videoPlayer.scss';
import { baseurl, loadJson } from '../../utils';
import CategoryPlayer from './player';

const createVideo = video => {
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('box');

  const videoItem = document.createElement('a');
  videoItem.href = `${baseurl}/videos/${video.file}`;
  videoItem.target = '_blank';
  videoItem.classList.add('video-link');

  const videoImage = document.createElement('img');
  videoImage.src = `${baseurl}/${video.image}`;
  videoItem.appendChild(videoImage);

  const videoTitle = document.createElement('div');
  videoTitle.classList.add('vid-title');
  videoTitle.innerHTML = video.title;
  videoItem.appendChild(videoTitle);

  const videoDuration = document.createElement('div');
  videoDuration.classList.add('vid-duration');
  const minutes = Math.floor(video.duration / 60.0);
  let seconds = (video.duration - minutes * 60.0).toFixed();
  if (seconds < 10) seconds = `0${seconds}`;
  videoDuration.innerHTML = `${minutes}:${seconds}`;
  videoItem.appendChild(videoDuration);

  videoContainer.appendChild(videoItem);
  return videoContainer;
};

class Fitness extends Emitter {
  constructor() {
    super();
    this.fitnessCaption = document.getElementById('fitness-caption');
    this.videoContainer = document.getElementById('videos');
    this.menu = document.getElementById('menu');
    this.mobileMenu = document.getElementById('mobile-menu');

    const soundList = {};
    loadJson('videos', data => {
      this.videos = data;
      loadJson('video-categories', data2 => {
        this.videosConfig = data2;
        Object.entries(data2).forEach(category => {
          this.menu.appendChild(this.createNavItem(category[0], category[1].name));
          this.mobileMenu.appendChild(this.createNavItem(category[0], category[1].name));
          soundList[category[0]] = {
            howl: null,
            file: `audio/${category[1].sound}.mp3`,
          };
        });
        this.soundPlayer = new CategoryPlayer(soundList);
        this.render(this.getAllVideo());
      });
    });
  }

  createNavItem(cat, name) {
    const navItem = document.createElement('div');
    navItem.classList.add('main-btn');
    navItem.dataset.cat = cat;
    navItem.innerHTML = name;
    navItem.addEventListener('click', event => {
      this.filter(event.target.dataset.cat);
    });
    return navItem;
  }

  getAllVideo() {
    let initialVideos = [];
    Object.keys(this.videos).forEach(v => {
      initialVideos = initialVideos.concat(this.videos[v]);
    });
    return initialVideos;
  }

  filter(category) {
    let videos;
    let caption;
    let selectedCat;

    const selected = document.querySelectorAll('.menu .main-btn.selected');
    if (selected.length) {
      selectedCat = selected[0].dataset.cat;
    }

    document.querySelectorAll('.main-btn').forEach(elem => elem.classList.remove('selected'));
    if (category === 'all') {
      videos = this.getAllVideo();
      caption = '';
    } else {
      videos = this.videos[category];
      caption = this.videosConfig[category].caption;
    }

    document.querySelectorAll(`[data-cat=${category}]`).forEach(elem => elem.classList.add('selected'));
    if (category !== selectedCat) {
      if (selectedCat) this.soundPlayer.pause();
      this.soundPlayer.play(category);
    } else this.soundPlayer.toggle();

    if (selectedCat === category) return;
    this.fitnessCaption.innerHTML = caption;
    this.render(videos);
  }

  render(videos) {
    let child = this.videoContainer.lastElementChild;
    while (child) {
      this.videoContainer.removeChild(child);
      child = this.videoContainer.lastElementChild;
    }
    this.videoContainer.scrollTop = 0;

    videos.forEach(v => {
      this.videoContainer.appendChild(createVideo(v));
    });

    document
      .querySelectorAll('.video-link')
      .forEach(v => v.addEventListener('click', () => this.soundPlayer.stopAll()));
  }

  bizerk() {
    Object.entries(this.videosConfig).forEach(category => this.soundPlayer.play(category[0], 0.5));
  }
}

export default Fitness;
