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
  const pinRef = useRef(null);
  const autoPlayRef = useRef(null);

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

  const archScale = useTransform(
    scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    [0.8, 1.4, 2.0, 2.6]
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

  const galleryY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 20, 0]);
  const galleryScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 0.96, 1]);
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0.5, 0.8, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 10, 0]);

  useEffect(() => {
    if (isModalOpen) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isModalOpen]);

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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const getVisibleProjects = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + projects.length) % projects.length;
      visible.push({ ...projects[index], position: i });
    }
    return visible;
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
        height: '200vh',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div
          id="projects"
          style={{
            width: '100vw',
            height: '100vh',
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
                width: '80vw',
                height: '50vh',
                background: `linear-gradient(180deg, ${colors.surfaceAlt} 0%, ${colors.surface} 40%, ${colors.background} 100%)`,
                borderRadius: '1000px 1000px 0 0',
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
                  borderRadius: '1000px 1000px 0 0',
                  background: `radial-gradient(ellipse at 50% 20%, ${colors.accentLight} 0%, transparent 70%)`,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50%',
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
                  opacity: 0.4,
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '33%',
                  height: '2px',
                  background: `linear-gradient(to right, transparent, ${colors.highlight}22, transparent)`,
                  opacity: 0.3,
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '25%',
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
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: 'calc(48px + 120px)',
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
                    marginBottom: '24px',
                    opacity: headerOpacity,
                    y: headerY,
                    willChange: 'opacity, transform',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      color: colors.highlight,
                    }}
                  >
                    Exhibition
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: colors.textPrimary,
                      marginBottom: '8px',
                    }}
                  >
                    Featured Works
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                      maxWidth: '640px',
                      margin: '8px auto 0',
                      color: colors.textSecondary,
                    }}
                  >
                    A curated selection of projects exploring the intersection of design, technology, and art
                  </p>
                </motion.div>

                {/* Gallery with Frame - Stretched */}
                <motion.div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1600px',
                    aspectRatio: '16/9',
                    maxHeight: '70vh',
                    margin: '0 auto',
                    y: galleryY,
                    scale: galleryScale,
                    willChange: 'transform',
                  }}
                >
                  <button
                    onClick={handlePrev}
                    style={{
                      position: 'absolute',
                      left: '-15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 20,
                      padding: '14px',
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
                    <ChevronLeft size={32} />
                  </button>

                  <button
                    onClick={handleNext}
                    style={{
                      position: 'absolute',
                      right: '-15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 20,
                      padding: '14px',
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
                    <ChevronRight size={32} />
                  </button>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 60px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      gap: '20px',
                    }}>
                      {visibleProjects.map((project, idx) => {
                        const isCenter = project.position === 0;

                        return (
                          <div
                            key={`${project.id}-${idx}`}
                            style={{
                              width: isCenter ? '70%' : '28%',
                              maxWidth: isCenter ? '700px' : '350px',
                              opacity: isCenter ? 1 : 0.4,
                              zIndex: isCenter ? 10 : 5,
                              transform: isCenter ? 'scale(1)' : 'scale(0.65)',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'all 0.5s ease-in-out',
                              position: 'relative',
                            }}
                            onClick={() => handleProjectClick(project)}
                          >
                            {/* Stretched Frame */}
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
                                if (isCenter) {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              {/* Frame image - stretched */}
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
                              
                              {/* Placeholder image inside the stretched frame */}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '10%',
                                  left: '10%',
                                  width: '80%',
                                  height: '80%',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                                  borderRadius: '12px',
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
                              </div>

                              {/* Overlay with project info on hover */}
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  opacity: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${colors.accent}77, ${colors.accent}99)`,
                                  backdropFilter: 'blur(4px)',
                                  transition: 'opacity 0.3s',
                                  zIndex: 3,
                                  borderRadius: '12px',
                                  pointerEvents: 'none',
                                }}
                              >
                                <div style={{ textAlign: 'center', padding: '20px', pointerEvents: 'none' }}>
                                  <h3
                                    style={{
                                      fontFamily: 'var(--font-heading)',
                                      fontSize: isCenter ? 'clamp(1.5rem, 2.5vw, 2rem)' : 'clamp(1rem, 1.2vw, 1.25rem)',
                                      fontWeight: 600,
                                      color: 'white',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    {project.title}
                                  </h3>
                                  <p
                                    style={{
                                      fontFamily: 'var(--font-body)',
                                      fontSize: isCenter ? 'clamp(1rem, 1.5vw, 1.25rem)' : 'clamp(0.75rem, 0.9vw, 0.875rem)',
                                      color: 'rgba(255,255,255,0.8)',
                                    }}
                                  >
                                    {project.category}
                                  </p>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      marginTop: '12px',
                                      fontFamily: 'var(--font-body)',
                                      color: 'white',
                                      fontSize: isCenter ? 'clamp(0.875rem, 1.2vw, 1rem)' : 'clamp(0.75rem, 0.8vw, 0.875rem)',
                                      fontWeight: 500,
                                      padding: '8px 20px',
                                      borderRadius: '9999px',
                                      background: 'rgba(255,255,255,0.15)',
                                      border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                  >
                                    View Exhibition
                                  </span>
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
                    gap: '10px',
                    marginTop: '24px',
                    opacity: headerOpacity,
                    willChange: 'opacity',
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
                        width: currentIndex === index ? '32px' : '10px',
                        height: '10px',
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
            padding: '16px',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            animation: 'modalFadeIn 0.3s ease-out',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '896px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              background: colors.surface,
              boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${colors.accent}44`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                padding: '8px',
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
              <X size={20} />
            </button>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 500,
                      marginBottom: '12px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.5rem, 3vw, 3rem)',
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
                    fontSize: '14px',
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
                  borderRadius: '12px',
                  marginBottom: '24px',
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
                  fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                  color: colors.textPrimary,
                  opacity: 0.85,
                }}
              >
                {selectedProject.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
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