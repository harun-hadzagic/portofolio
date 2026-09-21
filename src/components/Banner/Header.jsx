import React, { useEffect, useState } from "react";
import styled from "styled-components";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#service", label: "Services" },
  { href: "#project", label: "Projects" },
  { href: "#client", label: "Testimonials" },
  { href: "#footer", label: "Contact" },
];

const Header = () => {
  const [bar, setBar] = useState(false);

  const closeMenu = () => setBar(false);

  // While the full-screen menu is open, Escape closes it and the page
  // underneath stays put instead of scrolling away behind the overlay.
  useEffect(() => {
    if (!bar) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setBar(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [bar]);

  return (
    <Container bar={bar}>
      <Logo href="#home">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8052ff" />
              <stop offset="100%" stopColor="#15846e" />
            </linearGradient>
          </defs>
          <path d="M12 1 L23 22 L1 22 Z" fill="url(#logoGradient)" />
        </svg>
        <span>Harun</span>
      </Logo>

      <Nav id="primary-navigation" aria-label="Primary" bar={bar}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <MobileCta href="#footer" onClick={closeMenu}>
          Let&rsquo;s talk
        </MobileCta>
      </Nav>

      <Actions>
        <CtaButton href="#footer">Let&rsquo;s talk</CtaButton>
        <Bars
          onClick={() => setBar(!bar)}
          bar={bar}
          aria-label={bar ? "Close menu" : "Open menu"}
          aria-expanded={bar}
          aria-controls="primary-navigation"
        >
          <span />
        </Bars>
      </Actions>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--page-max-width);
  width: 86%;
  margin: 0 auto;
  padding: var(--spacing-36) 0;
  position: relative;
  z-index: 20;
  animation: header 500ms ease-in-out;

  @media (max-width: 840px) {
    width: 90%;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  text-decoration: none;

  span {
    font-weight: 400;
    font-size: 20px;
    letter-spacing: -0.4px;
    color: var(--color-bone-white);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-36);

  a {
    color: var(--color-ash-gray);
    text-decoration: none;
    font-size: var(--text-nav-label);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    transition: color 250ms ease-in-out;

    :hover {
      color: var(--color-bone-white);
    }
  }

  @media (max-width: 840px) {
    position: fixed;
    inset: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-void);
    gap: var(--spacing-36);
    /* dvh, not vh: mobile browser chrome otherwise clips the last item. */
    height: 100dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Slide the panel rather than animating its height — a height
       transition reflows the whole page on every one of the 400ms. */
    transform: ${(p) => (p.bar ? "translateY(0)" : "translateY(-100%)")};
    /* visibility (not just the transform) is what takes the closed links
       out of the tab order; off-screen alone leaves them focusable. */
    visibility: ${(p) => (p.bar ? "visible" : "hidden")};
    transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 400ms ease-in-out;
    z-index: 15;
    padding: var(--spacing-60) var(--spacing-24);

    a {
      font-size: var(--text-heading-2xs);
      color: var(--color-bone-white);
    }
  }
`;

const MobileCta = styled.a`
  display: none;
  @media (max-width: 840px) {
    display: inline-flex;
    margin-top: var(--spacing-18);
    background: var(--color-electric-iris);
    color: var(--color-bone-white) !important;
    padding: 14.4px 24px;
    border-radius: var(--radius-buttons);
    font-size: var(--text-nav-label) !important;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    text-decoration: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
`;

const CtaButton = styled.a`
  background-color: var(--color-electric-iris);
  color: var(--color-bone-white);
  text-decoration: none;
  padding: 14.4px 22px;
  border-radius: var(--radius-buttons);
  font-size: var(--text-nav-label);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: filter 250ms ease-in-out, transform 250ms ease-in-out;
  white-space: nowrap;

  :hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }

  @media (max-width: 840px) {
    display: none;
  }
`;

const Bars = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;

  @media (max-width: 840px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    position: relative;
    z-index: 20;

    span {
      position: relative;
      width: 22px;
      height: 2px;
      background-color: ${(p) => (p.bar ? "transparent" : "#fff")};
      transition: background-color 300ms ease-in-out;

      ::before,
      ::after {
        content: "";
        position: absolute;
        width: 22px;
        height: 2px;
        background-color: #fff;
        left: 0;
        transition: transform 300ms ease-in-out;
      }

      ::before {
        transform: ${(p) => (p.bar ? "rotate(45deg)" : "translateY(-7px)")};
      }

      ::after {
        transform: ${(p) => (p.bar ? "rotate(-45deg)" : "translateY(7px)")};
      }
    }
  }
`;
