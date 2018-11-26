import { ShaderMaterial, UniformsUtils, OrthographicCamera, Scene, Mesh, PlaneBufferGeometry } from 'three';

export class Pass {
  constructor () {
    // if set to true, the pass is processed by the composer
    this.enabled = true;

    // if set to true, the pass indicates to swap read and write buffer after rendering
    this.needsSwap = true;

    // if set to true, the pass clears its buffer before rendering
    this.clear = false;

    // if set to true, the result of the pass is rendered to screen
    this.renderToScreen = false;
  }

  setSize (width, height) {}

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    console.error('THREE.Pass: .render() must be implemented in derived pass.');
  }
}

export class MaskPass extends Pass {
  constructor (scene, camera) {
    super();

    this.scene = scene;
    this.camera = camera;

    this.clear = true;
    this.needsSwap = false;

    this.inverse = false;
  }

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    const context = renderer.context;
    const state = renderer.state;

    // don't update color or depth

    state.buffers.color.setMask(false);
    state.buffers.depth.setMask(false);

    // lock buffers

    state.buffers.color.setLocked(true);
    state.buffers.depth.setLocked(true);

    // set up stencil

    let writeValue;
    let clearValue;

    if (this.inverse) {
      writeValue = 0;
      clearValue = 1;
    } else {
      writeValue = 1;
      clearValue = 0;
    }

    state.buffers.stencil.setTest(true);
    state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
    state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
    state.buffers.stencil.setClear(clearValue);

    // draw into the stencil buffer

    renderer.render(this.scene, this.camera, readBuffer, this.clear);
    renderer.render(this.scene, this.camera, writeBuffer, this.clear);

    // unlock color and depth buffer for subsequent rendering

    state.buffers.color.setLocked(false);
    state.buffers.depth.setLocked(false);

    // only render where stencil is set to 1

    state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff); // draw if == 1
    state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
  }
}

export class ClearMaskPass extends Pass {
  constructor () {
    super();
    this.needsSwap = false;
  }

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    renderer.state.buffers.stencil.setTest(false);
  }
}

export class RenderPass extends Pass {
  constructor (scene, camera, overrideMaterial, clearColor, clearAlpha) {
    super();

    this.scene = scene;
    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;
    this.clearAlpha = clearAlpha !== undefined ? clearAlpha : 0;

    this.clear = true;
    this.needsSwap = false;
  }

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    this.scene.overrideMaterial = this.overrideMaterial;

    let oldClearColor;
    let oldClearAlpha;

    if (this.clearColor) {
      oldClearColor = renderer.getClearColor().getHex();
      oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor(this.clearColor, this.clearAlpha);
    }

    renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

    if (this.clearColor) {
      renderer.setClearColor(oldClearColor, oldClearAlpha);
    }

    this.scene.overrideMaterial = null;
    renderer.autoClear = oldAutoClear;
  }
}

export class ShaderPass extends Pass {
  constructor (shader, textureID) {
    super();
    this.textureID = textureID !== undefined ? textureID : 'tDiffuse';

    if (shader instanceof ShaderMaterial) {
      this.uniforms = shader.uniforms;

      this.material = shader;
    } else if (shader) {
      this.uniforms = UniformsUtils.clone(shader.uniforms);

      this.material = new ShaderMaterial({
        defines: shader.defines || {},
        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      });
    }

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();

    this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
    this.scene.add(this.quad);
  }

  render (renderer, writeBuffer, readBuffer, delta, maskActive) {
    if (this.uniforms[this.textureID]) {
      this.uniforms[this.textureID].value = readBuffer.texture;
    }

    this.quad.material = this.material;

    if (this.renderToScreen) {
      renderer.render(this.scene, this.camera);
    } else {
      renderer.render(this.scene, this.camera, writeBuffer, this.clear);
    }
  }
}
