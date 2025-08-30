import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import halftoneVertexShader from "./vertex.glsl";
import halftoneFragmentShader from "./fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Loaders
// const textureLoader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene();

// Loaders
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
};
sizes.resolution = new THREE.Vector2(
  sizes.width * sizes.pixelRatio,
  sizes.height * sizes.pixelRatio
);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.x = 7;
camera.position.y = 7;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const rendererParameters = { clearColor: "#26132f" };

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

gui.addColor(rendererParameters, "clearColor").onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

/**
 * Material
 */
const materialParameters = {
  color: "#ff794d",
  pointColor: "#22001a",
};

const material = new THREE.ShaderMaterial({
  vertexShader: halftoneVertexShader,
  fragmentShader: halftoneFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    uPointColor: new THREE.Uniform(
      new THREE.Color(materialParameters.pointColor)
    ),
    uShadowRepetition: new THREE.Uniform(50.0),
    uResolution: new THREE.Uniform(sizes.resolution),
    uLow: new THREE.Uniform(-0.8),
    uHigh: new THREE.Uniform(1.5),
    uAlphaPoint: new THREE.Uniform(0.5),
    uHalfToneDirection: new THREE.Uniform(new THREE.Vector3(0.0, -1.0, 0.0)),
  },
});

gui.addColor(materialParameters, "color").onChange(() => {
  material.uniforms.uColor.value.set(materialParameters.color);
});

gui.addColor(materialParameters, "pointColor").onChange(() => {
  material.uniforms.uPointColor.value.set(materialParameters.pointColor);
});

gui
  .add(material.uniforms.uAlphaPoint, "value", 0.0, 1.0, 0.01)
  .name("alpha point");

gui
  .add(material.uniforms.uShadowRepetition, "value", 1.0, 100.0, 1.0)
  .name("grid repetition");

gui.add(material.uniforms.uLow, "value", -1.0, 1.0, 0.01).name("low");

gui.add(material.uniforms.uHigh, "value", -1.0, 2.0, 0.01).name("high");

gui
  .add(material.uniforms.uHalfToneDirection.value, "x", -1.0, 1.0, 0.01)
  .name("half-tone direction x");
gui
  .add(material.uniforms.uHalfToneDirection.value, "y", -1.0, 1.0, 0.01)
  .name("half-tone direction y");
gui
  .add(material.uniforms.uHalfToneDirection.value, "z", -1.0, 1.0, 0.01)
  .name("half-tone direction z");

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material
);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

// Suzanne
let suzanne: THREE.Group;
gltfLoader.load("./suzanne.glb", (gltf) => {
  suzanne = gltf.scene;
  suzanne.traverse((child) => {
    const childMesh = child as THREE.Mesh;
    if (childMesh.isMesh) childMesh.material = material;
  });
  scene.add(suzanne);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1;
    suzanne.rotation.y = elapsedTime * 0.2;
  }

  sphere.rotation.x = -elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.2;

  torusKnot.rotation.x = -elapsedTime * 0.1;
  torusKnot.rotation.y = elapsedTime * 0.2;

  // Update materials => update .value
  material.uniforms.uResolution.value = sizes.resolution;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
