import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

import atmosVertexShader from "./atmosphere/vertex.glsl";
import fragmentVertexShader from "./atmosphere/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Loaders
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

/**
 * Earth
 */

const earthParameters = {
  atmosphereDayColor: "#00aaff",
  atmosphereTwilightColor: "#ff6600",
};

// Textures
const earthDayTexture = textureLoader.load("/earth/earth/day.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;
const earthNightTexture = textureLoader.load("/earth/earth/night.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;

const earthSpecularCloudsTexture = textureLoader.load(
  "/earth/earth/specularClouds.jpg"
);
earthSpecularCloudsTexture.anisotropy = 8;
// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader,
  uniforms: {
    uDayTexture: new THREE.Uniform(earthDayTexture),
    uNightTexture: new THREE.Uniform(earthNightTexture),
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0.0, 0.0, 1.0)),
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereDayColor)
    ),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereTwilightColor)
    ),
    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
  },
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

gui.addColor(earthParameters, "atmosphereDayColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereDayColor
  );
});

gui.addColor(earthParameters, "atmosphereTwilightColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
    earthParameters.atmosphereTwilightColor
  );
});
/**
 * Sun
 */
const sunSpherical = new THREE.Spherical(1, Math.PI / 2, 0);
const sunDirection = new THREE.Vector3();

// Debug
const debugSun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
);
scene.add(debugSun);

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  transparent: true,
  vertexShader: atmosVertexShader,
  fragmentShader: fragmentVertexShader,
  uniforms: {
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereDayColor)
    ),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(earthParameters.atmosphereTwilightColor)
    ),
  },
});

gui.addColor(earthParameters, "atmosphereDayColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereDayColor
  );
  atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
    earthParameters.atmosphereDayColor
  );
});

gui.addColor(earthParameters, "atmosphereTwilightColor").onChange(() => {
  earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
    earthParameters.atmosphereTwilightColor
  );
  atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(
    earthParameters.atmosphereTwilightColor
  );
});
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.04, 1.04, 1.04);
scene.add(atmosphere);

const updateSun = () => {
  // Sun direction
  sunDirection.setFromSpherical(sunSpherical);

  // Debug
  debugSun.position.copy(sunDirection).multiplyScalar(5);

  // Link to uniforms
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
};

updateSun();

gui.add(sunSpherical, "phi").min(0).max(Math.PI).onChange(updateSun);

gui.add(sunSpherical, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);

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
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
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
renderer.setClearColor("#000011");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  earth.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
