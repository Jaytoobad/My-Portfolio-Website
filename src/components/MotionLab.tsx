import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGraphics, useInView, useQualityTier, useReducedMotion } from "../lib/motion";
import "../styles/lab.css";

const LabGeometry = lazy(() => import("./lab/LabGeometry"));
const LabType = lazy(() => import("./lab/LabType"));
const LabParticles = lazy(() => import("./lab/LabParticles"));
const LabIdentity = lazy(() => import("./lab/LabIdentity"));

type Notes = { concept: string; tech: string; interaction: string };

type ExperimentProps = {
  index: string;
  title: string;
  notes: Notes;
  children: (active: boolean) => React.ReactNode;
};

/** Each experiment only loads its code, and only runs, while it is near the viewport. */
const Experiment = ({ index, title, notes, children }: ExperimentProps) => {
  const ref = useRef<HTMLElement>(null);
  const nearNow = useInView(ref, "300px");
  const visible = useInView(ref, "0px");
  // Once loaded, stay mounted so state (and the WebGL context) survives scrolling away.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (nearNow) setLoaded(true);
  }, [nearNow]);

  return (
    <article ref={ref} className="exp">
      <header className="exp__head">
        <span className="eyebrow">
          <b>{index}</b>Experiment
        </span>
        <h3 className="exp__title">{title}</h3>
      </header>

      <div className="exp__body">
        <Suspense fallback={<div className="exp__stage exp__loading">Loading experiment…</div>}>
          {loaded ? children(visible) : <div className="exp__stage exp__loading" />}
        </Suspense>
      </div>

      <dl className="exp__notes">
        <div>
          <dt className="eyebrow">Creative thinking</dt>
          <dd>{notes.concept}</dd>
        </div>
        <div>
          <dt className="eyebrow">Technology</dt>
          <dd>{notes.tech}</dd>
        </div>
        <div>
          <dt className="eyebrow">Try this</dt>
          <dd>{notes.interaction}</dd>
        </div>
      </dl>
    </article>
  );
};

export const MotionLab = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const quality = useQualityTier();
  const graphics = useGraphics();

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".exp").forEach((node) => {
        gsap.from(node, {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: node, start: "top 88%" },
        });
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section id="lab" ref={root} className="section lab">
      <div className="container">
        <p className="eyebrow">
          <b>04</b>Motion Lab
        </p>
        <h2 className="display lab__title">
          Things to <em>touch</em>, not just watch.
        </h2>
        <p className="lab__lede">
          Four small experiments, each live and interactive. They run in your browser, pause when off-screen and calm
          down if you prefer reduced motion.
        </p>

        <div className="lab__list">
          <Experiment
            index="01"
            title="Interactive 3D geometry"
            notes={{
              concept: "A form that feels like an object on a plinth: dark metal, one lime light, and a surface you can change.",
              tech: "Three.js through React Three Fiber, a physically based material, image-based lighting and orbit controls. Geometry detail drops on small screens.",
              interaction: "Drag to orbit, click to pulse, switch between forms, or flip to wireframe.",
            }}
          >
            {(active) =>
              graphics === "hardware" ? (
                <LabGeometry reduced={reduced} quality={quality} active={active} />
              ) : (
                <div className="exp__stage exp__loading">
                  3D needs a hardware-accelerated browser. It is switched off on this device.
                </div>
              )
            }
          </Experiment>

          <Experiment
            index="02"
            title="Kinetic typography"
            notes={{
              concept: "Type treated as material. Letters have weight and personality, and they get out of the way of your cursor.",
              tech: "React, a requestAnimationFrame loop and transform-only updates with smoothing. No layout work per frame.",
              interaction: "Move across the word, type your own, or switch to wave mode.",
            }}
          >
            {(active) => <LabType reduced={reduced} active={active} />}
          </Experiment>

          <Experiment
            index="03"
            title="Generative particle field"
            notes={{
              concept: "A fluid-like system with no fixed shape. Flow, drag and your input push it somewhere new each time.",
              tech: "HTML canvas 2D with a sine-based flow field, velocity damping and trail fading. Particle count scales with device capability.",
              interaction: "Move to steer, tap to burst, and swap between attract and repel.",
            }}
          >
            {(active) => <LabParticles reduced={reduced} quality={quality} active={active} />}
          </Experiment>

          <Experiment
            index="04"
            title="Lottie identity reveal"
            notes={{
              concept: "A monogram that draws itself, then lands a lime full stop. A small brand-motion moment.",
              tech: "Lottie (Bodymovin JSON) rendered as SVG by lottie-web, with playback controlled from code. This is the same pipeline used for After Effects exports.",
              interaction: "Replay it, or scrub the timeline frame by frame.",
            }}
          >
            {(active) => <LabIdentity reduced={reduced} active={active} />}
          </Experiment>
        </div>
      </div>
    </section>
  );
};
