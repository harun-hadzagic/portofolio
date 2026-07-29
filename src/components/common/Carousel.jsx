import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Carousel = ({ children, ariaLabel }) => {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);
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
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDist = Infinity;

    slideRefs.current.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - trackCenter);
      const norm = Math.min(1, dist / (trackRect.width / 2));
      el.style.transform = `scale(${1 - norm * 0.12})`;
      el.style.opacity = String(1 - norm * 0.55);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  }, []);

  useEffect(() => {
    updateEmphasis();
  }, [updateEmphasis, edgePad]);

  const onScroll = () => {
    requestAnimationFrame(updateEmphasis);
  };

  const goTo = (index) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const el = slideRefs.current[clamped] && slideRefs.current[clamped].current;
    if (!track || !el) return;
    const target = el.offsetLeft - (track.clientWidth - el.clientWidth) / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <Wrap>
      <Track
        ref={trackRef}
        onScroll={onScroll}
        aria-label={ariaLabel}
        role="group"
        style={{ paddingLeft: edgePad, paddingRight: edgePad }}
      >
        {items.map((child, i) => (
          <Slide key={child.key ?? i} ref={slideRefs.current[i]}>
            {child}
          </Slide>
        ))}
      </Track>
      <Controls>
        <Dots>
          {items.map((child, i) => (
            <Dot
              key={child.key ?? i}
              active={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </Dots>
        {items.length > 1 && (
          <Arrows>
            <ArrowButton aria-label="Previous" onClick={() => goTo(activeIndex - 1)}>
              <IoIosArrowBack />
            </ArrowButton>
            <ArrowButton aria-label="Next" onClick={() => goTo(activeIndex + 1)}>
              <IoIosArrowForward />
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
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-top: var(--spacing-12);
  padding-bottom: var(--spacing-24);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 auto;
  scroll-snap-align: center;
  transition: transform 250ms ease-out, opacity 250ms ease-out;
  will-change: transform, opacity;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-6);
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-12);
  flex-wrap: wrap;
`;

const Dot = styled.button`
  width: ${(p) => (p.active ? "24px" : "8px")};
  height: 8px;
  border-radius: var(--radius-tags);
  border: none;
  cursor: pointer;
  padding: 0;
  background: ${(p) => (p.active ? "var(--color-electric-iris)" : "rgba(255,255,255,0.18)")};
  transition: all 300ms ease-in-out;
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
  transition: all 250ms ease-in-out;

  :hover {
    border-color: var(--color-electric-iris);
    color: var(--color-bone-white);
  }
`;
