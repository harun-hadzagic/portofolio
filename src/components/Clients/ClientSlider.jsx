import React from "react";
import styled from "styled-components";
import { IoIosQuote } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";

const ClientSlider = ({ item }) => {
  const { name, position, img_url, stars, disc, link } = item;

  return (
    <Container>
      <Quote>
        <IoIosQuote />
      </Quote>
      <Stars>
        {Array(stars)
          .fill()
          .map((_, i) => (
            <AiFillStar key={i} />
          ))}
      </Stars>
      <Body>{disc}</Body>
      <Person href={link} target="_blank" rel="noreferrer">
        <img src={img_url} alt={name} />
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
  font-weight: 200;
  line-height: 1.5;
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
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-bone-white);
  }

  p {
    font-size: 13px;
    color: var(--color-ash-gray);
    margin-top: 2px;
    text-transform: capitalize;
  }
`;
