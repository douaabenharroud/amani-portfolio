"use client";

import { useState, useEffect, useRef } from "react";

export default function AboutSection() {
  const [isDark, setIsDark] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  ));
  const [particles, setParticles] = useState([]);
  const [isLightOn, setIsLightOn] = useState(false);
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particleTargets, setParticleTargets] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [particlesEntered, setParticlesEntered] = useState(false);
  const animationFrameRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const particlesGeneratedRef = useRef(false);

  const INITIAL_POSITIONS = [
    { top: 75, left: 83 },
    { top: 70, left: 86 },
    { top: 60, left: 88 },
    { top: 26, left: 84 },
    { top: 15, left: 85 },
    { top: 40, left: 82 },
    { top: 58, left: 95 },
    { top: 18, left: 87 },
    { top: 50, left: 83 },
    { top: 25, left: 90 },
    { top: 21, left: 80 },
    { top: 48, left: 87 },
  ];

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!particlesGeneratedRef.current) {
      particlesGeneratedRef.current = true;
      const generateParticles = () => {
        const newParticles = [];
        const targets = {};

        INITIAL_POSITIONS.forEach((pos, i) => {
          const size = 1.5 + Math.random() * 2.5;
          const side = Math.random() > 0.5 ? 'left' : 'right';
          const startLeft = side === 'left' ? -5 - Math.random() * 15 : 105 + Math.random() * 15;
          const startTop = 5 + Math.random() * 90;
          const delay = Math.random() * 5;
          const duration = 8 + Math.random() * 10;
          const opacity = 0.3 + Math.random() * 0.5;

          newParticles.push({
            id: i,
            size,
            top: startTop,
            left: startLeft,
            delay,
            duration,
            opacity,
            speed: 0.02 + Math.random() * 0.03,
            wanderRadius: 3 + Math.random() * 8,
            targetTop: pos.top + (Math.random() - 0.5) * 5,
            targetLeft: pos.left + (Math.random() - 0.5) * 5,
          });

          targets[i] = { top: startTop, left: startLeft };
        });

        setParticleTargets(targets);
        return newParticles;
      };

      setParticles(generateParticles());
    }

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isInView = entry.isIntersecting;

        if (!isInView) {
          setIsLightOn(false);
          setHasBeenHovered(false);
        }

        if (isInView) {
          setIsVisible(true);
          hasAnimatedRef.current = true;

          if (!particlesEntered && particles.length > 0) {
            setParticlesEntered(true);
            const newTargets = {};
            particles.forEach((particle) => {
              newTargets[particle.id] = {
                top: particle.targetTop || 5 + Math.random() * 90,
                left: particle.targetLeft || 5 + Math.random() * 90
              };
            });

            setTimeout(() => {
              setParticleTargets(newTargets);
            }, 500);
          }
        } else {
          setIsVisible(false);
          hasAnimatedRef.current = false;
          setParticlesEntered(false);

          if (particles.length > 0) {
            const resetTargets = {};
            particles.forEach((particle) => {
              const side = Math.random() > 0.5 ? 'left' : 'right';
              resetTargets[particle.id] = {
                top: 5 + Math.random() * 90,
                left: side === 'left' ? -5 - Math.random() * 15 : 105 + Math.random() * 15
              };
            });
            setParticleTargets(resetTargets);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    if (sectionRef.current) {
      scrollObserver.observe(sectionRef.current);
    }

    const nextSection = document.getElementById('next-section');
    let nextSectionObserver = null;

    if (nextSection) {
      nextSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasBeenHovered) {
            setIsLightOn(false);
            setHasBeenHovered(false);
          }
        });
      }, { threshold: 0.3 });

      nextSectionObserver.observe(nextSection);
    }

    return () => {
      scrollObserver.disconnect();
      if (nextSectionObserver) {
        nextSectionObserver.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasBeenHovered, particles, particlesEntered]);

  useEffect(() => {
    if (!isLightOn || particles.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let lastUpdate = Date.now();
    let frameCount = 0;

    const animateParticles = () => {
      const now = Date.now();
      const delta = (now - lastUpdate) / 1000;
      lastUpdate = now;
      frameCount++;

      if (frameCount % 30 === 0) {
        setParticleTargets(prevTargets => {
          const newTargets = { ...prevTargets };

          particles.forEach((particle) => {
            const currentTarget = newTargets[particle.id] || { top: particle.top, left: particle.left };

            const angle = Math.random() * Math.PI * 2;
            const distance = particle.wanderRadius * (0.3 + Math.random() * 0.7);

            let newTop = currentTarget.top + Math.sin(angle) * distance * 0.5;
            let newLeft = currentTarget.left + Math.cos(angle) * distance * 0.5;

            newTop = Math.max(5, Math.min(95, newTop));
            newLeft = Math.max(5, Math.min(95, newLeft));

            newTargets[particle.id] = {
              top: newTop,
              left: newLeft
            };
          });

          return newTargets;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };

    animationFrameRef.current = requestAnimationFrame(animateParticles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isLightOn, particles]);

  const handleLightToggle = () => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInView) return;
    }

    if (!hasBeenHovered) {
      setIsLightOn(true);
      setHasBeenHovered(true);

      const newTargets = {};
      particles.forEach((particle) => {
        const randomTop = 5 + Math.random() * 90;
        const randomLeft = 5 + Math.random() * 90;
        newTargets[particle.id] = {
          top: randomTop,
          left: randomLeft
        };
      });
      setParticleTargets(newTargets);
    }
  };

  const handleDownloadCV = () => {
    const cvUrl = '/CV_Douaa_Amani.pdf';
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'CV_Douaa_Amani.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden min-h-screen"
      style={{
        backgroundColor: 'var(--color-background)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        padding: '0px',
        margin: '0px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(14, 28, 46, 0) 0%, rgba(14, 28, 46, 1) 100%)'
              : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)'
          }}
        />
      </div>

      

      

      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(167, 183, 214, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(44, 79, 190, 0.06) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(109, 136, 193, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(167, 183, 214, 0.08) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(109, 136, 193, 0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(44, 79, 190, 0.04) 0%, transparent 70%)'
          }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {particles.map((particle) => {
          const target = particleTargets[particle.id] || { top: particle.top, left: particle.left };
          const transitionDuration = 3.5 + ((particle.id % 5) * 0.4);
          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: `${target.top}%`,
                left: `${target.left}%`,
                backgroundColor: isDark ? '#FFE8E0' : '#B27B95',
                opacity: particle.opacity,
                animation: `fairyFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                boxShadow: isDark
                  ? `0 0 ${particle.size * 3}px ${particle.size * 0.8}px rgba(255, 220, 200, 0.6),
                     0 0 ${particle.size * 6}px ${particle.size * 1.5}px rgba(255, 210, 190, 0.25)`
                  : `0 0 ${particle.size * 3}px ${particle.size * 0.8}px rgba(178, 123, 149, 0.4),
                     0 0 ${particle.size * 6}px ${particle.size * 1.5}px rgba(178, 123, 149, 0.15)`,
                filter: 'blur(0.3px)',
                transition: `top ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), left ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 1s ease, background-color 1s ease`,
                willChange: 'top, left',
              }}
            />
          );
        })}
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-6 lg:gap-8 xl:gap-10 items-center md:items-center min-h-[80vh] md:min-h-screen py-4 sm:py-6 md:py-8">
          
          {/* Image - On mobile: top, on desktop: right */}
          <div
            className={`order-1 md:order-2 flex justify-center items-center transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
            style={{
              transitionDelay: '300ms',
            }}
            onMouseEnter={handleLightToggle}
          >
            <div
              className="relative w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[320px] mx-auto"
              style={{ aspectRatio: '1 / 1' }}
            >

              <div className="hidden sm:block">
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-1000"
                  style={{
                    top: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '35%',
                    height: '4px',
                    borderRadius: '999px',
                    background: isDark
                      ? (isLightOn
                        ? 'linear-gradient(to right, rgba(255, 220, 180, 0.5), rgba(255, 210, 170, 0.85), rgba(255, 220, 180, 0.5))'
                        : 'linear-gradient(to right, rgba(60, 65, 60, 0.3), rgba(50, 55, 50, 0.5), rgba(60, 65, 60, 0.3))')
                      : (isLightOn
                        ? 'linear-gradient(to right, rgba(178, 123, 149, 0.3), rgba(178, 123, 149, 0.6), rgba(178, 123, 149, 0.3))'
                        : 'linear-gradient(to right, rgba(222, 212, 203, 0.3), rgba(222, 212, 203, 0.5), rgba(222, 212, 203, 0.3))'),
                    boxShadow: isDark && isLightOn
                      ? '0 0 20px rgba(255, 200, 150, 0.25), 0 0 40px rgba(255, 200, 150, 0.12)'
                      : !isDark && isLightOn
                      ? '0 0 20px rgba(178, 123, 149, 0.15), 0 0 40px rgba(178, 123, 149, 0.08)'
                      : 'none',
                  }}
                />

                <div
                  className="absolute z-15 pointer-events-none transition-all duration-700"
                  style={{
                    top: '-18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px',
                    height: '7px',
                    borderRadius: '3px',
                    background: isDark
                      ? (isLightOn ? 'rgba(40, 45, 40, 0.5)' : 'rgba(30, 35, 30, 0.7)')
                      : (isLightOn ? 'rgba(178, 123, 149, 0.15)' : 'rgba(222, 212, 203, 0.4)'),
                    border: isDark
                      ? (isLightOn ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.2)')
                      : (isLightOn ? '1px solid rgba(178, 123, 149, 0.15)' : '1px solid rgba(222, 212, 203, 0.3)'),
                    boxShadow: isDark && isLightOn
                      ? '0 1px 4px rgba(0,0,0,0.2)'
                      : !isDark && isLightOn
                      ? '0 1px 8px rgba(178, 123, 149, 0.08)'
                      : '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                />

                <div
                  className="absolute z-15 pointer-events-none transition-all duration-700"
                  style={{
                    top: '-22px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '7px',
                    height: '11px',
                    borderRadius: '2px',
                    background: isDark
                      ? (isLightOn ? 'rgba(40, 45, 40, 0.35)' : 'rgba(30, 35, 30, 0.6)')
                      : (isLightOn ? 'rgba(178, 123, 149, 0.12)' : 'rgba(222, 212, 203, 0.3)'),
                    border: isDark
                      ? (isLightOn ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(0,0,0,0.15)')
                      : (isLightOn ? '1px solid rgba(178, 123, 149, 0.1)' : '1px solid rgba(222, 212, 203, 0.2)'),
                  }}
                />

                {isDark && isLightOn && (
                 <div
                  className="absolute pointer-events-none"
                  style={{
                    top: '-200px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw',
                    height: '650px',
                    overflow: 'hidden',
                    WebkitMaskImage:
                      'radial-gradient(ellipse 340px 460px at 50% 200px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
                    maskImage:
                      'radial-gradient(ellipse 340px 460px at 50% 200px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
                  }}
                >
                    <div
                      className="absolute z-5 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '200px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '160px',
                        height: '360px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(255, 220, 180, 0.22) 0%,
                            rgba(255, 215, 175, 0.14) 30%,
                            rgba(255, 210, 170, 0.07) 55%,
                            rgba(255, 205, 165, 0.03) 80%,
                            transparent 100%
                          )
                        `,
                        filter: 'blur(8px)',
                        borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                        animation: 'lightFadeIn 1.2s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-4 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '175px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '380px',
                        height: '520px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(255, 215, 175, 0.10) 0%,
                            rgba(255, 210, 170, 0.06) 30%,
                            rgba(255, 205, 165, 0.03) 55%,
                            rgba(255, 200, 160, 0.01) 80%,
                            transparent 100%
                          )
                        `,
                        filter: 'blur(40px)',
                        animation: 'lightFadeIn 1.5s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-3 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '160px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '640px',
                        height: '720px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(255, 210, 170, 0.04) 0%,
                            rgba(255, 205, 165, 0.02) 40%,
                            transparent 70%
                          )
                        `,
                        filter: 'blur(80px)',
                        animation: 'lightFadeIn 1.8s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-2 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '205px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '360px',
                        height: '340px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 20%,
                            rgba(255, 215, 175, 0.06) 0%,
                            rgba(255, 210, 170, 0.03) 40%,
                            transparent 70%
                          )
                        `,
                        filter: 'blur(50px)',
                        animation: 'lightFadeIn 1.3s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-10 pointer-events-none transition-all duration-700"
                      style={{
                        top: '198px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '110px',
                        height: '18px',
                        background: 'linear-gradient(to bottom, rgba(255, 220, 180, 0.18), transparent)',
                        filter: 'blur(3px)',
                        borderRadius: '50%',
                        animation: 'lightFadeIn 0.8s ease-out forwards',
                      }}
                    />
                  </div>
                )}

                {!isDark && isLightOn && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: '-200px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100vw',
                      height: '650px',
                      overflow: 'hidden',
                      WebkitMaskImage:
                        'radial-gradient(ellipse 340px 460px at 50% 200px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
                      maskImage:
                        'radial-gradient(ellipse 340px 460px at 50% 200px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
                    }}
                  >
                    <div
                      className="absolute z-5 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '200px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '160px',
                        height: '360px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(178, 123, 149, 0.15) 0%,
                            rgba(178, 123, 149, 0.10) 30%,
                            rgba(178, 123, 149, 0.05) 55%,
                            rgba(178, 123, 149, 0.02) 80%,
                            transparent 100%
                          )
                        `,
                        filter: 'blur(8px)',
                        borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                        animation: 'lightFadeIn 1.2s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-4 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '175px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '380px',
                        height: '520px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(178, 123, 149, 0.08) 0%,
                            rgba(178, 123, 149, 0.05) 30%,
                            rgba(178, 123, 149, 0.02) 55%,
                            transparent 100%
                          )
                        `,
                        filter: 'blur(40px)',
                        animation: 'lightFadeIn 1.5s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-3 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '160px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '640px',
                        height: '720px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 0%,
                            rgba(178, 123, 149, 0.04) 0%,
                            rgba(178, 123, 149, 0.02) 40%,
                            transparent 70%
                          )
                        `,
                        filter: 'blur(80px)',
                        animation: 'lightFadeIn 1.8s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-2 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '205px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '360px',
                        height: '340px',
                        background: `
                          radial-gradient(
                            ellipse at 50% 20%,
                            rgba(178, 123, 149, 0.05) 0%,
                            rgba(178, 123, 149, 0.02) 40%,
                            transparent 70%
                          )
                        `,
                        filter: 'blur(50px)',
                        animation: 'lightFadeIn 1.3s ease-out forwards',
                      }}
                    />

                    <div
                      className="absolute z-10 pointer-events-none transition-all duration-700"
                      style={{
                        top: '198px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '110px',
                        height: '18px',
                        background: 'linear-gradient(to bottom, rgba(178, 123, 149, 0.12), transparent)',
                        filter: 'blur(3px)',
                        borderRadius: '50%',
                        animation: 'lightFadeIn 0.8s ease-out forwards',
                      }}
                    />
                  </div>
                )}
              </div>

              <div
                className="absolute inset-0 z-0 rounded-full blur-2xl transition-all duration-1000"
                style={{
                  background: isDark
                    ? (isLightOn
                      ? 'radial-gradient(circle, rgba(238, 212, 209, 0.15) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(30, 35, 30, 0.25) 0%, transparent 70%)')
                    : (isLightOn
                      ? 'radial-gradient(circle, rgba(178, 123, 149, 0.10) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(222, 212, 203, 0.15) 0%, transparent 70%)'),
                  transform: 'scale(1.1)',
                }}
              />

              <div
                className="absolute inset-0 z-0 overflow-hidden transition-all duration-1000"
                style={{
                  padding: '6%',
                  borderRadius: '50%',
                }}
              >
                <img
                  src="/me.png"
                  alt="Profile"
                  className="w-full h-full transition-all duration-1000"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center 58%',
                    borderRadius: '50%',
                    filter: isDark
                      ? (isLightOn
                        ? 'brightness(1.04) contrast(1.02) saturate(1.05) blur(0px)'
                        : 'brightness(0.35) contrast(0.9) saturate(0.8) blur(2px)')
                      : (isLightOn
                        ? 'brightness(1.04) contrast(1.02) saturate(1.05) blur(0px)'
                        : 'brightness(0.9) contrast(0.95) saturate(0.9) blur(0.5px)'),
                    transition: 'filter 1.2s ease-out',
                  }}
                />
              </div>

              <img
                src="/frame.png"
                alt="Frame"
                className="relative w-full h-auto z-10 pointer-events-none transition-all duration-1000"
                style={{
                  display: 'block',
                  filter: isDark
                    ? (isLightOn
                      ? 'drop-shadow(0 2px 12px rgba(255,210,170,0.08)) brightness(1)'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3)) brightness(0.5)')
                    : (isLightOn
                      ? 'drop-shadow(0 2px 12px rgba(178,123,149,0.06)) brightness(1)'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.04)) brightness(1)'),
                }}
              />
            </div>
          </div>

          {/* Text content - On mobile: bottom, on desktop: left */}
          <div
            className={`order-2 md:order-1 transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
            style={{
              transitionDelay: '150ms',
            }}
          >
            <h2
              className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mb-0.5 sm:mb-1 md:mb-1.5"
              style={{
                color: isDark ? '#FFFFFF' : '#2F2A36',
                fontFamily: 'var(--font-heading)',
              }}
            >
              About Me
            </h2>

            <p
              className="font-body text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-0.5 sm:mb-1 md:mb-1.5"
              style={{
                color: isDark ? 'var(--color-accent)' : 'var(--color-accent)',
                fontFamily: 'Symphony, serif',
              }}
            >
              Building intelligent products where AI, data, and software work together.
            </p>

            <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
              <p
                className="font-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed"
                style={{
                  color: isDark ? 'rgba(243,242,239,0.85)' : 'rgba(31,44,46,0.82)',
                }}
              >
                I work across AI, data, and software engineering to turn ideas into usable digital products. My background in software engineering and data science helps me move from model development to application building and product thinking.
              </p>
              <p
                className="font-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed"
                style={{
                  color: isDark ? 'rgba(243,242,239,0.85)' : 'rgba(31,44,46,0.82)',
                }}
              >
                I&apos;m particularly interested in systems that create practical human impact — from AI-enabled tools to data-driven experiences that make everyday processes clearer, smarter, and easier to use.
              </p>
            </div>

            <div className="mt-2 sm:mt-2.5 md:mt-3 lg:mt-4">
              <button
                onClick={handleDownloadCV}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 font-medium"
                style={{
                  ...(isHovered ? {
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-text-inverse)',
                    border: '1px solid var(--color-accent)',
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 24px -14px rgba(200, 137, 112, 0.7)',
                  } : {
                    backgroundColor: 'transparent',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                    transform: 'scale(1)',
                    boxShadow: 'none',
                  }),
                }}
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download CV
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fairyFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(8px, -10px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translate(-4px, -15px) scale(1.05);
            opacity: 0.4;
          }
          75% {
            transform: translate(10px, -6px) scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes lightFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>
    </section>
  );
}