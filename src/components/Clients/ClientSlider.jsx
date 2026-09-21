import React from "react";
import styled from "styled-components";
import { IoIosQuote } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";

const ClientSlider = ({ item }) => {
  const { name, position, img_url, stars, disc, link } = item;

  return (
    <Container>
      <Quote aria-hidden="true">
        <IoIosQuote />
      </Quote>
      {/* Five decorative glyphs say nothing to a screen reader; one label does. */}
      <Stars role="img" aria-label={`Rated ${stars} out of 5`}>
        {Array(stars)
          .fill()
          .map((_, i) => (
            <AiFillStar key={i} aria-hidden="true" />
          ))}
      </Stars>
      <Body>{disc}</Body>
      <Person
        href={link}
        target="_blank"
        rel="noreferrer"
        aria-label={`${name}, ${position} — view LinkedIn profile`}
      >
        {/* alt="" on purpose: the name sits right beside it, so alt text here
            would make the link announce the same name twice. */}
        <img src={img_url} alt="" width="64" height="64" loading="lazy" />
        <div>
          <h4>{name}</h4>
          <p>{position}</p>
        </div>
      </Person>
    </Container>
  );
};

export default ClientSlider;

const Container = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;

  @media (max-width: 990px) {
    width: 320px;
  }

  @media (max-width: 600px) {
    width: 280px;
  }
`;

const Quote = styled.span`
  font-size: 2.5rem;
  color: var(--color-electric-iris);
  opacity: 0.6;
  line-height: 1;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
  margin-top: var(--spacing-12);
  color: var(--color-saffron-spark);
  font-size: 1rem;
`;

const Body = styled.p`
  margin-top: var(--spacing-18);
  font-size: var(--text-body);
  font-weight: 300;
  line-height: 1.55;
  text-wrap: pretty;
  color: var(--color-silver-mist);
  flex: 1;
`;

const Person = styled.a`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  margin-top: var(--spacing-24);
  text-decoration: none;
  cursor: pointer;

  img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: var(--radius-cards);
    object-fit: cover;
    box-shadow: 0 0 0 0 var(--color-electric-iris);
    transition: box-shadow 250ms ease-in-out;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-bone-white);
    transition: color 250ms ease-in-out;
  }

  p {
    font-size: 13px;
    color: var(--color-ash-gray);
    margin-top: 2px;
    text-transform: capitalize;
  }

  /* It was a link with no hover feedback at all — nothing said it was one. */
  :hover img,
  :focus-visible img {
    box-shadow: 0 0 0 2px var(--color-electric-iris);
  }

  :hover h4,
  :focus-visible h4 {
    color: var(--color-saffron-spark);
  }
`;
