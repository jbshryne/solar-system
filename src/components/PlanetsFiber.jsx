import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Stars, OrbitControls } from "@react-three/drei";

function PlanetsFiber() {
  // const CanvasSize = () => {
  //   let { size, viewport } = useThree();
  //   size = [viewport.width, viewport.height];
  //   viewport = [viewport.width, viewport.height];
  // };

  const Sun = () => {
    const textureMap = useLoader(TextureLoader, "./assets/sun.jpeg");
    return (
      <mesh>
        <sphereGeometry args={[12]} />
        <meshBasicMaterial color="orange" map={textureMap} />
      </mesh>
    );
  };

  const Moon = ({ distance }) => {
    const textureMap = useLoader(TextureLoader, "./assets/moon.jpeg");
    const moonOrbit = useRef();

    useFrame(() => {
      moonOrbit.current.rotation.y -= 0.02;
    });

    return (
      <group ref={moonOrbit} position-x={distance}>
        <mesh position-x={4} rotateY={Math.PI}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial map={textureMap} />
        </mesh>
      </group>
    );
  };

  const Rings = () => {
    // const textureMap = useLoader(TextureLoader, "./assets/saturn-rings.png");
    return (
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[6, 8, 30]} />
        <meshBasicMaterial color={0xb9a68c} side={THREE.DoubleSide} />
      </mesh>
    );
  };

  const Planet = ({
    name,
    radius,
    distance,
    orbitSpeed,
    rotationSpeed,
    feature,
  }) => {
    const planetOrbit = useRef();
    const planetBody = useRef();
    const textureMap = useLoader(
      TextureLoader,
      `./assets/${name.toLowerCase()}.jpeg`
    );

    const randomAngle = Math.random() * Math.PI * 2;

    useFrame(() => {
      // start planet at random point in orbit
      planetOrbit.current.rotation.y -= orbitSpeed;
      planetBody.current.rotation.y -= rotationSpeed;
    });

    const handlePointerOver = (name) => {
      console.log(name);
    };

    // if (feature === "moon") console.log("moon orbiting " + name);

    return (
      <group
        ref={planetOrbit}
        rotation-y={randomAngle}
        onPointerOver={() => handlePointerOver(name)}
      >
        <mesh ref={planetBody} position-x={distance}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial map={textureMap} />
          {feature === "rings" && <Rings />}
        </mesh>
        {feature === "moon" && <Moon distance={distance} />}
      </group>
    );
  };

  const Pluto = () => {
    const plutoOrbit = useRef();
    const plutoBody = useRef();
    const plutoModel = useLoader(GLTFLoader, "./assets/Pluto_1_2374.glb");

    useFrame(() => {
      // start planet at random point in orbit
      plutoOrbit.current.rotation.y -= 0.0001;
      plutoBody.current.rotation.y -= 0.02;
    });

    return (
      <group ref={plutoOrbit}>
        <object3D
          ref={plutoBody}
          position-x={160}
          scale={[0.002, 0.002, 0.002]}
        >
          <primitive object={plutoModel.scene} />
        </object3D>
      </group>
    );
  };

  return (
    <Canvas
      camera={{ position: [0, 100, 100] }}
      scene={{ background: "black" }}
    >
      {/* <CanvasSize /> */}
      <Stars />
      <ambientLight args={[0xffffff, 0.2]} />
      <pointLight args={[0xffffff, 4, 1000, 0.1]} position={[0, 0, 0]} />
      <Sun />
      <Planet
        name="Mercury"
        radius={1}
        distance={18}
        orbitSpeed={0.007}
        rotationSpeed={0.01}
      />
      <Planet
        name="Venus"
        radius={1.8}
        distance={27}
        orbitSpeed={0.005}
        rotationSpeed={0.02}
      />
      <Planet
        name="Earth"
        radius={2}
        distance={36}
        orbitSpeed={0.003}
        rotationSpeed={0.08}
        feature="moon"
      />
      <Planet
        name="Mars"
        radius={1.5}
        distance={45}
        orbitSpeed={0.002}
        rotationSpeed={0.03}
      />
      <Planet
        name="Jupiter"
        radius={6}
        distance={64}
        orbitSpeed={0.0005}
        rotationSpeed={0.01}
      />
      <Planet
        name="Saturn"
        radius={4.5}
        distance={87}
        orbitSpeed={0.0003}
        rotationSpeed={0.025}
        feature="rings"
      />
      <Planet
        name="Uranus"
        radius={3.5}
        distance={110}
        orbitSpeed={0.0002}
        rotationSpeed={0.015}
      />
      <Planet
        name="Neptune"
        radius={3}
        distance={130}
        orbitSpeed={0.0001}
        rotationSpeed={0.02}
      />
      <Pluto />
      <OrbitControls zoomSpeed={0.2} />
    </Canvas>
  );
}

export default PlanetsFiber;
