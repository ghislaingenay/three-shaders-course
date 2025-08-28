import GUI from "lil-gui";
import canvas from "../../utils/canvas";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

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
