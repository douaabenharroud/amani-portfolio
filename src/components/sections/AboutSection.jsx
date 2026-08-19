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
  const animationFrameRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    const generateParticles = () => {
      const newParticles = [];
      const targets = {};
      
      for (let i = 0; i < 25; i++) {
        const size = 1.5 + Math.random() * 2.5;
        const top = 5 + Math.random() * 90;
        const left = 5 + Math.random() * 90;
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 10;
        const opacity = 0.3 + Math.random() * 0.5;
        
        newParticles.push({ 
          id: i, 
          size, 
          top, 
          left, 
          delay, 
          duration, 
          opacity,
          speed: 0.02 + Math.random() * 0.03,
          wanderRadius: 3 + Math.random() * 8,
        });
        
        targets[i] = { top, left };
      }
      
      setParticleTargets(targets);
      return newParticles;
    };
    
    setParticles(generateParticles());
    
    // Intersection Observer for scroll reveal animation
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    if (sectionRef.current) {
      scrollObserver.observe(sectionRef.current);
    }
    
    // Intersection Observer to detect when next section is in view
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasBeenHovered) {
            setIsLightOn(false);
            setHasBeenHovered(false);
          }
        });
      }, { threshold: 0.3 });
      
      intersectionObserver.observe(nextSection);
      
      return () => {
        intersectionObserver.disconnect();
        scrollObserver.disconnect();
        observer.disconnect();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
    
    return () => {
      scrollObserver.disconnect();
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasBeenHovered]);

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
        const newTargets = { ...particleTargets };
        
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
        
        setParticleTargets(newTargets);
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
  }, [isLightOn, particles, particleTargets]);

  const handleLightToggle = () => {
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
      className="relative w-full min-h-screen overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12"
      style={{
        backgroundColor: isDark ? '#323C31' : '#F0E6E3',
        minHeight: '100vh',
        height: 'auto',
      }}
    >
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

      {/* Lace overlay at top - matches home section's elegant style */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-5 opacity-30">
        <img 
          src="/lace.png" 
          alt="Lace decoration" 
          className="w-full h-auto object-cover"
          style={{ maxHeight: '150px' }}
        />
      </div>

      {/* Decorative elements - soft, matching home section's fairy light aesthetic */}
      <div className="absolute inset-0 pointer-events-none">
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

      {/* Delicate fairy dust particles - realistic firefly movement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => {
          const target = particleTargets[particle.id] || { top: particle.top, left: particle.left };
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
                transition: 'top 3s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 1s ease, background-color 1s ease',
              }}
            />
          );
        })}
      </div>

      {/* Content - Two column layout with responsive sizing */}
      <div 
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 items-center min-h-[calc(100vh-8rem)]">
          
          {/* Right - Photo with Frame - First on mobile (order-1), second on desktop (md:order-2) */}
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
            <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[420px] xl:max-w-[480px] 2xl:max-w-[520px] mx-auto">
              
              {/* PICTURE LIGHT - Realistic on/off behavior */}
              <>
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
                  <>
                    {/* Layer 1: Core illumination - Vertical trapezoid */}
                    <div 
                      className="absolute z-5 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '65%',
                        height: '140%',
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
                    
                    {/* Layer 2: Wide glow - Extended vertically */}
                    <div 
                      className="absolute z-4 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '-5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '150%',
                        height: '200%',
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
                    
                    {/* Layer 3: Ambient spill - Very wide and warm */}
                    <div 
                      className="absolute z-3 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '-10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '250%',
                        height: '280%',
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
                    
                    {/* Wall glow - Behind the painting, warm */}
                    <div 
                      className="absolute z-2 pointer-events-none transition-all duration-1000"
                      style={{
                        top: '5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '140%',
                        height: '130%',
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
                    
                    {/* LED diffuser glow - Warm */}
                    <div 
                      className="absolute z-10 pointer-events-none transition-all duration-700"
                      style={{
                        top: '-2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '45%',
                        height: '25px',
                        background: 'linear-gradient(to bottom, rgba(255, 220, 180, 0.18), transparent)',
                        filter: 'blur(3px)',
                        borderRadius: '50%',
                        animation: 'lightFadeIn 0.8s ease-out forwards',
                      }}
                    />
                  </>
                )}
              </>

              {/* Soft glow behind frame - More prominent when light is on */}
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
              
              {/* Photo - positioned behind frame with clip */}
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
              
              {/* Frame - on top with higher z-index */}
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

          {/* Left - Text Content - Second on mobile (order-2), first on desktop (md:order-1) */}
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
              className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-2 md:mb-3"
              style={{ 
                color: isDark ? '#FFFFFF' : '#432033',
                fontFamily: 'var(--font-heading)',
              }}
            >
              About Me
            </h2>
            
            <p 
              className="font-body text-lg sm:text-xl md:text-xl lg:text-2xl font-medium mb-2 md:mb-3"
              style={{ 
                color: isDark ? '#EED4D1' : '#AF6384',
                fontFamily: 'Symphony, serif',
              }}
            >
              Building products where AI, data, and design work together.
            </p>
            
            <p 
              className="font-body text-sm sm:text-base md:text-base lg:text-lg leading-relaxed mb-2 md:mb-3"
              style={{ 
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(67, 32, 51, 0.85)',
              }}
            >
              I'm a Data Scientist and Product Designer who transforms complex problems into simple, practical solutions. I combine AI, software engineering, and design to create digital experiences that are intelligent, intuitive, and built with purpose.

              I care about products that don't just look good—they solve real problems, improve how people work, and make technology feel effortless. Every decision, from strategy to implementation, is driven by clarity, usability, and measurable impact.
            </p>

            {/* Download CV Button - Matches navbar Contact Me button exactly */}
            <div className="mt-3 md:mt-4">
              <button
                onClick={handleDownloadCV}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 rounded-full px-6 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-3.5 text-sm sm:text-base transition-all duration-300 font-medium"
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
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300"
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

      {/* Add the animations */}
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