import React from "react";
import styled from "styled-components";
import { AiFillGithub, AiOutlineInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { Slide } from "react-awesome-reveal";

const ProfComponent = () => {

  const scrollToBottom = () =>{
    window.scrollTo(0, document.body.scrollHeight);

  }
  return (
    <Container id="home">
      <Slide direction="left">
        <Texts>
          <h4>
            Hello <span className="green">I'am</span>
          </h4>
          <h1 className="green">Harun Hadzagic</h1>
          <h3>Full stack web developer</h3>
          <p>
          I'm a passionate web developer dedicated to creating elegant and efficient websites. With expertise in front-end and back-end technologies, I bring ideas to life through code and creativity.
          </p>
          <button onClick={scrollToBottom}>Let's talk</button>
          <Social>
            <p>Check out my</p>
            <div className="social-icons">
              <span>
                <a href="https://www.instagram.com/harun.hadzagic/" target="blank">
                  <AiOutlineInstagram />
                </a>
              </span>
              <span>
                <a href="https://github.com/harun-hadzagic" target="blank">
                  <AiFillGithub />
                </a>
              </span>
              <span>
                <a href="https://www.linkedin.com/in/harun-h-437807136/" target="blank">
                  <FaLinkedinIn />
                </a>
              </span>
            </div>
          </Social>
          <br/>
          <hr/>
       <span >                
        <a href="https://drive.google.com/file/d/17JG_DYLuiydW-wPqSNoQHXG8jmEdp-4T/view?usp=sharing" target="blank">
          <button  style={{fontSize: '1.5rem', textDecoration: "none"}}>Check out my CV</button>
        </a>
        </span> 
        </Texts>


      </Slide>
      <Slide direction="right">
        <Profile>
          <img
            src="https://lh3.googleusercontent.com/drive-viewer/AITFw-wEf6a4YkY3-M8tBLxBww2CLmJQFL4nmBRzwBY4FJRd6Ibwf8GDAGDuZL7XGydZzaxR5Kd1Oz_epxPzZhUVgSI7xBqE=s1600"
            alt="profile"
            style={{borderRadius: "3rem"}}
          />
        </Profile>
      </Slide>
    </Container>
  );
};

export default ProfComponent;

const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding-top: 3rem;
  width: 80%;
  max-width: 1280px;
  margin: 0 auto;
  z-index: 1;
  @media (max-width: 840px) {
    width: 90%;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;
const Texts = styled.div`
  flex: 1;
  h4 {
    padding: 1rem 0;
    font-weight: 500;
  }
  h1 {
    font-size: 2rem;
    font-family: "Secular One", sans-serif;
    letter-spacing: 2px;
  }
  h3 {
    font-weight: 500;
    font-size: 1.2rem;
    padding-bottom: 1.2rem;
    text-transform: capitalize;
  }
  p {
    font-weight: 300;
  }

  button {
    padding: 0.7rem 2rem;
    margin-top: 3rem;
    cursor: pointer;
    background-color: #01be96;
    border: none;
    color: #fff;
    font-weight: 500;
    filter: drop-shadow(0px 10px 10px #01be9551);
    :hover {
      filter: drop-shadow(0px 10px 10px #01be9570);
    }
  }
`;
const Social = styled.div`
  margin-top: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  p {
    font-size: 0.9rem;
    @media (max-width: 690px) {
      font-size: 0.7rem;
    }
  }

  .social-icons {
    display: flex;
    align-items: center;
    gap: 1rem;
    span {
      width: 2.3rem;
      height: 2rem;
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      background-color: #01be96;
      position: relative;
      transition: transform 400ms ease-in-out;
      :hover {
        transform: rotate(360deg);
      }
    }

    a {
      color: #fff;
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
const Profile = styled.div`
  img {
    width: 25rem;
    filter: drop-shadow(0px 10px 10px #01be9570);
    transition: transform 400ms ease-in-out;
    @media (max-width: 790px) {
      width: 20rem;
    }

    @media (max-width: 660px) {
      width: 18rem;
    }

    @media (max-width: 640px) {
      width: 100%;
    }
  }

  :hover img {
    transform: translateY(-10px);
  }
`;
