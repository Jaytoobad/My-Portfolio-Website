import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useCoarsePointer, useReducedMotion } from "../lib/motion";
import { CONTACT } from "../content/profile";
import "../styles/contact.css";

const HEADLINE = ["Let's make", "something", "matter."] as const;

export const Contact = () => {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  const email = CONTACT.find((link) => link.id === "email")?.href;
  const enquiry = email ? `${email}${email.includes("?") ? "&" : "?"}subject=Project%20enquiry` : undefined;

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.from(".contact__line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".contact__title", start: "top 80%" },
      });
      gsap.from(".contact__rest", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact__rest", start: "top 90%" },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  // A soft lime light follows the pointer. Transform only, desktop only.
  useLayoutEffect(() => {
    const node = glow.current;
    const section = root.current;
    if (!node || !section || reduced || coarse) return;
    const moveX = gsap.quickTo(node, "x", { duration: 0.9, ease: "power3.out" });
    const moveY = gsap.quickTo(node, "y", { duration: 0.9, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, [reduced, coarse]);

  return (
    <section id="contact" ref={root} className="section contact">
      {!reduced && !coarse ? <div ref={glow} className="contact__glow" aria-hidden="true" /> : null}
      <div className="container contact__inner">
        <p className="eyebrow">
          <b>07</b>Contact
        </p>
        <h2 className="display contact__title" aria-label="Let's make something matter.">
          {HEADLINE.map((line, index) => (
            <span key={line} className="contact__line" aria-hidden="true">
              <span>{index === 2 ? <em>{line}</em> : line}</span>
            </span>
          ))}
        </h2>

        <div className="contact__rest">
          <p className="contact__text">
            Have a project, an idea or a collaboration in mind? I'd like to hear about it.
          </p>

          {enquiry ? (
            <a className="btn btn--solid" href={enquiry}>
              Start an enquiry <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ) : (
            <span className="btn btn--solid btn--disabled" aria-disabled="true">
              Enquiry link coming soon
            </span>
          )}

          <ul className="contact__links">
            {CONTACT.map((link) => (
              <li key={link.id}>
                {link.href ? (
                  <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    <span>{link.label}</span>
                    <span className="contact__value">
                      {link.display ?? "Open"} <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </a>
                ) : (
                  <div className="contact__pending">
                    <span>{link.label}</span>
                    <span className="contact__value">Coming soon</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer container">
        <span>© {new Date().getFullYear()} Hezekiah Asare</span>
        <span>Accra, Ghana</span>
      </footer>
    </section>
  );
};
