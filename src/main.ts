import * as THREE from "three";
import GUI from "lil-gui";

const gui = new GUI();
gui.hide();
const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
if (!canvas) {
  throw new Error("Canvas element not found");
}

/**
 * Scene
 */
const scene = new THREE.Scene();
