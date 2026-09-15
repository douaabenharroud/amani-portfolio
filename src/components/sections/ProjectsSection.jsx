"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "AmanKid (Proposed Concept)",
    category: "AI • IoT • Child Safety",
    description:
      "An intelligent, real-time child safety monitoring system that combines IoT wearables and mobile technology. It uses a novel human activity recognition (HAR) pipeline to detect critical situations, monitor well-being, and provide immediate alerts to parents and guardians, ensuring a secure environment for children.",
    image: "/amankid.png",
    tags: ["Python", "FastAPI", "Flutter", "Firebase", "Machine Learning", "IoT", "ESP32", "MediaPipe", "Computer Vision", "Cloud"],
    year: "2026",
  },
  {
    id: 2,
    title: "BotaniAI",
    category: "Machine Learning • IoT • Smart Agriculture",
    description:
      "An AIoT (Artificial Intelligence of Things) system for smart indoor plant care. It uses an ESP32 to collect environmental data (temperature, humidity, soil moisture, light) from sensors, transmits it to the cloud (ThingSpeak), and analyzes it with a machine learning ensemble (XGBoost, LightGBM) to predict plant health and provide actionable care recommendations.",
    image: "/botaniai.png",
    tags: ["Python", "MicroPython", "TensorFlow", "ESP32", "ThingSpeak", "FastAPI", "Flutter", "XGBoost", "Machine Learning", "IoT"],
    year: "2025",
  },
  {
    id: 3,
    title: "Arabic Sign Language Recognition",
    category: "Computer Vision • Deep Learning",
    description:
      "A deep learning system for recognizing Arabic Sign Language (ArSL) gestures from unconstrained video sequences. This comparative study evaluates three paradigms: traditional feature-based methods (HOG + LBP + KNN), deep learning (CNN-LSTM), and a Skeleton-based Spatio-Temporal Graph Convolutional Network (ST-GCN). ST-GCN achieved the highest accuracy at 95.73%.",
    image: "/api/placeholder/400/300",
    tags: ["Python", "TensorFlow", "OpenCV", "Deep Learning", "ST-GCN", "CNN-LSTM", "MediaPipe", "Computer Vision"],
    year: "2025",
  },
  {
    id: 4,
    title: "Plant Disease & FCN Segmentation",
    category: "Computer Vision • Semantic Segmentation",
    description:
      "A comprehensive study comparing the effectiveness of various Fully Convolutional Network (FCN) architectures (FCN-8, FCN-16, FCN-32) for the semantic segmentation of plants and plant diseases. The research demonstrates FCN-8's superiority in capturing fine spatial details for precise segmentation, dramatically outperforming traditional methods like Otsu thresholding and watershed.",
    image: "/api/placeholder/400/300",
    tags: ["Python", "TensorFlow", "OpenCV", "FCN", "Segmentation", "Deep Learning", "CVPPP"],
    year: "2025",
  },
  {
    id: 5,
    title: "AHD DayCare Connect",
    category: "Full-Stack Web Application",
    description:
      "A modern 'Connected Daycare' web application designed to streamline administrative and pedagogical management. It features comprehensive child profile management, real-time parent communication, secure online payments (via Chargily Pay), and dedicated portals for staff (educators, psychologists, speech therapists) to track child development.",
    image: "/api/placeholder/400/300",
    tags: ["React", "Django", "MySQL", "Bootstrap", "JavaScript", "Python", "Full-Stack"],
    year: "2024",
  },
  {
    id: 6,
    title: "Arabic Sports Trends Analysis & Visualization",
    category: "NLP • Data Analytics • LLM",
    description:
      "An intelligent platform to analyze and visualize sports trends from Arabic textual data using NLP, deep learning, and LLMs. The system extracts trending topics, recognizes named entities (players, clubs, competitions), performs sentiment analysis, and predicts emerging trends using Prophet and LLMs, all presented through an interactive real-time dashboard.",
    image: "/api/placeholder/400/300",
    tags: ["Python", "Flask", "React", "NLP", "LLM", "AraBERT", "Prophet", "MongoDB", "Data Visualization"],
    year: "2025",
  },
];

function MuseumFrame({
  project,
  index,
  wallX,
  frameWidth,
  gap,
  paddingSide,
  viewportWidth,
  isMobile,
  isTablet,
  colors,
  hoveredProjectId,
  setHoveredProjectId,
  onClick,
}) {
  const frameCenter =
    paddingSide + index * (frameWidth + gap) + frameWidth / 2;
  const viewportCenter = viewportWidth / 2;

  const signedDistance = useTransform(
    wallX,
    (x) => frameCenter + x - viewportCenter
  );
  const distance = useTransform(signedDistance, (d) => Math.abs(d));

  const scale = useTransform(
    distance,
    [0, frameWidth * 0.75, frameWidth * 1.6],
    [1, 0.9, 0.8]
  );
  const opacity = useTransform(
    distance,
    [0, frameWidth * 0.75, frameWidth * 1.6],
    [1, 0.75, 0.4]
  );
  const blur = useTransform(
    distance,
    [0, frameWidth, frameWidth * 1.8],
    [0, 0, 1.2]
  );
  const filterMV = useTransform(blur, (b) => `blur(${b.toFixed(2)}px)`);
  const spotlight = useTransform(
    distance,
    [0, frameWidth * 0.6, frameWidth * 1.4],
    [1, 0.4, 0.15]
  );
  const rotateY = useTransform(
    signedDistance,
    [-frameWidth * 1.6, 0, frameWidth * 1.6],
    [7, 0, -7]
  );

  const isHovered = hoveredProjectId === project.id;

  return (
    <motion.div
      style={{
        width: frameWidth,
        flexShrink: 0,
        scale,
        opacity,
        filter: filterMV,
        rotateY,
        cursor: "pointer",
        position: "relative",
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      onMouseEnter={() => !isMobile && setHoveredProjectId(project.id)}
      onMouseLeave={() => !isMobile && setHoveredProjectId(null)}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-12%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${colors.accentLight} 0%, transparent 70%)`,
          opacity: spotlight,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/10.8",
          zIndex: 1,
        }}
      >
        <Image
          src="/exhibition-frame.png"
          alt="Exhibition frame"
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 40vw"
          style={{
            objectFit: "contain",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: isMobile ? "6%" : "10%",
            left: isMobile ? "6%" : "10%",
            width: isMobile ? "88%" : "80%",
            height: isMobile ? "88%" : "80%",
            overflow: "hidden",
            borderRadius: isMobile ? "8px" : "12px",
            background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 40vw"
            style={{ objectFit: "cover" }}
          />

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: isMobile ? "10%" : 0,
              top: isMobile ? "auto" : 0,
              height: isMobile ? "34%" : "100%",
              opacity: isMobile ? 1 : isHovered ? 1 : 0,
              display: "flex",
              alignItems: isMobile ? "flex-end" : "center",
              justifyContent: isMobile ? "flex-start" : "center",
              background: isMobile
                ? `linear-gradient(to top, ${colors.accent}EE 0%, ${colors.accent}99 55%, transparent 100%)`
                : `linear-gradient(135deg, ${colors.accent}77, ${colors.accent}99)`,
              backdropFilter: isMobile ? "none" : "blur(4px)",
              transition: "opacity 0.3s",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                textAlign: isMobile ? "left" : "center",
                padding: isMobile ? "10px 24px" : "20px",
                width: "100%",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: isMobile
                    ? "clamp(0.75rem, 3vw, 1rem)"
                    : isTablet
                    ? "clamp(1rem, 1.8vw, 1.5rem)"
                    : "clamp(1.25rem, 2vw, 1.75rem)",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: isMobile ? "1px" : "6px",
                }}
              >
                {project.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: isMobile
                    ? "clamp(0.5rem, 1.5vw, 0.7rem)"
                    : "clamp(0.75rem, 1vw, 0.95rem)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {project.category}
              </p>
              {!isMobile && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    fontFamily: "var(--font-body)",
                    color: "white",
                    fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
                    fontWeight: 500,
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  View Exhibition
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [isDark, setIsDark] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [gap, setGap] = useState(0);
  const pinRef = useRef(null);

  useEffect(() => {
    const updateMetrics = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      setViewportWidth(w);

      if (mobile) {
        setFrameWidth(w * 0.8);
        setGap(20);
      } else if (tablet) {
        setFrameWidth(w * 0.5);
        setGap(48);
      } else {
        setFrameWidth(Math.min(560, w * 0.36));
        setGap(110);
      }
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const archScale = useTransform(
    scrollYProgress,
    isMobile ? [0, 0.25, 0.35, 0.5] : [0, 0.2, 0.33, 0.5],
    isMobile ? [0.9, 1.4, 1.9, 3] : [0.8, 1.4, 2.0, 2.6]
  );

const contentOpacity = useTransform(
  scrollYProgress,
  [0, 0.25, 0.5, 0.85, 0.95, 1],
  [0, 0.5, 1, 1, 1, 1]
);

  const contentCounterScale = useTransform(archScale, (v) => 1 / v);

  const contentPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.05 ? "auto" : "none"
  );

  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.8, 1],
    [0, 0.5, 1, 1, 1]
  );
  const headerY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    isMobile ? [10, 5, 0] : [20, 10, 0]
  );

  const paddingSide =
    frameWidth > 0 ? Math.max(0, (viewportWidth - frameWidth) / 2) : 0;
  const wallInnerWidth =
    frameWidth > 0
      ? projects.length * frameWidth + (projects.length - 1) * gap
      : 0;
  const wallWidth = wallInnerWidth + paddingSide * 2;
  const maxTravel = Math.max(0, wallWidth - viewportWidth);

  const wallX = useTransform(
    scrollYProgress,
    [0.5, 1],
    [0, -maxTravel]
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const colors = {
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    surfaceAlt: "var(--color-surface-alt)",
    elevated: "var(--color-elevated)",
    textPrimary: "var(--color-text)",
    textSecondary: "var(--color-text-secondary)",
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)",
    atmosphere: "var(--color-atmosphere)",
    galleryLight: "var(--color-gallery-light)",
    accentLight: "var(--color-accent-soft)",
    highlight: "var(--color-secondary)",
    border: "var(--color-border)",
    cardBg: "var(--color-primary-soft)",
    muted: "var(--color-text-muted)",
    focus: "var(--color-focus)",
  };

  return (
    <div
      ref={pinRef}
      style={{
        height: isMobile ? "240dvh" : "200dvh",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{ position: "sticky", top: 0, height: "100dvh", overflow: "hidden" }}>
        <div
          id="projects"
          style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <motion.div
              style={{
                scale: archScale,
                transformOrigin: "center bottom",
                width: isMobile ? "95vw" : "80vw",
                height: isMobile ? "40vh" : "50vh",
                background: colors.surfaceAlt,
                borderRadius: isMobile ? "500px 500px 0 0" : "1000px 1000px 0 0",
                boxShadow: `inset 0 0 0 1px ${colors.border}33`,
                willChange: "transform",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? "30%" : "50%",
                  height: "2px",
                  background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
                  opacity: 0.4,
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "20px" : "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? "20%" : "33%",
                  height: "2px",
                  background: `linear-gradient(to right, transparent, ${colors.highlight}22, transparent)`,
                  opacity: 0.3,
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "40px" : "80px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isMobile ? "15%" : "25%",
                  height: "2px",
                  background: `linear-gradient(to right, transparent, ${colors.highlight}11, transparent)`,
                  opacity: 0.2,
                  zIndex: 2,
                }}
              />

              <motion.div
                style={{
                  position: "relative",
                  zIndex: 10,
                  width: "100vw",
                  height: "100dvh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: isMobile ? "calc(24px + 60px)" : "calc(48px + 120px)",
                  paddingBottom: "0px",
                  opacity: contentOpacity,
                  scale: contentCounterScale,
                  pointerEvents: contentPointerEvents,
                  willChange: "opacity, transform",
                }}
              >
                <motion.div
                  style={{
                    textAlign: "center",
                    marginBottom: isMobile ? "20px" : "24px",
                    opacity: headerOpacity,
                    y: headerY,
                    willChange: "opacity, transform",
                    paddingLeft: isMobile ? "8px" : "0",
                    paddingRight: isMobile ? "8px" : "0",
                    marginTop: isMobile ? "12px" : "50px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-body)",
                      fontSize: isMobile ? "10px" : "14px",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                      color: colors.highlight,
                    }}
                  >
                    Exhibition
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: isMobile ? "clamp(1.25rem, 5.5vw, 2rem)" : "clamp(2rem, 5vw, 4rem)",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: colors.textPrimary,
                      marginBottom: isMobile ? "4px" : "8px",
                    }}
                  >
                    Featured Works
                  </h2>
                  {!isMobile && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                        maxWidth: "640px",
                        margin: "8px auto 0",
                        color: colors.textSecondary,
                      }}
                    >
                      A curated selection of projects exploring the intersection of design, technology, and art
                    </p>
                  )}
                </motion.div>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxHeight: isMobile ? "44vh" : isTablet ? "55vh" : "63vh",
                    overflow: "hidden",
                    perspective: "1600px",
                  }}
                >
                  {frameWidth > 0 && (
                    <motion.div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: `${gap}px`,
                        paddingLeft: `${paddingSide}px`,
                        paddingRight: `${paddingSide}px`,
                        width: "max-content",
                        x: wallX,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {projects.map((project, index) => (
                        <MuseumFrame
                          key={project.id}
                          project={project}
                          index={index}
                          wallX={wallX}
                          frameWidth={frameWidth}
                          gap={gap}
                          paddingSide={paddingSide}
                          viewportWidth={viewportWidth}
                          isMobile={isMobile}
                          isTablet={isTablet}
                          colors={colors}
                          hoveredProjectId={hoveredProjectId}
                          setHoveredProjectId={setHoveredProjectId}
                          onClick={() => handleProjectClick(project)}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "8px" : "16px",
            background: "var(--color-primary-soft)",
            backdropFilter: "blur(12px)",
            animation: "modalFadeIn 0.3s ease-out",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              position: "relative",
              maxWidth: isMobile ? "100%" : "896px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: isMobile ? "12px" : "16px",
              background: colors.surface,
              boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${colors.accent}44`,
              margin: isMobile ? "8px" : "0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: isMobile ? "12px" : "16px",
                right: isMobile ? "12px" : "16px",
                zIndex: 10,
                padding: isMobile ? "6px" : "8px",
                borderRadius: "9999px",
                background: colors.cardBg,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <X size={isMobile ? 16 : 20} />
            </button>

            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: isMobile ? "12px" : "16px",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "8px" : "0",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: isMobile ? "2px 10px" : "4px 12px",
                      borderRadius: "9999px",
                      fontSize: isMobile ? "10px" : "12px",
                      fontWeight: 500,
                      marginBottom: isMobile ? "8px" : "12px",
                      background: `${colors.accent}33`,
                      color: colors.accent,
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: isMobile ? "clamp(1.2rem, 4vw, 2rem)" : "clamp(1.5rem, 3vw, 3rem)",
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    {selectedProject.title}
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: isMobile ? "12px" : "14px",
                    color: colors.textSecondary,
                  }}
                >
                  {selectedProject.year}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: isMobile ? "8px" : "12px",
                  marginBottom: isMobile ? "16px" : "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: isMobile ? "clamp(0.875rem, 2vw, 1rem)" : "clamp(1rem, 1.2vw, 1.125rem)",
                  lineHeight: isMobile ? 1.6 : 1.7,
                  marginBottom: isMobile ? "16px" : "24px",
                  color: colors.textPrimary,
                  opacity: 0.85,
                }}
              >
                {selectedProject.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "6px" : "8px" }}>
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: isMobile ? "2px 10px" : "4px 12px",
                      borderRadius: "9999px",
                      fontSize: isMobile ? "10px" : "12px",
                      fontWeight: 500,
                      background: `${colors.accent}20`,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}