import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { gsap, useReducedMotion } from "../lib/motion";
import { STATUS_LABEL, type Project } from "../content/projects";
import { ImageSlot } from "./ImageSlot";
import "../styles/case.css";

type Props = {
  project: Project;
  onClose: () => void;
};

const SHOTS = [1, 2, 3] as const;

export const CaseStudy = ({ project, onClose }: Props) => {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const study = project.caseStudy;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(root.current, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1 })
        .from(".case__title-inner", { yPercent: 110, duration: 1.1 }, 0.35)
        .from(".case__fade", { opacity: 0, y: 24, duration: 0.9, stagger: 0.08 }, 0.55);
    }, root);
    return () => context.revert();
  }, [reduced]);

  if (!study) return null;

  return (
    <div ref={root} className="case" role="dialog" aria-modal="true" aria-label={`${project.name} case study`}>
      <button ref={closeButton} className="case__close" type="button" onClick={onClose}>
        <X size={18} aria-hidden="true" /> Close
      </button>

      <div className="container case__body">
        <p className="eyebrow case__fade">
          <b>Case study</b>
          <span className={`status status--${project.status}`}>{STATUS_LABEL[project.status]}</span>
        </p>

        <h2 className="display case__title">
          <span className="case__title-mask">
            <span className="case__title-inner">{project.name}</span>
          </span>
        </h2>

        <div className="case__lead case__fade">
          <p>{study.overview}</p>
          {project.url && (
            <a className="btn btn--solid" href={project.url} target="_blank" rel="noopener noreferrer">
              Visit live site <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="case__shots case__fade">
          {SHOTS.map((n) => (
            <ImageSlot
              key={n}
              src={`/projects/${project.slug}-${n}.jpg`}
              alt={`${project.name} screenshot ${n}`}
              label={`${project.name} ${n}`}
            />
          ))}
        </div>

        <div className="case__grid">
          <section className="case__fade">
            <h3 className="eyebrow">Opportunity</h3>
            <p>{study.opportunity}</p>
          </section>
          <section className="case__fade">
            <h3 className="eyebrow">Creative direction</h3>
            <p>{study.direction}</p>
          </section>
          <section className="case__fade">
            <h3 className="eyebrow">Development process</h3>
            <ul>
              {study.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="case__fade">
            <h3 className="eyebrow">My contributions</h3>
            <ul>
              {study.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {study.challenges.length > 0 && (
            <section className="case__fade case__wide">
              <h3 className="eyebrow">Challenges and solutions</h3>
              {study.challenges.map((challenge) => (
                <div key={challenge.title} className="case__challenge">
                  <h4>{challenge.title}</h4>
                  <p>{challenge.body}</p>
                </div>
              ))}
            </section>
          )}
          <section className="case__fade case__wide">
            <h3 className="eyebrow">Technologies</h3>
            <ul className="chips">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
