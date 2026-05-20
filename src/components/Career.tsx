import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Internship */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Development Intern</h4>
                <h5>Navodita Infotech · Nagpur, Maharashtra</h5>
              </div>
              <h3>Apr – May 2026</h3>
            </div>
            <p>
              Built a Hotel Management System with booking, room management, and admin dashboard modules.
              Developed RESTful APIs (Node.js / Express.js) and a React.js frontend for 3 user roles,
              reducing check-in time by 30%.
            </p>
          </div>

          {/* NSS Coordinator */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>NSS Coordinator</h4>
                <h5>K.K. Wagh Institute of Engineering Education and Research</h5>
              </div>
              <h3>Aug 2024 – Jan 2027</h3>
            </div>
            <p>
              Led 10+ community service initiatives engaging 200+ student volunteers across
              5+ annual events, fostering leadership and social responsibility.
            </p>
          </div>

          {/* Education */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech – Computer Science &amp; Design Engineering</h4>
                <h5>K.K. Wagh Institute of Engineering · GPA: 7.9 / 10.0</h5>
              </div>
              <h3>2023 – 2027</h3>
            </div>
            <p>
              Final-year student specialising in full-stack web, Android, and AI/ML.
              Achievements at NextGenTechFest 2026 and India Innovates 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
