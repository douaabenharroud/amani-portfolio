"use client";

import { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Code2,
  Database,
  Palette,
  Layers3,
  ChevronDown,
} from "lucide-react";

// Official brand icons from react-icons (all verified to exist)
import {
  SiPython,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiReact,
  SiNextdotjs,
  SiMysql,
  SiMongodb,
  SiFirebase,
  SiPytorch,
  SiTensorflow,
  SiOpencv,
  SiEspressif,
  SiArduino,
  SiRaspberrypi,
} from "react-icons/si";

import {
  TbBrandOpenai,
  TbSql,
  TbApi,
  TbCpu,
  TbChartHistogram,
  TbChartDots,
  TbWaveSine,
  TbAdjustments,
  TbBulb,
  TbBinaryTree,
} from "react-icons/tb";

import {
  FaBrain,
  FaDatabase,
  FaPalette,
  FaRobot,
  FaProjectDiagram,
} from "react-icons/fa";

// Single unified accent color for all cards
const UNIFIED_ACCENT = "#AF6384";

// Map every skill string to an icon that actually exists
const SKILL_ICONS = {
  // AI & Data
  "Machine Learning": FaBrain,
  "Deep Learning": TbBinaryTree,
  "Computer Vision": SiOpencv,
  "NLP": TbBrandOpenai,
  "LLMs": FaRobot,
  "Data Science": FaDatabase,

  // Software Engineering
  "Python": SiPython,
  "FastAPI": SiFastapi,
  "Django": SiDjango,
  "Flask": SiFlask,
  "React": SiReact,
  "Next.js": SiNextdotjs,

  // Data & Systems
  "SQL": TbSql,
  "MySQL": SiMysql,
  "MongoDB": SiMongodb,
  "Firebase": SiFirebase,
  "REST APIs": TbApi,

  // Product & UX
  "Product Thinking": TbBulb,
  "UX Strategy": FaProjectDiagram,
  "Prototyping": TbAdjustments,
  "UI Design": FaPalette,
  "AI Product Design": TbBrandOpenai,

  // Tools & Frameworks
  "PyTorch": SiPytorch,
  "TensorFlow": SiTensorflow,
  "OpenCV": SiOpencv,
  "XGBoost": TbChartHistogram,
  "LightGBM": TbChartDots,
  "MediaPipe": TbWaveSine,

  // IoT & Embedded
  "ESP32": SiEspressif,
  "IoT": SiArduino,
  "Sensors": SiRaspberrypi,
  "Edge AI": TbCpu,
};

const skillGroups = [
  {
    title: "AI & Data",
    accent: UNIFIED_ACCENT,
    mainIcon: BrainCircuit,
    items: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "LLMs", "Data Science"],
  },
  {
    title: "Software Engineering",
    accent: UNIFIED_ACCENT,
    mainIcon: Code2,
    items: ["Python", "FastAPI", "Django", "Flask", "React", "Next.js"],
  },
  {
    title: "Data & Systems",
    accent: UNIFIED_ACCENT,
    mainIcon: Database,
    items: ["SQL", "MySQL", "MongoDB", "Firebase", "REST APIs"],
  },
  {
    title: "Product & UX",
    accent: UNIFIED_ACCENT,
    mainIcon: Palette,
    items: ["Product Thinking", "UX Strategy", "Prototyping", "UI Design", "AI Product Design"],
  },
  {
    title: "Tools & Frameworks",
    accent: UNIFIED_ACCENT,
    mainIcon: Layers3,
    items: ["PyTorch", "TensorFlow", "OpenCV", "XGBoost", "LightGBM", "MediaPipe"],
  },
  {
    title: "IoT & Embedded",
    accent: UNIFIED_ACCENT,
    mainIcon: Layers3,
    items: ["ESP32", "IoT", "Sensors", "Edge AI"],
  },
];

export default function SkillsSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`skills-gallery-section ${isVisible ? "is-visible" : ""}`}
    >
      <div className="skills-top-divider" aria-hidden="true">
        <span className="skills-top-divider-line" />
        <span className="skills-top-divider-diamond" />
        <span className="skills-top-divider-line" />
      </div>

      <div className="skills-wrap">
        <div className="skills-header">
          <div className="skills-ornament" aria-hidden="true">
            <span className="skills-ornament-line" />
            <span className="skills-ornament-diamond" />
            <span className="skills-ornament-line" />
          </div>
          <span className="skills-eyebrow">Exhibition Catalogue · Skills & Tools</span>
          <h2 className="skills-title">Skills & Tools</h2>
        </div>

        {/* Desktop / tablet gallery */}
        <div className="skills-grid skills-desktop">
          {skillGroups.map((group, groupIndex) => {
            const MainIcon = group.mainIcon;

            return (
              <div
                key={group.title}
                className="skills-card"
                style={{
                  "--accent": group.accent,
                  "--delay": `${groupIndex * 90}ms`,
                }}
              >
                <span className="skills-corner skills-corner--tl" aria-hidden="true" />
                <span className="skills-corner skills-corner--tr" aria-hidden="true" />
                <span className="skills-corner skills-corner--bl" aria-hidden="true" />
                <span className="skills-corner skills-corner--br" aria-hidden="true" />

                {/* Front face */}
                <div className="skills-card-front">
                  <div className="skills-medallion-glow">
                    <div className="skills-medallion">
                      <MainIcon size={22} strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="skills-card-title">{group.title}</span>
                  <div className="skills-card-rule">
                    <span className="skills-card-rule-dot" />
                  </div>
                  <span className="skills-card-folio">
                    Plate {String(groupIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Back face — centered bubble grid, no title */}
                <div className="skills-card-back">
                  <div className="skills-bubbles">
                    {group.items.map((skill) => {
                      const SkillIcon = SKILL_ICONS[skill];
                      return (
                        <div key={skill} className="skills-bubble">
                          <div className="skills-bubble-icon">
                            {SkillIcon && <SkillIcon aria-hidden="true" />}
                          </div>
                          <span className="skills-bubble-label">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile drawers */}
        <div className="skills-mobile">
          {skillGroups.map((group, index) => {
            const MainIcon = group.mainIcon;
            const isOpen = openIndex === index;

            return (
              <div
                key={group.title}
                className="skills-drawer"
                style={{
                  "--accent": group.accent,
                  "--delay": `${index * 70}ms`,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`skills-panel-${index}`}
                  className="skills-drawer-face"
                >
                  <div className="skills-medallion skills-medallion--sm">
                    <MainIcon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="skills-card-title skills-card-title--sm">
                    {group.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className="skills-chevron"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  id={`skills-panel-${index}`}
                  className="skills-drawer-panel"
                  style={{ maxHeight: isOpen ? "480px" : "0px" }}
                >
                  <div className="skills-bubbles skills-bubbles--mobile">
                    {group.items.map((skill) => {
                      const SkillIcon = SKILL_ICONS[skill];
                      return (
                        <div key={skill} className="skills-bubble">
                          <div className="skills-bubble-icon">
                            {SkillIcon && <SkillIcon aria-hidden="true" />}
                          </div>
                          <span className="skills-bubble-label">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .skills-gallery-section {
          position: relative;
          isolation: isolate;
          z-index: 2;
          width: 100%;
          overflow: hidden;
          padding: 7rem 1.5rem 8rem;
          background: var(--color-background);
        }

        .skills-gallery-section::before,
        .skills-gallery-section::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 120px;
          pointer-events: none;
          z-index: 0;
        }

        .skills-gallery-section::before {
          top: 0;
          background: linear-gradient(
            to bottom,
            var(--color-surface-alt) 0%,
            color-mix(in srgb, var(--color-surface-alt) 60%, transparent) 45%,
            transparent 100%
          );
        }

        .skills-gallery-section::after {
          bottom: 0;
          background: linear-gradient(
            to top,
            var(--color-surface-alt) 0%,
            color-mix(in srgb, var(--color-surface-alt) 60%, transparent) 45%,
            transparent 100%
          );
        }

        .skills-top-divider {
          position: absolute;
          top: 2.25rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.8s ease 0.15s;
        }

        .skills-gallery-section.is-visible .skills-top-divider {
          opacity: 0.75;
        }

        .skills-top-divider-line {
          display: inline-block;
          width: 90px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--color-accent) 55%, transparent),
            transparent
          );
        }

        .skills-top-divider-diamond {
          display: inline-block;
          width: 5px;
          height: 5px;
          transform: rotate(45deg);
          background: color-mix(in srgb, var(--color-accent) 80%, transparent);
          box-shadow: 0 0 6px color-mix(in srgb, var(--color-accent) 45%, transparent);
        }

        .skills-wrap {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
        }

        .skills-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 3.5rem;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .skills-gallery-section.is-visible .skills-header {
          opacity: 1;
          transform: translateY(0);
        }

        .skills-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 1.25rem;
        }

        .skills-ornament-line {
          display: inline-block;
          width: 56px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--color-accent) 70%, transparent),
            transparent
          );
        }

        .skills-ornament-diamond {
          display: inline-block;
          width: 7px;
          height: 7px;
          transform: rotate(45deg);
          background: var(--color-accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 55%, transparent);
          opacity: 0.9;
        }

        .skills-eyebrow {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-secondary);
          margin-bottom: 0.9rem;
        }

        .skills-title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: clamp(2rem, 5vw, 3.75rem);
          color: var(--color-text);
          margin: 0;
          line-height: 1.15;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .skills-title { white-space: normal; }
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.1rem;
        }

        .skills-card {
          position: relative;
          /* ↑ Taller to fit bigger bubbles */
          min-height: 290px;
          perspective: 1200px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(28px);
          filter: blur(4px);
          transition:
            opacity 0.7s ease,
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.7s ease;
        }

        .skills-gallery-section.is-visible .skills-card {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          transition-delay: var(--delay, 0ms);
        }

        .skills-card-front,
        .skills-card-back {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: var(--color-surface-alt);
          border: 2px solid color-mix(in srgb, var(--color-text) 35%, transparent);
          border-radius: 6px;
          padding: 1.2rem 1rem 1rem;
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 6px 18px -14px color-mix(in srgb, var(--color-text) 55%, transparent);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }

        .skills-card-front {
          transform: rotateY(0deg);
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .skills-card-back {
          transform: rotateY(180deg);
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .skills-card:hover .skills-card-front {
          transform: rotateY(-180deg);
        }

        .skills-card:hover .skills-card-back {
          transform: rotateY(0deg);
        }

        .skills-card:hover .skills-card-front,
        .skills-card:hover .skills-card-back {
          border-color: var(--accent);
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 22px 44px -20px color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .skills-card-front::after,
        .skills-card-back::after {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid color-mix(in srgb, var(--color-text) 22%, transparent);
          border-radius: 3px;
          pointer-events: none;
          transition: border-color 0.4s ease;
        }

        .skills-card:hover .skills-card-front::after,
        .skills-card:hover .skills-card-back::after {
          border-color: color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .skills-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.4s ease;
          z-index: 2;
        }
        .skills-corner::before,
        .skills-corner::after {
          content: "";
          position: absolute;
          background: color-mix(in srgb, var(--color-text) 65%, transparent);
          transition: background 0.4s ease;
        }
        .skills-corner::before { width: 100%; height: 1px; top: 0; }
        .skills-corner::after  { width: 1px; height: 100%; left: 0; }

        .skills-corner--tl { top: 4px; left: 4px; }
        .skills-corner--tr { top: 4px; right: 4px; transform: scaleX(-1); }
        .skills-corner--bl { bottom: 4px; left: 4px; transform: scaleY(-1); }
        .skills-corner--br { bottom: 4px; right: 4px; transform: scale(-1, -1); }

        .skills-card:hover .skills-corner { opacity: 1; }
        .skills-card:hover .skills-corner::before,
        .skills-card:hover .skills-corner::after {
          background: var(--accent);
        }

        .skills-medallion-glow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skills-medallion-glow::before {
          content: "";
          position: absolute;
          inset: -30%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--accent) 35%, transparent) 0%,
            transparent 70%
          );
          opacity: 0.6;
          transition: opacity 0.4s ease;
        }

        .skills-card:hover .skills-medallion-glow::before { opacity: 1; }

        .skills-medallion {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-background);
          border: 2px solid color-mix(in srgb, var(--accent) 65%, var(--color-border));
          color: var(--accent);
          z-index: 1;
          transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent);
        }

        .skills-card:hover .skills-medallion {
          border-color: var(--accent);
          transform: scale(1.05);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        .skills-medallion--sm {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
        }

        .skills-card-title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--color-text);
          text-align: center;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .skills-card-title--sm {
          font-size: 0.9rem;
          text-align: left;
          flex: 1;
          white-space: nowrap;
        }

        .skills-card-rule {
          position: relative;
          width: 48px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--color-text) 50%, transparent),
            transparent
          );
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.4s ease;
        }

        .skills-card:hover .skills-card-rule {
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--accent) 85%, transparent),
            transparent
          );
        }

        .skills-card-rule-dot {
          width: 5px;
          height: 5px;
          transform: rotate(45deg);
          background: color-mix(in srgb, var(--color-text) 70%, transparent);
          opacity: 0.9;
          transition: background 0.4s ease;
        }

        .skills-card:hover .skills-card-rule-dot {
          background: var(--accent);
        }

        .skills-card-folio {
          font-family: var(--font-body);
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          opacity: 0.75;
          margin-top: 2px;
        }

        /* ---------- Bubbles (BIGGER) ---------- */

        .skills-bubbles {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.85rem 0.7rem;
          width: 100%;
        }

        .skills-bubble {
          /* ↑ Wider slot for bigger bubbles */
          flex: 0 0 72px;
          width: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          text-align: center;
        }

        .skills-bubble-icon {
          position: relative;
          /* ↑ Bigger circle: 56px */
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          /* ↑ Bigger icon inside */
          font-size: 1.7rem;
          background: var(--color-background);
          border: 2px solid color-mix(in srgb, var(--accent) 65%, var(--color-border));
          color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent);
          transition:
            border-color 0.35s ease,
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .skills-bubble-icon::before {
          content: "";
          position: absolute;
          inset: -30%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--accent) 35%, transparent) 0%,
            transparent 70%
          );
          opacity: 0.5;
          z-index: -1;
          transition: opacity 0.35s ease;
        }

        .skills-card:hover .skills-bubble-icon::before {
          opacity: 1;
        }

        .skills-card:hover .skills-bubble-icon {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        .skills-bubble:hover .skills-bubble-icon {
          transform: translateY(-2px) scale(1.06);
          box-shadow:
            0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent),
            0 8px 16px -10px color-mix(in srgb, var(--accent) 75%, transparent);
        }

        .skills-bubble-label {
          font-family: var(--font-body);
          /* ↑ Bigger label */
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.2;
          color: var(--color-text-secondary);
          transition: color 0.35s ease;
          word-break: break-word;
        }

        .skills-bubble:hover .skills-bubble-label {
          color: var(--color-text);
        }

        /* ---------- Mobile drawers ---------- */

        .skills-mobile { display: none; }

        .skills-drawer {
          position: relative;
          background: var(--color-surface-alt);
          border: 2px solid color-mix(in srgb, var(--color-text) 35%, transparent);
          border-radius: 6px;
          overflow: hidden;
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 6px 18px -14px color-mix(in srgb, var(--color-text) 55%, transparent);
          margin-bottom: 0.75rem;
          transition:
            border-color 0.3s ease,
            opacity 0.6s ease,
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 0;
          transform: translateY(18px);
        }

        .skills-gallery-section.is-visible .skills-drawer {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--delay, 0ms);
        }

        .skills-drawer::after {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px solid color-mix(in srgb, var(--color-text) 22%, transparent);
          border-radius: 3px;
          pointer-events: none;
        }

        .skills-drawer-face {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .skills-chevron {
          color: var(--color-text-secondary);
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }

        .skills-drawer-panel {
          overflow: hidden;
          transition: max-height 0.35s ease;
        }

        .skills-bubbles--mobile {
          padding: 1.1rem 1rem 1.3rem;
          gap: 1rem 0.8rem;
        }

        .skills-bubbles--mobile .skills-bubble {
          flex: 0 0 76px;
          width: 76px;
        }

        /* ---------- Reduced motion ---------- */

        @media (prefers-reduced-motion: reduce) {
          .skills-header,
          .skills-top-divider,
          .skills-card,
          .skills-drawer {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .skills-card-front,
          .skills-card-back {
            transition: none !important;
          }
        }

        /* ---------- Responsive ---------- */

        @media (max-width: 1200px) {
          .skills-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 820px) {
          .skills-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .skills-desktop { display: none !important; }
          .skills-mobile { display: block; }
        }
      `}</style>
    </section>
  );
}