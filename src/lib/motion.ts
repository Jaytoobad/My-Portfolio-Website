import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_QUERY = "(pointer: coarse)";

const subscribeQuery = (query: string, onChange: (matches: boolean) => void) => {
  const media = window.matchMedia(query);
  const handler = () => onChange(media.matches);
  handler();
  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
};

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => subscribeQuery(REDUCED_QUERY, setReduced), []);
  return reduced;
};

export const useCoarsePointer = () => {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => subscribeQuery(COARSE_QUERY, setCoarse), []);
  return coarse;
};

/** Lower-powered devices get fewer pixels and fewer objects. */
export const useQualityTier = () => {
  const coarse = useCoarsePointer();
  const [narrow, setNarrow] = useState(false);
  useEffect(() => subscribeQuery("(max-width: 768px)", setNarrow), []);
  return coarse || narrow ? "low" : "high";
};

/** True while the referenced element is within `margin` of the viewport. Used to pause work off-screen. */
export const useInView = (ref: { current: Element | null }, margin = "200px") => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      rootMargin: margin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, margin]);
  return inView;
};

export type GraphicsTier = "none" | "software" | "hardware";

let cachedTier: GraphicsTier | undefined;

/**
 * Detects whether WebGL is hardware accelerated. Software renderers (SwiftShader, llvmpipe) can block the
 * main thread for seconds, so 3D scenes are skipped there. Add `?3d=on` to the URL to force 3D for testing.
 */
export const detectGraphics = (): GraphicsTier => {
  if (cachedTier) return cachedTier;
  try {
    if (new URLSearchParams(window.location.search).get("3d") === "on") return (cachedTier = "hardware");
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return (cachedTier = "none");
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return (cachedTier = /swiftshader|llvmpipe|software|basic render/i.test(renderer) ? "software" : "hardware");
  } catch {
    return (cachedTier = "none");
  }
};

export const useGraphics = (): GraphicsTier | null => {
  const [tier, setTier] = useState<GraphicsTier | null>(null);
  useEffect(() => setTier(detectGraphics()), []);
  return tier;
};

/** Becomes true once the browser is idle after load, so heavy scenes never compete with first paint. */
export const useIdleReady = (timeout = 1500) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (idle) idle(() => setReady(true), { timeout });
      else window.setTimeout(() => setReady(true), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [timeout]);
  return ready;
};
