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
          View my CV <span aria-hidden="true">&rarr;</span>
        </GhostLink>
      </CtaRow>
      <SocialRow>
        <span>Find me on</span>
        <div className="icons">
          <a href="https://github.com/harun-hadzagic" target="_blank" rel="noreferrer" aria-label="GitHub">
            <AiFillGithub aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/in/harun-h-437807136/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn aria-hidden="true" />
          </a>
          <a href="https://www.instagram.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <AiOutlineInstagram aria-hidden="true" />
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
  /* em, not a fixed -0.04em ceiling: the clamp shrinks the size on small
     screens and proportional tracking shrinks with it. */
  letter-spacing: var(--tracking-display);
  text-wrap: balance;
  margin-bottom: var(--spacing-24);
`;

const Body = styled.p`
  color: var(--color-silver-mist);
  font-weight: 300;
  font-size: var(--text-body);
  line-height: 1.55;
  text-wrap: pretty;
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
  position: relative;
  color: var(--color-bone-white);
  text-decoration: none;

  /* 20px tall on its own — grow the hit area, not the underline. */
  ::after {
    content: "";
    position: absolute;
    inset: -8px -4px;
  }

  font-size: var(--text-nav-label);
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 2px;
  transition: border-color 250ms ease-in-out, color 250ms ease-in-out;

  span {
    display: inline-block;
    transition: transform 250ms ease-in-out;
  }

  :hover,
  :focus-visible {
    border-color: var(--color-saffron-spark);
    color: var(--color-saffron-spark);
  }

  :hover span,
  :focus-visible span {
    transform: translateX(3px);
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

      /* Expands the tap target to ~37px without moving the icon a pixel;
         19px glyphs are well under the 24px minimum on touch. */
      position: relative;

      ::after {
        content: "";
        position: absolute;
        inset: -9px;
      }

      :hover {
        color: var(--color-electric-iris);
        transform: translateY(-2px);
      }
    }
  }
`;
