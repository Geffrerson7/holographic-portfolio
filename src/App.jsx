import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// Componente para un planeta individual con movimiento orbital

function Planet({
  color,
  size,
  radiusX,
  radiusZ,
  speed,
  onClick,
  tilt = [0, 0, 0],
}) {
  const planetRef = useRef();
  const angleRef = useRef(0);

  useFrame(() => {
    angleRef.current += speed;
    const x = Math.cos(angleRef.current) * radiusX;
    const z = Math.sin(angleRef.current) * radiusZ;
    planetRef.current.position.set(x, 0, z);
  });

  return (
    <group rotation={tilt}>
      <mesh
        ref={planetRef}
        onClick={onClick}
        onPointerOver={() => {
          gsap.to(planetRef.current.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.3,
          });
        }}
        onPointerOut={() => {
          gsap.to(planetRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Componente para las órbitas elípticas

function Orbit({ radiusX, radiusZ, tilt = [0, 0, 0] }) {
  const points = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ)
    );
  }
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line rotation={tilt}>
      <primitive object={lineGeometry} />
      <lineBasicMaterial color={"#26ABB7"} linewidth={2} />
    </line>
  );
}

// Componente para el Sol
function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        emissive={"#11ddf0"}
        emissiveIntensity={1.5}
        color={"#26ABB7"}
      />
    </mesh>
  );
}

// Componente principal del sistema planetario
function SolarSystem() {
  const handlePlanetClick = (section) => {
    console.log(`Navegar a: ${section}`);
  };

  return (
    <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
      {" "}
      {/* Vista diagonal mejorada */}
      {/* Fondo estrellado con nebulosa */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade={true} />
      <mesh>
        <sphereGeometry args={[200, 64, 64]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          map={new THREE.TextureLoader().load(
            "/textures/8k_stars_milky_way.jpg"
          )}
        />
      </mesh>
      {/* Luz ambiental y solar */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      {/* Sol */}
      <Sun />
      {/* Órbitas elípticas proporcionales */}
      <Orbit radiusX={8} radiusZ={4} tilt={[Math.PI / 12, 0, 0]} />{" "}
      {/* Inclinación leve */}
      <Orbit radiusX={12} radiusZ={6} tilt={[Math.PI / 6, 0, 0]} />{" "}
      {/* Inclinación mayor */}
      <Orbit radiusX={16} radiusZ={8} tilt={[Math.PI / 4, 0, 0]} />{" "}
      {/* Inclinación aún mayor */}
      {/* Planetas con movimiento orbital elíptico */}
      <Planet
        radiusX={8}
        radiusZ={4}
        speed={0.01}
        color="#26ABB7"
        size={0.8}
        tilt={[Math.PI / 12, 0, 0]} // Coincide con la órbita
        onClick={() => handlePlanetClick("about")}
      />
      <Planet
        radiusX={12}
        radiusZ={6}
        speed={0.008}
        color="#33C2CC"
        size={1}
        tilt={[Math.PI / 6, 0, 0]}
        onClick={() => handlePlanetClick("projects")}
      />
      <Planet
        radiusX={16}
        radiusZ={8}
        speed={0.006}
        color="#5EE2E8"
        size={0.6}
        tilt={[Math.PI / 4, 0, 0]}
        onClick={() => handlePlanetClick("contact")}
      />
      {/* Controles de cámara */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SolarSystem />
    </div>
  );
}

export default App;
