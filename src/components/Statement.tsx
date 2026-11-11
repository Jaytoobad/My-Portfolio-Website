import { useLayoutEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib/motion";
import "../styles/statement.css";

const STATEMENT =
  "A website is more than a page. Design decides how it feels, technology decides how it behaves, interaction invites people in, and story gives them a reason to stay. I build at that intersection, shaping ideas into experiences that are considered, fast and alive, using modern tools and AI-assisted workflows to get from concept to something you can actually use.";

const PILLARS = [
  { name: "Design", body: "Typography, space and light that give an idea a point of view." },
  { name: "Technology", body: "React, TypeScript and the web platform, built to be fast and maintainable." },
  { name: "Interaction", body: "Motion and input that respond to the visitor instead of just decorating." },
  { name: "Storytelling", body: "Sequence and pacing that guide people through the work." },
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
            <b>02</b>Creative statement
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
          {PILLARS.map((pillar, index) => (
            <li key={pillar.name} className="pillar">
              <span className="eyebrow">0{index + 1}</span>
              <h3>{pillar.name}</h3>
              <p>{pillar.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
