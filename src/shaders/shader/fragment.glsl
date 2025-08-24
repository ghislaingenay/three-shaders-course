precision mediump float;
// how precise can be a float
// highp / mediump / lowp
// varying float vRandom;

// highp => high performance but might not work on some device
// lowp => can create bug by lack of precision
void main() {
  gl_FragColor = vec4(1, 0, 0, 1.0);
}