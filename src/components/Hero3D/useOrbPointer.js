import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Below this much travel between press and release the gesture reads as a tap,
// which fires a pulse instead of ending a spin.
const TAP_SLOP = 8;

/**
 * DOM-side half of the orb interaction. Everything the render loop consumes
 * lives in a mutable ref, so moving the pointer never re-renders React; only
 * the one fact the UI itself needs — whether the visitor has grabbed the orb at
 * least once — is state.
 *
 * `cursorRef` receives the custom contact ring. It is written straight from the
 * pointer event rather than from a frame callback, so the ring lands in the
 * same frame as the movement instead of trailing it.
 */
export default function useOrbPointer(cursorRef) {
  const stageRef = useRef(null);
  const [engaged, setEngaged] = useState(false);

  const input = useRef({
    ndcX: 0,
    ndcY: 0,
    hasPointer: false,
    dragging: false,
    // Pixels moved since the render loop last consumed them.
    dx: 0,
    dy: 0,
    lastX: 0,
    lastY: 0,
    travel: 0,
    firePulse: false,
  });

  // `key` is the dataset name the stylesheet selects on: orbCursor / orbPress.
  const setCursor = useCallback(
    (key, value) => {
      const ring = cursorRef?.current;
      if (ring) ring.dataset[key] = value ? "true" : "false";
    },
    [cursorRef]
  );

  // A captured drag can travel past the orb, where `cursor: none` no longer
  // applies and the arrow would reappear alongside the ring.
  const hideSystemCursor = useCallback((hidden) => {
    document.body.style.cursor = hidden ? "none" : "";
  }, []);

  useEffect(() => () => hideSystemCursor(false), [hideSystemCursor]);

  const track = useCallback(
    (event) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const state = input.current;
      state.ndcX = (x / rect.width) * 2 - 1;
      state.ndcY = -((y / rect.height) * 2 - 1);

      const ring = cursorRef?.current;
      if (ring) ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [cursorRef]
  );

  const endDrag = useCallback(
    (event, allowPulse) => {
      const state = input.current;
      setCursor("orbPress", false);
      hideSystemCursor(false);
      if (!state.dragging) return;
      state.dragging = false;
      if (allowPulse && state.travel < TAP_SLOP) state.firePulse = true;
      // Touch has no hover, so the contact must be retired on release or the
      // dimple would sit where the finger left it for good.
      if (event?.pointerType === "touch") state.hasPointer = false;
      if (event && stageRef.current?.hasPointerCapture?.(event.pointerId)) {
        stageRef.current.releasePointerCapture(event.pointerId);
      }
    },
    [setCursor, hideSystemCursor]
  );

  const handlers = useMemo(
    () => ({
      onPointerEnter: (event) => {
        if (event.pointerType === "touch") return;
        input.current.hasPointer = true;
        track(event);
        setCursor("orbCursor", true);
      },
      onPointerMove: (event) => {
        const state = input.current;
        track(event);
        state.hasPointer = true;
        if (event.pointerType !== "touch") setCursor("orbCursor", true);
        if (!state.dragging) return;
        const moveX = event.clientX - state.lastX;
        const moveY = event.clientY - state.lastY;
        state.dx += moveX;
        state.dy += moveY;
        state.travel += Math.abs(moveX) + Math.abs(moveY);
        state.lastX = event.clientX;
        state.lastY = event.clientY;
      },
      onPointerDown: (event) => {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
        const state = input.current;
        track(event);
        state.hasPointer = true;
        state.dragging = true;
        state.dx = 0;
        state.dy = 0;
        state.travel = 0;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        setEngaged(true);
        setCursor("orbPress", true);
        hideSystemCursor(true);
        stageRef.current?.setPointerCapture?.(event.pointerId);
      },
      onPointerUp: (event) => endDrag(event, true),
      // Fired when the browser takes the gesture over — a vertical scroll on
      // touch, for instance. That is not a tap, so no pulse.
      onPointerCancel: (event) => {
        endDrag(event, false);
        setCursor("orbCursor", false);
      },
      onPointerLeave: () => {
        // Pointer capture keeps a drag alive past the edge; only a free pointer
        // actually leaves.
        if (input.current.dragging) return;
        input.current.hasPointer = false;
        setCursor("orbCursor", false);
      },
    }),
    [track, endDrag, setCursor, hideSystemCursor]
  );

  return { stageRef, input, handlers, engaged };
}
