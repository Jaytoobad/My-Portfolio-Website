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
