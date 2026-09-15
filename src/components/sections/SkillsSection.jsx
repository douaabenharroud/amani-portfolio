"use client";

import { useState } from "react";
import {
  Aperture,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  Gauge,
  Globe,
  LayoutDashboard,
  Layers3,
  LineChart,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  Wifi,
  Wrench,
  ChevronDown,
} from "lucide-react";

const skillGroups = [
  {
    title: "AI & Data",
    accent: "#AF6384",
    mainIcon: BrainCircuit,
    items: ["Machine Learning", "Data Science", "Computer Vision", "NLP", "LLM", "Deep Learning"],
  },
  {
    title: "Engineering",
    accent: "#6D88C1",
    mainIcon: Code2,
    items: ["Python", "FastAPI", "Django", "Flask", "React", "Next.js"],
  },
  {
    title: "Infrastructure",
    accent: "#9A7FB0",
    mainIcon: Database,
    items: ["SQL", "MySQL", "MongoDB", "Firebase", "IoT", "ESP32"],
  },
  {
    title: "Product & UX",
    accent: "#7E8F99",
    mainIcon: Palette,
    items: ["Design", "Product Thinking", "UX Strategy", "Prototyping", "AI Products", "Automation"],
  },
  {
    title: "ML Tools",
    accent: "#5B6F7A",
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
    <section
      id="skills"
      className="relative w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "var(--color-background)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--color-secondary)",
              marginBottom: "0.9rem",
            }}
          >
            Curated expertise
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "var(--color-text)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Skills & Capabilities
          </h2>
          <p
            style={{
              margin: "0.9rem auto 0",
              maxWidth: "700px",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
            }}
          >
            Building intelligent products, data-driven systems, and polished digital experiences across AI, software engineering, and product design.
          </p>
        </div>

        {/* Desktop / tablet grid */}
        <div
          className="skills-gallery skills-desktop"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "1rem",
          }}
        >
          {skillGroups.map((group, groupIndex) => {
            const MainIcon = group.mainIcon;

            return (
              <div
                key={group.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "320px",
                  background: groupIndex % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    padding: "1.25rem 0.75rem 0.9rem",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <MainIcon size={32} />
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: group.accent,
                      fontWeight: 700,
                    }}
                  >
                    {group.title}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.7rem",
                    padding: "1rem",
                    flex: 1,
                  }}
                >
                  {group.items.map((skill) => (
                    <div
                      key={skill}
                      style={{
                        padding: "0.65rem 0.6rem",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textAlign: "center",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile accordion */}
        <div className="skills-mobile">
          {skillGroups.map((group, index) => {
            const MainIcon = group.mainIcon;
            const isOpen = openIndex === index;

            return (
              <div
                key={group.title}
                style={{
                  background: index % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  marginBottom: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`skills-panel-${index}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 1rem",
                    background: `linear-gradient(180deg, ${group.accent}1A 0%, transparent 100%)`,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-primary)",
                      flexShrink: 0,
                    }}
                  >
                    <MainIcon size={20} />
                  </div>

                  <span
                    style={{
                      flex: 1,
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-text)",
                      fontWeight: 700,
                    }}
                  >
                    {group.title}
                  </span>

                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--color-text)",
                      transition: "transform 0.25s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>

                <div
                  id={`skills-panel-${index}`}
                  style={{
                    maxHeight: isOpen ? "600px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.55rem",
                      padding: "0 1rem 1rem",
                    }}
                  >
                    {group.items.map((skill) => (
                      <div
                        key={skill}
                        style={{
                          padding: "0.55rem 0.5rem",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text)",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textAlign: "center",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .skills-mobile {
          display: none;
        }

        @media (max-width: 1200px) {
          .skills-gallery {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .skills-gallery {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .skills-desktop {
            display: none !important;
          }

          .skills-mobile {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}