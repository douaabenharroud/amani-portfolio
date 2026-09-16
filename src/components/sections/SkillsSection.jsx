"use client";

import { useState } from "react";
import {
  BrainCircuit,
  Code2,
  Database,
  Palette,
  Layers3,
  ChevronDown,
} from "lucide-react";

// Single unified accent color for all cards
const UNIFIED_ACCENT = "#AF6384";

const skillGroups = [
  {
    title: "AI & Data",
    accent: UNIFIED_ACCENT,
    mainIcon: BrainCircuit,
    items: ["Machine Learning", "Data Science", "Computer Vision", "NLP", "LLM", "Deep Learning"],
  },
  {
    title: "Engineering",
    accent: UNIFIED_ACCENT,
    mainIcon: Code2,
    items: ["Python", "FastAPI", "Django", "Flask", "React", "Next.js"],
  },
  {
    title: "Infrastructure",
    accent: UNIFIED_ACCENT,
    mainIcon: Database,
    items: ["SQL", "MySQL", "MongoDB", "Firebase", "IoT", "ESP32"],
  },
  {
    title: "Product & UX",
    accent: UNIFIED_ACCENT,
    mainIcon: Palette,
    items: ["Design", "Product Thinking", "UX Strategy", "Prototyping", "AI Products", "Automation"],
  },
  {
    title: "ML Tools",
    accent: UNIFIED_ACCENT,
    mainIcon: Layers3,
    items: ["TensorFlow", "PyTorch", "OpenCV", "XGBoost", "LightGBM", "MediaPipe"],
  },
];

export default function SkillsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="skills" className="skills-gallery-section">
      {/* Top hairline divider with center diamond — echoes the header ornament */}
      <div className="skills-top-divider" aria-hidden="true">
        <span className="skills-top-divider-line" />
        <span className="skills-top-divider-diamond" />
        <span className="skills-top-divider-line" />
      </div>

      <div className="skills-wrap">
        <div className="skills-header">
          <div className="skills-ornament" aria-hidden="true">
           
          </div>
          <span className="skills-eyebrow">Exhibition Catalogue · Skill Set</span>
          <h2 className="skills-title">Capabilities on Display</h2>
        </div>

        {/* Desktop / tablet gallery */}
        <div className="skills-grid skills-desktop">
          {skillGroups.map((group, groupIndex) => {
            const MainIcon = group.mainIcon;

            return (
              <div
                key={group.title}
                className="skills-card"
                style={{ "--accent": group.accent }}
              >
                <span className="skills-corner skills-corner--tl" aria-hidden="true" />
                <span className="skills-corner skills-corner--tr" aria-hidden="true" />
                <span className="skills-corner skills-corner--bl" aria-hidden="true" />
                <span className="skills-corner skills-corner--br" aria-hidden="true" />

                <div className="skills-card-head">
                  <div className="skills-medallion-glow">
                    <div className="skills-medallion">
                      <MainIcon size={26} strokeWidth={1.5} />
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

                <div className="skills-tags">
                  {group.items.map((skill) => (
                    <span key={skill} className="skills-tag">
                      {skill}
                    </span>
                  ))}
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
                style={{ "--accent": group.accent }}
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
                  <div className="skills-tags skills-tags--mobile">
                    {group.items.map((skill) => (
                      <span key={skill} className="skills-tag">
                        {skill}
                      </span>
                    ))}
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

          /* Inverted: darker base tone now */
          background: var(--color-background);
        }

        /* Fades blend into the lighter surrounding surface-alt at the edges. */
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

        /* Quiet hairline + diamond sitting in the top fade. */
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

        /* ---------- Header ---------- */

        .skills-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 3.5rem;
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

        .skills-subtitle {
          font-family: var(--font-body);
          font-weight: 300;
          font-style: italic;
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin: 1rem 0 0;
        }

        /* ---------- Desktop gallery ---------- */

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 1.1rem;
        }

        .skills-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 320px;

          /* Inverted: cards now use surface-alt so they stand out against
             the darker section background. */
          background: var(--color-surface-alt);
          border: 2px solid color-mix(in srgb, var(--color-text) 35%, transparent);
          border-radius: 6px;

          padding: 1.85rem 1.15rem 1.5rem;
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 6px 18px -14px color-mix(in srgb, var(--color-text) 55%, transparent);
          transition:
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease;
        }

        .skills-card::after {
          content: "";
          position: absolute;
          inset: 6px;
          border: 1px solid color-mix(in srgb, var(--color-text) 22%, transparent);
          border-radius: 3px;
          pointer-events: none;
          transition: border-color 0.4s ease;
        }

        .skills-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent);
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 22px 44px -20px color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .skills-card:hover::after {
          border-color: color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .skills-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.4s ease;
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

        .skills-card-head {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.4rem;
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
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          /* Inverted: medallion interior now uses background (darker)
             so it pops inside the lighter surface-alt card. */
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
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .skills-card-title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--color-text);
          text-align: center;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .skills-card-title--sm {
          font-size: 0.95rem;
          text-align: left;
          flex: 1;
          white-space: nowrap;
        }

        .skills-card-rule {
          position: relative;
          width: 64px;
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
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          opacity: 0.75;
          margin-top: 2px;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          flex: 1;
          align-content: flex-start;
        }

        .skills-tag {
          padding: 0.35rem 0.8rem;
          border-radius: 3px;
          font-family: var(--font-body);
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--color-text-secondary);
          background: color-mix(in srgb, var(--color-text) 5%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-text) 30%, transparent);
          white-space: nowrap;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .skills-card:hover .skills-tag {
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          border-color: color-mix(in srgb, var(--accent) 60%, transparent);
        }

        /* ---------- Mobile drawers ---------- */

        .skills-mobile { display: none; }

        .skills-drawer {
          position: relative;
          /* Inverted: drawer uses surface-alt to match cards. */
          background: var(--color-surface-alt);
          border: 2px solid color-mix(in srgb, var(--color-text) 35%, transparent);
          border-radius: 6px;
          overflow: hidden;
          box-shadow:
            0 1px 0 color-mix(in srgb, var(--color-text) 8%, transparent) inset,
            0 6px 18px -14px color-mix(in srgb, var(--color-text) 55%, transparent);
          margin-bottom: 0.75rem;
          transition: border-color 0.3s ease;
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

        .skills-tags--mobile {
          justify-content: flex-start;
          padding: 0 1rem 1.1rem;
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