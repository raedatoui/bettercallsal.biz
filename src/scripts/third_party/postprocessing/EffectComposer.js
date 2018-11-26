import { LinearFilter, RGBAFormat, WebGLRenderTarget } from 'three';
import { CopyShader } from '../shaders/Shader';
import { MaskPass, ClearMaskPass, ShaderPass } from './Pass';

export class EffectComposer {
  constructor(renderer, renderTarget) {
    this.renderer = renderer;

    if (renderTarget === undefined) {
      const parameters = {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        stencilBuffer: false,
      };
      const size = renderer.getSize();
      renderTarget = new WebGLRenderTarget(size.width, size.height, parameters);
    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    if (CopyShader === undefined) console.error('EffectComposer relies on CopyShader');

    this.copyPass = new ShaderPass(CopyShader);
  }

  swapBuffers() {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  }

  addPass(pass) {
    this.passes.push(pass);

    const size = this.renderer.getSize();
    pass.setSize(size.width, size.height);
  }

  insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
  }

  render(delta) {
    let maskActive = false;

    let pass;

    let i;

    const il = this.passes.length;

    for (i = 0; i < il; i++) {
      pass = this.passes[i];

      if (pass.enabled === false) continue;

      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

      if (pass.needsSwap) {
        if (maskActive) {
          const context = this.renderer.context;

          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }

        this.swapBuffers();
      }

      if (MaskPass !== undefined) {
        if (pass instanceof MaskPass) {
          maskActive = true;
        } else if (pass instanceof ClearMaskPass) {
          maskActive = false;
        }
      }
    }
  }

  reset(renderTarget) {
    if (renderTarget === undefined) {
      const size = this.renderer.getSize();

      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize(size.width, size.height);
    }

    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  }

  setSize(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(width, height);
    }
  }
}
