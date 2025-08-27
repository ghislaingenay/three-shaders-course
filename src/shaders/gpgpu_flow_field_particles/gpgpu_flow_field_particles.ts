import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  clearColor: "#160920",
};

// Loaders
const textureLoader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particles.material.uniforms.uResolution.value.set(
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
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4.5, 4, 11);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#29191f";
renderer.setClearColor(debugObject.clearColor);

/**
 * Particles
 */
class Particles {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  points: THREE.Points;
  constructor() {
    this.geometry = new THREE.SphereGeometry(3);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio
          )
        ),
      },
    });
    this.points = new THREE.Points(particles.geometry, particles.material);
  }
}
const particles = new Particles();
scene.add(particles.points);

/**
 * Tweaks
 */
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
gui
  .add(particles.material.uniforms.uSize, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSize");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
