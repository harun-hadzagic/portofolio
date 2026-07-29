import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const SHELL_RADIUS = 1.9;
const SHELL_NOISE = 0.22;
// buildShell's noise term peaks at 1 + noiseAmp * (0.5 + 0.3 + 0.2)
const ORB_MAX_RADIUS = SHELL_RADIUS * (1 + SHELL_NOISE);

const PALETTE = [
  { hex: "#8052ff", weight: 5 },
  { hex: "#a38aff", weight: 3 },
  { hex: "#ffb829", weight: 3 },
  { hex: "#2bd9b9", weight: 2 },
  { hex: "#ff5fd1", weight: 2 },
  { hex: "#5f8bff", weight: 2 },
];

const weighted = PALETTE.reduce((arr, entry) => {
  for (let i = 0; i < entry.weight; i++) arr.push(entry.hex);
  return arr;
}, []);

const pickColor = () => new THREE.Color(weighted[(Math.random() * weighted.length) | 0]);

function buildShell(count, radius, noiseAmp, seed) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i + seed;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const noise =
      1 +
      noiseAmp *
        (Math.sin(theta * 3 + y * 5 + seed) * 0.5 +
          Math.sin(theta * 7 - y * 2) * 0.3 +
          Math.sin(y * 11 + seed) * 0.2);

    positions[i * 3] = x * radius * noise;
    positions[i * 3 + 1] = y * radius * noise;
    positions[i * 3 + 2] = z * radius * noise;

    const c = pickColor();
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return { positions, colors };
}

function buildLinks(positions, count, maxDist, maxPerNode) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push([positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]);
  }
  const segments = [];
  for (let i = 0; i < count; i += 3) {
    const distances = [];
    for (let j = 0; j < count; j += 3) {
      if (i === j) continue;
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const dz = pts[i][2] - pts[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < maxDist) distances.push([j, d]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    distances.slice(0, maxPerNode).forEach(([j]) => {
      if (i < j) {
        segments.push(...pts[i], ...pts[j]);
      }
    });
  }
  return new Float32Array(segments);
}

/**
 * Pulls the camera back until the orb's silhouette fits inside the shorter axis
 * of the canvas, so the sphere is never clipped by the pane's edges.
 */
const FitCamera = ({ radius = ORB_MAX_RADIUS, padding = 1.14 }) => {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  useLayoutEffect(() => {
    const aspect = width / Math.max(1, height);
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const halfAngle = Math.min(vFov, hFov) / 2;

    camera.position.set(0, 0, (radius * padding) / Math.sin(halfAngle));
    camera.updateProjectionMatrix();
  }, [camera, width, height, radius, padding]);

  return null;
};

const Orb = ({ speed }) => {
  const group = useRef();

  const outer = useMemo(() => buildShell(3600, SHELL_RADIUS, SHELL_NOISE, 0), []);
  const inner = useMemo(() => buildShell(1400, 1.25, 0.28, 4.2), []);
  const linkPositions = useMemo(
    () => buildLinks(outer.positions, 420, 0.42, 2),
    [outer]
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * speed;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <group ref={group}>
      <Points positions={outer.positions} colors={outer.colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </Points>
      <Points positions={inner.positions} colors={inner.colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.032}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.55}
        />
      </Points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linkPositions.length / 3}
            array={linkPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#a596ff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

const ParticleOrb = ({ speed = 0.12, bloom = true, sparkles = true, active = true }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <FitCamera />
      <Orb speed={speed} />
      {sparkles && (
        <Sparkles count={140} scale={4} size={1.4} speed={0.15} color="#8052ff" opacity={0.4} />
      )}
      {bloom && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.05}
            luminanceSmoothing={0.9}
            intensity={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
};

export default ParticleOrb;
