import { useEffect } from "react";
import * as THREE from "three";
import SceneInit from "../lib/SceneInit";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

// function addSphere(stars, scene) {
//   // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
//   for (var z = -1000; z < 1000; z += 10) {
//     // Make a sphere (exactly the same as before).
//     var geometry = new THREE.SphereGeometry(0.5, 32, 32);
//     var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     var sphere = new THREE.Mesh(geometry, material);

//     // This time we give the sphere random x and y positions between -500 and 500
//     sphere.position.x = Math.random() * 1000 - 500;
//     sphere.position.y = Math.random() * 1000 - 500;

//     // Then set the z position to where it is in the loop (distance of camera)
//     sphere.position.z = z;

//     if (sphere.position.z > 1000) sphere.position.z -= 2000;

//     // scale it up a bit
//     sphere.scale.x = sphere.scale.y = 2;

//     //add the sphere to the scene
//     scene.add(sphere);

//     //finally push it to the stars array
//     stars.push(sphere);
//   }
// }

class Planet {
  constructor(name, radius, distance, orbitSpeed, rotationSpeed) {
    this.name = name;

    this.radius = radius;
    this.distance = distance;
    this.orbitSpeed = orbitSpeed;
    this.rotationSpeed = rotationSpeed;
    this.angle = Math.random() * Math.PI * 2; // Random initial angle
    this.orbit = new THREE.Group();
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius),
      new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(`./assets/${name}.jpeg`),
      })
    );
  }

  init(scene) {
    this.angle = Math.random() * Math.PI * 2; // Random initial angle
    this.orbit.rotation.y = this.angle; // Set the rotation based on the angle
    this.mesh.position.x = this.distance;
    this.orbit.add(this.mesh);
    scene.add(this.orbit);
  }

  update() {
    this.angle -= this.orbitSpeed; // Increment the angle
    this.orbit.rotation.y = this.angle; // Set the rotation based on the angle
    this.mesh.rotation.y -= this.rotationSpeed;
  }
}

const Canvas = () => {
  useEffect(() => {
    // const stars = [];
    const mainCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    // this.camera.position.x = 0;
    mainCamera.position.y = 160;
    mainCamera.position.z = 160;

    const test = new SceneInit("3d-canvas", mainCamera);
    test.initialize("space");
    test.animate();

    // const axesHelper = new THREE.AxesHelper(16);
    // test.scene.add(axesHelper);

    // part 2 - load textures
    const sunTexture = new THREE.TextureLoader().load("./assets/sun.jpeg");
    const moonTexture = new THREE.TextureLoader().load("./assets/moon.jpeg");

    // moonTexture.offset = 0.9;

    // part 3 - refactor initial sun + earth scene groups
    const solarSystemGroup = new THREE.Group();

    const sunGeometry = new THREE.SphereGeometry(9);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      transparent: true,
      opacity: 1,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystemGroup.add(sunMesh);
    test.scene.add(solarSystemGroup);

    const sunLight = new THREE.PointLight(0xffffff, 4, 1000, 0.1);
    sunLight.position.set(0, 0, 0);
    test.scene.add(sunLight);

    // part 3.1 - add the earth and moon to the solar system
    const earthDistance = 36;
    const earth = new Planet("earth", 2, earthDistance, 0.003, 0.08);
    const earthOrbit = earth.orbit;

    let planetCamera = false;

    window.addEventListener("mousedown", () => {
      if (!planetCamera) {
        const earthPosition = earth.mesh.getWorldPosition(new THREE.Vector3());
        console.log(earthPosition);

        gsap.to(test.camera.position, {
          duration: 3,
          x: earthPosition.x + 10,
          y: earthPosition.y,
          z: earthPosition.z + 10,
          onUpdate: () => {
            test.camera.lookAt(earthPosition);
          },
          onComplete: () => {
            earthOrbit.add(test.camera);
            test.camera.lookAt(earthPosition);
            planetCamera = true;
          },
        });
      } else {
        earthOrbit.remove(test.camera);
        planetCamera = false;
      }
    });

    const moonOrbit = new THREE.Group();
    const moonGeometry = new THREE.SphereGeometry(1);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.rotation.y = Math.PI;
    moonOrbit.add(moonMesh);
    moonOrbit.position.x = earthDistance;

    moonMesh.position.x = 4;
    earthOrbit.add(moonOrbit);

    // part 3.2 add the other planets to the solar system

    const mercury = new Planet("mercury", 1, 15, 0.007, 0.01);
    const venus = new Planet("venus", 1.8, 23, 0.005, 0.02);
    const mars = new Planet("mars", 2.5, 45, 0.002, 0.04);
    const jupiter = new Planet("jupiter", 6, 80, 0.0005, 0.01);
    const saturn = new Planet("saturn", 4.5, 100, 0.0003, 0.025);
    const uranus = new Planet("uranus", 3.5, 120, 0.0002, 0.015);
    const neptune = new Planet("neptune", 3, 140, 0.0001, 0.02);

    const planets = [
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
    ];

    planets.forEach((planet) => {
      planet.init(test.scene);
    });

    const plutoOrbit = new THREE.Group();
    //load model of Pluto from "./assets/Pluto_1_2374.glb"
    let plutoModel;
    const loader = new GLTFLoader();
    loader.load("./assets/Pluto_1_2374.glb", function (gltf) {
      plutoModel = gltf.scene;
      plutoModel.scale.set(0.002, 0.002, 0.002);
      plutoModel.position.x = 160;
      plutoOrbit.add(plutoModel);
    });
    let plutoAngle = Math.random() * Math.PI * 2; // Random initial angle
    plutoOrbit.rotation.y = plutoAngle; // Set the rotation based on the angle
    test.scene.add(plutoOrbit);

    // add saturn's rings

    const saturnRingsGeometry = new THREE.RingGeometry(6, 8, 30);

    // let pos = saturnRingsGeometry.attributes.position;
    // console.log(saturnRingsGeometry.attributes);
    // let v3 = new THREE.Vector3();
    // for (let i = 0; i < pos.count; i++) {
    //   v3.fromBufferAttribute(pos, i);
    //   saturnRingsGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    // }

    // const saturnRingTexture = new THREE.TextureLoader().load(
    //   "./assets/saturn_ring.png"
    //   // (texture) => {
    //   //   // texture.wrapS = THREE.RepeatWrapping;
    //   //   // texture.wrapT = THREE.RepeatWrapping;
    //   //   // texture.repeat.set(4, 2); // Adjust the repeat values as needed
    //   //   texture.rotation = Math.PI / 2;
    //   // }
    // );

    const saturnRingsMaterial = new THREE.MeshStandardMaterial({
      // map: saturnRingTexture,
      color: 0xb9a68c,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const saturnRingsMesh = new THREE.Mesh(
      saturnRingsGeometry,
      saturnRingsMaterial
    );
    saturnRingsMesh.rotation.x = Math.PI / 2;
    saturn.mesh.add(saturnRingsMesh);

    // part 3.3 - animate earth rotation and moon rotation

    // let planetCamera = false;

    // const handlePlanetCamera = (planet) => {
    //   if (planetCamera) {
    //     const planetPosition = planet.mesh.getWorldPosition(
    //       new THREE.Vector3()
    //     );
    //     gsap.to(test.camera.position, {
    //       duration: 3,
    //       x: planetPosition.x + 10,
    //       y: planetPosition.y,
    //       z: planetPosition.z + 10,
    //       onUpdate: () => {
    //         test.camera.lookAt(planetPosition);
    //       },
    //       onComplete: () => {
    //         earthOrbit.add(test.camera);
    //         planetCamera = true;
    //       },
    //     });
    //   } else {
    //     earthOrbit.remove(test.camera);
    //     planetCamera = false;
    //   }
    // };

    // document.querySelector("button").addEventListener("click", () => {
    //   handlePlanetCamera(earth);
    // });

    // window.addEventListener("mousedown", () => {
    //   earthOrbit.add(test.camera);
    //   gsap.to(test.camera.position, {
    //     duration: 3,
    //     x: earthPosition.x + 10,
    //     y: earthPosition.y,
    //     z: earthPosition.z + 10,
    //     onUpdate: () => {
    //       test.camera.lookAt(earthPosition);
    //     },
    //   });
    //   // console.log(earthMesh.position);
    // });

    const animate = () => {
      moonOrbit.rotation.y -= 0.02;

      planets.forEach((planet) => {
        planet.update();
      });

      // const earthPosition = earth.mesh.getWorldPosition(new THREE.Vector3());
      // test.camera.position.x = earthPosition.x + 10;
      // test.camera.position.y = earthPosition.y;
      // test.camera.position.z = earthPosition.z + 10;
      // test.camera.lookAt(earthPosition);

      plutoAngle -= 0.0001; // Increment the angle
      plutoOrbit.rotation.y = plutoAngle; // Set the rotation based on the angle
      // rotate the pluto model
      if (plutoModel) {
        plutoModel.rotation.y -= 0.02;
      }
      // plutoModel.rotation.y -= 0.02;

      window.requestAnimationFrame(animate);
    };

    // addSphere(stars, test.scene);
    animate();
  }, []);

  return (
    <div id="canvas-page">
      <canvas id="3d-canvas">
        {/* <button value="earthButton"></button> */}
      </canvas>
    </div>
  );
};

export default Canvas;
