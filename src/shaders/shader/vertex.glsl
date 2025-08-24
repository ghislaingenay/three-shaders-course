// mat4 Each matrix will transform the 'position' until we get the final clip space coordinates
// uniform mat4 projectionMatrix; // transform the coordinates into the clip spaca coordiantes
// uniform mat4 viewMatrix; // apply transformations relative to the camera
// uniform mat4 modelMatrix; // apply transformations relative to the Mesh (position, rotation, scale)
// attribute vec3 position; // Get from geometry directly => BufferGeometry

uniform vec2 uFrequency;
uniform float uTime;
attribute float aRandom; // take from shader.ts
uniform vec3 uColor; // take from shader.ts
// can combine view and modelMatrix with modelViewMatrix
// uniform mat4 modelViewMatrix;

// attribute vec2 uv; // no need to use a becaause attrib ute already exisst in the material
varying vec2 vUv;
varying float vElevation;
// To apply a matrix, we multiply it

// varying float vRandom;

void main() {
  // Add the vertex positions to the render
  vec4 modelPosition = modelMatrix * vec4(position, 1.0); 

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  vElevation = elevation;
  // Separate the position to get the waves
  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;


  // vRandom = aRandom;
  vUv = uv;
}

// The w component encodes perspective.
// w varies with depth (generally proportional to -z in camera space), so dividing by w makes distant objects appear smaller.