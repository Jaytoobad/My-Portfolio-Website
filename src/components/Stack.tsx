import { useLayoutEffect, useRef } from "react";
import { gsap, useReducedMotion } from "../lib/motion";
import { LEVEL_LABEL, STACK } from "../content/profile";
import "../styles/about.css";

export const Stack = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.from(".stack__group", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".stack__groups", start: "top 82%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="stack" ref={root} className="section stack">
      <div className="container">
        <p className="eyebrow">
          Technology and workflow
        </p>
        <h2 className="display stack__title">
          What I use, and <em>how well.</em>
        </h2>
        <p className="stack__lede">
          Grouped by how I actually use them, not ranked by bars or percentages.
        </p>

        <div className="stack__groups">
          {STACK.map((group) => (
            <section key={group.name} className="stack__group" data-level={group.level}>
              <header>
                <h3>{group.name}</h3>
                <span className="level">{LEVEL_LABEL[group.level]}</span>
              </header>
              <p>{group.note}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};
