// mat4 Each matrix will transform the 'position' until we get the final clip space coordinates
uniform mat4 projectionMatrix; // transform the coordinates into the clip spaca coordiantes
uniform mat4 viewMatrix; // apply transformations relative to the camera
uniform mat4 modelMatrix; // apply transformations relative to the Mesh (position, rotation, scale)
attribute vec3 position; // Get from geometry directly => BufferGeometry

attribute float aRandom; // take from shader.ts
// can combine view and modelMatrix with modelViewMatrix
// uniform mat4 modelViewMatrix;

// To apply a matrix, we multiply it

// varying float vRandom;

void main() {
  // Add the vertex positions to the render
  vec4 modelPosition = modelMatrix * vec4(position, 1.0); 

  // Separate the position to get the waves
  // modelPosition.z += sin(modelPosition.x * 20.0) * 0.1; // 20: spatial angualr frequency (k) - 0.1: Amplitude
  // modelPosition.z += aRandom * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // vRandom = aRandom;
}

// The w component encodes perspective.
// w varies with depth (generally proportional to -z in camera space), so dividing by w makes distant objects appear smaller.