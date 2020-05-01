import Emitter from 'es6-event-emitter';
import '../videos/videoPlayer.scss';
import { baseurl } from '../../utils';

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

  videoContainer.appendChild(videoItem);
  return videoContainer;
};

class Fitness extends Emitter {
  constructor() {
    super();
    this.fitnessCaption = document.getElementById('fitness-caption');
    this.videoContainer = document.getElementById('videos');
    this.soundPlayer = null;

    const request = new XMLHttpRequest();
    request.open('GET', `${baseurl}/videos.json?t=${new Date().getTime()}`);
    request.responseType = 'json';
    request.onload = () => {
      this.videos = request.response;
      const categoryRequest = new XMLHttpRequest();
      categoryRequest.open('GET', `${baseurl}/video-categories.json?t=${new Date().getTime()}`);
      categoryRequest.responseType = 'json';
      categoryRequest.onload = () => {
        this.videoCaptions = categoryRequest.response.categories;
        this.categoryMapping = categoryRequest.response.sounds;
        this.render(this.getAllVideo());
      };
      categoryRequest.send();
    };
    request.send();

  }

  init(soundPlayer) {
    this.soundPlayer = soundPlayer;
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
      if (selectedCat) this.soundPlayer.stop(this.categoryMapping[selectedCat]);
    } else {
      videos = this.videos[category];
      caption = this.videoCaptions[category];
      document.querySelectorAll(`[data-cat=${category}]`).forEach(elem => elem.classList.add('selected'));
      if (category !== selectedCat) {
        if (selectedCat) this.soundPlayer.stop(this.categoryMapping[selectedCat]);
        this.soundPlayer.play(this.categoryMapping[category], true);
      } else this.soundPlayer.toggle(this.categoryMapping[category]);
    }

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
    this.videoContainer.scrollTop =0;

    videos.forEach(v => {
      this.videoContainer.appendChild(createVideo(v));
    });

    document
      .querySelectorAll('.video-link')
      .forEach(v => v.addEventListener('click', () => this.soundPlayer.stopAll()));
  }
}

export default Fitness;
