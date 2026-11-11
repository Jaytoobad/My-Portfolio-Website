import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useReducedMotion } from "../lib/motion";
import { PROJECTS, STATUS_LABEL, findProject } from "../content/projects";
import { CaseStudy } from "./CaseStudy";
import "../styles/work.css";

const CASE_PREFIX = "#case/";

const slugFromHash = () => (window.location.hash.startsWith(CASE_PREFIX) ? window.location.hash.slice(CASE_PREFIX.length) : null);

export const Work = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setOpenSlug(slugFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = (slug: string) => {
    window.location.hash = `${CASE_PREFIX}${slug}`;
  };
  const close = useCallback(() => {
    history.replaceState(null, "", "#work");
    setOpenSlug(null);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 70,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  const active = openSlug ? findProject(openSlug) : undefined;

  return (
    <section id="work" ref={root} className="section work">
      <div className="container">
        <header className="work__head">
          <p className="eyebrow">
            <b>03</b>Selected work
          </p>
          <h2 className="display work__title">
            Real sites, <em>real</em> workflows.
          </h2>
        </header>

        <ol className="projects">
          {PROJECTS.map((project, index) => {
            const hasStudy = Boolean(project.caseStudy);
            return (
              <li key={project.slug} className="project">
                <span className="project__index">0{index + 1}</span>

                <div className="project__main">
                  <h3 className="display project__name">{project.name}</h3>
                  <span className={`status status--${project.status}`}>{STATUS_LABEL[project.status]}</span>
                </div>

                <div className="project__detail">
                  <p>{project.summary}</p>
                  {project.progressNote && <p className="project__note">{project.progressNote}</p>}
                  <ul className="chips">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="project__actions">
                  {hasStudy && (
                    <button className="btn btn--solid" type="button" onClick={() => open(project.slug)}>
                      Case study
                    </button>
                  )}
                  {project.url && (
                    <a className="btn" href={project.url} target="_blank" rel="noopener noreferrer">
                      Live site <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {active?.caseStudy && <CaseStudy project={active} onClose={close} />}
    </section>
  );
};
