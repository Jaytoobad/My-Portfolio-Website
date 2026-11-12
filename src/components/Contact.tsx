import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { gsap, useCoarsePointer, useReducedMotion } from "../lib/motion";
import { CONTACT } from "../content/profile";
import "../styles/contact.css";

const HEADLINE = ["Let's make", "something", "matter."] as const;

const useAccraTime = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const accraTime = useAccraTime();
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  const email = CONTACT.find((link) => link.id === "email")?.href;
  const address = email?.replace("mailto:", "");
  const copyEmail = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is also shown in the list below.
    }
  };
  const enquiry = email ? `${email}${email.includes("?") ? "&" : "?"}subject=Hello%20Hezekiah` : undefined;
  const whatsapp = CONTACT.find((link) => link.id === "whatsapp")?.href;
  // Details that have not been provided yet are simply not shown.
  const available = CONTACT.filter((link) => link.href);

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
        <p className="eyebrow">Contact</p>
        <h2 className="display contact__title" aria-label="Let's make something matter.">
          {HEADLINE.map((line, index) => (
            <span key={line} className="contact__line" aria-hidden="true">
              <span>{index === 2 ? <em>{line}</em> : line}</span>
            </span>
          ))}
        </h2>

        <div className="contact__rest">
          <div className="contact__person">
            <img src="/photos/avatar.webp" width={56} height={56} alt="Hezekiah Asare" loading="lazy" decoding="async" />
            <p className="contact__text">
              Have a project in mind, or just want to say hello? Send me a message and I'll get back to you.
            </p>
          </div>

          <div className="contact__actions">
            {enquiry ? (
              <a className="btn btn--solid" href={enquiry}>
                Email me <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ) : null}
            {address ? (
              <button className="btn" type="button" onClick={copyEmail}>
                {copied ? "Copied" : "Copy email"}
                {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              </button>
            ) : null}
            {whatsapp ? (
              <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </p>

          <ul className="contact__links">
            {available.map((link) => (
              <li key={link.id}>
                <a href={link.href} target={link.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  <span>{link.label}</span>
                  <span className="contact__value">
                    {link.display ?? "Open"} <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="footer container">
        <span>© {new Date().getFullYear()} Hezekiah Asare</span>
        <span>Accra, Ghana{accraTime ? `, ${accraTime} local time` : ""}</span>
      </footer>
    </section>
  );
};
