import { useLayoutEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib/motion";
import { EDUCATION, INTERESTS } from "../content/profile";
import "../styles/about.css";

export const About = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.from(".about__col > *", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".about__grid", start: "top 80%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="about" ref={root} className="section about">
      <div className="container">
        <p className="eyebrow">
          <b>05</b>About
        </p>
        <div className="about__grid">
          <div className="about__col">
            <h2 className="display about__title">
              An IT professional growing into a <em>creative technologist.</em>
            </h2>
            <p className="about__text">
              I'm Hezekiah Asare, based in Ghana. I'm currently serving at the Lands Commission, where I'm exposed to IT
              operations and technology-related responsibilities.
            </p>
            <p className="about__text">
              Alongside that, I build websites and interactive experiences, using AI-assisted workflows to move faster
              while I keep learning the craft of motion, 3D and front-end engineering.
            </p>
          </div>

          <div className="about__col about__facts">
            <div>
              <h3 className="eyebrow">Education</h3>
              <ul className="facts">
                {EDUCATION.map((item) => (
                  <li key={item.place}>
                    <strong>{item.place}</strong>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Experience</h3>
              <ul className="facts">
                <li>
                  <strong>Lands Commission</strong>
                  <span>Currently serving · IT operations and technology-related responsibilities</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Creative interests</h3>
              <ul className="tags">
                {INTERESTS.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
