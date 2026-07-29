import React from "react";
import styled from "styled-components";
import { AiFillGithub, AiOutlineInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

const HeroIntro = () => {
  return (
    <Content>
      <Eyebrow>Full-stack web developer</Eyebrow>
      <Headline>Harun Hadzagic</Headline>
      <Body>
        I build elegant, fast web experiences from front to back —
        translating ideas into products people actually enjoy using.
      </Body>
      <CtaRow>
        <PrimaryButton href="#footer">Let&rsquo;s talk</PrimaryButton>
        <GhostLink
          href="https://drive.google.com/file/d/1xqKJoWVSRiY9L_V32P4ibgd0h9SWYYLZ/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          View my CV →
        </GhostLink>
      </CtaRow>
      <SocialRow>
        <span>Find me on</span>
        <div className="icons">
          <a href="https://github.com/harun-hadzagic" target="_blank" rel="noreferrer" aria-label="GitHub">
            <AiFillGithub />
          </a>
          <a href="https://www.linkedin.com/in/harun-h-437807136/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://www.instagram.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <AiOutlineInstagram />
          </a>
        </div>
      </SocialRow>
    </Content>
  );
};

export default HeroIntro;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Eyebrow = styled.p`
  color: var(--color-saffron-spark);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: var(--spacing-18);
`;

const Headline = styled.h1`
  color: var(--color-bone-white);
  font-weight: 400;
  font-size: clamp(42px, 7vw, 78px);
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: var(--spacing-24);
`;

const Body = styled.p`
  color: var(--color-silver-mist);
  font-weight: 200;
  font-size: var(--text-body);
  line-height: 1.5;
  max-width: 480px;
`;

const CtaRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-36);
  margin-top: var(--spacing-36);
  flex-wrap: wrap;
`;

const PrimaryButton = styled.a`
  background-color: var(--color-electric-iris);
  color: var(--color-bone-white);
  text-decoration: none;
  padding: 14.4px 24px;
  border-radius: var(--radius-buttons);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: filter 250ms ease-in-out, transform 250ms ease-in-out;

  :hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }
`;

const GhostLink = styled.a`
  color: var(--color-bone-white);
  text-decoration: none;
  font-size: var(--text-nav-label);
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 2px;
  transition: border-color 250ms ease-in-out, color 250ms ease-in-out;

  :hover {
    border-color: var(--color-saffron-spark);
    color: var(--color-saffron-spark);
  }
`;

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-18);
  margin-top: var(--spacing-60);

  span {
    color: var(--color-ash-gray);
    font-size: var(--text-caption);
    text-transform: uppercase;
    letter-spacing: 0.35px;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-18);

    a {
      color: var(--color-ash-gray);
      font-size: 1.2rem;
      display: flex;
      transition: color 250ms ease-in-out, transform 250ms ease-in-out;

      :hover {
        color: var(--color-electric-iris);
        transform: translateY(-2px);
      }
    }
  }
`;
