import { useLayoutEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib/motion";
import "../styles/statement.css";

const STATEMENT =
  "Most websites look fine and say nothing. I want mine to feel like someone made them on purpose. Design sets the mood, code makes it work, motion makes it feel alive, and the story is what people remember. I use AI to build faster, but the ideas, the taste and the calls are mine.";

const PILLARS = [
  { name: "Design", body: "How it looks and feels: type, space, colour and light." },
  { name: "Technology", body: "React, TypeScript and the web platform, built to be fast and easy to maintain." },
  { name: "Interaction", body: "Motion and input that respond to the visitor instead of just decorating the page." },
  { name: "Storytelling", body: "The order things appear in, and the pace, so people are led through the work." },
] as const;

export const Statement = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.fromTo(".statement__a", { xPercent: 3 }, {
        xPercent: -3,
        ease: "none",
        scrollTrigger: { trigger: ".statement__pin", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".statement__b", { xPercent: -3 }, {
        xPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: ".statement__pin", start: "top bottom", end: "bottom top", scrub: true },
      });

      const words = gsap.utils.toArray<HTMLElement>(".statement__word");
      gsap.fromTo(
        words,
        { opacity: 0.5 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".statement__pin",
            start: "top top",
            end: "+=130%",
            scrub: 0.6,
            pin: true,
          },
        },
      );

      gsap.from(".pillar", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".pillars", start: "top 85%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="statement" ref={root} className="statement">
      <div className="statement__pin">
        <div className="container statement__inner">
          <p className="eyebrow">
            Creative statement
          </p>
          <h2 className="display statement__title" aria-label="Not just another website.">
            <span className="statement__a" aria-hidden="true">
              Not just another
            </span>
            <span className="statement__b" aria-hidden="true">
              <em>website.</em>
            </span>
          </h2>
          <p className="statement__text">
            <span className="sr-only">{STATEMENT}</span>
            <span aria-hidden="true">
              {STATEMENT.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="statement__word">
                  {word}{" "}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>

      <div className="container">
        <ol className="pillars">
          {PILLARS.map((pillar) => (
            <li key={pillar.name} className="pillar">
              <h3>{pillar.name}</h3>
              <p>{pillar.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
