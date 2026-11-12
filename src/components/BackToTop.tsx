import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "../lib/motion";
import "../styles/backtotop.css";

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`totop${visible ? " totop--show" : ""}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
};
