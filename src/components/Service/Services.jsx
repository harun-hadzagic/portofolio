import React from "react";
import { MdDesignServices } from "react-icons/md";
import { FiCodesandbox } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import styled from "styled-components";
import Card from "./Card";
import { Fade } from "react-awesome-reveal";
import css from "../../assets/images/css.svg";
import firebase from "../../assets/images/firebase.svg";
import git from "../../assets/images/git.svg";
import html from "../../assets/images/html.svg";
import javaScript from "../../assets/images/javascript.svg";
import mongoDb from "../../assets/images/mongodb.svg";
import nodeJs from "../../assets/images/nodejs.svg";
import react from "../../assets/images/react.svg";
import typeScript from "../../assets/images/typescript.svg";
import vue from "../../assets/images/vue.svg";
import github from "../../assets/images/github.png";
import sql from "../../assets/images/sql-server.png";

const skillsArray = [
  { src: javaScript, name: "JavaScript" },
  { src: typeScript, name: "TypeScript" },
  { src: react, name: "React" },
  { src: vue, name: "Vue" },
  { src: nodeJs, name: "Node.js" },
  { src: firebase, name: "Firebase" },
  { src: mongoDb, name: "MongoDB" },
  { src: sql, name: "SQL Server" },
  { src: github, name: "GitHub" },
  { src: git, name: "Git" },
  { src: html, name: "HTML" },
  { src: css, name: "CSS" },
];

const services = [
  {
    Icon: MdDesignServices,
    title: "Responsive Website Design",
    disc: "Visually appealing, user-friendly websites optimized for every device and screen size, from desktop to mobile.",
  },
  {
    Icon: FiCodesandbox,
    title: "Custom Web Applications",
    disc: "Tailor-made web applications built end to end — from concept to deployment — using modern front-end and back-end technology.",
  },
  {
    Icon: CgWebsite,
    title: "Database Design & Management",
    disc: "Robust, well-structured databases that keep your application's data secure, consistent, and fast.",
  },
];

const Services = () => {
  return (
    <Container id="service">
      <Fade direction="up" triggerOnce>
        <Eyebrow>My services</Eyebrow>
        <Headline>What I do</Headline>
      </Fade>

      <Cards>
        {services.map((service, i) => (
          <Fade direction="up" triggerOnce delay={i * 100} key={service.title}>
            <Card Icon={service.Icon} title={service.title} disc={service.disc} />
          </Fade>
        ))}
      </Cards>

      <Fade direction="up" triggerOnce>
        <SkillsHeadline>
          My <span className="iris">skills</span>
        </SkillsHeadline>
      </Fade>
      <Fade direction="up" triggerOnce>
        <SkillsRow>
          {skillsArray.map((skill) => (
            <img src={skill.src} key={skill.name} alt={skill.name} title={skill.name} />
          ))}
        </SkillsRow>
      </Fade>
    </Container>
  );
};

export default Services;

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

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-60);
  margin-top: var(--spacing-96);
`;

const SkillsHeadline = styled.h3`
  font-size: var(--text-subheading);
  font-weight: 400;
  color: var(--color-bone-white);
  margin-top: var(--spacing-96);
  margin-bottom: var(--spacing-60);

  @media (max-width: 840px) {
    margin-top: var(--spacing-60);
  }
`;

const SkillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-60);

  img {
    height: 42px;
    width: auto;
    filter: grayscale(1);
    opacity: 0.5;
    transition: filter 300ms ease-in-out, opacity 300ms ease-in-out, transform 300ms ease-in-out;

    :hover {
      filter: grayscale(0);
      opacity: 1;
      transform: translateY(-4px);
    }
  }

  @media (max-width: 640px) {
    gap: var(--spacing-36);
    img {
      height: 32px;
    }
  }
`;
