import { useRef, useState } from "react";
import * as THREE from "three";
import {
  Canvas,
  useLoader,
  useFrame,
  useThree,
  extend,
} from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Stars, OrbitControls, Text } from "@react-three/drei";
// import { useFont } from "../lib/hooks";

extend({ TextGeometry });

function PlanetsFiber() {
  console.log("PlanetsFiber loads!");
  const Sun = () => {
    const texture = useLoader(TextureLoader, "./assets/sun.jpeg");
    const sunLabel = useRef();
    const [highlighted, setHighlighted] = useState(false);

    const handlePointerOver = () => {
      setHighlighted(true);
    };

    const handlePointerOut = () => {
      setHighlighted(false);
    };

    useFrame(({ camera }) => {
      if (highlighted) sunLabel.current.lookAt(camera.position);
    });

    return (
      <>
        <mesh
          onPointerOver={() => handlePointerOver()}
          onPointerOut={() => handlePointerOut()}
        >
          <sphereGeometry args={[12, 64, 64]} />
          <meshBasicMaterial
            color={highlighted ? "white" : "goldenrod"}
            map={texture}
          />
        </mesh>
        {highlighted && (
          <Text
            ref={sunLabel}
            scale={[0.5, 0.5, 0.5]}
            position={[0, 15, 0]}
            color="white"
            fontSize={10}
            maxWidth={100}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="white"
          >
            Sun
          </Text>
        )}
        {/* <mesh position={[0, 15, 0]}>
          <textGeometry args={["Sun", { font, size: 5, height: 0.5 }]} />
          <meshBasicMaterial color="orange" />
        </mesh> */}
      </>
    );
  };

  const Moon = ({ distance }) => {
    const textureMap = useLoader(TextureLoader, "./assets/moon.jpeg");
    const moonOrbit = useRef();
    const moonLabel = useRef();

    const [highlighted, setHighlighted] = useState(false);

    const handlePointerOver = () => {
      setHighlighted(true);
    };

    const handlePointerOut = () => {
      setHighlighted(false);
    };

    useFrame(({ camera }) => {
      moonOrbit.current.rotation.y -= 0.02;
      if (highlighted) moonLabel.current.lookAt(camera.position);
    });

    return (
      <group ref={moonOrbit} position-x={distance}>
        <mesh
          position-x={4}
          rotation-y={Math.PI}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[1, 32, 32]} />
          {highlighted ? (
            <meshBasicMaterial map={textureMap} />
          ) : (
            <meshStandardMaterial map={textureMap} />
          )}
        </mesh>
        {highlighted && (
          <Text
            ref={moonLabel}
            scale={[0.5, 0.5, 0.5]}
            position={[4, 3, 0]}
            color="white"
            fontSize={2}
            maxWidth={100}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="white"
          >
            Moon
          </Text>
        )}
      </group>
    );
  };

  const Rings = () => {
    const texture = useLoader(TextureLoader, "./assets/saturn-rings-top.png");

    const geometry = new THREE.RingGeometry(6, 8, 64);
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, v3.length() < 7 ? 0 : 1, 1);
    }

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: "#D2B48C",
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    return (
      <>
        <primitive object={mesh} rotation-x={Math.PI / 2} />
      </>
    );
  };

  const Planet = ({
    name,
    radius,
    distance,
    orbitSpeed,
    rotationSpeed,
    feature,
    color = "white",
  }) => {
    // const camera = useThree((state) => state.camera);
    const planetOrbit = useRef();
    const planetBody = useRef();
    const planetLabel = useRef();
    const textureMap = useLoader(
      TextureLoader,
      `./assets/${name.toLowerCase()}.jpeg`
    );

    const randomAngleRef = useRef(Math.random() * Math.PI * 2);
    const [highlighted, setHighlighted] = useState(false);

    useFrame(({ camera }) => {
      // start planet at random point in orbit
      planetOrbit.current.rotation.y -= orbitSpeed;
      planetBody.current.rotation.y -= rotationSpeed;
      if (highlighted) planetLabel.current.lookAt(camera.position);
    });

    const handlePointerOver = () => {
      setHighlighted(true);
      console.log(name, "highlighted");
    };

    const handlePointerOut = () => {
      setHighlighted(false);
      console.log(name, "unhighlighted");
    };

    return (
      <group ref={planetOrbit} rotation-y={randomAngleRef.current}>
        <mesh
          ref={planetBody}
          onPointerOver={() => handlePointerOver()}
          onPointerOut={() => handlePointerOut()}
          // onPointerDown={console.log}
          position-x={distance}
          // onClick={() => {
          //   const planetPosition = planetBody.current.getWorldPosition(
          //     new THREE.Vector3()
          //   );

          //   camera.position.x = planetPosition.x + 10;
          //   camera.position.y = planetPosition.y + 10;
          //   camera.position.z = planetPosition.z + 10;
          //   planetOrbit.current.add(camera);
          //   camera.lookAt(planetPosition);
          // }}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          {highlighted ? (
            <meshBasicMaterial map={textureMap} />
          ) : (
            <meshStandardMaterial map={textureMap} color={color} />
          )}
          {feature === "rings" && <Rings />}
        </mesh>
        {feature === "moon" && <Moon distance={distance} />}
        {highlighted && (
          <Text
            ref={planetLabel}
            scale={[0.5, 0.5, 0.5]}
            position={[distance, radius + 2, 0]}
            color="white"
            fontSize={radius * 2}
            maxWidth={100}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="white"
          >
            {name}
          </Text>
        )}
      </group>
    );
  };

  const Pluto = () => {
    const plutoOrbit = useRef();
    const plutoBody = useRef();
    const plutoLabel = useRef();
    const plutoModel = useLoader(GLTFLoader, "./assets/Pluto_1_2374.glb");

    const [highlighted, setHighlighted] = useState(false);

    useFrame(({ camera }) => {
      // start planet at random point in orbit
      plutoOrbit.current.rotation.y -= 0.0001;
      plutoBody.current.rotation.y -= 0.02;
      if (highlighted) plutoLabel.current.lookAt(camera.position);
    });

    return (
      <group ref={plutoOrbit}>
        <object3D
          ref={plutoBody}
          position-x={160}
          scale={[0.002, 0.002, 0.002]}
          onPointerOver={() => setHighlighted(true)}
          onPointerOut={() => setHighlighted(false)}
        >
          <primitive object={plutoModel.scene} />
        </object3D>
        {highlighted && (
          <Text
            ref={plutoLabel}
            scale={[0.5, 0.5, 0.5]}
            position={[160, 5, 0]}
            color="white"
            fontSize={5}
            maxWidth={100}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="white"
          >
            Pluto
          </Text>
        )}
      </group>
    );
  };

  // const Raycaster = () => {
  //   const { camera, mouse, raycaster, scene } = useThree();
  //   // raycaster.layers.set(1);
  //   // console.log(raycaster.layers);
  //   // object.layers.enable(1);

  //   const onMouseClick = (e) => {
  //     const x = (e.clientX / window.innerWidth) * 2 - 1;
  //     const y = -(e.clientY / window.innerHeight) * 2 + 1;
  //     mouse.x = x;
  //     mouse.y = y;
  //     raycaster.setFromCamera(mouse, camera);
  //     const intersects = raycaster.intersectObjects(scene.children, true);
  //     intersects.forEach((intersect) => {
  //       console.log(intersect.object.geometry.type);
  //     });
  //   };
  //   window.addEventListener("click", onMouseClick);
  //   return null;
  // };

  return (
    <>
      <Canvas
        camera={{ position: [0, 100, 100], fov: 30 }}
        scene={{ background: "black" }}
        // onClick={(e) => console.log("click", e.object.name)}
      >
        {/* <CanvasSize /> */}
        {/* <Raycaster /> */}
        <Stars />
        <ambientLight args={[0xffffff, 0.2]} />
        <pointLight args={[0xffffff, 4, 1000, 0.1]} position={[0, 0, 0]} />
        <Sun />
        <Planet
          name="Mercury"
          color="C0C0C0"
          radius={1}
          distance={18}
          orbitSpeed={0.007}
          rotationSpeed={0.01}
        />
        <Planet
          name="Venus"
          color="FFD700"
          radius={1.8}
          distance={27}
          orbitSpeed={0.005}
          rotationSpeed={0.02}
        />
        <Planet
          name="Earth"
          color="0000FF"
          radius={2}
          distance={36}
          orbitSpeed={0.003}
          rotationSpeed={0.08}
          feature="moon"
        />
        <Planet
          name="Mars"
          color="FF6347"
          radius={1.5}
          distance={45}
          orbitSpeed={0.002}
          rotationSpeed={0.03}
        />
        <Planet
          name="Jupiter"
          color="FFD700"
          radius={6}
          distance={64}
          orbitSpeed={0.0005}
          rotationSpeed={0.01}
        />
        <Planet
          name="Saturn"
          color="tan"
          radius={4.5}
          distance={87}
          orbitSpeed={0.0003}
          rotationSpeed={0.025}
          feature="rings"
        />
        <Planet
          name="Uranus"
          color="lightblue"
          radius={3.5}
          distance={110}
          orbitSpeed={0.0002}
          rotationSpeed={0.015}
        />
        <Planet
          name="Neptune"
          color="deepskyblue"
          radius={3}
          distance={130}
          orbitSpeed={0.0001}
          rotationSpeed={0.02}
        />
        <Pluto />
        <OrbitControls zoomSpeed={0.2} />
      </Canvas>
    </>
  );
}

export default PlanetsFiber;
