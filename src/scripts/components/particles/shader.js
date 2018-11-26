class ParticlesShader {
  static get shader () {
    return {
      vertex: require('./vert.glsl'),
      fragment: require('./frag.glsl')
    };
  }

  static get uniforms () {
    return {
      uTime: { value: 0 },
      texture: { value: null },
      limit: { value: 0 },
      uZoomMultiplyer: { value: 0 }
    };
  }
}

export default ParticlesShader;
