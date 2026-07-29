import { useEffect, useState } from "react";

const MIN_WIDTH = 840;

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function computeCapability() {
  if (typeof window === "undefined") return false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wideEnough = window.innerWidth >= MIN_WIDTH;
  return wideEnough && !reduceMotion && detectWebGL();
}

export default function useCanRender3D() {
  const [capable, setCapable] = useState(computeCapability);

  useEffect(() => {
    let timeout = null;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setCapable(computeCapability()), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return capable;
}
