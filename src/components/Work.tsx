import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    number: "01",
    name: "HMPI Analyzer",
    category: "Web Application · Environmental Data",
    tools: "Node.js, Express.js, React.js, Chart.js, PostgreSQL, Vercel, Render",
    description:
      "Groundwater Pollution Analysis System processing 8,000+ environmental records to identify the top 3 high-risk zones. Improving data analysis efficiency by 40% with interactive Chart.js dashboards and CI/CD-style deployment achieving 99%+ uptime.",
    image: "/images/hmpi-preview.png",
    link: "https://hmpi-bk.vercel.app/",
    period: "Oct 2025 – Dec 2025",
  },
  {
    number: "02",
    name: "Daily Coding Challenge",
    category: "Android Application · EdTech",
    tools: "Kotlin, Jetpack Compose, MVVM, Supabase Realtime, Firebase Firestore, Google Gemini AI, Ktor, CameraX",
    description:
      "Native Android learning & productivity app with MVVM and Clean Architecture. Features a real-time multiplayer Code Arena supporting 10+ concurrent users and Google Gemini AI-powered contextual hints, reducing average coding time by 35%.",
    images: ["/images/daily-coding-1.jpeg", "/images/daily-coding-2.jpeg"],
    link: "https://github.com/Aryan-satpute-91/DailyCoding.git",
    period: "Mar 2026 – Apr 2026",
  },
  {
    number: "03",
    name: "Nexus Store",
    category: "Full-Stack Web · 3D E-Commerce",
    tools: "React.js, Vite, Tailwind CSS, Framer Motion, Three.js, Zustand, Node.js, Express.js, MongoDB, Stripe, Razorpay",
    description:
      "Futuristic cyberpunk-style 3D e-commerce platform featuring immersive animated UI, 3D product grids, secure JWT auth, persistent cart state, search/filtering, Stripe/Razorpay checkouts, and a robust admin dashboard.",
    image: "/images/nexus-preview.png",
    link: "https://github.com/Aryan-satpute-91/NEXUS-STORE.git",
    period: "Apr 2026 – May 2026",
  },
  {
    number: "04",
    name: "Bio-Sentry",
    category: "Research Project · Edge-AI · IoT",
    tools: "Python, PyTorch, CoT-YOLOv8, Raspberry Pi 4B, LoRa SX1278, B.A.T.M.A.N. Mesh, OpenCV, SQLite, Flask",
    description:
      "Autonomous multimodal Edge-AI surveillance system for forest conservation and anti-poaching. Uses acoustic FFT triggering, TDOA-based spatial localization, and enhanced CoT-YOLOv8 computer vision over a self-organizing LoRa mesh network. Achieved 96.2% mAP with 5.2s end-to-end alert latency.",
    image: "/images/placeholder.webp",
    period: "2025 – 2026 (Ongoing)",
    badge: "Final Year Project",
  },
];

const Work = () => {
  useGSAP(() => {
    function getTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box.length) return 0;
      const rectLeft = document.querySelector(".work-container")!.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding = parseInt(window.getComputedStyle(box[0]).padding) / 2;
      return rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getTranslateX()}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: () => -getTranslateX(),
      ease: "none",
    });
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                {"badge" in project && (
                  <div className="work-badge">{project.badge}</div>
                )}
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                <p className="work-desc">{project.description}</p>
              </div>
              <WorkImage image={"image" in project ? project.image : undefined} images={"images" in project ? project.images : undefined} alt={project.name} link={"link" in project ? (project as any).link : undefined} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
