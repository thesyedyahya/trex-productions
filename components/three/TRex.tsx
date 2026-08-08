"use client";

import {
  Component,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Float } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/trex.glb";

/*
 * Brand "specimen" treatment: solid gunmetal armor catching the stage's
 * green/teal light, with a soft teal emissive undertone. No wireframe,
 * no hologram flicker.
 */
function useSpecimenMaterials() {
  return useMemo(() => {
    const base = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0d1f42"),
      emissive: new THREE.Color("#15cbd0"),
      emissiveIntensity: 0.14,
      metalness: 0.9,
      roughness: 0.32,
    });
    return { base };
  }, []);
}

/* Slow breathing pulse on the emissive undertone. */
function useBreathing(materials: { base: THREE.MeshStandardMaterial }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    materials.base.emissiveIntensity = 0.14 + Math.sin(t * 0.8) * 0.05;
  });
}

/*
 * The real model — drop a Meshy.ai / Blender export at public/models/trex.glb
 * and this renders it with the brand specimen treatment, auto-scaled and
 * auto-centered so any export "just works".
 */
function RexModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const materials = useSpecimenMaterials();
  useBreathing(materials);

  const specimen = useMemo(() => {
    const root = new THREE.Group();

    const basePass = scene.clone(true);
    basePass.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = materials.base;
      }
    });

    root.add(basePass);

    // Normalize: center on origin, feet on the floor, ~2.6 units tall.
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.6 / Math.max(size.y, 0.0001);
    root.scale.setScalar(scale);
    root.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    );

    const wrapper = new THREE.Group();
    wrapper.add(root);
    return wrapper;
  }, [scene, materials]);

  // Rotation is owned by the SpecimenRig in ScrollScene (scroll-to-turn).
  return <primitive object={specimen} />;
}

/*
 * Fallback shown until a trex.glb exists: a floating film clapperboard in
 * brand colors — instantly reads "production studio". The top arm idles
 * slightly open and snaps shut on a "trex-clap" event (fired on tap,
 * together with the roar).
 */
function Clapperboard() {
  const materials = useSpecimenMaterials();
  useBreathing(materials);
  const arm = useRef<THREE.Group>(null);
  const clapQueued = useRef(false);
  const clapStart = useRef(-10);

  const stripeMats = useMemo(() => {
    const lime = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#123318"),
      emissive: new THREE.Color("#6bfd5c"),
      emissiveIntensity: 0.9,
      metalness: 0.6,
      roughness: 0.4,
    });
    const teal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#06212f"),
      emissive: new THREE.Color("#15cbd0"),
      emissiveIntensity: 0.55,
      metalness: 0.6,
      roughness: 0.4,
    });
    return { lime, teal };
  }, []);

  useEffect(() => {
    const clap = () => {
      clapQueued.current = true;
    };
    window.addEventListener("trex-clap", clap);
    return () => window.removeEventListener("trex-clap", clap);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (clapQueued.current) {
      clapQueued.current = false;
      clapStart.current = t;
    }

    const idle = 0.34 + Math.sin(t * 1.1) * 0.05;
    let angle = idle;
    const since = t - clapStart.current;
    if (since >= 0 && since < 0.55) {
      // snap shut fast, reopen with ease
      const p = since / 0.55;
      angle =
        p < 0.28
          ? idle * (1 - Math.pow(p / 0.28, 2))
          : idle * Math.pow((p - 0.28) / 0.72, 1.6);
    }
    if (arm.current) arm.current.rotation.z = angle;
  });

  const stripeXs = [-1.05, -0.63, -0.21, 0.21, 0.63, 1.05];

  // Brand logo on the back of the board — visible as the scene rotates.
  const logoTex = useTexture("/brand/logo.png");
  logoTex.colorSpace = THREE.SRGBColorSpace;

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.45}>
      <group position={[0, 1.55, 0]}>
        {/* board body */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[2.7, 1.5, 0.16]} />
          <primitive object={materials.base} attach="material" />
        </mesh>

        {/* logo on the back face */}
        <mesh position={[0, -0.2, -0.085]} rotation-y={Math.PI}>
          <planeGeometry args={[2.2, 0.71]} />
          <meshBasicMaterial map={logoTex} transparent toneMapped={false} />
        </mesh>

        {/* detail lines on the board face */}
        <mesh position={[0, 0.08, 0.085]}>
          <boxGeometry args={[2.3, 0.03, 0.02]} />
          <primitive object={stripeMats.teal} attach="material" />
        </mesh>
        <mesh position={[0, -0.34, 0.085]}>
          <boxGeometry args={[2.3, 0.03, 0.02]} />
          <primitive object={stripeMats.teal} attach="material" />
        </mesh>
        {/* "rec" lamp */}
        <mesh position={[0.98, -0.68, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <primitive object={stripeMats.lime} attach="material" />
        </mesh>

        {/* fixed top slab */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[2.7, 0.34, 0.16]} />
          <primitive object={materials.base} attach="material" />
        </mesh>
        {stripeXs.map((sx, i) => (
          <mesh key={`f${i}`} position={[sx, 0.72, 0.085]} rotation-z={-0.45}>
            <boxGeometry args={[0.28, 0.34, 0.02]} />
            <primitive
              object={i % 2 === 0 ? stripeMats.lime : stripeMats.teal}
              attach="material"
            />
          </mesh>
        ))}

        {/* clapper arm, hinged at the left end */}
        <group ref={arm} position={[-1.35, 0.93, 0]}>
          <mesh position={[1.35, 0.17, 0]}>
            <boxGeometry args={[2.7, 0.34, 0.16]} />
            <primitive object={materials.base} attach="material" />
          </mesh>
          {stripeXs.map((sx, i) => (
            <mesh
              key={`a${i}`}
              position={[sx + 1.35, 0.17, 0.085]}
              rotation-z={0.45}
            >
              <boxGeometry args={[0.28, 0.34, 0.02]} />
              <primitive
                object={i % 2 === 0 ? stripeMats.teal : stripeMats.lime}
                attach="material"
              />
            </mesh>
          ))}
        </group>

        <pointLight color="#45e78f" intensity={6} distance={8} />
      </group>
    </Float>
  );
}

class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function TRex() {
  // Probe for the model before mounting the loader so a missing file
  // falls back silently instead of surfacing a fetch error.
  const [status, setStatus] = useState<"checking" | "ready" | "missing">(
    "checking"
  );

  useEffect(() => {
    let alive = true;
    fetch(MODEL_PATH, { method: "HEAD" })
      .then((res) => {
        if (alive) setStatus(res.ok ? "ready" : "missing");
      })
      .catch(() => {
        if (alive) setStatus("missing");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (status === "checking") return null;
  if (status === "missing") return <Clapperboard />;

  return (
    <ModelBoundary fallback={<Clapperboard />}>
      <RexModel />
    </ModelBoundary>
  );
}
