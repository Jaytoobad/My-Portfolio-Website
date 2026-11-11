import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { Play } from "lucide-react";
import identityMark from "../../assets/identity-mark.json";

type Props = { reduced: boolean; active: boolean };

const TOTAL_FRAMES = 90;

/** Experiment 04 — a Lottie (Bodymovin JSON) identity reveal, driven entirely from code. */
const LabIdentity = ({ reduced, active }: Props) => {
  const host = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);
  const played = useRef(false);
  const [frame, setFrame] = useState(reduced ? TOTAL_FRAMES - 1 : 0);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let cancelled = false;

    void import("lottie-web/build/player/lottie_light").then((module) => {
      if (cancelled) return;
      const instance = module.default.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: identityMark,
      });
      animation.current = instance;
      instance.addEventListener("enterFrame", () => setFrame(Math.round(instance.currentFrame)));
      if (reduced) instance.goToAndStop(TOTAL_FRAMES - 1, true);
    });

    return () => {
      cancelled = true;
      animation.current?.destroy();
      animation.current = null;
    };
  }, [reduced]);

  // Reveal once, the first time the experiment scrolls into view.
  useEffect(() => {
    if (!active || played.current || reduced) return;
    const timer = window.setTimeout(() => {
      if (animation.current) {
        played.current = true;
        animation.current.goToAndPlay(0, true);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [active, reduced]);

  const replay = () => {
    if (reduced) {
      animation.current?.goToAndStop(TOTAL_FRAMES - 1, true);
      return;
    }
    animation.current?.goToAndPlay(0, true);
  };

  const scrub = (value: number) => {
    animation.current?.goToAndStop(value, true);
    setFrame(value);
  };

  return (
    <div className="exp__stage-wrap">
      <div className="exp__stage exp__stage--identity">
        <div ref={host} className="identity" role="img" aria-label="Animated HA monogram drawing itself in lime." />
      </div>
      <div className="exp__controls">
        <button type="button" className="chip" onClick={replay}>
          <Play size={14} aria-hidden="true" /> Replay
        </button>
        <label className="field field--range">
          <span className="eyebrow">Scrub</span>
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            value={frame}
            onChange={(event) => scrub(Number(event.target.value))}
            aria-label="Scrub the animation timeline"
          />
        </label>
      </div>
    </div>
  );
};

export default LabIdentity;
