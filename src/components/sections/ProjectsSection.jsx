"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProjectsSection() {
  const [isDark, setIsDark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
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

  // Auto-play carousel
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

  // Get visible projects (3 at a time)
  const getVisibleProjects = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + projects.length) % projects.length;
      visible.push({ ...projects[index], position: i });
    }
    return visible;
  };

  const visibleProjects = getVisibleProjects();

  // Color palette for Projects section - using Tulipan Violet (#976D90) as primary
  // with Crushed Raspberry (#AF6384) as accent
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
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32"
      style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      {/* Subtle pattern overlay - museum wall texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative accent elements with Tulipan Violet tones */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(175, 99, 132, 0.08) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(238, 212, 209, 0.06) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(151, 109, 144, 0.05) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Section header with Tulipan Violet palette */}
      <div className="relative z-10 text-center mb-12 md:mb-16 lg:mb-20 px-4">
        <span 
          className="inline-block font-body text-sm font-medium tracking-widest uppercase mb-3"
          style={{ 
            color: colors.highlight,
            letterSpacing: '0.2em',
          }}
        >
          Exhibition
        </span>
        <h2 
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
          style={{ 
            color: colors.textPrimary,
            fontFamily: 'var(--font-heading)',
          }}
        >
          Featured Works
        </h2>
        <p 
          className="font-body text-base sm:text-lg md:text-xl mt-3 md:mt-4 max-w-2xl mx-auto"
          style={{ 
            color: colors.textSecondary,
          }}
        >
          A curated selection of projects exploring the intersection of design, technology, and art
        </p>
      </div>

      {/* 3D Gallery Room */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery container with perspective */}
        <div 
          className="relative w-full aspect-[16/9] max-h-[600px] mx-auto perspective-1000"
          style={{
            perspective: '1200px',
          }}
        >
          {/* Gallery room background - museum wall effect with Tulipan Violet */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              background: colors.surface,
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)',
            }}
          >
            {/* Gallery wall texture */}
            <div 
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Accent lighting line at top with Crushed Raspberry */}
            <div 
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
                opacity: 0.4,
              }}
            />

            {/* Floor shadow */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 100%)',
              }}
            />
            
            {/* Warm glow in center */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 40%, ${colors.accentLight} 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textPrimary,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${colors.border}`,
            }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textPrimary,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${colors.border}`,
            }}
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Exhibition wall frames - 3D perspective */}
          <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-12 lg:px-16">
            <div className="flex items-center justify-center w-full h-full gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {visibleProjects.map((project, idx) => {
                const isCenter = project.position === 0;
                const isLeft = project.position === -1;
                const isRight = project.position === 1;
                
                let transform = '';
                let zIndex = 5;
                let opacity = 0.6;
                
                if (isCenter) {
                  transform = 'translateZ(0px) scale(1)';
                  zIndex = 10;
                  opacity = 1;
                } else if (isLeft) {
                  transform = 'translateX(-40%) translateZ(-100px) scale(0.8)';
                  zIndex = 5;
                  opacity = 0.5;
                } else if (isRight) {
                  transform = 'translateX(40%) translateZ(-100px) scale(0.8)';
                  zIndex = 5;
                  opacity = 0.5;
                }
                
                return (
                  <div
                    key={`${project.id}-${idx}`}
                    className="relative transition-all duration-500 ease-in-out cursor-pointer flex-shrink-0"
                    style={{
                      transform: transform,
                      zIndex: zIndex,
                      opacity: opacity,
                      width: isCenter ? '55%' : '35%',
                      maxWidth: isCenter ? '400px' : '280px',
                      transformStyle: 'preserve-3d',
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Frame with accent border - Crushed Raspberry */}
                    <div 
                      className="relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                      style={{
                        boxShadow: isCenter 
                          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${colors.accent}44`
                          : '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                        background: colors.surfaceAlt,
                        transform: 'rotateY(2deg)',
                      }}
                    >
                      {/* Project image placeholder with Tulipan Violet gradient */}
                      <div 
                        className="w-full aspect-[4/3] flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                        }}
                      >
                        <div className="text-center p-4">
                          <div className="text-5xl sm:text-6xl md:text-7xl mb-3">
                            🖼️
                          </div>
                          <h3 
                            className="font-heading text-lg sm:text-xl md:text-2xl font-semibold"
                            style={{ 
                              color: colors.textPrimary,
                              fontFamily: 'var(--font-heading)',
                            }}
                          >
                            {project.title}
                          </h3>
                          <p 
                            className="font-body text-xs sm:text-sm mt-1"
                            style={{ 
                              color: colors.textSecondary,
                            }}
                          >
                            {project.category}
                          </p>
                        </div>
                      </div>
                      
                      {/* Frame border effect with Crushed Raspberry on hover */}
                      <div 
                        className="absolute inset-0 pointer-events-none transition-colors duration-300"
                        style={{
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                        }}
                      />
                      
                      {/* Hover overlay with Crushed Raspberry */}
                      <div 
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${colors.accent}77, ${colors.accent}99)`,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <span 
                          className="font-body text-white text-sm sm:text-base font-medium px-4 py-2 rounded-full"
                          style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.2)',
                          }}
                        >
                          View Exhibition
                        </span>
                      </div>
                    </div>
                    
                    {/* Gallery label below frame with Misty Rose accent */}
                    {isCenter && (
                      <div 
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
                      >
                        <p 
                          className="font-body text-xs sm:text-sm font-medium"
                          style={{ 
                            color: colors.textSecondary,
                          }}
                        >
                          <span style={{ color: colors.accent }}>✦</span> {project.category} • {project.year}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dot indicators with Crushed Raspberry accent */}
        <div className="flex justify-center gap-2 mt-8 md:mt-10">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setCurrentIndex(index);
                }
              }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                background: currentIndex === index 
                  ? colors.accent
                  : colors.border,
                cursor: 'pointer',
              }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Modal - Exhibition Detail with Tulipan Violet and Crushed Raspberry */}
      {isModalOpen && selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            animation: 'modalFadeIn 0.3s ease-out',
          }}
          onClick={handleCloseModal}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: colors.surface,
              boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${colors.accent}44`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with Crushed Raspberry accent */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: colors.cardBg,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 md:p-10">
              {/* Project header with Crushed Raspberry accent */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{
                      background: `${colors.accent}33`,
                      color: colors.accent,
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <h2 
                    className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold"
                    style={{ 
                      color: colors.textPrimary,
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {selectedProject.title}
                  </h2>
                </div>
                <span 
                  className="font-body text-sm"
                  style={{ 
                    color: colors.textSecondary,
                  }}
                >
                  {selectedProject.year}
                </span>
              </div>

              {/* Project image placeholder with Tulipan Violet gradient */}
              <div 
                className="w-full aspect-[16/9] rounded-xl mb-6 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.surfaceAlt}, ${colors.accent}22)`,
                }}
              >
                <div className="text-center">
                  <div className="text-7xl sm:text-8xl mb-4">🖼️</div>
                  <p 
                    className="font-body"
                    style={{ 
                      color: colors.textSecondary,
                    }}
                  >
                    Exhibition Preview
                  </p>
                </div>
              </div>

              {/* Project description */}
              <p 
                className="font-body text-base sm:text-lg leading-relaxed mb-6"
                style={{ 
                  color: colors.textPrimary,
                  opacity: 0.85,
                }}
              >
                {selectedProject.description}
              </p>

              {/* Tags with Crushed Raspberry accent */}
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
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

      {/* Add animations */}
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
        
        .perspective-1000 {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
}