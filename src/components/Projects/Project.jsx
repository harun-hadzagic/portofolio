import React from "react";
import styled from "styled-components";
import { HiOutlineExternalLink } from "react-icons/hi";

const Project = ({ item }) => {
  const { img, disc, title, demo } = item;
  return (
    <Container>
      <ImageWrap>
        <img src={img} alt={title} loading="lazy" />
      </ImageWrap>
      <Title>{title}</Title>
      <Disc>{disc}</Disc>
      {demo && (
        <Demo href={demo} target="_blank" rel="noreferrer">
          View demo <HiOutlineExternalLink />
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
    transition: transform 400ms ease-in-out, filter 400ms ease-in-out;
  }

  transition: box-shadow 400ms ease-in-out;

  ${Container}:hover & {
    box-shadow: 0 0 0 2px var(--color-electric-iris);
  }

  ${Container}:hover & img {
    transform: scale(1.05);
  }
`;

const Title = styled.h3`
  margin-top: var(--spacing-24);
  font-size: var(--text-heading-xs);
  font-weight: 400;
  color: var(--color-bone-white);
`;

const Disc = styled.p`
  margin-top: var(--spacing-6);
  font-size: 15px;
  font-weight: 200;
  line-height: 1.5;
  color: var(--color-silver-mist);
`;

const Demo = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--spacing-12);
  color: var(--color-saffron-spark);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-decoration: none;

  svg {
    transition: transform 250ms ease-in-out;
  }

  :hover svg {
    transform: translate(2px, -2px);
  }
`;
