import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Shape = "knot" | "crystal" | "ring";
type Props = { reduced: boolean; quality: "low" | "high"; active: boolean };

const LIME = "#c8ff2e";
const SHAPES: readonly { id: Shape; label: string }[] = [
  { id: "knot", label: "Knot" },
  { id: "crystal", label: "Crystal" },
  { id: "ring", label: "Rings" },
];

const Geometry = ({ shape, detail }: { shape: Shape; detail: number }) => {
  if (shape === "crystal") return <icosahedronGeometry args={[1.25, 1]} />;
  if (shape === "ring") return <torusGeometry args={[1.1, 0.34, detail / 2, detail]} />;
  return <torusKnotGeometry args={[0.95, 0.28, detail * 4, detail, 2, 3]} />;
};

const Object3D = ({ shape, wire, reduced, quality }: { shape: Shape; wire: boolean; reduced: boolean; quality: "low" | "high" }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);
  const detail = quality === "low" ? 24 : 48;

  useFrame((_state, delta) => {
    const target = mesh.current;
    if (!target) return;
    pulse.current = THREE.MathUtils.damp(pulse.current, 0, 5, delta);
    target.scale.setScalar(1 + pulse.current * 0.25);
    if (!reduced) target.rotation.z += delta * 0.15;
  });

  return (
    <mesh ref={mesh} onClick={() => (pulse.current = 1)}>
      <Geometry shape={shape} detail={detail} />
      {wire ? (
        <meshBasicMaterial color={LIME} wireframe />
      ) : (
        <meshPhysicalMaterial color="#0d0d0c" metalness={1} roughness={0.18} clearcoat={0.7} envMapIntensity={1.4} flatShading={shape === "crystal"} />
      )}
    </mesh>
  );
};

/** Experiment 01 — drag to orbit, click to pulse, switch form and surface. */
const LabGeometry = ({ reduced, quality, active }: Props) => {
  const [shape, setShape] = useState<Shape>("knot");
  const [wire, setWire] = useState(false);

  return (
    <div className="exp__stage-wrap">
      <div className="exp__stage exp__stage--3d">
        <Canvas
          frameloop={active ? "always" : "never"}
          dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
          camera={{ position: [0, 0, 5], fov: 40 }}
          gl={{ antialias: quality === "high", alpha: true }}
          aria-label="Interactive 3D object. Drag to rotate, click to pulse."
          role="img"
        >
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={4} color={LIME} position={[-5, 1, 2]} scale={[1.5, 8, 1]} rotation-y={Math.PI / 2} />
            <Lightformer form="rect" intensity={2} color="#f4f0e8" position={[0, 5, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          </Environment>
          <Object3D shape={shape} wire={wire} reduced={reduced} quality={quality} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.8} />
        </Canvas>
      </div>
      <div className="exp__controls" role="group" aria-label="3D geometry controls">
        {SHAPES.map((item) => (
          <button key={item.id} type="button" className="chip" aria-pressed={shape === item.id} onClick={() => setShape(item.id)}>
            {item.label}
          </button>
        ))}
        <button type="button" className="chip" aria-pressed={wire} onClick={() => setWire((value) => !value)}>
          Wireframe
        </button>
      </div>
    </div>
  );
};

export default LabGeometry;
