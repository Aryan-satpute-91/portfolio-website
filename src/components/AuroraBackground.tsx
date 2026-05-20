import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/AuroraBackground.css";

gsap.registerPlugin(ScrollTrigger);

const AuroraBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Mouse Follower with Inertia (Lerping)
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates (-0.5 to 0.5)
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let frameId: number;
    const updateMouseParallax = () => {
      // Lerp logic for butter-smooth fluid movement
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;

      if (containerRef.current) {
        // Subtle shift of the whole layer (max 45px) to give 3D depth
        const moveX = currentX * 45;
        const moveY = currentY * 45;
        containerRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      frameId = requestAnimationFrame(updateMouseParallax);
    };

    frameId = requestAnimationFrame(updateMouseParallax);

    // 2. GSAP ScrollTrigger for Scroll-Responsive Morphs
    const b1 = blob1Ref.current;
    const b2 = blob2Ref.current;
    const b3 = blob3Ref.current;

    if (b1 && b2 && b3) {
      // Create a master timeline linked to the overall scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.8, // Elegant inertia on scroll changes
          invalidateOnRefresh: true,
        },
      });

      // Section 1 -> About Section Morph (~15%)
      tl.to([b1, b2, b3], { duration: 1 }) // Buffer space
        .to(b1, {
          x: "15vw",
          y: "35vh",
          scale: 1.25,
          backgroundColor: "#ff5e00", // Bright orange
          duration: 2,
        }, "about")
        .to(b2, {
          x: "-40vw",
          y: "-30vh",
          scale: 0.95,
          backgroundColor: "#8b00ff", // Deep violet purple
          duration: 2,
        }, "about")
        .to(b3, {
          x: "20vw",
          y: "-45vh",
          scale: 1.15,
          backgroundColor: "#ff0055", // Neon hot pink
          duration: 2,
        }, "about");

      // About Section -> What I Do Section Morph (~35%)
      tl.to(b1, {
        x: "50vw",
        y: "-10vh",
        scale: 0.95,
        backgroundColor: "#00f3ff", // Neon Electric Cyan
        duration: 2,
      }, "whatIDO")
        .to(b2, {
          x: "-65vw",
          y: "30vh",
          scale: 1.35,
          backgroundColor: "#00ff88", // Cyber Emerald
          duration: 2,
        }, "whatIDO")
        .to(b3, {
          x: "-10vw",
          y: "10vh",
          scale: 0.85,
          backgroundColor: "#3f0099", // Deep Midnight Blue
          duration: 2,
        }, "whatIDO");

      // What I Do -> Career Section Morph (~55%)
      tl.to(b1, {
        x: "-25vw",
        y: "25vh",
        scale: 1.3,
        backgroundColor: "#ff00bb", // Cyberpunk Purple-Pink
        duration: 2,
      }, "career")
        .to(b2, {
          x: "30vw",
          y: "-40vh",
          scale: 1.0,
          backgroundColor: "#ffd700", // Metallic gold
          duration: 2,
        }, "career")
        .to(b3, {
          x: "10vw",
          y: "-10vh",
          scale: 1.25,
          backgroundColor: "#6e00ff", // Radiant Violet
          duration: 2,
        }, "career");

      // Career -> Work/TechStack Section Morph (~75%)
      tl.to(b1, {
        x: "-45vw",
        y: "40vh",
        scale: 1.1,
        backgroundColor: "#0055ff", // Royal Cobalt Blue
        duration: 2,
      }, "work")
        .to(b2, {
          x: "45vw",
          y: "-15vh",
          scale: 1.35,
          backgroundColor: "#ff0055", // Hot Neon Pink
          duration: 2,
        }, "work")
        .to(b3, {
          x: "5vw",
          y: "35vh",
          scale: 1.2,
          backgroundColor: "#00ffff", // Electric Turquoise
          duration: 2,
        }, "work");

      // Work/TechStack -> Contact Section Morph (~100%)
      tl.to(b1, {
        x: "0vw",
        y: "45vh",
        scale: 1.45,
        backgroundColor: "#ff2a00", // Deep magma red
        duration: 2,
      }, "contact")
        .to(b2, {
          x: "25vw",
          y: "30vh",
          scale: 1.25,
          backgroundColor: "#ff9900", // Radiant Amber
          duration: 2,
        }, "contact")
        .to(b3, {
          x: "-30vw",
          y: "35vh",
          scale: 1.2,
          backgroundColor: "#ff0066", // Sunset Coral
          duration: 2,
        }, "contact");
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="aurora-background-container" ref={containerRef}>
      {/* Dynamic interactive blobs */}
      <div className="aurora-blob aurora-blob-1" ref={blob1Ref}></div>
      <div className="aurora-blob aurora-blob-2" ref={blob2Ref}></div>
      <div className="aurora-blob aurora-blob-3" ref={blob3Ref}></div>

      {/* Static deep baseline soft ambient light */}
      <div className="aurora-blob-ambient"></div>
    </div>
  );
};

export default AuroraBackground;
