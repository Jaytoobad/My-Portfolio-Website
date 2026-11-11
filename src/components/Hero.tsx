import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { gsap, useQualityTier, useReducedMotion } from "../lib/motion";
import "../styles/hero.css";

const HeroScene = lazy(() => import("./HeroScene"));

type Part = { text: string; accent?: boolean };

const HEADLINE: readonly (readonly Part[])[] = [
  [{ text: "I turn ideas" }],
  [{ text: "into " }, { text: "digital", accent: true }],
  [{ text: "experiences.", accent: true }],
];

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

export const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const quality = useQualityTier();
  const [visible, setVisible] = useState(true);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  // Pause rendering while the hero is off-screen.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? true), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });
      timeline
        .from(".hero__eyebrow", { opacity: 0, y: 12, duration: 0.9 }, 0.1)
        .from(".hero__line-inner", { yPercent: 115, duration: 1.3, stagger: 0.11 }, 0.2)
        .from(".hero__intro, .hero__actions", { opacity: 0, y: 24, duration: 1, stagger: 0.12 }, 0.85)
        .from(".hero__foot", { opacity: 0, duration: 1 }, 1.2);
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="top" ref={root} className="hero">
      <div className="hero__stage" aria-hidden="true">
        {webgl ? (
          <Suspense fallback={null}>
            <HeroScene active={visible} reduced={reduced} quality={quality} />
          </Suspense>
        ) : (
          <div className="hero__fallback" />
        )}
      </div>

      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">
          <b>01</b>
          Creative Developer
          <span className="hero__place">
            <MapPin size={13} aria-hidden="true" /> Accra, Ghana
          </span>
        </p>

        <h1 className="display hero__title" aria-label="I turn ideas into digital experiences.">
          {HEADLINE.map((line) => (
            <span key={line.map((part) => part.text).join("")} className="hero__line" aria-hidden="true">
              <span className="hero__line-inner">
                {line.map((part) =>
                  part.accent ? <em key={part.text}>{part.text}</em> : <span key={part.text}>{part.text}</span>,
                )}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__intro">
          I&rsquo;m Hezekiah Asare &mdash; a creative developer exploring the intersection of thoughtful design,
          modern web technology and AI-assisted creation.
        </p>

        <div className="hero__actions">
          <a className="btn btn--solid" href="#work">
            Selected work <ArrowDownRight size={18} aria-hidden="true" />
          </a>
          <a className="btn" href="#contact">
            Get in touch <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="container hero__foot">
        <span className="eyebrow">Web development</span>
        <span className="eyebrow">Motion &amp; interaction</span>
        <span className="eyebrow">AI-assisted workflows</span>
        <span className="eyebrow hero__scroll">
          Scroll <i aria-hidden="true" />
        </span>
      </div>
    </section>
  );
};
