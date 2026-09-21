import React from "react";
import styled from "styled-components";
import { HiOutlineExternalLink } from "react-icons/hi";

const Project = ({ item }) => {
  const { img, disc, title, demo, demoLabel } = item;
  const label = demoLabel || "View demo";
  return (
    <Container>
      <ImageWrap>
        <img src={img} alt={title} loading="lazy" decoding="async" />
      </ImageWrap>
      <Title>{title}</Title>
      <Disc>{disc}</Disc>
      {demo && (
        <Demo
          href={demo}
          target="_blank"
          rel="noreferrer"
          /* Out of context a bare "Visit site" tells a screen-reader user
             nothing; the visible text stays inside the accessible name. */
          aria-label={`${label} — ${title}`}
        >
          {label} <HiOutlineExternalLink aria-hidden="true" />
        </Demo>
      )}
    </Container>
  );
};

export default Project;

const Container = styled.div`
  width: 340px;

  @media (max-width: 990px) {
    width: 300px;
  }

  @media (max-width: 600px) {
    width: 260px;
  }
`;

const ImageWrap = styled.div`
  border-radius: var(--radius-cards);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background-color: #0a0a0a;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease-in-out;
  }

  transition: box-shadow 400ms ease-in-out;

  /* focus-within mirrors hover so keyboard users get the same emphasis
     when they tab onto the card's link. */
  ${Container}:hover &,
  ${Container}:focus-within & {
    box-shadow: 0 0 0 2px var(--color-electric-iris);
  }

  ${Container}:hover & img,
  ${Container}:focus-within & img {
    transform: scale(1.05);
  }
`;

const Title = styled.h3`
  margin-top: var(--spacing-24);
  font-size: var(--text-heading-xs);
  font-weight: 400;
  letter-spacing: var(--tracking-heading);
  text-wrap: balance;
  color: var(--color-bone-white);
`;

const Disc = styled.p`
  margin-top: var(--spacing-6);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.55;
  text-wrap: pretty;
  color: var(--color-silver-mist);
`;

const Demo = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  /* 15px tall as drawn; the hit area needs to clear 24px. */
  ::after {
    content: "";
    position: absolute;
    inset: -8px -4px;
  }

  margin-top: var(--spacing-12);
  color: var(--color-saffron-spark);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-decoration: none;

  svg {
    transition: transform 250ms ease-in-out;
  }

  :hover svg,
  :focus-visible svg {
    transform: translate(2px, -2px);
  }
`;
