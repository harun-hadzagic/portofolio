import React from "react";
import styled from "styled-components";
import ClientSlider from "./ClientSlider";
import Carousel from "../common/Carousel";
import { Fade } from "react-awesome-reveal";
import SA from "../../assets/images/SA.jpeg";
import AO from "../../assets/images/AO.jpeg";
import SC from "../../assets/images/SC.jpeg";
import AF from "../../assets/images/AF.jpeg";

const clients = [
  {
    name: "Samir Arapcic",
    position: "web developer | coding mentor",
    img_url: SA,
    stars: 5,
    link: "https://www.linkedin.com/in/samir-arapcic-05964470/",
    disc: `Harun's unwavering positivity, unyielding optimism, strong work ethic, and 'can-do' attitude showcase a remarkable level of maturity and an insatiable intellectual curiosity. His assignments consistently exhibit exceptional quality, and his ability to tackle challenges with a smile and unwavering determination is truly commendable.`,
  },
  {
    name: "Amila Omanovic",
    position: "project manager",
    img_url: AO,
    stars: 5,
    link: "https://www.linkedin.com/in/amila-omanovi%C4%87-a9764311a/",
    disc: `Harun is a committed team member and one of key drivers of our high client satisfaction scores. He sets very ambitious goals for himself and what's impressive is that he manages to meet them all. I appreciate that I can always count on him to treat all his tasks with importance. That's what makes him a reliable team member. Furthermore, he's an excellent communicator and keeps me up to date on his progress, ensuring we're always on the same page. He often shows initiative, has a great eye for detail and consistently produces high work quality.`,
  },
  {
    name: "Sulejman Catibusic",
    position: "a programmer at heart",
    img_url: SC,
    stars: 5,
    link: "https://www.linkedin.com/in/sulejman-catibusic-2991354a/",
    disc: `Harun is an extremely hardworking programmer and dedicated to the goal he sets (and always raises the bar pretty high). There is no chance that anything will distract him, and his great virtue is the speed of acquiring knowledge, and a sense of where to turn his nose, i.e. what to learn next. In addition, Harun is an outstanding organizer, a born team and project leader, regardless of the industry. Any team that Harun joins will gain a lot in terms of overall value, quality and efficiency.`,
  },
  {
    name: "Ajsela Felic",
    position: "UI/UX designer",
    img_url: AF,
    stars: 5,
    link: "https://www.linkedin.com/in/ajselafelic/",
    disc: `Harun is extremely nice to work with. He is friendly and social at work. He is detailed at his task, and is dedicated to everything he is working on.`,
  },
];

const Clients = () => {
  return (
    <Container id="client">
      <Fade direction="up" triggerOnce>
        <Eyebrow>Testimonials</Eyebrow>
        <Headline>What people say</Headline>
      </Fade>
      <SliderWrap>
        <Carousel ariaLabel="Testimonials">
          {clients.map((item, i) => (
            <ClientSlider item={item} key={i} />
          ))}
        </Carousel>
      </SliderWrap>
    </Container>
  );
};

export default Clients;

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

const SliderWrap = styled.div`
  margin-top: var(--spacing-60);
`;
