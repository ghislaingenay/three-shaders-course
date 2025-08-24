// precision mediump float;
// how precise can be a float
// highp / mediump / lowp
// varying float vRandom;
uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;


// highp => high performance but might not work on some device
// lowp => can create bug by lack of precision
void main() {
  vec4 textureColor = texture2D(uTexture, vUv); // texture2d returns vec4
  textureColor.rgb *= vElevation * 2.0 + 0.5; // make the waves more visible
  gl_FragColor = textureColor;
}