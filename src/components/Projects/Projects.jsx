import React from "react";
import styled from "styled-components";
import SliderComp from "./Slider";
import { Fade } from "react-awesome-reveal";

const Projects = () => {
  return (
    <Container id="project">
      <Fade direction="up" triggerOnce>
        <Eyebrow>My work</Eyebrow>
        <Headline>Recent projects</Headline>
        <SubBody>
          A small showcase of the products I&rsquo;ve built — reach out if
          you&rsquo;d like to see more.
        </SubBody>
      </Fade>
      <SliderWrap>
        <SliderComp />
      </SliderWrap>
    </Container>
  );
};

export default Projects;

const Container = styled.div`
  width: 86%;
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding-top: var(--spacing-120);

  @media (max-width: 840px) {
    width: 90%;
    padding-top: var(--spacing-96);
  }
`;

const Eyebrow = styled.p`
  color: var(--color-saffron-spark);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: var(--spacing-18);
`;

const Headline = styled.h2`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 400;
  letter-spacing: -1.68px;
  color: var(--color-bone-white);
`;

const SubBody = styled.p`
  margin-top: var(--spacing-18);
  max-width: 520px;
  font-size: var(--text-body);
  font-weight: 200;
  color: var(--color-silver-mist);
  line-height: 1.5;
`;

const SliderWrap = styled.div`
  margin-top: var(--spacing-60);
`;
