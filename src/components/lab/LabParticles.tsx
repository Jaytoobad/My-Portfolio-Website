import { useEffect, useRef, useState } from "react";

type Props = { reduced: boolean; quality: "low" | "high"; active: boolean };
type Mode = "attract" | "repel";

type Particle = { x: number; y: number; vx: number; vy: number };

/** Experiment 03 — a flow-field particle system. Pointer steers it, a tap bursts it. */
const LabParticles = ({ reduced, quality, active }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("attract");
  const modeRef = useRef<Mode>(mode);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const burst = useRef<{ x: number; y: number; power: number } | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, quality === "low" ? 1 : 1.5);
    const count = quality === "low" ? 450 : 1300;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#0a0a0a";
      context.fillRect(0, 0, width, height);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      }));
    };

    const step = (time: number) => {
      const t = time / 1000;
      const p = pointer.current;
      const b = burst.current;
      const sign = modeRef.current === "attract" ? -1 : 1;

      for (const particle of particles) {
        const angle = (Math.sin(particle.x * 0.0035 + t * 0.25) + Math.cos(particle.y * 0.0035 - t * 0.2)) * Math.PI;
        particle.vx += Math.cos(angle) * 0.07;
        particle.vy += Math.sin(angle) * 0.07;

        if (p) {
          const dx = particle.x - p.x;
          const dy = particle.y - p.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < 170) {
            const force = (1 - distance / 170) * 0.9;
            particle.vx += (dx / distance) * force * sign;
            particle.vy += (dy / distance) * force * sign;
          }
        }
        if (b) {
          const dx = particle.x - b.x;
          const dy = particle.y - b.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < 260) {
            const force = (1 - distance / 260) * b.power * 6;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        particle.vx *= 0.94;
        particle.vy *= 0.94;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x += width;
        if (particle.x > width) particle.x -= width;
        if (particle.y < 0) particle.y += height;
        if (particle.y > height) particle.y -= height;
      }
      burst.current = null;
    };

    const draw = () => {
      context.fillStyle = "rgba(10, 10, 10, 0.13)";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(200, 255, 46, 0.85)";
      for (const particle of particles) {
        const speed = Math.min(Math.hypot(particle.vx, particle.vy), 4);
        const size = 0.8 + speed * 0.35;
        context.fillRect(particle.x, particle.y, size, size);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (reduced) {
      // One composed still frame instead of continuous motion.
      for (let i = 0; i < 160; i += 1) {
        step(i * 40);
        if (i % 8 === 0) draw();
      }
      return () => observer.disconnect();
    }

    let frame = 0;
    if (active) {
      const tick = (time: number) => {
        step(time);
        draw();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduced, quality, active]);

  const toLocal = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div className="exp__stage-wrap">
      <div className="exp__stage exp__stage--particles">
        <canvas
          ref={canvasRef}
          className="particles"
          role="img"
          aria-label="Generative particle field. Move the pointer to steer it, tap to burst."
          onPointerMove={(event) => (pointer.current = toLocal(event))}
          onPointerLeave={() => (pointer.current = null)}
          onPointerCancel={() => (pointer.current = null)}
          onPointerDown={(event) => (burst.current = { ...toLocal(event), power: 1 })}
        />
      </div>
      <div className="exp__controls" role="group" aria-label="Particle controls">
        <button type="button" className="chip" aria-pressed={mode === "attract"} onClick={() => setMode("attract")}>
          Attract
        </button>
        <button type="button" className="chip" aria-pressed={mode === "repel"} onClick={() => setMode("repel")}>
          Repel
        </button>
        <span className="exp__hint">Tap or click to burst</span>
      </div>
    </div>
  );
};

export default LabParticles;
