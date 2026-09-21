import React from "react";
import styled from "styled-components";

const Card = ({ Icon, title, disc }) => {
  return (
    <Container>
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      <p>{disc}</p>
    </Container>
  );
};

export default Card;

const Container = styled.div`
  width: 100%;

  svg {
    font-size: 2.5rem;
    color: var(--color-electric-iris);
    margin-bottom: var(--spacing-24);
  }

  h3 {
    font-size: var(--text-heading-2xs);
    font-weight: 400;
    letter-spacing: var(--tracking-heading);
    text-wrap: balance;
    color: var(--color-bone-white);
    margin-bottom: var(--spacing-12);
  }

  p {
    font-size: var(--text-body);
    font-weight: 300;
    color: var(--color-silver-mist);
    line-height: 1.55;
    text-wrap: pretty;
    max-width: 340px;
  }
`;
