import React, { useRef } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import ClientSlider from './ClientSlider';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Slide } from 'react-awesome-reveal';
import SA from "../../assets/images/SA.jpeg"
import AO from "../../assets/images/AO.jpeg"
import SC from "../../assets/images/SC.jpeg"
import AF from "../../assets/images/AF.jpeg"

let clients = [
    {
        name : "Samir Arapcic",
        position : "web developer | coding mentor",
        img_url : SA,
        stars : 5,
        link: "https://www.linkedin.com/in/samir-arapcic-05964470/",
        disc : `Harun's unwavering positivity, unyielding optimism, strong work ethic, and 'can-do' attitude showcase a remarkable level of maturity and an insatiable intellectual curiosity. His assignments consistently exhibit exceptional quality, and his ability to tackle challenges with a smile and unwavering determination is truly commendable.`
    },
    {
        name : "Amila Omanovic",
        position : "project manager",
        img_url : AO,
        stars : 5,
        link: "https://www.linkedin.com/in/amila-omanovi%C4%87-a9764311a/",
        disc : `Harun is a committed team member and one of key drivers of our high client satisfaction scores. He sets very ambitious goals for himself and what’s impressive is that he manages to meet them all. I appreciate that I can always count on him to treat all his tasks with importance. That’s what makes him a reliable team member. Furthermore, he’s an excellent communicator and keeps me up to date on his progress, ensuring we’re always on the same page. He often shows initiative, has a great eye for detail and consistently produces high work quality. `
    },
    {
        name : "Sulejman Catibusic",
        position : "a programmer at heart",
        img_url : SC,
        stars : 5,
        link:"https://www.linkedin.com/in/sulejman-catibusic-2991354a/",
        disc : `Harun is an extremely hardworking programmer and dedicated to the goal he sets (and always raises the bar pretty high). There is no chance that anything will distract him, and his great virtue is the speed of acquiring knowledge, and a sense of where to turn his nose, i.e. what to learn next. In addition, Harun is an outstanding organizer, a born team and project leader, regardless of the industry. Any team that Harun joins will gain a lot in terms of overall value, quality and efficiency.`
    },
    {
        name : "Ajsela Felic",
        position : "UI/UX designer",
        img_url : AF,
        stars : 5,
        link: "https://www.linkedin.com/in/ajselafelic/",
        disc : `Harun is extremely nice to work with. He is friendly and social at work. He is detailed at his task, and is dedicated to everything he is working on.`
    },


]
var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows : false,
    responsive: [
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 530,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]}

const Clients = () => {
    const arrowRef = useRef(null);
    let clientDisc = "";
    clientDisc = clients.map((item, i) => (
        <ClientSlider item={item} key={i}/>
    ))
  return (
    <Container id='client'>
        <Slide direction="left">
            <span className="green">testimonials</span>
            <h1>what people say</h1>
        </Slide>
        <Testimonials>
            <Slider ref={arrowRef} {...settings}>
                {clientDisc}
            </Slider>
            <Buttons>
                <button
                onClick={() => arrowRef.current.slickPrev()}
                ><IoIosArrowBack/></button>
                <button
                onClick={() => arrowRef.current.slickNext()}
                ><IoIosArrowForward/></button>
            </Buttons>
        </Testimonials>
    </Container>
  )
}

export default Clients

const Container = styled.div`
    width: 80%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 4rem 0;

    @media(max-width:840px){
        width: 90%;
    }

    span{
        font-weight: 700;
        text-transform: uppercase;
    }

    h1{
        padding-top: 1rem;
        text-transform: capitalize;
    }

    .slick-list, .slick-slider, .slick-track{
        padding: 0;
    }

    .slick-dots{
        text-align: left;
        margin-left: 1rem;
    }

    .slick-dots li button:before{
        content: "";
    }

    .slick-dots li button{
        width: 9px;
        height: 4px;
        background: linear-gradient(159deg, rgb(45, 45, 58) 0%, rgb(43, 43, 53) 100%);
        padding: 0.1rem;
        margin-top: 1rem;
        transition: all 400ms ease-in-out;
        border-radius: 50px;
    }
    
    .slick-dots li.slick-active button{
        background: #01be96;
        width: 15px;
    }

    .slick-dots li{
        margin: 0;
    }
`

const Testimonials = styled.div`
    margin-top: 2rem;
    position: relative;
`
const Buttons = styled.div`
    position: absolute;
    right: 0.7rem;
    bottom: -2rem;

    button{
        background-color: transparent;
        margin-left: 0.5rem;
        border: none;
        color: #01be96;
        cursor: pointer;
        font-size: 1.1rem;
    }

    @media(max-width:530px){
        display: none;
    }
`