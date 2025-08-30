import GUI from "lil-gui";
import canvasElement from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { texture } from "three/tsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

const pictureTexture = textureLoader.load("/particle_cursor/picture-1.png");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  resolution: new THREE.Vector2(),
};

sizes.resolution.set(
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

  // Materials
  particlesMaterial.uniforms.uResolution.value.set(
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
camera.position.set(0, 0, 18);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement,
  antialias: true,
});
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Displacement
 */
const canvas = document.createElement("canvas");
canvas.id = "2d";
canvas.width = canvas.height = 128; // don't make heigher that quantity of particles

document.body.append(canvas);

const displacement = {
  canvas,
  raycaster: new THREE.Raycaster(),
  screenCursor: new THREE.Vector2(),
  canvasCursor: new THREE.Vector2(),
  context: canvas.getContext("2d") as CanvasRenderingContext2D,
  glowImage: new Image(),
  interactivePlane: new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide })
  ),
  texture: new THREE.CanvasTexture(),
  canvasCursorPrevious: new THREE.Vector2(9999, 9999),
};

displacement.texture = new THREE.CanvasTexture(displacement.canvas);
displacement.canvas.style.position = "fixed";
displacement.canvas.style.width = "128px";
displacement.canvas.style.height = "128px";
displacement.canvas.style.top = "0px";
displacement.canvas.style.left = "0px";
displacement.canvas.style.zIndex = "10";

// displacement.context.fillStyle = "black";
displacement.context.fillRect(
  0,
  0,
  displacement.canvas.width,
  displacement.canvas.height
);

displacement.glowImage.src = "/particle_cursor/glow.png";

// Coordinates
displacement.screenCursor = new THREE.Vector2(9999, 9999); // not see center being displced
displacement.canvasCursor = new THREE.Vector2(9999, 9999);
window.addEventListener("pointermove", (event) => {
  // something to clip space -1 to 1
  displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
  displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
});

displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
particlesGeometry.setIndex(null); // to be sure that no index is used
particlesGeometry.deleteAttribute("normal");
const intensityArray = new Float32Array(
  particlesGeometry.attributes.position.count
);
const anglesArray = new Float32Array(
  particlesGeometry.attributes.position.count
);
for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
  intensityArray[i] = Math.random();
  anglesArray[i] = Math.random() * Math.PI * 2; // 0 to full circle
}

particlesGeometry.setAttribute(
  "aAngle",
  new THREE.BufferAttribute(anglesArray, 1)
);
particlesGeometry.setAttribute(
  "aIntensity",
  new THREE.BufferAttribute(intensityArray, 1)
);

const particlesMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uResolution: new THREE.Uniform(sizes.resolution),
    uPictureTexture: new THREE.Uniform(pictureTexture),
    uDisplacementTexture: new THREE.Uniform(displacement.texture),
  },
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  /**
   * Raycaster
   */
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
  const intersections = displacement.raycaster.intersectObject(
    displacement.interactivePlane
  );
  if (intersections.length) {
    const uv = intersections[0].uv;
    if (uv) {
      displacement.canvasCursor.x = uv.x * displacement.canvas.width;
      displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
    }
  }
  /**
   * Displacement
   */
  // Speed alpha
  const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
    displacement.canvasCursor
  );
  displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
  const alpha = Math.min(cursorDistance * 0.1, 1);

  displacement.context.globalCompositeOperation = "source-over";
  displacement.context.globalAlpha = 0.02;

  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
  );
  // draw glow
  const glowSize = displacement.canvas.width * 0.25;
  displacement.context.globalCompositeOperation = "lighten";
  displacement.context.globalAlpha = alpha;
  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x - glowSize * 0.5,
    displacement.canvasCursor.y - glowSize * 0.5,
    glowSize,
    glowSize
  );

  displacement.texture.needsUpdate = true;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

export default tick;
