import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { color, texture } from "three/tsl";
import { GroundedSkybox, Sky } from "three/examples/jsm/Addons.js";

const gui = new GUI();
// Loaders
const textureLoader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  pixelRatio: Math.min(window.devicePixelRatio, 2),
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
  sizes.resolution.set(sizes.width, sizes.height);

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
camera.position.set(1.5, 0, 6);
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

/**
 * Fireworks
 */
const createFirework = (
  count: number,
  position: THREE.Vector3,
  size: number,
  texture: THREE.Texture,
  radius: number,
  color: THREE.Color
) => {
  texture.flipY = false;
  // Geometry
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const timeMultipliersArray = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const spherical = new THREE.Spherical(
      radius,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );

    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;
    sizesArray[i] = Math.random();

    colors[i3] = new THREE.Color(color).r;
    colors[i3 + 1] = new THREE.Color(color).g;
    colors[i3 + 2] = new THREE.Color(color).b;
    timeMultipliersArray[i] = 1 + Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionsArray, 3)
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizesArray, 1)
  );
  geometry.setAttribute(
    "aTimeMultiplier",
    new THREE.Float32BufferAttribute(timeMultipliersArray, 1)
  );

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    transparent: true,
    depthWrite: false,
    fragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
  });
  const firework = new THREE.Points(geometry, material);
  firework.position.copy(position);
  scene.add(firework);

  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  };

  // Animation
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destroy,
  });
};

const textures = [
  textureLoader.load("/fireworks/particles/1.png"),
  textureLoader.load("/fireworks/particles/2.png"),
  textureLoader.load("/fireworks/particles/3.png"),
  textureLoader.load("/fireworks/particles/4.png"),
  textureLoader.load("/fireworks/particles/5.png"),
  textureLoader.load("/fireworks/particles/6.png"),
  textureLoader.load("/fireworks/particles/7.png"),
  textureLoader.load("/fireworks/particles/8.png"),
];

const parameters = {
  radius: 1,
  texture: 0,
  count: 500,
  size: 0.5,
  color: new THREE.Color("#8affff"),
};

const createFireworkFromParameters = (
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
) => {
  // handled in gsap animations
  // if (material) material.dispose();
  // firework && scene.remove(firework);
  // if (geometry) geometry.dispose();

  createFirework(
    parameters.count,
    position,
    parameters.size,
    textures[parameters.texture],
    parameters.radius,
    parameters.color
  );
};

const createRandomFirework = () => {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  const size = 0.1 + Math.random() * 0.1;
  const count = Math.round(400 + Math.random() * 1000);
  const textureIndex = Math.floor(Math.random() * textures.length);
  const texture = textures[textureIndex];
  const radius = 0.5 + Math.random();
  const position = new THREE.Vector3(x, y, z);
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1, 0.7);
  createFirework(count, position, size, texture, radius, color);
};

// window.addEventListener("click", (e) => {
//   const x = (e.clientX / sizes.width) * 2 - 1;
//   const y = -(e.clientY / sizes.height) * 2 + 1;
//   const vector = new THREE.Vector3(x, y, 0.5);
//   createFireworkFromParameters(vector);
// });
document.addEventListener("click", createRandomFirework);

// createFireworkFromParameters();

gui
  .add(parameters, "size", 0.01, 2)
  // .min(0.01)
  // .max(2)
  .step(0.05)
  .name("size")
  .onFinishChange(createFireworkFromParameters);

gui
  .add(parameters, "count", 100, 2000)
  .step(100)
  .name("count")
  .onFinishChange(() => {
    createFireworkFromParameters();
  });

gui
  .add(parameters, "radius", 0.1, 5)
  .step(0.1)
  .name("radius")
  .onFinishChange(createFireworkFromParameters);

gui
  .add(parameters, "texture", [0, 1, 2, 3, 4, 5, 6, 7])
  .name("texture")
  .onFinishChange(createFireworkFromParameters);

/**
 * Sky
 */

const sky = new Sky();
sky.scale.setScalar(450000);
const sun = new THREE.Vector3();

scene.add(sky);

const effectController = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.7,
  elevation: 2,
  azimuth: 180,
  exposure: renderer.toneMappingExposure,
};

function guiChanged() {
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = effectController.turbidity;
  uniforms["rayleigh"].value = effectController.rayleigh;
  uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms["sunPosition"].value.copy(sun);

  renderer.toneMappingExposure = effectController.exposure;
  renderer.render(scene, camera);
}

gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
gui
  .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
  .onChange(guiChanged);
gui
  .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
  .onChange(guiChanged);
gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);

guiChanged();

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
