"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

function FloatingParticles({ colors, isMobile }) {
  const particles = Array.from({ length: isMobile ? 12 : 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isMobile ? 3 : 5) + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: colors.accent,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function OrbitRings({ colors, isMobile }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          style={{
            position: "absolute",
            width: isMobile ? `${40 + ring * 25}vw` : `${30 + ring * 20}vw`,
            height: isMobile ? `${40 + ring * 25}vw` : `${30 + ring * 20}vw`,
            borderRadius: "50%",
            border: `1px solid ${colors.accent}${ring === 1 ? "18" : ring === 2 ? "10" : "06"}`,
          }}
          animate={{
            rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            rotate: {
              duration: 60 + ring * 20,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 8 + ring * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
}

function GridLines({ colors }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.15,
      }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(i + 1) * 14}%`,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
          }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${(i + 1) * 14}%`,
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${colors.highlight}, transparent)`,
          }}
          animate={{ opacity: [0.05, 0.25, 0.05] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CornerOrnaments({ colors, isMobile }) {
  const size = isMobile ? 40 : 80;
  const stroke = isMobile ? 1.5 : 2;
  const corners = [
    { pos: { top: isMobile ? 8 : 24, left: isMobile ? 8 : 24 }, rotate: 0 },
    { pos: { top: isMobile ? 8 : 24, right: isMobile ? 8 : 24 }, rotate: 90 },
    { pos: { bottom: isMobile ? 8 : 24, right: isMobile ? 8 : 24 }, rotate: 180 },
    { pos: { bottom: isMobile ? 8 : 24, left: isMobile ? 8 : 24 }, rotate: 270 },
  ];

  return (
    <>
      {corners.map((c, i) => (
        <motion.svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 80 80"
          style={{
            position: "absolute",
            ...c.pos,
            transform: `rotate(${c.rotate}deg)`,
            pointerEvents: "none",
            zIndex: 4,
            opacity: 0.25,
          }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M 4 40 L 4 4 L 40 4"
            fill="none"
            stroke={colors.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" fill={colors.highlight} opacity="0.5" />
          <path
            d="M 20 4 L 20 12 M 4 20 L 12 20"
            stroke={colors.accent}
            strokeWidth={stroke * 0.75}
            strokeLinecap="round"
            opacity="0.5"
          />
        </motion.svg>
      ))}
    </>
  );
}

function ArchGlow({ colors, isMobile }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: isMobile ? "120vw" : "90vw",
        height: isMobile ? "50vh" : "60vh",
        background: `radial-gradient(ellipse at bottom center, ${colors.accent}22 0%, ${colors.highlight}11 30%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 2,
      }}
      animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

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
  isDark,
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

  // Local hover state for immediate visual feedback
  const [localHover, setLocalHover] = useState(false);

  useEffect(() => {
    setLocalHover(isHovered);
  }, [isHovered]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setHoveredProjectId(project.id);
      setLocalHover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredProjectId(null);
      setLocalHover(false);
    }
  };

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            boxShadow: `inset 0 0 0 1px ${colors.border}33, 0 4px 20px ${colors.accent}11`,
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 40vw"
            style={{ objectFit: "cover" }}
          />

          {/* Desktop-only hover overlay — just the button, no text */}
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: localHover ? 1 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${colors.accent}55, ${colors.accent}77)`,
                backdropFilter: "blur(4px)",
                transition: "opacity 0.3s",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-body)",
                  color: isDark ? "white" : "black",
                  fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
                  fontWeight: isDark ? 500 : 600,
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  background: isDark
                    ? "rgba(255,255,255,0.30)"
                    : "rgba(255,255,255,0.40)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.25)"
                    : "1px solid rgba(0,0,0,0.65)",
                  letterSpacing: "0.05em",
                }}
              >
                View Exhibition
              </span>
            </div>
          )}

          {!isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  width: 20,
                  height: 20,
                  borderTop: `2px solid ${colors.accent}66`,
                  borderLeft: `2px solid ${colors.accent}66`,
                  borderRadius: "4px 0 0 0",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  borderBottom: `2px solid ${colors.accent}66`,
                  borderRight: `2px solid ${colors.accent}66`,
                  borderRadius: "0 0 4px 0",
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ScrollIndicator({ colors, isMobile }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: isMobile ? "6px" : "10px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        zIndex: 20,
        pointerEvents: "none",
      }}
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        style={{
          width: "1px",
          height: isMobile ? "10px" : "14px",
          background: `linear-gradient(to bottom, ${colors.accent}, transparent)`,
        }}
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile-only: museum plaque stack that sits BELOW the caption,       */
/* inside the same content column — no layout restructuring.           */
/* ------------------------------------------------------------------ */
function MobileMuseumPlaque({ project, activeIndex, total, colors }) {
  return (
    <div
      style={{
        marginTop: "14px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Divider / floor line */}
      <div
        style={{
          width: "55%",
          height: "1px",
          background: `linear-gradient(to right, transparent, ${colors.accent}66, transparent)`,
          marginBottom: "2px",
        }}
      />

      {/* Plaque card */}
      <motion.div
        key={`plaque-${activeIndex}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "340px",
          padding: "12px 16px",
          borderRadius: "10px",
          background: `linear-gradient(180deg, ${colors.surface}, ${colors.surfaceAlt})`,
          border: `1px solid ${colors.accent}33`,
          boxShadow: `0 6px 20px ${colors.accent}15, inset 0 1px 0 ${colors.accent}11`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${colors.highlight}, transparent)`,
            opacity: 0.6,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: colors.highlight,
              fontWeight: 600,
            }}
          >
            Catalogue
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: colors.textSecondary,
              opacity: 0.7,
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <h4
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(0.9rem, 3.6vw, 1.05rem)",
            fontWeight: 600,
            color: colors.textPrimary,
            lineHeight: 1.25,
            marginBottom: "4px",
          }}
        >
          {project?.title}
        </h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            color: colors.textSecondary,
            opacity: 0.75,
          }}
        >
          <span
            style={{
              width: "14px",
              height: "1px",
              background: colors.accent,
              opacity: 0.6,
            }}
          />
          <span style={{ letterSpacing: "0.15em" }}>{project?.year}</span>
        </div>
      </motion.div>

      {/* Pedestal dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "2px",
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              width: i === activeIndex ? 18 : 5,
              height: 3,
              borderRadius: "9999px",
              background: i === activeIndex ? colors.accent : `${colors.border}`,
            }}
            animate={{ opacity: i === activeIndex ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Hint */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: colors.textSecondary,
          opacity: 0.45,
          margin: 0,
        }}
      >
        Tap artwork to explore
      </p>
    </div>
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
  const [activeIndex, setActiveIndex] = useState(0);
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

  const wallX = useTransform(scrollYProgress, [0.5, 1], [0, -maxTravel]);

  useEffect(() => {
    const unsubscribe = wallX.on("change", (x) => {
      if (frameWidth === 0) return;
      const centerOffset = -x + viewportWidth / 2;
      const idx = Math.round(
        (centerOffset - paddingSide - frameWidth / 2) / (frameWidth + gap)
      );
      const clamped = Math.max(0, Math.min(projects.length - 1, idx));
      setActiveIndex(clamped);
    });
    return () => unsubscribe();
  }, [wallX, frameWidth, gap, paddingSide, viewportWidth]);

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

  const topPadding = isMobile ? "300px" : "200px";

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
          <GridLines colors={colors} />
          <OrbitRings colors={colors} isMobile={isMobile} />
          <FloatingParticles colors={colors} isMobile={isMobile} />

          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(to right, ${colors.accent}, ${colors.highlight})`,
              transformOrigin: "left",
              scaleX: scrollYProgress,
              zIndex: 20,
              opacity: 0.6,
            }}
          />

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
              <ArchGlow colors={colors} isMobile={isMobile} />

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
                  justifyContent: "flex-start",
                  paddingTop: topPadding,
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
                    marginBottom: isMobile ? "12px" : "20px",
                    opacity: headerOpacity,
                    y: headerY,
                    willChange: "opacity, transform",
                    paddingLeft: isMobile ? "8px" : "0",
                    paddingRight: isMobile ? "8px" : "0",
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
                      marginBottom: "2px",
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
                      marginBottom: "0px",
                    }}
                  >
                    Featured Works
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: isMobile ? "4px" : "6px",
                      marginTop: isMobile ? "6px" : "10px",
                    }}
                  >
                    {projects.map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          width: activeIndex === i ? (isMobile ? 20 : 28) : (isMobile ? 5 : 6),
                          height: isMobile ? 3 : 4,
                          borderRadius: "9999px",
                          background: activeIndex === i ? colors.accent : `${colors.border}`,
                          transition: "all 0.3s ease",
                        }}
                        animate={{ opacity: activeIndex === i ? 1 : 0.4 }}
                      />
                    ))}
                  </div>
                </motion.div>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxHeight: isMobile ? "40vh" : isTablet ? "50vh" : "58vh",
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
                          isDark={isDark}
                          colors={colors}
                          hoveredProjectId={hoveredProjectId}
                          setHoveredProjectId={setHoveredProjectId}
                          onClick={() => handleProjectClick(project)}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Caption */}
                <motion.div
                  style={{
                    marginTop: isMobile ? "10px" : "16px",
                    textAlign: "center",
                    opacity: headerOpacity,
                    paddingLeft: isMobile ? "20px" : "0",
                    paddingRight: isMobile ? "20px" : "0",
                    maxWidth: isMobile ? "90vw" : "600px",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: isMobile ? "0.85rem" : "clamp(0.95rem, 1.4vw, 1.15rem)",
                          fontWeight: 600,
                          color: colors.textPrimary,
                          marginBottom: "2px",
                        }}
                      >
                        {projects[activeIndex]?.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: isMobile ? "9px" : "11px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: colors.textSecondary,
                          opacity: 0.7,
                        }}
                      >
                        {projects[activeIndex]?.category}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Mobile-only museum plaque fill — sits inside the same column */}
                {isMobile && (
                  <MobileMuseumPlaque
                    project={projects[activeIndex]}
                    activeIndex={activeIndex}
                    total={projects.length}
                    colors={colors}
                  />
                )}
              </motion.div>
            </motion.div>
          </div>

          <CornerOrnaments colors={colors} isMobile={isMobile} />
          <ScrollIndicator colors={colors} isMobile={isMobile} />

          {!isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg)",
                  transformOrigin: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: colors.textSecondary,
                  opacity: 0.4,
                  zIndex: 15,
                  whiteSpace: "nowrap",
                }}
              >
                Portfolio · 2024–2026
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "24px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(90deg)",
                  transformOrigin: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: colors.textSecondary,
                  opacity: 0.4,
                  zIndex: 15,
                  whiteSpace: "nowrap",
                }}
              >
                Gallery No. 06
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}