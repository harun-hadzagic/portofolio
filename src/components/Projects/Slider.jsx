import React, { useRef, useState } from 'react'
import Slider from 'react-slick';
import Project from './Project';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styled from 'styled-components';
import eCommerce from "../../assets/images/e-commerce.png"
import quiz from "../../assets/images/quiz.png"
import library from "../../assets/images/library.png"
import petAdoption from "../../assets/images/pet-adoption.png"
import videoStream from "../../assets/images/video-streamer.png"
import hangman from "../../assets/images/hangman.png"
let data = [
  {
    img: eCommerce,
    disc: "The system allows anyone to become a user and purchase books using their credit card, while a manager has all CRUD capabilities for all books.",
    title: "Online Book Store"
  },
  {
    img: quiz,
    disc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Eveniet iure rerum obcaecati et laborum earum!"
    ,
    title: "Quiz App"
  },
  {
    img: library,
    disc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Eveniet iure rerum obcaecati et laborum earum!"
    ,
    title: "Library"
  },
  {
    img: petAdoption,
    disc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Eveniet iure rerum obcaecati et laborum earum!"
    ,
    title: "Pet adoption"
  },
  {
    img: videoStream,
    disc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Eveniet iure rerum obcaecati et laborum earum!"
    ,
    title: ""
  },
  {
    img: hangman,
    disc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Eveniet iure rerum obcaecati et laborum earum!"
    ,
    title: ""
  }
];

var settings = {
  className: "center",
  centerMode: true,
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  arrows: false,
  responsive: [
    {
      breakpoint: 990,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        centerMode: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        centerMode: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false
      }
    }
  ]
};
const SliderComp = () => {
  const [right, setRight]  = useState(false)
  const [left, setLeft] = useState(false)
  const arrowRef = useRef(null);
  let sliderProject = "";
  sliderProject = data.map((item, i) => (
    <Project item={item} key={i} />
  ))
  return (
    <Container>
      <Slider ref={arrowRef} {...settings}>
        {sliderProject}
      </Slider>
      <Buttons>
        <button
        style={{backgroundColor: "#EBE4D1", opacity: left ? "100%" :" 80%"}} onMouseEnter={()=>setLeft(true)} onMouseLeave={()=>setLeft(false)}
          onClick={() => arrowRef.current.slickPrev()}
          className='back'><IoIosArrowBack /></button>
        <button
          style={{backgroundColor: "#EBE4D1", opacity: right ? "100%" :" 80%"}} onMouseEnter={()=>setRight(true)} onMouseLeave={()=>setRight(false)}
          onClick={() => arrowRef.current.slickNext()}
          className='next'><IoIosArrowForward /></button>
      </Buttons>
    </Container>
  )
}

export default SliderComp;

const Container = styled.div`
  position: relative;
`

const Buttons = styled.div`
  button{
    width: 2rem;
    height: 2rem;
    background-color: rgba(255, 255, 255, 0.100);
    cursor: pointer;
    color: #01be96;
    border: none;
    position: absolute;
    top: 45%;
    right: -1rem;
  }

  .back{
    left: -1rem;
  }
`