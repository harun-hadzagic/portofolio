import React from "react";
import { MdDesignServices } from "react-icons/md";
import { FiCodesandbox } from "react-icons/fi";
import { CgWebsite } from "react-icons/cg";
import styled from "styled-components";
import Card from "./Card";
import { Slide } from "react-awesome-reveal";
import css from "../../assets/images/css.svg"
import firebase from "../../assets/images/firebase.svg"
import git from "../../assets/images/git.svg"
import html from "../../assets/images/html.svg"
import javaScript from "../../assets/images/javascript.svg"
import mongoDb from "../../assets/images/mongodb.svg"
import nodeJs from "../../assets/images/nodejs.svg"
import react from "../../assets/images/react.svg"
import typeScript from "../../assets/images/typescript.svg"
import expressjs from "../../assets/images/expressjs.svg"
import bootstrap from "../../assets/images/bootstrap.svg"
import npm from "../../assets/images/npm.png"
import vue from "../../assets/images/vue.svg"
import socket from "../../assets/images/socket.png"
import redux from "../../assets/images/redux.svg"
import github from "../../assets/images/github.png"
import sql from "../../assets/images/sql-server.png"





const Services = () => {
const skillsArray = [javaScript, typeScript,react,vue,  nodeJs,  firebase, mongoDb, sql,github,  git ,html,css,]
  return (
    <Container id="service">
      <Slide direction="down">
        <h4>
          My <span className="green">services</span>
        </h4>
        <h1>What I Do</h1>
      </Slide>
      <Cards>
        <Slide direction="left">
          <Card
            Icon={MdDesignServices}
            title={"Responsive Website Design"}
            disc={`Create visually appealing and user-friendly websites optimized for various devices and screen sizes, ensuring a seamless user experience across desktops, tablets, and smartphones.`}
          />
        </Slide>
        <Slide direction="up">
          <Card
            Icon={FiCodesandbox}
            title={"Custom Web Application Development"}
            disc={`Develop tailor-made web applications that address your specific needs, from concept to deployment, utilizing both front-end and back-end technologies.`}
          />
        </Slide>
        <Slide direction="right">
          <Card
            Icon={CgWebsite}
            title={"Database Design and Management"}
            disc={`Design and maintain robust databases to efficiently store and manage data for your web applications, ensuring data integrity, security, and optimal performance.`}
          />
        </Slide>
      </Cards>
      <br/>
      <Slide direction="up">
        <h2>
          My <span className="green">Skills</span>
        </h2>
      </Slide>
      <Slide direction="left">
        <Container style={{display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
      {skillsArray.map((skill, index)=>{
        return <img src={skill} key={index} height={"60rem"} style={{margin: "1rem"}} alt="logo"/>
      })}
      </Container>
      </Slide>
      
    </Container>
  );
};

export default Services;

const Container = styled.div`
  width: 80%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 0;
  @media (max-width: 840px) {
    width: 90%;
  }

  h1 {
    padding-top: 1rem;
  }
`;
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 4rem;
  gap: 1rem;
`;
