import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ParticleOrb from "./ParticleOrb";
import HeroIntro from "../Banner/HeroIntro";
import useScrollProgress from "../../hooks/useScrollProgress";

const clampMap = (v, inMin, inMax) => {
  if (inMax === inMin) return v >= inMax ? 1 : 0;
  return Math.min(1, Math.max(0, (v - inMin) / (inMax - inMin)));
};

const trapezoid = (v, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) =>
  clampMap(v, fadeInStart, fadeInEnd) - clampMap(v, fadeOutStart, fadeOutEnd);

const STATEMENTS = [
  "Every project starts the same way — a problem worth solving, and the discipline to solve it well.",
  "I sweat the details most people never notice. That's usually where the difference is.",
];

const Hero3D = () => {
  const wrapperRef = useRef(null);
  const progress = useScrollProgress(wrapperRef);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stage0Opacity = 1 - clampMap(progress, 0.16, 0.24);
  const stage1Opacity = trapezoid(progress, 0.24, 0.3, 0.46, 0.52);
  const stage2Opacity = trapezoid(progress, 0.52, 0.58, 0.78, 0.86);

  const orbSpeed = 0.1 + progress * 0.12;

  return (
    <Wrapper ref={wrapperRef} id="home">
      <Sticky>
        <Row>
          <TextPane>
            <Panel style={{ opacity: stage0Opacity, pointerEvents: stage0Opacity > 0.15 ? "auto" : "none" }}>
              <HeroIntro />
            </Panel>
            <Panel style={{ opacity: stage1Opacity, pointerEvents: "none" }}>
              <Statement>{STATEMENTS[0]}</Statement>
            </Panel>
            <Panel style={{ opacity: stage2Opacity, pointerEvents: "none" }}>
              <Statement>{STATEMENTS[1]}</Statement>
            </Panel>
          </TextPane>
          <VisualPane aria-hidden="true">
            <ParticleOrb speed={orbSpeed} active={inView} />
          </VisualPane>
        </Row>
      </Sticky>
    </Wrapper>
  );
};

export default Hero3D;

const Wrapper = styled.div`
  position: relative;
  height: 320vh;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-60);
  width: 86%;
  max-width: var(--page-max-width);
  margin: 0 auto;
`;

const TextPane = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  min-height: 380px;
`;

const Panel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: opacity 200ms linear;
`;

const Statement = styled.p`
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -1px;
  color: var(--color-bone-white);
  max-width: 560px;
`;

const VisualPane = styled.div`
  flex: 1;
  min-width: 0;
  height: clamp(380px, 58vh, 620px);

  /* Dissolve the canvas rectangle so its edge never reads as a hard cut-off. */
  --orb-fade: radial-gradient(
    ellipse closest-side at 50% 50%,
    #000 0 90%,
    transparent 100%
  );
  -webkit-mask-image: var(--orb-fade);
  mask-image: var(--orb-fade);
`;
