import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import "../styles/nav.css";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#lab", label: "Motion Lab" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
] as const;

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Progress bar is scaled with a transform, so scrolling never triggers layout.
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector<HTMLElement>(link.href)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((node) => observer.observe(node));
    const onTop = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" onClick={close} aria-label="HA Hezekiah Asare">
          <span className="nav__mark">HA</span>
          <span className="nav__name">Hezekiah Asare</span>
        </a>

        <nav className="nav__links" id="primary-nav" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={active === link.href ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="nav__progress" aria-hidden="true">
        <div ref={bar} className="nav__progress-bar" />
      </div>
    </header>
  );
};
