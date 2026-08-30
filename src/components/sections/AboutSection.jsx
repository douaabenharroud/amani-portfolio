"use client";

import { useState, useEffect, useRef } from "react";

export default function AboutSection() {
  const [isDark, setIsDark] = useState(false);
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
  const wasInViewRef = useRef(false);

  // Store initial positions - matching home section count (12)
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

  useEffect(() => {
    // Only generate particles once
    if (!particlesGeneratedRef.current) {
      particlesGeneratedRef.current = true;
      const generateParticles = () => {
        const newParticles = [];
        const targets = {};

        // Use the same positions as home section
        INITIAL_POSITIONS.forEach((pos, i) => {
          const size = 1.5 + Math.random() * 2.5;
          // Start from sides (left or right)
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

    // Intersection Observer for scroll reveal animation and light control
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isInView = entry.isIntersecting;

        // Turn off light when section is not in view
        if (!isInView) {
          setIsLightOn(false);
          setHasBeenHovered(false);
        }

        if (isInView) {
          setIsVisible(true);
          hasAnimatedRef.current = true;

          // Trigger particle entrance when section becomes visible
          if (!particlesEntered && particles.length > 0) {
            setParticlesEntered(true);
            // Move particles from sides to their target positions
            const newTargets = {};
            particles.forEach((particle) => {
              newTargets[particle.id] = {
                top: particle.targetTop || 5 + Math.random() * 90,
                left: particle.targetLeft || 5 + Math.random() * 90
              };
            });

            // Delay before particles start entering
            setTimeout(() => {
              setParticleTargets(newTargets);
            }, 500);
          }
        } else {
          setIsVisible(false);
          hasAnimatedRef.current = false;
          setParticlesEntered(false);

          // Reset particles to sides when scrolled away
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

    // Intersection Observer to detect when next section is in view
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

  // Smooth random movement when light is on
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
    // Only turn on light if section is visible
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
      className="relative w-full overflow-x-hidden min-h-screen py-6 sm:py-8 md:py-10 lg:py-12"
      style={{
        backgroundColor: isDark ? '#323C31' : '#F0E6E3',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}
    >
      {/* Hide scrollbar for Chrome, Safari and Opera */}
      <style jsx>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Ensure full viewport height coverage */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(50, 60, 49, 0) 0%, rgba(50, 60, 49, 1) 100%)'
              : 'radial-gradient(ellipse at center, rgba(240, 230, 227, 0) 0%, rgba(240, 230, 227, 1) 100%)'
          }}
        />
      </div>

      {/* Subtle gradient transition from home section */}
      <div
        className="absolute top-0 left-0 w-full h-12 sm:h-16 lg:h-20 pointer-events-none z-5"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(50, 60, 49, 0) 0%, rgba(50, 60, 49, 1) 100%)'
            : 'linear-gradient(to bottom, rgba(240, 230, 227, 0) 0%, rgba(240, 230, 227, 1) 100%)'
        }}
      />

      {/* Lace overlay at top - Behind content */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0 opacity-30">
        <img
          src="/lace.png"
          alt="Lace decoration"
          className="w-full h-auto object-cover"
          style={{ maxHeight: '150px' }}
        />
      </div>

      {/* Decorative elements - Behind content */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(238, 212, 209, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(175, 99, 132, 0.08) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(175, 99, 132, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(238, 212, 209, 0.08) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(151, 109, 144, 0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(151, 109, 144, 0.06) 0%, transparent 70%)'
          }}
        ></div>
      </div>

      {/* Delicate fairy dust particles - Over lace */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {particles.map((particle) => {
          const target = particleTargets[particle.id] || { top: particle.top, left: particle.left };
          // Slower transition for each particle (3-5 seconds)
          const transitionDuration = 3.5 + Math.random() * 2.5;
          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: `${target.top}%`,
                left: `${target.left}%`,
                backgroundColor: isDark ? '#FFE8E0' : '#D487A8',
                opacity: particle.opacity,
                animation: `fairyFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                boxShadow: isDark
                  ? `0 0 ${particle.size * 3}px ${particle.size * 0.8}px rgba(255, 220, 200, 0.6),
                     0 0 ${particle.size * 6}px ${particle.size * 1.5}px rgba(255, 210, 190, 0.25)`
                  : `0 0 ${particle.size * 3}px ${particle.size * 0.8}px rgba(212, 135, 168, 0.6),
                     0 0 ${particle.size * 6}px ${particle.size * 1.5}px rgba(212, 135, 168, 0.25)`,
                filter: 'blur(0.3px)',
                transition: `top ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), left ${transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 1s ease, background-color 1s ease`,
                willChange: 'top, left',
              }}
            />
          );
        })}
      </div>

      {/* Content - Over everything */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center min-h-[calc(100vh-4rem)] py-2 sm:py-4 md:py-6">

          {/* Right - Photo with Frame */}
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
            {/*
              FIX: this wrapper previously had no explicit height (only "w-full",
              with height coming implicitly from the frame image's natural aspect
              ratio via h-auto). Because that height is content-derived rather than
              a definite/explicit CSS height, the child beam layers below
              (which use percentage heights like 140%, 200%, 280%) could not
              resolve their percentage against THIS box. Per spec, an
              absolutely-positioned descendant with a % height falls back to the
              nearest ancestor that DOES have a definite height when its
              immediate containing block's height is auto — in this layout that
              was effectively the section/viewport, which made the beam balloon
              out far taller than intended and inflated page scroll height.

              Giving this wrapper an explicit aspectRatio makes its height
              definite, so all descendant % heights now resolve correctly
              against the photo frame itself.

              IMPORTANT: replace the aspectRatio value below with frame.png's
              actual width/height ratio (check the file's real pixel
              dimensions) if it isn't a perfect square.
            */}
            <div
              className="relative w-full max-w-[140px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[350px] mx-auto"
              style={{ aspectRatio: '1 / 1' }}
            >

              {/* Picture Light - Hide on small screens */}
              <div className="hidden sm:block">
                {/* Linear LED fixture - Light bar */}
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-1000"
                  style={{
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    height: '5px',
                    borderRadius: '999px',
                    background: isDark
                      ? (isLightOn
                        ? 'linear-gradient(to right, rgba(255, 220, 180, 0.5), rgba(255, 210, 170, 0.85), rgba(255, 220, 180, 0.5))'
                        : 'linear-gradient(to right, rgba(60, 65, 60, 0.3), rgba(50, 55, 50, 0.5), rgba(60, 65, 60, 0.3))')
                      : 'linear-gradient(to right, rgba(180, 175, 170, 0.3), rgba(160, 155, 150, 0.5), rgba(180, 175, 170, 0.3))',
                    boxShadow: isDark && isLightOn
                      ? '0 0 20px rgba(255, 200, 150, 0.25), 0 0 40px rgba(255, 200, 150, 0.12)'
                      : 'none',
                  }}
                />

                {/* Mount bracket */}
                <div
                  className="absolute z-15 pointer-events-none transition-all duration-700"
                  style={{
                    top: '-22px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '32px',
                    height: '10px',
                    borderRadius: '3px',
                    background: isDark
                      ? (isLightOn ? 'rgba(40, 45, 40, 0.5)' : 'rgba(30, 35, 30, 0.7)')
                      : 'rgba(180, 175, 170, 0.4)',
                    border: isDark
                      ? (isLightOn ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.2)')
                      : '1px solid rgba(120, 115, 110, 0.1)',
                    boxShadow: isDark && isLightOn
                      ? '0 1px 4px rgba(0,0,0,0.2)'
                      : '0 1px 4px rgba(0,0,0,0.15)',
                  }}
                />

                {/* Support arm */}
                <div
                  className="absolute z-15 pointer-events-none transition-all duration-700"
                  style={{
                    top: '-26px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '14px',
                    borderRadius: '2px',
                    background: isDark
                      ? (isLightOn ? 'rgba(40, 45, 40, 0.35)' : 'rgba(30, 35, 30, 0.6)')
                      : 'rgba(180, 175, 170, 0.3)',
                    border: isDark
                      ? (isLightOn ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(0,0,0,0.15)')
                      : '1px solid rgba(120, 115, 110, 0.08)',
                  }}
                />

                {/* BEAM - Only active in dark mode when light is on */}
                {isDark && isLightOn && (
                  /*
                    FIX #2: these beam layers use oversized % width/height
                    (up to 250%/280% of the frame box) to fake a soft light
                    spread. Even though they now resolve against the correctly
                    sized photo frame (see FIX #1 above), their literal layout
                    boxes are still genuinely huge in pixels and extend past
                    the section's normal content bounds. Because the <section>
                    has overflowY: 'auto', any descendant's layout box that
                    exceeds its normal bounds enlarges the section's
                    *scrollable* content area (scrollHeight) — this is true
                    even for position:absolute elements, and even though most
                    of each layer is already faded to transparent. That's what
                    produced the "weird extra space" every time isLightOn
                    flipped true (and it shrank back when it flipped false).

                    box-shadow / filter:blur() do NOT count toward scrollable
                    overflow (paint-only effects), but literal oversized boxes
                    do. Rather than resize each gradient by hand, we clip all
                    of them inside one fixed-pixel, overflow:hidden container.
                    Because every gradient already fades to transparent well
                    before its own box edge, clipping here is visually
                    seamless, and because this container's size is a constant
                    (not a % of anything), it contributes the exact same,
                    bounded amount to layout every single time the light
                    toggles on — no more jump/space on re-entry.
                  */
                  /*
                    Simplified per feedback: rather than chasing exact
                    clearance math for the mask, just size the clip box to
                    match the page (100vh) and let it clip at the bottom
                    naturally. Clipping at the page's own edge reads as
                    normal (same as it clipping at the left/right screen
                    edges already did) — it's not a floating box edge inside
                    the content, so it doesn't look like a bug. Still a
                    constant value (not a % of an ancestor's content-derived
                    size), so this can't reintroduce the earlier
                    scroll-height jump.
                  */
                 <div
  className="absolute pointer-events-none"
  style={{
    top: '-260px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100vw',
    height: '900px', // was '100vh' — must be taller than the mask's
                     // own falloff (260px center + 560px radius ≈ 820px)
                     // or the mask gets clipped before it reaches
                     // transparent, producing a hard edge
    overflow: 'hidden',
    WebkitMaskImage:
      'radial-gradient(ellipse 460px 620px at 50% 260px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
    maskImage:
      'radial-gradient(ellipse 460px 620px at 50% 260px, black 12%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.28) 64%, rgba(0,0,0,0.12) 78%, rgba(0,0,0,0.04) 90%, transparent 100%)',
  }}
>
                    <div
                      className="absolute z-5 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '260px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '230px',
                        height: '490px',
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
                        top: '230px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '525px',
                        height: '700px',
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
                        top: '215px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '875px',
                        height: '980px',
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
                        top: '271px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '490px',
                        height: '455px',
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
                        top: '258px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '158px',
                        height: '25px',
                        background: 'linear-gradient(to bottom, rgba(255, 220, 180, 0.18), transparent)',
                        filter: 'blur(3px)',
                        borderRadius: '50%',
                        animation: 'lightFadeIn 0.8s ease-out forwards',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Soft glow behind frame */}
              <div
                className="absolute inset-0 z-0 rounded-full blur-2xl transition-all duration-1000"
                style={{
                  background: isDark
                    ? (isLightOn
                      ? 'radial-gradient(circle, rgba(238, 212, 209, 0.15) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(30, 35, 30, 0.3) 0%, transparent 70%)')
                    : 'radial-gradient(circle, rgba(175, 99, 132, 0.10) 0%, transparent 70%)',
                  transform: 'scale(1.1)',
                }}
              />

              {/* Photo */}
              <div
                className="absolute inset-0 z-0 overflow-hidden transition-all duration-1000"
                style={{
                  padding: '11%',
                  borderRadius: '8%',
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
                    transform: 'scale(1.15)',
                    filter: isDark
                      ? (isLightOn
                        ? 'brightness(1.04) contrast(1.02) saturate(1.05) blur(0px)'
                        : 'brightness(0.35) contrast(0.9) saturate(0.8) blur(2px)')
                      : 'none',
                    transition: 'filter 1.2s ease-out',
                  }}
                />
              </div>

              {/* Frame */}
              <img
                src="/frame.png"
                alt="Frame"
                className="relative w-full h-auto z-10 pointer-events-none transition-all duration-1000"
                style={{
                  filter: isDark
                    ? (isLightOn
                      ? 'drop-shadow(0 2px 12px rgba(255,210,170,0.08)) brightness(1)'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3)) brightness(0.5)')
                    : 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))',
                }}
              />
            </div>
          </div>

          {/* Left - Text Content */}
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
              className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-1 sm:mb-2"
              style={{
                color: isDark ? '#FFFFFF' : '#432033',
                fontFamily: 'var(--font-heading)',
              }}
            >
              About Me
            </h2>

            <p
              className="font-body text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-1 sm:mb-2"
              style={{
                color: isDark ? '#EED4D1' : '#AF6384',
                fontFamily: 'Symphony, serif',
              }}
            >
              Building products where AI, data, and design work together.
            </p>

            {/*
              FIX #5 (text): this used to be a single <p> containing two
              ideas separated only by a blank line in the JSX source. HTML
              collapses that whitespace, so it rendered as one run-on block
              with no real paragraph break — not the "fixed writing" issue
              it looked like, but a markup issue.

              It also had maxHeight + overflowY:'auto', which forced its own
              tiny internal scrollbar whenever the two paragraphs didn't fit
              — meaning the reader had to scroll INSIDE a small box just to
              read a couple of sentences, separate from scrolling the page.
              Removed that: the text now just flows naturally, sized down
              slightly (text-[11px] on the smallest screens, tighter
              leading) so it comfortably fits without needing any scroll of
              its own.
            */}
            <p
              className="font-body text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed mb-1.5 sm:mb-2"
              style={{
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(67, 32, 51, 0.85)',
              }}
            >
              I'm a Data Scientist and Product Designer who transforms complex problems into simple, practical solutions. I combine AI, software engineering, and design to create digital experiences that are intelligent, intuitive, and built with purpose.
            </p>
            <p
              className="font-body text-[11px] sm:text-sm md:text-base lg:text-lg leading-snug sm:leading-relaxed mb-2 sm:mb-3"
              style={{
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(67, 32, 51, 0.85)',
              }}
            >
              I care about products that don't just look good—they solve real problems, improve how people work, and make technology feel effortless. Every decision, from strategy to implementation, is driven by clarity, usability, and measurable impact.
            </p>

            {/* Download CV Button */}
            <div className="mt-2 sm:mt-3">
              <button
                onClick={handleDownloadCV}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 rounded-full px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base transition-all duration-300 font-medium"
                style={{
                  ...(isHovered ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-light)',
                    border: '1px solid var(--color-primary)',
                    transform: 'scale(1.02)',
                    boxShadow: '0 10px 20px -8px rgba(67, 32, 51, 0.35)',
                  } : {
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    transform: 'scale(1)',
                    boxShadow: 'none',
                  }),
                  ...(isDark ? {
                    '--color-primary': '#EED4D1',
                    '--color-text-light': '#323C31',
                  } : {
                    '--color-primary': '#AF6384',
                    '--color-text-light': '#FFFFFF',
                  }),
                }}
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300"
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

      {/* Styles to hide scrollbars */}
      <style jsx global>{`
        /* Hide scrollbar for section */
        #about {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        #about::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      {/* Animations */}
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