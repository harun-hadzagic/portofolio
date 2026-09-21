import React, { useRef, useState } from "react";
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const Footer = () => {
  const formRef = useRef(null);
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
  };

  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const scrollUp = () => {
    window.scroll({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handleChange = (name) => (event) => {
    const { value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    // Clear a field's error as soon as the person starts fixing it.
    setErrors((previous) =>
      previous[name] ? { ...previous, [name]: undefined } : previous
    );
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Please enter your name.";
    if (!formData.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(formData.email.trim()))
      next.email = "That email address doesn't look right — check for a typo.";
    if (!formData.message.trim()) next.message = "Please enter a message.";
    return next;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    // Send focus to the first problem so keyboard and screen-reader users
    // land on it instead of hunting for a single message at the bottom.
    const firstInvalid = ["name", "email", "message"].find((key) => nextErrors[key]);
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setLoader(true);
    emailjs
      .sendForm(
        "service_t8dni6r",
        "template_2sa8xqd",
        formRef.current,
        "ac8Lt9gkcjvry3bRl"
      )
      .then(
        () => {
          setFormData({ name: "", email: "", message: "" });
          setErrors({});
          toast.dark("Message sent!", toastOptions);
          setLoader(false);
        },
        () => {
          toast.dark(
            "Couldn't send that — please try again, or email me directly.",
            toastOptions
          );
          setLoader(false);
        }
      );
  };

  const fieldProps = (key) => ({
    id: `contact-${key}`,
    name: key === "message" ? "message" : `user_${key}`,
    value: formData[key],
    onChange: handleChange(key),
    ref: fieldRefs[key],
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });

  return (
    <Container id="footer">
      <ToastContainer />
      <Profile>
        <Fade direction="up" triggerOnce>
          <Identity>
            <img
              src={HarunHadzagic}
              alt="Harun Hadzagic"
              width="64"
              height="64"
              loading="lazy"
            />
            <div>
              <Eyebrow>Let&rsquo;s talk</Eyebrow>
              <h2>Ready when you are.</h2>
            </div>
          </Identity>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h3>Location</h3>
            <p>
              Bosnia and Herzegovina,
              <br /> 71000 Sarajevo
            </p>
          </Block>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h3>Contact me directly</h3>
            <div className="row">
              <span>
                <HiOutlineMailOpen aria-hidden="true" />
              </span>
              <a href="mailto:harun.hadzagic@gmail.com">harun.hadzagic@gmail.com</a>
            </div>
          </Block>
        </Fade>

        <Fade direction="up" triggerOnce>
          <Block>
            <h3>Check my profiles</h3>
            <div className="icons">
              <a href="https://github.com/harun-hadzagic" target="_blank" rel="noreferrer" aria-label="GitHub">
                <AiFillGithub aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/in/harun-h-437807136/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <AiFillLinkedin aria-hidden="true" />
              </a>
              <a href="https://www.facebook.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <BsFacebook aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/harun.hadzagic/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <AiOutlineInstagram aria-hidden="true" />
              </a>
            </div>
          </Block>
        </Fade>

        <ArrowUp onClick={scrollUp} aria-label="Back to top">
          <AiOutlineArrowUp aria-hidden="true" />
        </ArrowUp>
      </Profile>

      <Form>
        <Fade direction="up" triggerOnce>
          {/* noValidate: we own the messages, so the browser's native bubbles
              don't fire first and bypass our styled, announced errors. */}
          <form ref={formRef} onSubmit={sendEmail} noValidate>
            <FieldGroup>
              <label className="sr-only" htmlFor="contact-name">
                Full name
              </label>
              <Field>
                <span>
                  <CgProfile aria-hidden="true" />
                </span>
                <input
                  type="text"
                  placeholder="Full name…"
                  autoComplete="name"
                  {...fieldProps("name")}
                />
              </Field>
              {errors.name && (
                <FieldError id="contact-name-error">{errors.name}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <label className="sr-only" htmlFor="contact-email">
                Email address
              </label>
              <Field>
                <span>
                  <MdAlternateEmail aria-hidden="true" />
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  {...fieldProps("email")}
                />
              </Field>
              {errors.email && (
                <FieldError id="contact-email-error">{errors.email}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <label className="sr-only" htmlFor="contact-message">
                Message
              </label>
              <Field className="message">
                <span>
                  <FiMail aria-hidden="true" />
                </span>
                <textarea rows="6" placeholder="Message…" {...fieldProps("message")} />
              </Field>
              {errors.message && (
                <FieldError id="contact-message-error">{errors.message}</FieldError>
              )}
            </FieldGroup>

            <SubmitRow>
              <SubmitButton type="submit" disabled={loader} aria-busy={loader}>
                {loader ? (
                  <>
                    <span className="loader" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </SubmitButton>
            </SubmitRow>
          </form>
        </Fade>
      </Form>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
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
    letter-spacing: var(--tracking-heading);
    text-wrap: balance;
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

  h3 {
    font-size: var(--text-nav-label);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    color: var(--color-ash-gray);
    margin-bottom: var(--spacing-12);
  }

  p {
    font-size: var(--text-body);
    font-weight: 300;
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
      position: relative;
      text-decoration: none;
      color: var(--color-bone-white);
      font-weight: 300;
      font-size: var(--text-body);
      transition: color 250ms ease-in-out;

      ::after {
        content: "";
        position: absolute;
        inset: -6px -4px;
      }

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

      /* Expands the tap target to ~37px without moving the icon a pixel;
         19px glyphs are well under the 24px minimum on touch. */
      position: relative;

      ::after {
        content: "";
        position: absolute;
        inset: -9px;
      }

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

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  padding-bottom: var(--spacing-12);
  transition: border-color 250ms ease-in-out, box-shadow 250ms ease-in-out;

  &.message {
    align-items: flex-start;
  }

  span {
    color: var(--color-ash-gray);
    display: flex;
    padding-top: 2px;
    transition: color 250ms ease-in-out;
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
    font-weight: 300;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-ash-gray);
  }

  /* The inputs drop their own outline, so the underline has to carry the
     focus state — doubled to 2px, it reads at a glance. */
  :focus-within {
    border-color: var(--color-electric-iris);
    box-shadow: 0 1px 0 0 var(--color-electric-iris);
  }

  :focus-within span {
    color: var(--color-electric-iris);
  }

  &:has(input[aria-invalid="true"]),
  &:has(textarea[aria-invalid="true"]) {
    border-color: rgb(255, 82, 82);
  }
`;

const FieldError = styled.p`
  color: rgb(255, 82, 82);
  font-size: var(--text-nav-label);
  font-weight: 500;
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-12);
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
  transition: filter 250ms ease-in-out, transform 250ms ease-in-out,
    opacity 250ms ease-in-out;

  :hover:not(:disabled) {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }

  :disabled {
    opacity: 0.75;
    cursor: progress;
  }
`;
