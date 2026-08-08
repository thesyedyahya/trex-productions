"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { sound } from "@/lib/audio";
import { TRex } from "./TRex";

/*
 * Scroll-driven hero scene. The page's scroll progress (0→1 across the
 * 400vh hero) flies the camera along a spline around the specimen while
 * the model slowly turns to meet it. Pointer adds a subtle parallax.
 */

const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 1.9, 8.4), // beat 1 — wide reveal
    new THREE.Vector3(4.8, 2.0, 4.4), // beat 2 — side orbit
    new THREE.Vector3(-2.8, 2.8, 3.6), // beat 3 — close on the head
    new THREE.Vector3(0, 3.6, 9.8), // beat 4 — high pull-back
  ],
  false,
  "catmullrom",
  0.35
);

const TARGET_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 1.5, 0),
    new THREE.Vector3(0, 1.5, 0),
    new THREE.Vector3(0, 1.9, 0),
    new THREE.Vector3(0, 1.2, 0),
  ],
  false,
  "catmullrom",
  0.35
);

function ScrollCameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera, pointer } = useThree();
  const eased = useRef(0);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    // ease toward the scroll position so fast scrolls feel weighted
    eased.current += (progress.get() - eased.current) * 0.08;
    const t = THREE.MathUtils.clamp(eased.current, 0, 1);

    CAMERA_PATH.getPointAt(t, pos);
    TARGET_PATH.getPointAt(t, target);

    camera.position.set(
      pos.x + pointer.x * 0.6,
      pos.y + pointer.y * 0.35,
      pos.z
    );
    camera.lookAt(target);
  });

  return null;
}

/*
 * Scales the whole stage down on narrow (portrait) viewports so the
 * specimen never crowds or clips the copy on phones.
 */
function FitStage({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();

  useEffect(() => {
    if (!group.current) return;
    const aspect = size.width / size.height;
    const s = THREE.MathUtils.clamp(aspect / 1.15, 0.55, 1);
    group.current.scale.setScalar(s);
  }, [size]);

  return <group ref={group}>{children}</group>;
}

function SpecimenRig({
  progress,
  children,
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const p = progress.get();
    const idle = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
    // extra half-turn eased in over the finale so the model lands
    // front-facing (2π) at the CTA instead of edge-on
    const finale = THREE.MathUtils.smoothstep(p, 0.78, 1) * Math.PI * 0.5;
    group.current.rotation.y = p * Math.PI * 1.5 + finale + idle;
  });

  return <group ref={group}>{children}</group>;
}

/* Tap (press without travel) makes the rex roar. */
function TapRoar() {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    let downAt: { x: number; y: number } | null = null;

    const down = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY };
    };
    const up = (e: PointerEvent) => {
      if (
        downAt &&
        Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 6
      ) {
        sound.roar();
        window.dispatchEvent(new Event("trex-clap"));
      }
      downAt = null;
    };

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  return null;
}

/* Soft brand-green stage glow under the specimen — no grids, no rings. */
function StageGlow() {
  return (
    <group rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
      <mesh>
        <circleGeometry args={[6.5, 64]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              float dist = length(vUv - 0.5) * 2.0;
              float glow = smoothstep(1.0, 0.0, dist);
              vec3 color = mix(vec3(0.082, 0.796, 0.816), vec3(0.271, 0.906, 0.561), glow);
              gl_FragColor = vec4(color, glow * glow * 0.4);
            }
          `}
        />
      </mesh>
      {/* one thin accent ring, teal */}
      <mesh>
        <ringGeometry args={[2.9, 2.94, 96]} />
        <meshBasicMaterial
          color="#15cbd0"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* Drifting dust motes catching the stage light. */
function Motes({ count = 500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.random() * 8;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#45e78f"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ScrollScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.9, 8.4], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#041033"]} />
      <fog attach="fog" args={["#041033", 10, 28]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 8, 2]} intensity={0.8} color="#8fd0ff" />
      <pointLight position={[0, 4, 2]} intensity={9} color="#2e7cff" distance={16} />
      <pointLight position={[5, 1.5, 3]} intensity={6} color="#45e78f" distance={14} />
      <pointLight position={[-5, 2, -3]} intensity={5} color="#15cbd0" distance={15} />

      <FitStage>
        <Suspense fallback={null}>
          <SpecimenRig progress={progress}>
            <TRex />
          </SpecimenRig>
        </Suspense>
        <StageGlow />
      </FitStage>
      <Motes />

      <ScrollCameraRig progress={progress} />
      <TapRoar />

      <EffectComposer>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.18} />
        <Vignette eskil={false} offset={0.12} darkness={0.62} />
      </EffectComposer>
    </Canvas>
  );
}
