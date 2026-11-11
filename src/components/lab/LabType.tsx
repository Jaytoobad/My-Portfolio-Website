import { useEffect, useMemo, useRef, useState } from "react";

type Props = { reduced: boolean; active: boolean };
type Mode = "repel" | "wave";

const MAX_LENGTH = 12;
const RADIUS = 190;

/** Experiment 02 — letters respond to the pointer. Transform-only, no layout work per frame. */
const LabType = ({ reduced, active }: Props) => {
  const [text, setText] = useState("Motion");
  const [mode, setMode] = useState<Mode>("repel");
  const stage = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const letters = useMemo(() => Array.from(text.slice(0, MAX_LENGTH)), [text]);

  useEffect(() => {
    if (reduced || !active) return;
    const root = stage.current;
    if (!root) return;

    const state = letterRefs.current.map(() => ({ x: 0, y: 0, s: 1, r: 0 }));
    let frame = 0;

    const tick = (now: number) => {
      const bounds = root.getBoundingClientRect();
      letterRefs.current.forEach((node, index) => {
        const current = state[index];
        if (!node || !current) return;
        // offsetLeft/Top ignore transforms, so the rest position stays stable.
        const cx = bounds.left + node.offsetLeft + node.offsetWidth / 2;
        const cy = bounds.top + node.offsetTop + node.offsetHeight / 2;

        let tx = 0;
        let ty = 0;
        let ts = 1;
        let tr = 0;

        if (mode === "wave") {
          ty = Math.sin(now / 420 + index * 0.7) * 16;
          tr = Math.sin(now / 600 + index) * 4;
        }

        const p = pointer.current;
        if (p) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const distance = Math.hypot(dx, dy) || 1;
          const influence = Math.max(0, 1 - distance / RADIUS);
          tx += (dx / distance) * influence * 70;
          ty += (dy / distance) * influence * 70;
          ts += influence * 0.45;
          tr += (dx / distance) * influence * 18;
        }

        current.x += (tx - current.x) * 0.12;
        current.y += (ty - current.y) * 0.12;
        current.s += (ts - current.s) * 0.12;
        current.r += (tr - current.r) * 0.12;
        node.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotate(${current.r.toFixed(2)}deg) scale(${current.s.toFixed(3)})`;
        node.dataset.hot = Math.abs(current.x) + Math.abs(current.y) > 12 ? "true" : "false";
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      letterRefs.current.forEach((node) => node && (node.style.transform = ""));
    };
  }, [reduced, active, mode, letters]);

  return (
    <div className="exp__stage-wrap">
      <div
        ref={stage}
        className="exp__stage exp__stage--type"
        onPointerMove={(event) => (pointer.current = { x: event.clientX, y: event.clientY })}
        onPointerLeave={() => (pointer.current = null)}
        onPointerCancel={() => (pointer.current = null)}
      >
        <p className="kinetic">
          <span className="sr-only">{letters.join("")}</span>
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              ref={(node) => {
                letterRefs.current[index] = node;
              }}
              className="kinetic__letter"
              aria-hidden="true"
            >
              {letter === " " ? " " : letter}
            </span>
          ))}
        </p>
      </div>
      <div className="exp__controls">
        <label className="field">
          <span className="eyebrow">Your word</span>
          <input
            type="text"
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(event) => setText(event.target.value)}
            aria-label="Word to animate"
          />
        </label>
        <div role="group" aria-label="Typography mode" className="exp__chips">
          <button type="button" className="chip" aria-pressed={mode === "repel"} onClick={() => setMode("repel")}>
            Repel
          </button>
          <button type="button" className="chip" aria-pressed={mode === "wave"} onClick={() => setMode("wave")}>
            Wave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabType;
