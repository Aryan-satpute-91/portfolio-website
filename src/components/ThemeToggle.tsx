import React from "react";
import { useTheme } from "../context/ThemeContext";
import { MdSunny, MdNightlight } from "react-icons/md";
import "./styles/ThemeToggle.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      data-cursor="disable"
    >
      <div className={`theme-icon-wrapper ${theme === "light" ? "light-active" : "dark-active"}`}>
        <span className="sun-icon">
          <MdSunny />
        </span>
        <span className="moon-icon">
          <MdNightlight />
        </span>
      </div>
      <div className="toggle-glow"></div>
    </button>
  );
};

export default ThemeToggle;
