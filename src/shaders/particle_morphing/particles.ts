import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import * as THREE from "three";
import gsap from "gsap";

export type SizeObject = {
  width: number;
  height: number;
  pixelRatio: number;
};

class Particles {
  geometry;
  material;
  points;
  sizes;
  maxCount;
  index;
  colorFrom;
  positions: Array<THREE.Float32BufferAttribute>;
  colorTo;
  constructor(sizes: SizeObject) {
    this.maxCount = 0;
    this.positions = [];
    this.index = 0;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setIndex(null);
    this.sizes = sizes;
    this.colorFrom = new THREE.Color("#ff7300");
    this.colorTo = new THREE.Color("#0041ff");
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // prevent the occluding issue:
      uniforms: {
        uSize: new THREE.Uniform(0.4),
        uProgress: new THREE.Uniform(0),
        uColorA: new THREE.Uniform(this.colorFrom),
        uColorB: new THREE.Uniform(this.colorTo),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio
          )
        ),
      },
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  morph(toIndex: number) {
    this.geometry.attributes.position = this.positions[this.index];
    this.geometry.attributes.aPositionTarget = this.positions[toIndex];

    // Animate uProgress
    gsap.fromTo(
      this.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, ease: "linear", duration: 3 }
    );
    this.index = toIndex;
  }
}

export default Particles;
