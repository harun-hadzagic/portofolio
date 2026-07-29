import React from "react";
import Project from "./Project";
import Carousel from "../common/Carousel";
import eCommerce from "../../assets/images/e-commerce.png";
import quiz from "../../assets/images/quiz.png";
import library from "../../assets/images/library.png";
import petAdoption from "../../assets/images/pet-adoption.png";
import videoStream from "../../assets/images/video-streamer.png";
import hangman from "../../assets/images/hangman.png";
import meetups from "../../assets/images/meetups.jpg";
import challenges from "../../assets/images/challenges.png";

const data = [
  {
    img: eCommerce,
    title: "Online Book Store",
    disc: "A full e-commerce flow where anyone can browse and buy books by card, while a manager gets complete CRUD control over the catalog.",
  },
  {
    img: quiz,
    title: "Quiz App",
    disc: "Lets mentors create, edit and delete quizzes for their students, while students take quizzes and track their results.",
  },
  {
    img: library,
    title: "Library",
    disc: "One place to browse books, authors and publishers, with an admin who can add, edit, or remove any of the three.",
  },
  {
    img: petAdoption,
    title: "Pet Adoption",
    disc: "Built during a hackathon — lets users post pets up for adoption alongside a suite of supporting services.",
  },
  {
    img: videoStream,
    title: "Live Stream Platform",
    disc: "A live streaming platform where a streamer can start broadcasting and viewers can tune in in real time.",
  },
  {
    img: hangman,
    title: "Hangman",
    disc: "The word-guessing game we all grew up with, rebuilt from scratch.",
  },
  {
    img: meetups,
    title: "Event Meetups",
    disc: "Post a meetup or find one worth joining — built for organizing communities around shared interests.",
  },
  {
    img: challenges,
    title: "Challenges",
    disc: "Animate your life with challenges and keep track of every one of them.",
    demo: "https://react-animated.vercel.app/",
  },
];

const SliderComp = () => {
  return (
    <Carousel ariaLabel="Projects">
      {data.map((item, i) => (
        <Project item={item} key={i} />
      ))}
    </Carousel>
  );
};

export default SliderComp;
