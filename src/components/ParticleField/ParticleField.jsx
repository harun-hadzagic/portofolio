import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const TAU = Math.PI * 2;

const PALETTE = [
  { color: "129, 90, 255", weight: 5 }, // electric iris
  { color: "163, 138, 255", weight: 3 }, // lighter iris
  { color: "255, 184, 41", weight: 3 }, // saffron spark
  { color: "43, 217, 185", weight: 2 }, // bright teal
  { color: "21, 132, 110", weight: 1 }, // deep verdant
  { color: "255, 95, 209", weight: 2 }, // magenta
  { color: "95, 139, 255", weight: 2 }, // blue
];

const weightedPalette = PALETTE.reduce((arr, entry) => {
  for (let i = 0; i < entry.weight; i++) arr.push(entry.color);
  return arr;
}, []);

const pickColor = () => weightedPalette[(Math.random() * weightedPalette.length) | 0];
const rand = (min, max) => min + Math.random() * (max - min);

function makeHarmonics() {
  return [
    { amp: rand(0.08, 0.16), freq: 2 + Math.round(rand(0, 2)), phase: rand(0, TAU) },
    { amp: rand(0.05, 0.1), freq: 4 + Math.round(rand(0, 3)), phase: rand(0, TAU) },
    { amp: rand(0.03, 0.06), freq: 7 + Math.round(rand(0, 3)), phase: rand(0, TAU) },
  ];
}

function blobMultiplier(angle, harmonics) {
  let r = 1;
  for (const h of harmonics) r += h.amp * Math.sin(angle * h.freq + h.phase);
  return r;
}

function buildParticles(width, height, variant) {
  const isHero = variant === "hero";
  const area = width * height;
  const density = isHero ? 2600 : 9000;
  const count = Math.max(
    isHero ? 90 : 40,
    Math.min(isHero ? 240 : 130, Math.round(area / density))
  );

  const cx = width * (isHero ? 0.52 : 0.5);
  const cy = height * (isHero ? 0.48 : 0.5);
  const radiusX = isHero ? width * 0.44 : width * 0.65;
  const radiusY = isHero ? height * 0.42 : height * 0.65;
  const harmonics = makeHarmonics();

  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = rand(0, TAU);
    const edgeBias = isHero ? rand(0.3, 1) : rand(0, 1);
    const mult = blobMultiplier(angle, harmonics) * edgeBias;
    const baseX = cx + Math.cos(angle) * radiusX * mult;
    const baseY = cy + Math.sin(angle) * radiusY * mult;

    particles.push({
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      size: rand(isHero ? 2.5 : 2, isHero ? 7 : 5),
      rotation: rand(0, TAU),
      rotSpeed: rand(-0.4, 0.4),
      driftAmp: rand(4, isHero ? 16 : 22),
      driftSpeed: rand(0.15, 0.4),
      phaseX: rand(0, TAU),
      phaseY: rand(0, TAU),
      color: pickColor(),
      alpha: isHero ? rand(0.45, 0.95) : rand(0.12, 0.32),
    });
  }
  return particles;
}

function buildLinks(particles, maxDist, maxPerNode) {
  const links = [];
  for (let i = 0; i < particles.length; i++) {
    const distances = [];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const dx = particles[i].baseX - particles[j].baseX;
      const dy = particles[i].baseY - particles[j].baseY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) distances.push([j, d]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    distances.slice(0, maxPerNode).forEach(([j, d]) => {
      if (i < j) links.push([i, j, 1 - d / maxDist]);
    });
  }
  return links;
}

function drawTriangle(ctx, x, y, size, rotation) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = rotation + i * (TAU / 3) - Math.PI / 2;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

const ParticleField = ({ variant = "hero", className }) => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let particles = [];
    let links = [];
    let width = 0;
    let height = 0;
    let rafId = null;
    let resizeTimeout = null;
    let hidden = document.hidden;

    const setup = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = buildParticles(width, height, variant);
      links =
        variant === "hero"
          ? buildLinks(particles, Math.min(width, height) * 0.16, 2)
          : [];
    };

    const render = (t) => {
      ctx.clearRect(0, 0, width, height);

      if (links.length) {
        ctx.lineWidth = 1;
        links.forEach(([i, j, strength]) => {
          const a = particles[i];
          const b = particles[j];
          ctx.strokeStyle = `rgba(160, 150, 255, ${strength * 0.14})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      }

      particles.forEach((p) => {
        const time = reduceMotion ? 0 : t;
        p.x = p.baseX + Math.sin(time * p.driftSpeed + p.phaseX) * p.driftAmp;
        p.y = p.baseY + Math.cos(time * p.driftSpeed * 0.8 + p.phaseY) * p.driftAmp;
        const rotation = reduceMotion
          ? p.rotation
          : p.rotation + Math.sin(time * 0.2 + p.phaseX) * 0.6;
        ctx.strokeStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.lineWidth = variant === "hero" ? 1.4 : 1;
        drawTriangle(ctx, p.x, p.y, p.size, rotation);
      });
    };

    const loop = (ts) => {
      render(ts / 1000);
      if (!reduceMotion && !hidden) rafId = requestAnimationFrame(loop);
    };

    setup();
    render(0);
    if (!reduceMotion) rafId = requestAnimationFrame(loop);

    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setup();
        render(0);
      }, 200);
    };

    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden && !reduceMotion && !rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return (
    <Wrap ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </Wrap>
  );
};

export default ParticleField;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  canvas {
    display: block;
  }
`;
