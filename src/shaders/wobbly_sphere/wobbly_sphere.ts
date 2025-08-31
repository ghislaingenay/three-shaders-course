import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { DRACOLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
  clearColor: "#160920",
  colorA: "#0000ff",
  colorB: "#ff0000",
};

// Loaders
const textureLoader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene();

// Loaders
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/src/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Environment map
 */
rgbeLoader.load("/wobbly_sphere/urban_alley_01_1k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Wobble
 */
// Material
const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),
  uWarpPositionFrequency: new THREE.Uniform(0.38),
  uWarpTimeFrequency: new THREE.Uniform(0.12),
  uWarpStrength: new THREE.Uniform(1.7),
  uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
  uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB)),
};

const material = new CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial>({
  baseMaterial: THREE.MeshPhysicalMaterial,
  // MeshPhysicalMaterial
  vertexShader,
  fragmentShader,
  metalness: 0,
  roughness: 0.5,
  color: "#ffffff",
  transmission: 0,
  ior: 1.5,
  thickness: 1.5,
  transparent: true,
  wireframe: false,
  uniforms,
});
const depthMaterial = new CustomShaderMaterial<typeof THREE.MeshDepthMaterial>({
  baseMaterial: THREE.MeshDepthMaterial,
  // MeshPhysicalMaterial
  vertexShader,
  uniforms,
  // fragmentShader,
  // encode the depth in all 4 channels instead of grayscale depth to improve the precision
  depthPacking: THREE.RGBADepthPacking,
});

// Tweaks
gui
  .add(uniforms.uPositionFrequency, "value", 0, 2, 0.001)
  .name("uPositionFrequency");
gui.add(uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("uTimeFrequency");
gui.add(uniforms.uStrength, "value", 0, 2, 0.001).name("uStrength");
gui
  .add(uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001)
  .name("uWarpPositionFrequency");
gui
  .add(uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001)
  .name("uWarpTimeFrequency");
gui.add(uniforms.uWarpStrength, "value", 0, 2, 0.001).name("uWarpStrength");
gui
  .addColor(debugObject, "colorA")
  .onChange(() => uniforms.uColorA.value.set(debugObject.colorA));
gui
  .addColor(debugObject, "colorB")
  .onChange(() => uniforms.uColorB.value.set(debugObject.colorB));
// Geometry
// let geometry = new THREE.IcosahedronGeometry(2.5, 50) as THREE.BufferGeometry;
// // merged vertices to get idnexed geometry
// geometry = mergeVertices(geometry);
// geometry.computeTangents();
// // Mesh
// const wobble = new THREE.Mesh(geometry, material);
// wobble.customDepthMaterial = depthMaterial;
// wobble.receiveShadow = true;
// wobble.castShadow = true;
// scene.add(wobble);

// Model
gltfLoader.load("/wobbly_sphere/suzanne.glb", (gltf) => {
  console.log("gltf", gltf);
  const wobble = gltf.scene.children[0] as unknown as THREE.Mesh;
  wobble.receiveShadow = true;
  wobble.castShadow = true;
  wobble.material = material;
  wobble.customDepthMaterial = depthMaterial;
  scene.add(wobble);
});

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
);
plane.receiveShadow = true;
plane.rotation.y = Math.PI;
plane.position.y = -5;
plane.position.z = 5;
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

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
camera.position.set(13, -3, -5);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Materials
  uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
