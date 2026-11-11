import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "../lib/motion";

type Props = {
  active: boolean;
  reduced: boolean;
  quality: "low" | "high";
};

const LIME = "#c8ff2e";

/** Deterministic pseudo-random so the shard layout is stable between renders. */
const seeded = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const Shards = ({ count }: { count: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const random = seeded(42);
    const dummy = new THREE.Object3D();
    return Array.from({ length: count }, () => {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const radius = 2.1 + random() * 1.1;
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      dummy.rotation.set(random() * 3, random() * 3, random() * 3);
      dummy.scale.setScalar(0.05 + random() * 0.1);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, [count]);

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    matrices.forEach((matrix, index) => instanced.setMatrixAt(index, matrix));
    instanced.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={0.55} roughness={0.35} />
    </instancedMesh>
  );
};

const Sculpture = ({ reduced, quality }: Pick<Props, "reduced" | "quality">) => {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const shards = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const intro = useRef({ value: reduced ? 1 : 0 });

  const viewport = useThree((state) => state.viewport);
  const wide = viewport.width / viewport.height > 1.1;

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      intro.current.value = 1;
      return;
    }
    const tween = gsap.to(intro.current, { value: 1, duration: 2.4, ease: "expo.out", delay: 0.15 });
    return () => {
      tween.kill();
    };
  }, [reduced]);

  useFrame((state, delta) => {
    const root = group.current;
    if (!root) return;

    const time = state.clock.elapsedTime;
    const progress = intro.current.value;
    const eased = 0.25 + 0.75 * progress;
    const lift = scroll.current;

    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, reduced ? 0 : pointer.current.x, 3, delta);
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, reduced ? 0 : pointer.current.y, 3, delta);

    const baseX = wide ? viewport.width * 0.2 : 0;
    const baseY = wide ? 0 : viewport.height * 0.3;
    const baseScale = wide ? Math.min(viewport.height * 0.25, 1.1) : Math.min(viewport.width * 0.24, 0.8);

    root.position.x = baseX - lift * 0.9;
    root.position.y = baseY + lift * 0.7 + (reduced ? 0 : Math.sin(time * 0.6) * 0.08);
    root.rotation.y = smooth.current.x * 0.6 + lift * 0.9 + (1 - progress) * Math.PI;
    root.rotation.x = smooth.current.y * 0.35 + lift * 0.3;
    root.scale.setScalar(baseScale * eased * (1 - lift * 0.18));

    if (!reduced) {
      if (knot.current) knot.current.rotation.z = time * 0.1;
      if (core.current) {
        core.current.rotation.x = time * 0.25;
        core.current.rotation.y = time * 0.18;
      }
      if (shards.current) shards.current.rotation.y = -time * 0.08;
    }
  });

  const tubular = quality === "low" ? 120 : 240;
  const radial = quality === "low" ? 18 : 40;

  return (
    <group ref={group}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1, 0.3, tubular, radial, 2, 3]} />
        <meshPhysicalMaterial
          color="#0d0d0c"
          metalness={1}
          roughness={0.2}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          envMapIntensity={1.3}
        />
      </mesh>
      <mesh ref={core} scale={0.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.55} />
      </mesh>
      <group ref={shards}>
        <Shards count={quality === "low" ? 8 : 22} />
      </group>
    </group>
  );
};

const HeroScene = ({ active, reduced, quality }: Props) => (
  <Canvas
    className="hero__canvas"
    frameloop={active ? "always" : "never"}
    dpr={quality === "low" ? [1, 1.25] : [1, 1.75]}
    camera={{ position: [0, 0, 6.5], fov: 38 }}
    gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
    aria-hidden="true"
  >
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={4} color={LIME} position={[-5, 1, 2]} scale={[1.5, 8, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.2} color="#f4f0e8" position={[0, 5, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="ring" intensity={1.4} color="#f4f0e8" position={[4, -2, -3]} scale={3} />
    </Environment>
    <directionalLight position={[4, 3, 5]} intensity={0.8} color={LIME} />
    <Sculpture reduced={reduced} quality={quality} />
  </Canvas>
);

export default HeroScene;
