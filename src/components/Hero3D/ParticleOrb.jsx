import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, PointMaterialImpl } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  PULSE_SLOTS,
  PULSE_LIFETIME,
  applyOrbField,
  createOrbUniforms,
  pointerToShell,
} from "./orbField";
import useOrbPointer from "./useOrbPointer";

const SHELL_RADIUS = 1.9;
const SHELL_NOISE = 0.22;
// buildShell's noise term peaks at 1 + noiseAmp * (0.5 + 0.3 + 0.2)
const ORB_MAX_RADIUS = SHELL_RADIUS * (1 + SHELL_NOISE);

// Interaction feel.
const DRAG_SENSITIVITY = 0.0062; // radians per pixel dragged
const SPIN_DAMPING = 2.1; // a flick glides for roughly a second and a half
const MAX_SPIN_SPEED = 7; // rad/s, so a violent flick still reads as an orb
const TILT_LIMIT = 0.5; // never far enough to look at the orb pole-on
const TILT_RETURN = 0.45; // and the tilt drifts home once you let go

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

function shellGeometry({ positions, colors }) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
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

const Orb = ({ speed, input, uniforms }) => {
  const lean = useRef();
  const spin = useRef();
  const camera = useThree((state) => state.camera);

  // Angles the visitor owns, kept outside React so a drag never re-renders.
  const motion = useRef({ spinAngle: 0, spinVelocity: 0, tilt: 0, leanX: 0, leanY: 0, presence: 0 });
  const pointerWorld = useMemo(() => new THREE.Vector3(), []);
  const pointerLocal = useMemo(() => new THREE.Vector3(), []);

  const outer = useMemo(() => buildShell(3600, SHELL_RADIUS, SHELL_NOISE, 0), []);
  const inner = useMemo(() => buildShell(1400, 1.25, 0.28, 4.2), []);

  const geometries = useMemo(() => {
    const links = new THREE.BufferGeometry();
    links.setAttribute(
      "position",
      new THREE.BufferAttribute(buildLinks(outer.positions, 420, 0.42, 2), 3)
    );
    return { outer: shellGeometry(outer), inner: shellGeometry(inner), links };
  }, [outer, inner]);

  const materials = useMemo(() => {
    const shell = (params) =>
      applyOrbField(
        new PointMaterialImpl({
          transparent: true,
          vertexColors: true,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          ...params,
        }),
        uniforms,
        { points: true }
      );

    return {
      outer: shell({ size: 0.045, opacity: 0.9 }),
      inner: shell({ size: 0.032, opacity: 0.55 }),
      links: applyOrbField(
        new THREE.LineBasicMaterial({
          color: "#a596ff",
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
        }),
        uniforms
      ),
    };
  }, [uniforms]);

  useEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [geometries, materials]
  );

  useFrame((state, delta) => {
    if (!spin.current || !lean.current) return;

    // A tab returning to the foreground hands back one enormous delta; clamping
    // keeps that from teleporting the orb or spiking the flick velocity.
    const dt = THREE.MathUtils.clamp(delta, 1 / 240, 1 / 30);
    const pointer = input.current;
    const m = motion.current;

    if (pointer.dragging) {
      const stepY = pointer.dx * DRAG_SENSITIVITY;
      m.spinAngle += stepY;
      m.tilt = THREE.MathUtils.clamp(
        m.tilt + pointer.dy * DRAG_SENSITIVITY,
        -TILT_LIMIT,
        TILT_LIMIT
      );
      // Smoothed so the release reads the swing of the gesture, not the last frame.
      m.spinVelocity = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(m.spinVelocity, stepY / dt, 0.3),
        -MAX_SPIN_SPEED,
        MAX_SPIN_SPEED
      );
    } else {
      m.spinAngle += m.spinVelocity * dt;
      m.spinVelocity *= Math.exp(-SPIN_DAMPING * dt);
      if (Math.abs(m.spinVelocity) < 0.002) m.spinVelocity = 0;
      m.tilt *= Math.exp(-TILT_RETURN * dt);
    }
    pointer.dx = 0;
    pointer.dy = 0;

    // The ambient rotation is never interrupted; the flick decays back into it.
    m.spinAngle += speed * dt;
    spin.current.rotation.y = m.spinAngle;

    const ease = 1 - Math.exp(-7 * dt);
    m.presence += ((pointer.hasPointer ? 1 : 0) - m.presence) * (1 - Math.exp(-5 * dt));
    // A drag is already direct control; leaning into it as well feels like drift.
    const lift = pointer.dragging ? 0 : m.presence;
    m.leanY += (pointer.ndcX * 0.13 * lift - m.leanY) * ease;
    m.leanX += (-pointer.ndcY * 0.09 * lift - m.leanX) * ease;

    lean.current.rotation.y = m.leanY;
    lean.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.12) * 0.12 + m.tilt + m.leanX;

    // Where the cursor meets the shell, expressed in the spinning group's own
    // space so the shader needs no knowledge of the current transform.
    camera.updateMatrixWorld();
    spin.current.updateWorldMatrix(true, false);
    pointerToShell(camera, pointer.ndcX, pointer.ndcY, SHELL_RADIUS, pointerWorld);
    spin.current.worldToLocal(pointerLocal.copy(pointerWorld));
    uniforms.uPointer.value.copy(pointerLocal);

    const contact = pointer.hasPointer ? (pointer.dragging ? 1.15 : 1) : 0;
    uniforms.uPointerStrength.value +=
      (contact - uniforms.uPointerStrength.value) * (1 - Math.exp(-6 * dt));

    const ages = uniforms.uPulseAge.value;
    for (let i = 0; i < PULSE_SLOTS; i++) {
      if (ages[i] < 0) continue;
      ages[i] += dt;
      if (ages[i] > PULSE_LIFETIME) ages[i] = -1;
    }

    if (pointer.firePulse) {
      pointer.firePulse = false;
      let slot = ages.findIndex((age) => age < 0);
      if (slot === -1) {
        slot = 0;
        for (let i = 1; i < PULSE_SLOTS; i++) if (ages[i] > ages[slot]) slot = i;
      }
      uniforms.uPulseOrigin.value[slot].copy(pointerLocal);
      ages[slot] = 0;
    }
  });

  return (
    <group ref={lean}>
      <group ref={spin}>
        <points geometry={geometries.outer} material={materials.outer} />
        <points geometry={geometries.inner} material={materials.inner} />
        <lineSegments geometry={geometries.links} material={materials.links} />
      </group>
    </group>
  );
};

const ParticleOrb = ({
  speed = 0.12,
  bloom = true,
  sparkles = true,
  active = true,
  affordance = false,
}) => {
  const cursorRef = useRef(null);
  const { stageRef, input, handlers, engaged } = useOrbPointer(cursorRef);
  const uniforms = useMemo(createOrbUniforms, []);

  return (
    <Stage ref={stageRef} {...handlers}>
      <CanvasHolder>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.75]}
          frameloop={active ? "always" : "never"}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <FitCamera />
          <Orb speed={speed} input={input} uniforms={uniforms} />
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
      </CanvasHolder>
      <Contact ref={cursorRef} data-orb-cursor="false" data-orb-press="false">
        <ContactRing />
      </Contact>
      <Hint $visible={affordance && !engaged}>Drag to spin</Hint>
    </Stage>
  );
};

export default ParticleOrb;

const Stage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* The contact ring stands in for the arrow here: a system cursor sitting on
     top of the orb reads as chrome, and the hand cursor promises a link. */
  cursor: none;
  user-select: none;
  -webkit-user-select: none;
  /* Vertical swipes stay with the page — this hero is a 320vh scroll section,
     and stealing that gesture would strand touch visitors inside it. */
  touch-action: pan-y;
`;

const CanvasHolder = styled.div`
  position: absolute;
  inset: 0;

  /* Dissolve the canvas rectangle so its edge never reads as a hard cut-off. */
  --orb-fade: radial-gradient(
    ellipse closest-side at 50% 50%,
    #000 0 90%,
    transparent 100%
  );
  -webkit-mask-image: var(--orb-fade);
  mask-image: var(--orb-fade);
`;

/* Position only — the ring's own transform is free to animate on top of it. */
const Contact = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;

  /* A touch pointer has no hover, so there is nothing to stand in for. */
  @media (hover: none) {
    display: none;
  }
`;

const ContactRing = styled.span`
  display: block;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 220ms cubic-bezier(0.16, 1, 0.3, 1);

  [data-orb-cursor="true"] > & {
    opacity: 1;
    transform: scale(1);
  }

  /* Pressing contracts the ring onto the point the shader is pushing from. */
  [data-orb-press="true"] > & {
    transform: scale(0.62);
    border-color: var(--color-saffron-spark);
  }
`;

const Hint = styled.span`
  position: absolute;
  left: 50%;
  bottom: 0;
  color: var(--color-ash-gray);
  font-size: var(--text-caption);
  text-transform: uppercase;
  letter-spacing: 0.35px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateX(-50%) translateY(${(p) => (p.$visible ? "0" : "6px")});
  transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
`;
