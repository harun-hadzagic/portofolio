import React from "react";
import Project from "./Project";
import Carousel from "../common/Carousel";
import accentuate from "../../assets/images/accentuate.jpg";
import uallaby from "../../assets/images/uallaby.jpg";
import koenigPergola from "../../assets/images/koenig-pergola.jpg";
import dankuchen from "../../assets/images/dankuchen.jpg";
import bhTours from "../../assets/images/bh-tours.jpg";
import jsVulnModel from "../../assets/images/js-vuln-model.jpg";
import eCommerce from "../../assets/images/e-commerce.png";
import quiz from "../../assets/images/quiz.png";
import library from "../../assets/images/library.png";
import petAdoption from "../../assets/images/pet-adoption.png";
import videoStream from "../../assets/images/video-streamer.png";
import meetups from "../../assets/images/meetups.jpg";
import challenges from "../../assets/images/challenges.png";

const data = [
  {
    img: accentuate,
    title: "Accentuate Custom Fields",
    disc: "A Built for Shopify metafields app merchants use to build reusable product content — size charts, FAQs, brand bios — and bulk-edit metafields across large catalogs.",
    demo: "https://apps.shopify.com/accentuate",
    demoLabel: "View on Shopify",
  },
  {
    img: uallaby,
    title: "Uallaby",
    disc: "An Italian tech company putting generative AI to work for business — I worked on the app behind the platform.",
    demo: "https://uallaby.ai/",
    demoLabel: "Visit site",
  },
  {
    img: koenigPergola,
    title: "König Pergola",
    disc: "Storefront and the entire Shopify setup for a Swiss pergola brand, including the configurator that walks a customer through specifying their own pergola.",
    demo: "https://koenigpergola.ch/",
    demoLabel: "Visit site",
  },
  {
    img: dankuchen,
    title: "DanKüchen Bosnia",
    disc: "A trilingual site for DanKüchen's Sarajevo kitchen atelier — collections, materials and the full design process, built to turn browsing into a showroom consultation.",
    demo: "https://dankuchen-bosnia.com/",
    demoLabel: "Visit site",
  },
  {
    img: jsVulnModel,
    title: "Insecure JS Detection Model",
    disc: "A CodeBERT model fine-tuned to flag vulnerable JavaScript — 99% accurate on the held-out test set and 81% on code it had never seen before.",
    demo: "https://github.com/harun-hadzagic/model-for-detecting-insecure-js-code",
    demoLabel: "View on GitHub",
  },
  {
    img: bhTours,
    title: "Five Star Trans & Tours",
    disc: "A luxury transport and car rental site for a Bosnian operator, with a multi-language booking flow front and centre.",
    demo: "https://www.bh-tours.com/",
    demoLabel: "Visit site",
  },
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
    <Carousel ariaLabel="Projects" labels={data.map((item) => item.title)}>
      {data.map((item) => (
        <Project item={item} key={item.title} />
      ))}
    </Carousel>
  );
};

export default SliderComp;
