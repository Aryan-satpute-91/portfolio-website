import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../context/LoadingProvider";

gsap.registerPlugin(ScrollTrigger);

// ─── Frame config ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 1680;
const SECTIONS = [
  { trigger: ".landing-section", start: 0,    end: 239  }, // Scene 1 — The Arrival
  { trigger: ".about-section",   start: 240,  end: 479  }, // Scene 2 — The Core
  { trigger: ".whatIDO",         start: 480,  end: 719  }, // Scene 3 — The Armory
  { trigger: ".career-section",  start: 720,  end: 959  }, // Scene 4 — The Descent
  { trigger: ".work-section",    start: 960,  end: 1199 }, // Scene 5 — The Hangar
  { trigger: ".techstack",       start: 1200, end: 1439 }, // Scene 6 — The System
  { trigger: ".contact-section", start: 1440, end: 1679 }, // Scene 7 — The Final Floor
];

// ─── Color grade per scene (CSS filter applied to canvas) ─────────────────────
const SCENE_GRADES = [
  "brightness(0.9) contrast(1.15) saturate(1.2)",             // 1 Arrival
  "brightness(0.75) contrast(1.2) saturate(1.1) hue-rotate(10deg)", // 2 Core
  "brightness(0.85) contrast(1.1) saturate(1.3)",             // 3 Armory
  "brightness(0.65) contrast(1.3) saturate(0.9) hue-rotate(-5deg)", // 4 Descent
  "brightness(0.8) contrast(1.15) saturate(1.2)",             // 5 Hangar
  "brightness(0.8) contrast(1.1) saturate(1.4) hue-rotate(5deg)",  // 6 System
  "brightness(0.7) contrast(1.1) saturate(0.85)",             // 7 Final Floor
];

const currentFrame = (i: number) => `/frames/${String(i + 1).padStart(4, "0")}.jpg`;

// ─── Canvas crossfade using two canvases ──────────────────────────────────────
export const ScrollSequence = () => {
  const { isLoading } = useLoading();
  const wrapRef    = useRef<HTMLDivElement>(null);
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef({ frame: 0, scene: 0, blendAlpha: 0 });
  const imagesRef  = useRef<(HTMLImageElement | null)[]>([]);

  // Initialize the image cache array once
  if (imagesRef.current.length === 0) {
    imagesRef.current = Array(TOTAL_FRAMES).fill(null);
  }

  useEffect(() => {
    const canvasA = canvasARef.current!;
    const canvasB = canvasBRef.current!;
    const ctxA    = canvasA.getContext("2d")!;

    canvasA.width  = 1920; canvasA.height = 1080;
    canvasB.width  = 1920; canvasB.height = 1080;

    const renderFirst = () => {
      const firstImg = imagesRef.current[0];
      if (firstImg && firstImg.complete) {
        ctxA.drawImage(firstImg, 0, 0, 1920, 1080);
      }
    };

    // 1. Immediately preload ONLY the first frame for an instant initial view without saturating connection pool
    if (!imagesRef.current[0]) {
      const img = new Image();
      img.src = currentFrame(0);
      img.onload = () => {
        imagesRef.current[0] = img;
        renderFirst();
      };
    } else {
      renderFirst();
    }

    // ── Render loop (with lazy-load fallback) ──────────────────────────────────
    const render = () => {
      const { frame, blendAlpha } = stateRef.current;
      let img = imagesRef.current[frame];

      // On-demand load fallback if not loaded yet
      if (!img) {
        img = new Image();
        img.src = currentFrame(frame);
        img.onload = () => {
          imagesRef.current[frame] = img;
          if (stateRef.current.frame === frame) {
            ctxA.clearRect(0, 0, 1920, 1080);
            ctxA.drawImage(img!, 0, 0, 1920, 1080);
          }
        };
        return;
      }

      if (!img.complete || img.naturalWidth === 0) return;

      ctxA.clearRect(0, 0, 1920, 1080);
      ctxA.drawImage(img, 0, 0, 1920, 1080);

      // Cross-fade canvas B (previous scene last frame) into canvas A
      canvasB.style.opacity = String(Math.max(0, 1 - blendAlpha));
      canvasA.style.opacity = String(Math.min(1, blendAlpha + 0.01));
    };

    // ── Per-section scroll triggers ───────────────────────────────────────────
    SECTIONS.forEach((sec, idx) => {
      const obj = { frame: sec.start };

      gsap.fromTo(
        obj,
        { frame: sec.start },
        {
          frame: sec.end,
          snap: "frame",
          ease: "none",
          scrollTrigger: {
            trigger: sec.trigger,
            start: "top bottom",
            end:   "bottom top",
            scrub: 1.2,
            onUpdate: (self) => {
              // Smooth scene blend: first 15% of each section crossfade in
              const blend = Math.min(1, self.progress / 0.15);
              stateRef.current.scene      = idx;
              stateRef.current.blendAlpha = blend;

              // Apply color grade smoothly
              const wrap = wrapRef.current;
              if (wrap) {
                wrap.style.filter = SCENE_GRADES[idx];
              }
            },
          },
          onUpdate: () => {
            stateRef.current.frame = Math.round(obj.frame);
            render();
          },
        }
      );
    });

    const onResize = () => render();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ── Progressive background preloading deferred until critical assets (model, draco) are fully loaded ──
  useEffect(() => {
    if (isLoading) return;

    let isCancelled = false;
    let currentBatchStart = 1;
    const BATCH_SIZE = 20; // Since model is loaded, we can use slightly larger batches
    const INTERVAL_MS = 25;

    const loadNextBatch = () => {
      if (isCancelled || currentBatchStart >= TOTAL_FRAMES) return;
      const end = Math.min(TOTAL_FRAMES, currentBatchStart + BATCH_SIZE);
      for (let i = currentBatchStart; i < end; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = currentFrame(i);
          img.onload = () => {
            if (!isCancelled) imagesRef.current[i] = img;
          };
        }
      }
      currentBatchStart = end;
      setTimeout(loadNextBatch, INTERVAL_MS);
    };

    // Small initial delay after loading fades out to ensure smooth entry transitions complete
    const delayTimer = setTimeout(() => {
      loadNextBatch();
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimer);
    };
  }, [isLoading]);

  return (
    <div
      ref={wrapRef}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         -3,
        pointerEvents:  "none",
        transition:     "filter 0.8s ease",
      }}
    >
      {/* Canvas B — previous scene (fades out during crossfade) */}
      <canvas
        ref={canvasBRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}
      />
      {/* Canvas A — current scene (fades in) */}
      <canvas
        ref={canvasARef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* ── Unified cinematic overlay stack ─────────────────────────────── */}

      {/* 1. Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        pointerEvents: "none",
      }} />

      {/* 2. Scanlines */}
      <div className="cin-scanlines" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* 3. Base darkening so text always readable */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,8,0.32)",
        pointerEvents: "none",
      }} />

      {/* 4. Neon atmospheric glow strips */}
      <div className="cin-glow-top"    style={{ position: "absolute", top:    0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(0,229,255,0.6),transparent)", pointerEvents: "none" }} />
      <div className="cin-glow-bottom" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent)", pointerEvents: "none" }} />
    </div>
  );
};

export default ScrollSequence;
