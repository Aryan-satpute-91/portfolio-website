import { useEffect } from "react";

// ─── Canonical site URL ───────────────────────────────────────────────────────
const SITE_URL = "https://aryan-satpute-portfolio.vercel.app";

// Section → browser tab title mapping
const SECTION_TITLES: Record<string, string> = {
  landingDiv: "Aryan Satpute | Full Stack Developer & Software Engineer",
  about:
    "About Aryan Satpute | Full Stack & Android Developer",
  skills:
    "Skills & Services | Aryan Satpute — Full Stack Developer",
  work: "Featured Projects | Aryan Satpute — Portfolio",
  experience:
    "Experience & Education | Aryan Satpute",
  techstack:
    "Tech Stack | Aryan Satpute — React, Node.js, Kotlin, Python",
  contact: "Contact Aryan Satpute | Full Stack Developer",
};

const DEFAULT_TITLE =
  "Aryan Satpute | Full Stack Developer & Software Engineer Portfolio";

// ─── Component ───────────────────────────────────────────────────────────────
const SEO = () => {
  // Dynamic title based on visible section
  useEffect(() => {
    const sectionIds = Object.keys(SECTION_TITLES);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.title = SECTION_TITLES[id] ?? DEFAULT_TITLE;

            // Update canonical meta dynamically
            const canonical = document.querySelector(
              'link[rel="canonical"]'
            ) as HTMLLinkElement | null;
            if (canonical) {
              canonical.href =
                id && id !== "landingDiv"
                  ? `${SITE_URL}/#${id}`
                  : `${SITE_URL}/`;
            }
          }
        });
      },
      {
        // Fire when section enters the top 40% of the viewport
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default SEO;
