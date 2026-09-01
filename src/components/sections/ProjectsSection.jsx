"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function ProjectsSection() {
  const [isDark, setIsDark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const pinRef = useRef(null);
  const autoPlayRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);

  const projects = [
    {
      id: 1,
      title: "AI Art Gallery",
      category: "Generative AI",
      description: "An immersive gallery experience powered by AI that creates unique artworks in real-time based on visitor interactions and emotions.",
      image: "/projects/ai-gallery.jpg",
      tags: ["React", "TensorFlow", "WebGL", "AI"],
      year: "2024",
    },
    {
      id: 2,
      title: "Smart Home Dashboard",
      category: "IoT & Design",
      description: "A minimalist dashboard that connects and controls smart home devices with an intuitive interface, featuring real-time data visualization and automation rules.",
      image: "/projects/smart-home.jpg",
      tags: ["Next.js", "MQTT", "D3.js", "Tailwind"],
      year: "2023",
    },
    {
      id: 3,
      title: "EcoTracker",
      category: "Sustainability Tech",
      description: "A mobile-first platform that helps individuals and businesses track their carbon footprint and discover personalized sustainability recommendations.",
      image: "/projects/eco-tracker.jpg",
      tags: ["React Native", "Firebase", "ML", "Mapbox"],
      year: "2024",
    },
    {
      id: 4,
      title: "Neural Music Studio",
      category: "Audio AI",
      description: "An AI-powered music production tool that generates melodies, harmonies, and full compositions based on user input and emotional context.",
      image: "/projects/music-studio.jpg",
      tags: ["Python", "PyTorch", "Web Audio", "React"],
      year: "2023",
    },
    {
      id: 5,
      title: "HealthSync",
      category: "Health Tech",
      description: "A comprehensive health monitoring platform that aggregates data from wearables, provides AI-powered insights, and connects users with healthcare professionals.",
      image: "/projects/health-sync.jpg",
      tags: ["Node.js", "GraphQL", "React Native", "AI"],
      year: "2024",
    },
    {
      id: 6,
      title: "Digital Garden",
      category: "Creative Coding",
      description: "An interactive digital garden that grows and evolves based on user engagement, combining generative art with gamification elements.",
      image: "/projects/digital-garden.jpg",
      tags: ["p5.js", "WebGL", "Generative Art", "GSAP"],
      year: "2023",
    },
  ];

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // FIX #3/#4: mobile arch now starts larger AND reaches its max scale
  // at 85% of scroll progress instead of 100% — that leaves a buffer so
  // the arch is fully settled at max size well before the user reaches
  // the physical end of the page, even if there's still a little
  // measurement slack. Max scale also raised (1.7 -> 3) since the
  // mobile arch's box (95vw x 40vh) needs more scale than the desktop
  // one to read as "fully expanded" relative to a narrow viewport.
  const archScale = useTransform(
    scrollYProgress,
    isMobile ? [0, 0.25, 0.55, 0.85] : [0, 0.33, 0.66, 1],
    isMobile ? [0.9, 1.4, 1.9, 3] : [0.8, 1.4, 2.0, 2.6]
  );

  const contentOpacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.5, 0.8, 1], 
    [0, 0.3, 0.6, 0.9, 1]
  );

  const contentCounterScale = useTransform(archScale, (v) => 1 / v);

  const contentPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.05 ? "auto" : "none"
  );

  const galleryY = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [20, 10, 0] : [40, 20, 0]);
  const galleryScale = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [0.96, 0.98, 1] : [0.92, 0.96, 1]);
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.5, 0.8, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [10, 5, 0] : [20, 10, 0]);

  useEffect(() => {
    // Autoplay also pauses while dragging (mobile) or hovering a card
    // (desktop) — otherwise the carousel could advance out from under
    // someone mid-swipe or mid-read of the hover info.
    if (isModalOpen || isDragging || hoveredProjectId !== null) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isModalOpen, isDragging, hoveredProjectId]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Optimized swipe handling: the old version only checked position on
  // touchend, so the card never moved until you lifted your finger, then
  // snapped abruptly — it felt unresponsive. This version tracks the
  // finger live (dragX) so the card follows the swipe in real time, tells
  // vertical scrolling apart from a horizontal swipe so it doesn't fight
  // the page's own pinned scroll, and suppresses the trailing tap so a
  // swipe never accidentally opens the project modal.
  const SWIPE_THRESHOLD = 60;

  const handleTouchStart = (e) => {
    if (!isMobile || isTransitioning) return;
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    // A mostly-vertical gesture is the page/pin scroll, not a card swipe —
    // bail out immediately so the user keeps scrolling normally instead
    // of the carousel eating the gesture.
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      setIsDragging(false);
      setDragX(0);
      return;
    }

    dragDistanceRef.current = Math.abs(deltaX);
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (dragX > SWIPE_THRESHOLD) {
      handlePrev();
    } else if (dragX < -SWIPE_THRESHOLD) {
      handleNext();
    }
    setIsDragging(false);
    setDragX(0);
  };

  const handleCardClick = (project) => {
    // A swipe that moved more than a few px shouldn't also register as a
    // tap that opens the modal.
    if (isMobile && dragDistanceRef.current > 10) {
      dragDistanceRef.current = 0;
      return;
    }
    handleProjectClick(project);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const getVisibleProjects = () => {
    if (isMobile) {
      // On mobile, show only current project
      return [{ ...projects[currentIndex], position: 0 }];
    } else if (isTablet) {
      // FIX #2: the old loop stepped `i++` over a range of -0.5..0.5,
      // which skips 0 entirely, so the "center" card never actually
      // got position === 0 and never rendered as centered.
      // Iterating over explicit positions fixes that.
      const visible = [];
      [0, 1].forEach((i) => {
        const index = (currentIndex + i + projects.length) % projects.length;
        visible.push({ ...projects[index], position: i });
      });
      return visible;
    } else {
      // Desktop: show 3 projects
      const visible = [];
      for (let i = -1; i <= 1; i++) {
        const index = (currentIndex + i + projects.length) % projects.length;
        visible.push({ ...projects[index], position: i });
      }
      return visible;
    }
  };

  const visibleProjects = getVisibleProjects();

  const colors = {
    background: isDark ? '#2a1f28' : '#976D90',
    surface: isDark ? '#352a33' : '#a87da3',
    surfaceAlt: isDark ? '#403540' : '#b88db3',
    textPrimary: isDark ? '#FFFFFF' : '#FAF7F6',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(250,247,246,0.7)',
    accent: '#AF6384',
    accentLight: isDark ? 'rgba(175, 99, 132, 0.3)' : 'rgba(175, 99, 132, 0.2)',
    highlight: '#EED4D1',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
  };

  return (
    <div
      ref={pinRef}
      style={{
        // FIX #4: mobile browsers change the real visible viewport height
        // as the address bar shows/hides during scroll, but a fixed 150vh
        // is measured once against the *tallest* viewport state. That
        // mismatch means the user hits the physical bottom of the page
        // before scrollYProgress ever reaches 1, so the arch stops
        // mid-grow. Using dvh keeps this in sync with the real viewport,
        // and the taller mobile value (220vh) adds scroll runway so the
        // animation has room to fully complete before the page ends.
        height: isMobile ? '240dvh' : '200dvh',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <div
          id="projects"
          style={{
            width: '100vw',
            height: '100dvh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 1,
            pointerEvents: 'none',
          }}>
            <motion.div
              style={{
                scale: archScale,
                transformOrigin: 'center bottom',
                width: isMobile ? '95vw' : '80vw',
                height: isMobile ? '40vh' : '50vh',
                background: `linear-gradient(180deg, ${colors.surfaceAlt} 0%, ${colors.surface} 40%, ${colors.background} 100%)`,
                borderRadius: isMobile ? '500px 500px 0 0' : '1000px 1000px 0 0',
                boxShadow: `inset 0 -20px 60px rgba(0,0,0,0.3)`,
                willChange: 'transform',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: isMobile ? '500px 500px 0 0' : '1000px 1000px 0 0',
                  background: `radial-gradient(ellipse at 50% 20%, ${colors.accentLight} 0%, transparent 70%)`,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isMobile ? '30%' : '50%',
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
                  opacity: 0.4,
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: isMobile ? '20px' : '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isMobile ? '20%' : '33%',
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${colors.highlight}22, transparent)`,
                  opacity: 0.3,
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: isMobile ? '40px' : '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isMobile ? '15%' : '25%',
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${colors.highlight}11, transparent)`,
                  opacity: 0.2,
                  zIndex: 2,
                }}
              />

              <motion.div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  width: '100vw',
                  height: '100dvh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: isMobile ? '16px' : '32px',
                  paddingRight: isMobile ? '16px' : '32px',
                  paddingTop: isMobile ? 'calc(24px + 60px)' : 'calc(48px + 120px)',
                  paddingBottom: '0px',
                  opacity: contentOpacity,
                  scale: contentCounterScale,
                  pointerEvents: contentPointerEvents,
                  willChange: 'opacity, transform',
                }}
              >
                <motion.div 
                  style={{
                    textAlign: 'center',
                    marginBottom: isMobile ? '20px' : '24px',
                    opacity: headerOpacity,
                    y: headerY,
                    willChange: 'opacity, transform',
                    paddingLeft: isMobile ? '8px' : '0',
                    paddingRight: isMobile ? '8px' : '0',
                    marginTop: isMobile ? '12px' : '50px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-body)',
                      fontSize: isMobile ? '10px' : '14px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                      color: colors.highlight,
                    }}
                  >
                    Exhibition
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: isMobile ? 'clamp(1.25rem, 5.5vw, 2rem)' : 'clamp(2rem, 5vw, 4rem)',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: colors.textPrimary,
                      marginBottom: isMobile ? '4px' : '8px',
                    }}
                  >
                    Featured Works
                  </h2>
                  {!isMobile && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: isMobile ? 'clamp(0.75rem, 2vw, 1rem)' : 'clamp(1rem, 1.5vw, 1.25rem)',
                        maxWidth: isMobile ? '280px' : '640px',
                        margin: '8px auto 0',
                        color: colors.textSecondary,
                      }}
                    >
                      A curated selection of projects exploring the intersection of design, technology, and art
                    </p>
                  )}
                </motion.div>

                {/* Gallery with Frame */}
                <motion.div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: isMobile ? '100%' : isTablet ? '1200px' : '1440px',
                    aspectRatio: isMobile ? '4/3' : '16/9',
                    maxHeight: isMobile ? '40vh' : isTablet ? '55vh' : '63vh',
                    margin: '8px auto',
                    y: galleryY,
                    scale: galleryScale,
                    willChange: 'transform',
                  }}
                >
                  {!isMobile && (
                    <>
                      <button
                        onClick={handlePrev}
                        style={{
                          position: 'absolute',
                          left: isMobile ? '-8px' : isTablet ? '-10px' : '-15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 20,
                          padding: isMobile ? '8px' : isTablet ? '10px' : '14px',
                          borderRadius: '9999px',
                          background: colors.cardBg,
                          color: colors.textPrimary,
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${colors.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                      >
                        <ChevronLeft size={isMobile ? 20 : isTablet ? 24 : 32} />
                      </button>

                      <button
                        onClick={handleNext}
                        style={{
                          position: 'absolute',
                          right: isMobile ? '-8px' : isTablet ? '-10px' : '-15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 20,
                          padding: isMobile ? '8px' : isTablet ? '10px' : '14px',
                          borderRadius: '9999px',
                          background: colors.cardBg,
                          color: colors.textPrimary,
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${colors.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                      >
                        <ChevronRight size={isMobile ? 20 : isTablet ? 24 : 32} />
                      </button>
                    </>
                  )}

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '0 8px' : '0 60px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      gap: isMobile ? '8px' : isTablet ? '12px' : '18px',
                    }}>
                      {visibleProjects.map((project, idx) => {
                        const isCenter = project.position === 0;

                        let cardWidth, cardMaxWidth, cardScale, cardOpacity;
                        
                        if (isMobile) {
                          cardWidth = '100%';
                          cardMaxWidth = '100%';
                          cardScale = 1;
                          cardOpacity = 1;
                        } else if (isTablet) {
                          if (isCenter) {
                            cardWidth = '80%';
                            cardMaxWidth = '80%';
                            cardScale = 1;
                            cardOpacity = 1;
                          } else {
                            cardWidth = '40%';
                            cardMaxWidth = '40%';
                            cardScale = 0.7;
                            cardOpacity = 0.4;
                          }
                        } else {
                          if (isCenter) {
                            cardWidth = '63%';
                            cardMaxWidth = '630px';
                            cardScale = 1;
                            cardOpacity = 1;
                          } else {
                            cardWidth = '25.2%';
                            cardMaxWidth = '315px';
                            cardScale = 0.65;
                            cardOpacity = 0.4;
                          }
                        }

                        return (
                          <div
                            key={`${project.id}-${idx}`}
                            style={{
                              width: cardWidth,
                              maxWidth: cardMaxWidth,
                              opacity: cardOpacity,
                              zIndex: isCenter ? 10 : 5,
                              transform: isMobile
                                ? `translateX(${dragX}px) scale(${cardScale})`
                                : `scale(${cardScale})`,
                              cursor: 'pointer',
                              flexShrink: 0,
                              // No transition while actively dragging so the
                              // card tracks the finger 1:1 with zero lag;
                              // snaps back with easing once released.
                              transition: isMobile
                                ? (isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)')
                                : 'all 0.5s ease-in-out',
                              // Lets the browser handle vertical scrolling
                              // (the page's pinned scroll) natively while
                              // our JS owns horizontal swipes only.
                              touchAction: isMobile ? 'pan-y' : undefined,
                              position: 'relative',
                            }}
                            onClick={() => handleCardClick(project)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                          >
                            <div
                              style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '16/12',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onMouseEnter={(e) => {
                                if (isCenter && !isMobile) {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }
                                if (!isMobile) setHoveredProjectId(project.id);
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                if (!isMobile) setHoveredProjectId(null);
                              }}
                            >
                              <Image
                                src="/exhibition-frame.png"
                                alt="Exhibition frame"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{
                                  objectFit: 'contain',
                                  zIndex: 2,
                                  pointerEvents: 'none',
                                  width: '100%',
                                  height: '100%',
                                }}
                                priority={isCenter}
                              />
                              
                              <div
                                style={{
                                  position: 'absolute',
                                  top: isMobile ? '6%' : '10%',
                                  left: isMobile ? '6%' : '10%',
                                  width: isMobile ? '88%' : '80%',
                                  height: isMobile ? '88%' : '80%',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                                  borderRadius: isMobile ? '8px' : '12px',
                                }}
                              >
                                <Image
                                  src="/landingLight.png"
                                  alt={project.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  style={{
                                    objectFit: 'cover',
                                  }}
                                />

                                {/* Overlay with project info — nested inside
                                    the art container (not the outer frame
                                    div) so it's clipped by that container's
                                    own bounds and border-radius and stays
                                    confined to the photo, never spilling
                                    onto the ornate frame border. */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    // FIX: on mobile, the frame graphic's
                                    // border visually overlaps the bottom
                                    // edge of this art container. Since the
                                    // caption sits below the frame in
                                    // z-index (1 vs 2) so it doesn't paint
                                    // over the ornate border, that same
                                    // overlap was hiding the caption text
                                    // when it was flush against bottom: 0.
                                    // Lifting it up clears that overlap zone.
                                    bottom: isMobile ? '12%' : 0,
                                    top: isMobile ? 'auto' : 0,
                                    height: isMobile ? '30%' : '100%',
                                    opacity: isMobile ? 1 : (hoveredProjectId === project.id ? 1 : 0),
                                    display: 'flex',
                                    alignItems: isMobile ? 'flex-end' : 'center',
                                    justifyContent: isMobile ? 'flex-start' : 'center',
                                    background: isMobile
                                      ? `linear-gradient(to top, ${colors.accent}EE 0%, ${colors.accent}99 55%, transparent 100%)`
                                      : `linear-gradient(135deg, ${colors.accent}77, ${colors.accent}99)`,
                                    backdropFilter: isMobile ? 'none' : 'blur(4px)',
                                    transition: 'opacity 0.3s',
                                    // Kept below the frame graphic's z-index
                                    // (2) so the tint/caption sits under the
                                    // ornate border instead of painting over
                                    // it — it only ever covers the photo.
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                  }}
                                  className="project-overlay"
                                >
                                  <div style={{ 
                                    textAlign: isMobile ? 'left' : 'center', 
                                    padding: isMobile ? '10px 35px' : '20px', 
                                    pointerEvents: 'none',
                                    width: '100%',
                                  }}>
                                    <h3
                                      style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: isMobile ? 'clamp(0.7rem, 2.2vw, 0.9rem)' : 
                                                    isTablet ? 'clamp(1rem, 1.8vw, 1.5rem)' : 
                                                    'clamp(1.5rem, 2.5vw, 2rem)',
                                        fontWeight: 600,
                                        color: 'white',
                                        marginBottom: isMobile ? '1px' : '6px',
                                      }}
                                    >
                                      {project.title}
                                    </h3>
                                    <p
                                      style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: isMobile ? 'clamp(0.45rem, 1.3vw, 0.65rem)' : 
                                                    isTablet ? 'clamp(0.6rem, 1vw, 0.875rem)' : 
                                                    'clamp(1rem, 1.5vw, 1.25rem)',
                                        color: 'rgba(255,255,255,0.8)',
                                      }}
                                    >
                                      {project.category}
                                    </p>
                                    {!isMobile && (
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          marginTop: '12px',
                                          fontFamily: 'var(--font-body)',
                                          color: 'white',
                                          fontSize: isTablet ? 'clamp(0.6rem, 0.8vw, 0.875rem)' : 'clamp(0.875rem, 1.2vw, 1rem)',
                                          fontWeight: 500,
                                          padding: isTablet ? '6px 16px' : '8px 20px',
                                          borderRadius: '9999px',
                                          background: 'rgba(255,255,255,0.15)',
                                          border: '1px solid rgba(255,255,255,0.2)',
                                        }}
                                      >
                                        View Exhibition
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? '6px' : '10px',
                    marginTop: isMobile ? '12px' : '24px',
                    opacity: headerOpacity,
                    willChange: 'opacity',
                    paddingBottom: isMobile ? '8px' : '0',
                  }}
                >
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isTransitioning) {
                          setCurrentIndex(index);
                        }
                      }}
                      style={{
                        width: currentIndex === index ? (isMobile ? '24px' : '32px') : (isMobile ? '8px' : '10px'),
                        height: isMobile ? '8px' : '10px',
                        borderRadius: '9999px',
                        background: currentIndex === index ? colors.accent : colors.border,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        border: 'none',
                        padding: 0,
                      }}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedProject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '8px' : '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            animation: 'modalFadeIn 0.3s ease-out',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: isMobile ? '100%' : '896px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: isMobile ? '12px' : '16px',
              background: colors.surface,
              boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${colors.accent}44`,
              margin: isMobile ? '8px' : '0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: isMobile ? '12px' : '16px',
                right: isMobile ? '12px' : '16px',
                zIndex: 10,
                padding: isMobile ? '6px' : '8px',
                borderRadius: '9999px',
                background: colors.cardBg,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <X size={isMobile ? 16 : 20} />
            </button>

            <div style={{ padding: isMobile ? '16px' : '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                marginBottom: isMobile ? '12px' : '16px',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '8px' : '0',
              }}>
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: isMobile ? '2px 10px' : '4px 12px',
                      borderRadius: '9999px',
                      fontSize: isMobile ? '10px' : '12px',
                      fontWeight: 500,
                      marginBottom: isMobile ? '8px' : '12px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: isMobile ? 'clamp(1.2rem, 4vw, 2rem)' : 'clamp(1.5rem, 3vw, 3rem)',
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    {selectedProject.title}
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isMobile ? '12px' : '14px',
                    color: colors.textSecondary,
                  }}
                >
                  {selectedProject.year}
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: isMobile ? '8px' : '12px',
                  marginBottom: isMobile ? '16px' : '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/landingLight.png"
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: isMobile ? 'clamp(0.875rem, 2vw, 1rem)' : 'clamp(1rem, 1.2vw, 1.125rem)',
                  lineHeight: isMobile ? 1.6 : 1.7,
                  marginBottom: isMobile ? '16px' : '24px',
                  color: colors.textPrimary,
                  opacity: 0.85,
                }}
              >
                {selectedProject.description}
              </p>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: isMobile ? '6px' : '8px' 
              }}>
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: isMobile ? '2px 10px' : '4px 12px',
                      borderRadius: '9999px',
                      fontSize: isMobile ? '10px' : '12px',
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