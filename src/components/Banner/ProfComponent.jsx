import React from "react";
import styled from "styled-components";
import { Fade } from "react-awesome-reveal";
import ParticleField from "../ParticleField/ParticleField";
import HeroIntro from "./HeroIntro";

const ProfComponent = () => {
  return (
    <Container id="home">
      <Fade direction="up" triggerOnce cascade damping={0.15}>
        <HeroIntro />
      </Fade>

      <Visual aria-hidden="true">
        <ParticleField variant="hero" />
      </Visual>
    </Container>
  );
};

export default ProfComponent;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-60);
  width: 86%;
  max-width: var(--page-max-width);
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  padding-bottom: var(--spacing-60);

  @media (max-width: 840px) {
    width: 90%;
  }

  @media (max-width: 900px) {
    flex-direction: column-reverse;
    min-height: auto;
    padding-top: var(--spacing-24);
    gap: var(--spacing-36);
  }
`;

const Visual = styled.div`
  flex: 1;
  height: 460px;
  min-width: 0;

  @media (max-width: 900px) {
    width: 100%;
    height: 320px;
  }

  @media (max-width: 480px) {
    height: 260px;
  }
`;
