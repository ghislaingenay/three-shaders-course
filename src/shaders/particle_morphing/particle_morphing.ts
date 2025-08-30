import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Particles from "./particles";

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
dracoLoader.setDecoderPath("/src/draco/");
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

let particles: Particles;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    );
  }

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
camera.position.set(0, 0, 8 * 2);
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

debugObject.clearColor = "#160920";
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
renderer.setClearColor(debugObject.clearColor);

/**
 * Particles
 */

gltfLoader.load("/particle_morphing/models.glb", (gltf) => {
  console.log(gltf);
  particles = new Particles(sizes);
  const positions = gltf.scene.children.map((child) => {
    const meshChild = child as unknown as THREE.Mesh;
    return meshChild.geometry.attributes.position;
  });
  // we are going to add values to the smallest ones so that they are all the size of the biggest one.
  particles.maxCount = 0;
  for (const position of positions) {
    if (position.count > particles.maxCount)
      particles.maxCount = position.count;
  }

  for (const position of positions) {
    const originalArray = position.array;
    const newArray = new Float32Array(particles.maxCount * 3);
    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3;

      if (i3 < originalArray.length) {
        newArray[i3 + 0] = originalArray[i3 + 0];
        newArray[i3 + 1] = originalArray[i3 + 1];
        newArray[i3 + 2] = originalArray[i3 + 2];
      } else {
        // now all particle are centered, just put in the mesh using random values from original array
        const randomIndex = Math.floor(position.count * Math.random()) * 3;
        newArray[i3 + 0] = originalArray[randomIndex + 0];
        newArray[i3 + 1] = originalArray[randomIndex + 1];
        newArray[i3 + 2] = originalArray[randomIndex + 2];
      }
    }
    particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
  }
  const sizeArray = new Float32Array(particles.maxCount);
  for (let i = 0; i < particles.maxCount; i++) {
    sizeArray[i] = Math.random();
  }

  particles.geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizeArray, 1)
  );
  // Geometry
  particles.geometry.setAttribute(
    "position",
    particles.positions[particles.index]
  ); // index one => Suzanne
  particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
  scene.add(particles.points);

  gui
    .add(particles.material.uniforms.uProgress, "value", 0, 1, 0.01)
    .name("progress")
    .listen();

  const morpher = {
    "0": () => particles.morph(0),
    "1": () => particles.morph(1),
    "2": () => particles.morph(2),
    "3": () => particles.morph(3),
  };

  gui
    .addColor(particles, "colorFrom")
    .name("Color From")
    .onChange(() => {
      particles.material.uniforms.uColorA.value.set(particles.colorFrom);
    });

  gui
    .addColor(particles, "colorTo")
    .name("Color To")
    .onChange(() => {
      particles.material.uniforms.uColorB.value.set(particles.colorTo);
    });

  gui.add(morpher, "0").name("To Donut");
  gui.add(morpher, "1").name("To Suzanne");
  gui.add(morpher, "2").name("To Sphere");
  gui.add(morpher, "3").name("To Three JS");
});

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
