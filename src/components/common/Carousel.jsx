import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Carousel = ({ children, ariaLabel, labels = [] }) => {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const ticking = useRef(false);
  const scrollEndTimeout = useRef(null);
  const items = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [edgePad, setEdgePad] = useState(0);

  slideRefs.current = items.map((_, i) => slideRefs.current[i] || React.createRef());

  const measurePadding = useCallback(() => {
    const track = trackRef.current;
    const first = slideRefs.current[0] && slideRefs.current[0].current;
    if (!track || !first) return;
    const pad = Math.max(0, (track.clientWidth - first.clientWidth) / 2);
    setEdgePad(pad);
  }, []);

  useEffect(() => {
    measurePadding();
    const track = trackRef.current;
    if (!track) return undefined;
    const resizeObserver = new ResizeObserver(measurePadding);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [measurePadding, items.length]);

  const updateEmphasis = useCallback(() => {
    ticking.current = false;
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    // Read every rect first, then write every style. Interleaving the two
    // forces a synchronous layout per slide on each scroll frame.
    const measurements = slideRefs.current.map((ref) => {
      const el = ref.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { el, dist: Math.abs(r.left + r.width / 2 - trackCenter) };
    });

    measurements.forEach((m, i) => {
      if (!m) return;
      if (m.dist < closestDist) {
        closestDist = m.dist;
        closestIndex = i;
      }
    });

    measurements.forEach((m) => {
      if (!m) return;
      const norm = Math.min(1, m.dist / (trackRect.width / 2));
      m.el.style.transform = `scale(${1 - norm * 0.12})`;
      m.el.style.opacity = String(1 - norm * 0.55);
    });

    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  }, []);

  useEffect(() => {
    updateEmphasis();
  }, [updateEmphasis, edgePad]);

  useEffect(() => () => clearTimeout(scrollEndTimeout.current), []);

  const onScroll = () => {
    const track = trackRef.current;
    // Promote the slides to their own layers only while they are actually
    // moving; a permanent will-change keeps 13 layers alive for nothing.
    if (track) {
      track.classList.add("is-scrolling");
      clearTimeout(scrollEndTimeout.current);
      scrollEndTimeout.current = setTimeout(
        () => track.classList.remove("is-scrolling"),
        150
      );
    }
    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(updateEmphasis);
    }
  };

  const goTo = (index) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const el = slideRefs.current[clamped] && slideRefs.current[clamped].current;
    if (!track || !el) return;
    const target = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    track.scrollTo({
      left: target,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const onKeyDown = (event) => {
    const keyed = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(event.key in keyed)) return;
    event.preventDefault();
    goTo(keyed[event.key]);
  };

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === items.length - 1;
  // Past a handful of slides the dot row wraps to two or three lines on a
  // phone, which reads as broken. Swap in a counter at that size instead.
  const manySlides = items.length > 6;
  const labelFor = (i) =>
    labels[i] ? `${i + 1} of ${items.length}: ${labels[i]}` : `${i + 1} of ${items.length}`;

  return (
    <Wrap>
      <Track
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        // A scrollable region has to be focusable, or keyboard users have no
        // way to reach the slides that are off-screen.
        tabIndex={0}
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        role="group"
        style={{ paddingLeft: edgePad, paddingRight: edgePad }}
      >
        {items.map((child, i) => (
          <Slide
            key={child.key ?? i}
            ref={slideRefs.current[i]}
            role="group"
            aria-roledescription="slide"
            aria-label={labelFor(i)}
          >
            {child}
          </Slide>
        ))}
      </Track>
      <Controls>
        {manySlides && (
          <Counter aria-hidden="true">
            {activeIndex + 1} / {items.length}
          </Counter>
        )}
        <Dots $collapse={manySlides}>
          {items.map((child, i) => (
            <Dot
              key={child.key ?? i}
              active={i === activeIndex}
              aria-label={`Go to slide ${labelFor(i)}`}
              aria-current={i === activeIndex}
              onClick={() => goTo(i)}
            >
              <span />
            </Dot>
          ))}
        </Dots>
        {items.length > 1 && (
          <Arrows>
            <ArrowButton
              aria-label="Previous slide"
              onClick={() => goTo(activeIndex - 1)}
              disabled={atStart}
            >
              <IoIosArrowBack aria-hidden="true" />
            </ArrowButton>
            <ArrowButton
              aria-label="Next slide"
              onClick={() => goTo(activeIndex + 1)}
              disabled={atEnd}
            >
              <IoIosArrowForward aria-hidden="true" />
            </ArrowButton>
          </Arrows>
        )}
      </Controls>
    </Wrap>
  );
};

export default Carousel;

const Wrap = styled.div`
  position: relative;
`;

const Track = styled.div`
  display: flex;
  gap: var(--spacing-24);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-top: var(--spacing-12);
  padding-bottom: var(--spacing-24);

  &::-webkit-scrollbar {
    display: none;
  }

  /* The ring belongs around the rail, not tight against the cards. */
  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 4px;
    border-radius: var(--radius-cards);
  }

  &.is-scrolling > * {
    will-change: transform, opacity;
  }
`;

const Slide = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: center;
  transition: transform 250ms ease-out, opacity 250ms ease-out;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-24);
  margin-top: var(--spacing-6);
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${(p) =>
    p.$collapse &&
    `
    @media (max-width: 640px) {
      display: none;
    }
  `}
`;

/* Only rendered for long rails, and only visible where the dots are not. */
const Counter = styled.p`
  display: none;
  font-size: var(--text-nav-label);
  font-weight: 500;
  color: var(--color-ash-gray);
  /* Tabular figures so the number doesn't jitter as it counts up. */
  font-variant-numeric: tabular-nums;

  @media (max-width: 640px) {
    display: block;
  }
`;

/* The button is a 24px hit target; the visible pill inside stays 8px, so
   the dots look unchanged but are no longer an 8x8px tap gamble. */
const Dot = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;

  span {
    display: block;
    width: ${(p) => (p.active ? "24px" : "8px")};
    height: 8px;
    border-radius: var(--radius-tags);
    background: ${(p) =>
      p.active ? "var(--color-electric-iris)" : "rgba(255,255,255,0.18)"};
    transition: width 300ms ease-in-out, background-color 300ms ease-in-out;
  }

  :hover span {
    background: ${(p) =>
      p.active ? "var(--color-electric-iris)" : "rgba(255,255,255,0.4)"};
  }
`;

const Arrows = styled.div`
  display: flex;
  gap: var(--spacing-12);
`;

const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: var(--color-ash-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  transition: border-color 250ms ease-in-out, color 250ms ease-in-out,
    opacity 250ms ease-in-out;

  :hover:not(:disabled) {
    border-color: var(--color-electric-iris);
    color: var(--color-bone-white);
  }

  :disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
