import domtoimage from 'dom-to-image';
import * as THREE from 'three';
import Detector from '../../third-party/Detector';

import { HorizontalBlurShader, VerticalBlurShader } from '../../third-party/shaders/Shader';
import EffectComposer from '../../third-party/postprocessing/EffectComposer';
import { RenderPass, ShaderPass } from '../../third-party/postprocessing/Pass';

import ParticlesShader from './shader';

class Particles {
  constructor() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.sphere = null;
    this.material = null;
    this.noise = [];

    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.radiusW = 960;
    this.radiusH = 960;
    this.material = null;

    this.startTime = 0;
    this.textDataUrl = null;
    this.container = null;
    this.limit = 0;
    this.zoomDivider = 1;

    this.image = null;

    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.resizeCbWrapper = null;
    this.container = document.getElementById('particles');
    this._analyzer = null;
  }

  set analyzer(fft) {
    this._analyzer = fft;
  }

  get analyzer() {
    return this._analyzer;
  }

  play() {
    document.getElementById('sc-artwork').style.display = 'block';
    domtoimage
      .toPng(document.body)
      .then(dataUrl => {
        const main = document.getElementById('main');
        main.style.opacity = '0.75';

        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          document.getElementById('particles').style.display = 'block';

          this.image = img;
          this.startTime = new Date().getTime();
          this.textDataUrl = img.src;
          this.WIDTH = img.width;
          this.HEIGHT = img.height;
          this.radiusW = img.width;
          this.radiusH = img.height;
          this.initParticles();
          this.addMouseHandler();
          this.animate();
        };
      })
      .catch(error => {
        console.error('oops, something went wrong!', error);
      });
  }

  noDownSampling() {
    const tot = this.radiusW * this.radiusH;
    const positions = new Float32Array(tot * 3);
    const texels = new Float32Array(tot * 2);
    const sizes = new Float32Array(tot);

    const vertex = new THREE.Vector3();
    const texel = new THREE.Vector2();

    // let stepW = (1/amount)*radiusW;
    // let stepH = (1/amount)*radiusH;

    for (let i = 0; i <= this.radiusH; i++) {
      for (let j = 0; j <= this.radiusW; j++) {
        const ind = j + (i - 1) * this.radiusW - 1;
        vertex.y = i - this.radiusH / 2;
        vertex.x = j - this.radiusW / 2;
        vertex.z = 0;
        // let ind = i*amount + j;
        vertex.toArray(positions, ind * 3);
        texel.y = i / this.radiusH;
        texel.x = j / this.radiusW;
        texel.toArray(texels, ind * 2);
        sizes[ind] = 1;
        // console.log(ind, vertex.x, vertex.y);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('texel', new THREE.BufferAttribute(texels, 2));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }

  downSampled() {
    const amount = 512; // 100000;

    const positions = new Float32Array(amount * amount * 3);
    const texels = new Float32Array(amount * amount * 2);
    const sizes = new Float32Array(amount * amount);

    const vertex = new THREE.Vector3();
    const texel = new THREE.Vector2();

    const stepW = (1 / amount) * this.radiusW;
    const stepH = (1 / amount) * this.radiusH;

    for (let i = 0; i < amount; i++) {
      for (let j = 0; j < amount; j++) {
        vertex.x = j * stepW - this.radiusW / 2;
        vertex.y = i * stepH - this.radiusH / 2;
        vertex.z = 0;
        const ind = i * amount + j;
        vertex.toArray(positions, ind * 3);
        texel.x = j / amount;
        texel.y = i / amount;
        texel.toArray(texels, ind * 2);
        sizes[ind] = 1;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('texel', new THREE.BufferAttribute(texels, 2));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }

  initParticles() {
    this.camera = new THREE.OrthographicCamera(
      this.WIDTH / -2,
      this.WIDTH / 2,
      this.HEIGHT / 2,
      this.HEIGHT / -2,
      -1,
      2
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();

    const geometry = this.downSampled();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        limit: { value: 0.0 },
        uZoomMultiplyer: { value: this.zoomDivider / new THREE.Vector3().distanceTo(this.camera.position) },
        texture: { value: new THREE.TextureLoader().load(this.textDataUrl) },
      },
      vertexShader: ParticlesShader.shader.vertex,
      fragmentShader: ParticlesShader.shader.fragment,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    this.sphere = new THREE.Points(geometry, this.material);
    this.scene.add(this.sphere);

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setClearColor(0x000000, 0);

    this.container.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);

    const mainPass = new RenderPass(this.scene, this.camera);
    // mainPass.renderToScreen = true;
    this.composer.addPass(mainPass);

    const hblur = new ShaderPass(HorizontalBlurShader);
    this.composer.addPass(hblur);

    const vblur = new ShaderPass(VerticalBlurShader);
    vblur.renderToScreen = true;
    this.composer.addPass(vblur);

    // wrapper for removing event listener on dispose
    this.resizeCbWrapper = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.resizeCbWrapper, false);
    document.getElementById('particles').style.animation = 'fadein 10s linear';
  }

  addMouseHandler() {
    document.addEventListener(
      'mousemove',
      e => {
        this.onMouseMove(e);
      },
      false
    );

    document.addEventListener(
      'mousedown',
      e => {
        this.onMouseDown(e);
      },
      false
    );

    document.addEventListener(
      'mouseup',
      e => {
        this.onMouseUp(e);
      },
      false
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    const time = new Date().getTime() - this.startTime;
    this.material.uniforms.uTime.value = time * 0.00000025;

    const data = new Uint8Array(this._analyzer.fftSize);
    this._analyzer.getByteFrequencyData(data);
    this.limit += 0.4;

    if (this.mouseDown) {
      if (this.limit <= 2.0) {
        this.limit += 0.4;
      }
    } else if (this.limit > 0) this.limit -= 0.01;

    this.material.uniforms.limit.value = this.limit;

    // sphere.rotation.z = 000000250 * time;

    const {
      geometry: { attributes },
    } = this.sphere;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 255.0;
      for (let j = 0; j < data.length; j++) {
        attributes.size.array[i * data.length + j] = v;
      }
    }
    attributes.size.needsUpdate = true;

    this.composer.render();
    // renderer.render( scene, camera );
  }

  onMouseMove(evt) {
    if (!this.mouseDown) {
      return;
    }

    evt.preventDefault();

    const deltaX = evt.clientX - this.mouseX;
    const deltaY = evt.clientY - this.mouseY;
    this.mouseX = deltaX;
    this.mouseY = deltaY;
  }

  onMouseDown(evt) {
    evt.preventDefault();
    this.mouseDown = true;
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
  }

  onMouseUp(evt) {
    evt.preventDefault();
    this.mouseDown = false;
  }
}

export default Particles;
