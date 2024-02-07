import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import gsap from "gsap";

export default class SceneInit {
  constructor(
    canvasId,
    camera = undefined
    // earthPosition = new THREE.Vector3(0, 0, 0)
  ) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = camera;
    this.renderer = undefined;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize(zPos = 136, bgImage, earthPosition = new THREE.Vector3(0, 0, 0)) {
    this.scene = new THREE.Scene();
    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera(
        this.fov,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );

      // this.camera.position.x = 0;
      this.camera.position.y = 180;
      this.camera.position.z = zPos;
      // this.camera.lookAt(0, 0, 0);
    } else {
      this.camera.position.set(0, 0, 5);
    }

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth / 1, window.innerHeight / 1);
    // this.renderer.shadowMap.enabled = true;
    // document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxDistance = 480;
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambientLight);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    // gsap.to(this.camera.position, {
    //   x: earthPosition.x,
    //   y: earthPosition.y,
    //   z: earthPosition.z + 10,
    //   duration: 5,
    //   // onUpdate: () => {
    //   //   this.camera.lookAt(earthPosition);
    //   // },
    // });

    // NOTE: Load space background.
    this.loader = new THREE.TextureLoader();
    if (bgImage === "space") {
      // this.scene.backgroundColor = new THREE.Color(0x000000);
      // make background look like a sphere
      const bgGeometry = new THREE.SphereGeometry(500, 500, 500);
      const bgMaterial = new THREE.MeshBasicMaterial({
        map: this.loader.load("/assets/stars.jpeg"),
        // darken image so that stars are more visible
        transparent: true,
        side: THREE.BackSide,
      });
      const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
      this.scene.add(bgSphere);
    }
    // NOTE: Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
  }

  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));

    this.render();
    this.stats.update();
    // this.camera.lookAt(0, 10, 0);
    // this.controls.update();
  }

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2);
  }
}
