import React, { useState } from "react";
import styled from "styled-components";
import { MdAlternateEmail } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMailOpen } from "react-icons/hi";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiOutlineArrowUp,
  AiOutlineInstagram,
} from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { Fade } from "react-awesome-reveal";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HarunHadzagic from "../../assets/images/HH.jpeg";

const Footer = () => {
  const scrollUp = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    error: "",
  });
  const handleChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.value });
  };
  const sendEmail = (e) => {
    e.preventDefault();
    if (formData.name.length === 0)
      return setFormData({ ...formData, error: "Please enter your name" });
    if (formData.email.length === 0)
      return setFormData({ ...formData, error: "Please enter your email" });
    if (formData.message.length === 0)
      return setFormData({ ...formData, error: "Please enter your message" });
    setLoader(true);
    emailjs
      .sendForm(
        "service_t8dni6r",
        "template_2sa8xqd",
        document.querySelector("form"),
        "ac8Lt9gkcjvry3bRl"
      )
      .then(
        () => {
          setFormData({
            name: "",
            email: "",
            message: "",
            error: "",
          });
          toast.dark("Message sent!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoader(false);
        },
        () => {
          toast.dark("Whoops, something went wrong..", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoader(false);
        }
      );
  };
  return (
    <Container id="footer">
      <ToastContainer />
      <Profile>
        <Fade direction="up" triggerOnce>
          <Identity>
            <img src={HarunHadzagic} alt="Harun Hadzagic" />
            <div>
              <Eyebrow>Let&rsquo;s talk</Eyebrow>
              <h2>Ready when you are.</h2>
            </div>
          </Identity>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h4>Location</h4>
            <p>
              Bosnia and Herzegovina,
              <br /> 71000 Sarajevo
            </p>
          </Block>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h4>Contact me directly</h4>
            <div className="row">
              <span>
                <HiOutlineMailOpen />
              </span>
              <a href="mailto:harun.hadzagic@gmail.com">harun.hadzagic@gmail.com</a>
            </div>
          </Block>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h4>Check my profiles</h4>
            <div className="icons">
              <a href="https://github.com/harun-hadzagic" target="_blank" rel="noreferrer" aria-label="GitHub">
                <AiFillGithub />
              </a>
              <a href="https://www.linkedin.com/in/harun-h-437807136/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <AiFillLinkedin />
              </a>
              <a href="https://www.facebook.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <BsFacebook />
              </a>
              <a href="https://www.instagram.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <AiOutlineInstagram />
              </a>
            </div>
          </Block>
        </Fade>

        <ArrowUp onClick={scrollUp} aria-label="Back to top">
          <AiOutlineArrowUp />
        </ArrowUp>
      </Profile>

      <Form>
        <Fade direction="up" triggerOnce>
          <form onSubmit={sendEmail}>
            <Field>
              <span>
                <CgProfile />
              </span>
              <input
                type="text"
                placeholder="Full name..."
                name="user_name"
                value={formData.name}
                onChange={handleChange("name")}
              />
            </Field>
            <Field>
              <span>
                <MdAlternateEmail />
              </span>
              <input
                type="email"
                placeholder="Email..."
                name="user_email"
                value={formData.email}
                onChange={handleChange("email")}
              />
            </Field>
            <Field className="message">
              <span>
                <FiMail />
              </span>
              <textarea
                cols="30"
                rows="6"
                placeholder="Message..."
                name="message"
                value={formData.message}
                onChange={handleChange("message")}
              />
            </Field>
            {formData.error && (
              <div className="error">
                <span>{formData.error}</span>
              </div>
            )}
            <SubmitRow>
              {loader ? (
                <div className="loader" />
              ) : (
                <SubmitButton type="submit" value="Send">
                  Submit
                </SubmitButton>
              )}
            </SubmitRow>
          </form>
        </Fade>
      </Form>
    </Container>
  );
};

export default Footer;

const Container = styled.div`
  position: relative;
  padding: var(--spacing-120) 0 var(--spacing-96);
  width: 86%;
  max-width: var(--page-max-width);
  margin: 0 auto;
  display: flex;
  gap: var(--spacing-96);

  @media (max-width: 840px) {
    width: 90%;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    gap: var(--spacing-60);
  }
`;

const Profile = styled.div`
  flex: 1;
  min-width: 0;
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-18);
  margin-bottom: var(--spacing-60);

  img {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-cards);
    object-fit: cover;
    flex-shrink: 0;
  }

  h2 {
    font-size: var(--text-heading-sm);
    font-weight: 400;
    letter-spacing: -1px;
    color: var(--color-bone-white);
  }
`;

const Eyebrow = styled.p`
  color: var(--color-saffron-spark);
  font-size: var(--text-caption);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: var(--spacing-6);
`;

const Block = styled.div`
  padding-bottom: var(--spacing-30);

  h4 {
    font-size: var(--text-nav-label);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    color: var(--color-ash-gray);
    margin-bottom: var(--spacing-12);
  }

  p {
    font-size: var(--text-body);
    font-weight: 200;
    color: var(--color-silver-mist);
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--spacing-12);

    span {
      color: var(--color-electric-iris);
      display: flex;
      font-size: 1.1rem;
    }

    a {
      text-decoration: none;
      color: var(--color-bone-white);
      font-weight: 200;
      font-size: var(--text-body);

      :hover {
        color: var(--color-saffron-spark);
      }
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-18);

    a {
      color: var(--color-ash-gray);
      font-size: 1.3rem;
      display: flex;
      transition: color 250ms ease-in-out, transform 250ms ease-in-out;

      :hover {
        color: var(--color-electric-iris);
        transform: translateY(-2px);
      }
    }
  }
`;

const ArrowUp = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: var(--color-bone-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: var(--spacing-24);
  transition: border-color 250ms ease-in-out, color 250ms ease-in-out;

  :hover {
    border-color: var(--color-electric-iris);
    color: var(--color-electric-iris);
  }
`;

const Form = styled.div`
  flex: 1;
  min-width: 0;

  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-24);
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  padding-bottom: var(--spacing-12);
  transition: border-color 250ms ease-in-out;

  &.message {
    align-items: flex-start;
  }

  span {
    color: var(--color-ash-gray);
    display: flex;
    padding-top: 2px;
  }

  &.message span {
    padding-top: 4px;
  }

  input,
  textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    color: var(--color-bone-white);
    background-color: transparent;
    font-size: var(--text-body);
    font-weight: 200;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-ash-gray);
  }

  :focus-within {
    border-color: var(--color-electric-iris);
  }

  :focus-within span {
    color: var(--color-electric-iris);
  }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SubmitButton = styled.button`
  background-color: var(--color-electric-iris);
  color: var(--color-bone-white);
  border: none;
  padding: 14.4px 24px;
  border-radius: var(--radius-buttons);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  cursor: pointer;
  transition: filter 250ms ease-in-out, transform 250ms ease-in-out;

  :hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }
`;
