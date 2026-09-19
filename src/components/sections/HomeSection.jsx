"use client";

import { useState, useEffect, useRef } from "react";

// ============================================
// MUSEUM-INSPIRED BUTTON COMPONENT
// ============================================
const MuseumButton = ({
  children,
  variant = 'primary',
  onMouseEnter,
  onMouseLeave,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };
  
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };
  
  const variants = {
    primary: {
      background: isHovered ? 'var(--color-primary-hover)' : 'var(--color-primary)',
      borderColor: isHovered ? 'var(--color-primary-hover)' : 'var(--color-primary)',
      color: 'var(--color-text-inverse)',
    },
    secondary: {
      background: isHovered ? 'var(--color-primary-soft)' : 'transparent',
      borderColor: 'var(--color-primary)',
      color: isHovered ? 'var(--color-primary)' : 'var(--color-primary)',
    },
    accent: {
      background: isHovered ? 'var(--color-accent-hover)' : 'var(--color-accent)',
      borderColor: isHovered ? 'var(--color-accent-hover)' : 'var(--color-accent)',
      color: 'var(--color-text-inverse)',
    },
    outline: {
      background: isHovered ? 'var(--color-primary-soft)' : 'transparent',
      borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-border)',
      color: isHovered ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    },
  };

  const style = variants[variant] || variants.primary;

  return (
    <button
      className={`museum-btn museum-btn-${variant} btn-${variant} ${className}`.trim()}
      style={{
        ...style,
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-sm)' : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================
// HOME SECTION
// ============================================
function HomeSection() {
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [birdsLoaded, setBirdsLoaded] = useState(false);
  const [hoveredLight, setHoveredLight] = useState(null);
  const [lightPositions, setLightPositions] = useState([]);
  const [scatteredLights, setScatteredLights] = useState([]);
  const [isScattering, setIsScattering] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [flightPaths, setFlightPaths] = useState([]);
  const [originalPositions, setOriginalPositions] = useState([]);
  const [fireflyStates, setFireflyStates] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);
  const initialScrollY = useRef(0);
  const resetTimeoutRef = useRef(null);
  const cooldownRef = useRef(false);
  const cooldownTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const departureProgressRef = useRef({});
  const offScreenRef = useRef({});
  const isResettingRef = useRef(false);
  const isScatteringRef = useRef(false);
  const wasInViewRef = useRef(false);
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
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    const scrollTimer = setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
      setIsAnimating(false);
    }, 1400);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
    };
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log('Birds image loaded successfully');
      setBirdsLoaded(true);
    };
    img.onerror = () => console.log('Birds image failed to load');
    img.src = '/birds.png';
  }, []);

  useEffect(() => {
    if (!particlesGeneratedRef.current) {
      particlesGeneratedRef.current = true;
      setLightPositions(INITIAL_POSITIONS);
      setOriginalPositions(INITIAL_POSITIONS);
      
      const states = {};
      INITIAL_POSITIONS.forEach((_, index) => {
        states[index] = {
          isOffScreen: false,
          departureTime: 0,
          destTop: 0,
          destLeft: 0,
          type: 'static',
        };
      });
      setFireflyStates(states);
      
      const paths = INITIAL_POSITIONS.map((pos, index) => {
        const wobbleAmplitude = 2 + Math.random() * 4;
        const wobbleSpeed = 0.02 + Math.random() * 0.03;
        const phase = Math.random() * Math.PI * 2;
        
        return {
          wobbleAmplitude,
          wobbleSpeed,
          phase,
          originTop: pos.top,
          originLeft: pos.left,
          destTop: 0,
          destLeft: 0,
          departureTime: 0,
        };
      });
      setFlightPaths(paths);
    }
  }, []);

  const resetFireflies = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    cooldownRef.current = true;
    isResettingRef.current = true;
    isScatteringRef.current = false;
    
    cooldownTimeoutRef.current = setTimeout(() => {
      cooldownRef.current = false;
      isResettingRef.current = false;
    }, 3000);

    setIsResetting(true);
    
    setLightPositions(prev => {
      return prev.map((pos, index) => {
        const original = INITIAL_POSITIONS[index] || pos;
        return {
          ...pos,
          top: original.top,
          left: original.left,
        };
      });
    });
    
    departureProgressRef.current = {};
    offScreenRef.current = {};
    
    const states = {};
    INITIAL_POSITIONS.forEach((_, index) => {
      states[index] = {
        isOffScreen: false,
        departureTime: 0,
        destTop: 0,
        destLeft: 0,
        type: 'static',
      };
    });
    setFireflyStates(states);
    
    setScatteredLights([]);
    setIsScattering(false);
    setHoveredLight(null);
    setScrollOffset(0);
    
    resetTimeoutRef.current = setTimeout(() => {
      setIsResetting(false);
      isResettingRef.current = false;
      resetTimeoutRef.current = null;
    }, 100);
  };

  const isOffScreen = (top, left) => {
    const margin = 10;
    return top < -margin || top > 110 || left < -margin || left > 110;
  };

  const generateWobblePath = (baseTop, baseLeft, time, pathIndex, progress = 1) => {
    const path = flightPaths[pathIndex] || {
      wobbleAmplitude: 3,
      wobbleSpeed: 0.025,
      phase: 0,
    };
    
    const progressScale = Math.min(progress * 1.5, 1);
    const offScreenFactor = fireflyStates[pathIndex]?.isOffScreen ? 0.5 : 1;
    
    const wobbleX = Math.sin(time * path.wobbleSpeed + path.phase) * path.wobbleAmplitude * progressScale * offScreenFactor;
    const wobbleY = Math.cos(time * path.wobbleSpeed * 1.3 + path.phase * 0.7) * path.wobbleAmplitude * 0.8 * progressScale * offScreenFactor;
    
    const randomJitter = 0.3 * progressScale * offScreenFactor;
    const jitterX = (Math.sin(time * 0.1 + pathIndex) * 0.5) * randomJitter;
    const jitterY = (Math.cos(time * 0.12 + pathIndex * 1.2) * 0.5) * randomJitter;
    
    const driftScale = fireflyStates[pathIndex]?.isOffScreen ? 0.2 : 1;
    const driftX = Math.sin(time * 0.005 + pathIndex) * 0.5 * driftScale;
    const driftY = Math.cos(time * 0.007 + pathIndex * 0.8) * 0.5 * driftScale;
    
    return {
      top: baseTop + wobbleY + jitterY + driftY,
      left: baseLeft + wobbleX + jitterX + driftX,
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isAnimating) return;
      if (!sectionRef.current || !isDark) return;
      if (cooldownRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const windowHeight = window.innerHeight;
      
      const isInView = sectionTop < windowHeight && sectionBottom > 0;
      
      if (wasInViewRef.current && !isInView) {
        if (isScatteringRef.current) {
          resetFireflies();
        }
        wasInViewRef.current = false;
        return;
      }
      
      wasInViewRef.current = isInView;
      
      if (!isInView) return;
      
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      
      if (!isResettingRef.current && scrollDelta > 80) {
        if (isScatteringRef.current) {
          const scrollDeltaPos = currentScrollY - initialScrollY.current;
          setScrollOffset(scrollDeltaPos);
        } else {
          initialScrollY.current = currentScrollY;
          triggerScatter();
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDark, isAnimating]);

  useEffect(() => {
    let time = 0;
    let startTime = Date.now();
    let animationId = null;
    
    const animate = () => {
      time += 1;
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (isScatteringRef.current && !isResettingRef.current) {
        setLightPositions(prev => {
          return prev.map((pos, index) => {
            if (scatteredLights.includes(index)) {
              const origin = originalPositions[index] || INITIAL_POSITIONS[index];
              
              const departureTime = flightPaths[index]?.departureTime || 0;
              const timeSinceDeparture = Math.max(0, elapsed - departureTime);
              const progress = Math.min(timeSinceDeparture / 2, 1);
              
              departureProgressRef.current[index] = progress;
              
              const isOff = isOffScreen(pos.top, pos.left);
              if (isOff) {
                offScreenRef.current[index] = true;
                setFireflyStates(prev => ({
                  ...prev,
                  [index]: {
                    ...prev[index],
                    isOffScreen: true,
                  }
                }));
              }
              
              if (offScreenRef.current[index]) {
                return pos;
              }
              
              const wobble = generateWobblePath(
                pos.top, 
                pos.left, 
                time, 
                index, 
                progress
              );
              
              return {
                ...pos,
                top: wobble.top,
                left: wobble.left,
              };
            }
            return pos;
          });
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scatteredLights, originalPositions, flightPaths]);

  const triggerScatter = () => {
    if (cooldownRef.current) return;
    if (isScatteringRef.current) return;
    if (isResettingRef.current) return;
    
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    isScatteringRef.current = true;
    setIsScattering(true);
    setScrollOffset(0);
    const startTime = Date.now() / 1000;
    
    const baseFlightPaths = [
      { top: -15, left: -10, type: 'static' },
      { top: -20, left: 50, type: 'static' },
      { top: -10, left: 110, type: 'static' },
      { top: 50, left: -15, type: 'static' },
      { top: 50, left: 115, type: 'static' },
      { top: 110, left: 20, type: 'scroll' },
      { top: 115, left: 60, type: 'scroll' },
      { top: 105, left: 90, type: 'scroll' },
      { top: -25, left: 80, type: 'static' },
      { top: -8, left: 105, type: 'static' },
      { top: 30, left: -20, type: 'static' },
      { top: 80, left: 110, type: 'scroll' },
    ];
    
    lightPositions.forEach((light, i) => {
      const moveDelay = 100 + i * 150 + Math.random() * 300;
      
      setTimeout(() => {
        setScatteredLights(prev => [...prev, i]);
        
        setFlightPaths(prev => {
          const newPaths = [...prev];
          if (newPaths[i]) {
            newPaths[i].departureTime = (Date.now() / 1000) - startTime;
          }
          return newPaths;
        });
        
        setLightPositions(prev => {
          const newPositions = [...prev];
          const basePath = baseFlightPaths[i % baseFlightPaths.length];
          const randomOffset = 2 + Math.random() * 5;
          const origin = originalPositions[i] || INITIAL_POSITIONS[i];
          
          const destTop = basePath.top + (Math.random() - 0.5) * randomOffset;
          const destLeft = basePath.left + (Math.random() - 0.5) * randomOffset;
          
          setFireflyStates(prev => ({
            ...prev,
            [i]: {
              ...prev[i],
              destTop: destTop,
              destLeft: destLeft,
              type: basePath.type,
            }
          }));
          
          newPositions[i] = { 
            top: origin.top + (Math.random() - 0.5) * randomOffset,
            left: origin.left + (Math.random() - 0.5) * randomOffset,
            type: basePath.type,
            destTop: destTop,
            destLeft: destLeft,
          };
          return newPositions;
        });
      }, moveDelay);
    });
  };

  const handleLightHover = (index) => {
    if (cooldownRef.current) return;
    if (isScatteringRef.current) return;
    if (isResettingRef.current) return;
    
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    isScatteringRef.current = true;
    setIsScattering(true);
    setHoveredLight(index);
    setScrollOffset(0);
    initialScrollY.current = window.scrollY;
    const startTime = Date.now() / 1000;
    
    const baseFlightPaths = [
      { top: -15, left: -10, type: 'static' },
      { top: -20, left: 50, type: 'static' },
      { top: -10, left: 110, type: 'static' },
      { top: 50, left: -15, type: 'static' },
      { top: 50, left: 115, type: 'static' },
      { top: 110, left: 20, type: 'scroll' },
      { top: 115, left: 60, type: 'scroll' },
      { top: 105, left: 90, type: 'scroll' },
      { top: -25, left: 80, type: 'static' },
      { top: -8, left: 105, type: 'static' },
      { top: 30, left: -20, type: 'static' },
      { top: 80, left: 110, type: 'scroll' },
    ];
    
    lightPositions.forEach((light, i) => {
      const moveDelay = 100 + i * 150 + Math.random() * 300;
      
      setTimeout(() => {
        setScatteredLights(prev => [...prev, i]);
        
        setFlightPaths(prev => {
          const newPaths = [...prev];
          if (newPaths[i]) {
            newPaths[i].departureTime = (Date.now() / 1000) - startTime;
          }
          return newPaths;
        });
        
        setLightPositions(prev => {
          const newPositions = [...prev];
          const basePath = baseFlightPaths[i % baseFlightPaths.length];
          const randomOffset = 2 + Math.random() * 5;
          const origin = originalPositions[i] || INITIAL_POSITIONS[i];
          
          const destTop = basePath.top + (Math.random() - 0.5) * randomOffset;
          const destLeft = basePath.left + (Math.random() - 0.5) * randomOffset;
          
          setFireflyStates(prev => ({
            ...prev,
            [i]: {
              ...prev[i],
              destTop: destTop,
              destLeft: destLeft,
              type: basePath.type,
            }
          }));
          
          newPositions[i] = { 
            top: origin.top + (Math.random() - 0.5) * randomOffset,
            left: origin.left + (Math.random() - 0.5) * randomOffset,
            type: basePath.type,
            destTop: destTop,
            destLeft: destLeft,
          };
          return newPositions;
        });
      }, moveDelay);
    });
  };

  const getTextStyles = () => {
    return {
      name: {
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-heading)',
        fontWeight: '400',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        textShadow: isDark
          ? '0 0 30px rgba(167, 183, 214, 0.16), 0 0 60px rgba(167, 183, 214, 0.05)'
          : '0 0 30px rgba(8, 29, 58, 0.08)',
      },
      subtitle: {
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        fontWeight: '300',
        letterSpacing: '0.05em',
        opacity: '0.85',
      },
      description: {
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontWeight: '300',
        lineHeight: '1.7',
        letterSpacing: '0.01em',
        opacity: isDark ? '0.9' : '0.85',
      },
      tag: {
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontWeight: '300',
        fontSize: '0.7rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        opacity: '0.7',
      },
    };
  };

  const textStyles = getTextStyles();

  return (
    <section
      ref={sectionRef}
      id="home"
      className="home-section relative w-full flex items-center justify-center overflow-hidden pt-14 sm:pt-16 md:pt-20 lg:pt-24"
      style={{ 
        minHeight: 'clamp(500px, 74vh, 920px)',
        zIndex: 2,
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Background image restored */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${isDark ? '/landingDark.png' : '/landingLight.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          transform: 'scaleX(-1)',
        }}
      />

      {/*
        SEAMLESS FADE INTO ABOUT SECTION
        - Widened from 80px -> 220px so the transition has room to breathe.
        - Added extra gradient stops (25/45/65/82/100%) instead of the old
          4-stop ramp, so opacity increases gradually rather than jumping,
          which is what read as a "hard line" before.
        - Colors are unchanged (#181726 dark / #FFFCFA light) and match the
          About section's own background exactly, so the seam disappears
          rather than shifting tone.
      */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: '220px',
          background: 'linear-gradient(to bottom, transparent 0%, var(--color-background) 100%)',
        }}
      />
      
      {/* Museum-inspired ambient glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-atmosphere-soft) 0%, transparent 70%)',
        }}
      />

      {/* Accent wash overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent-soft) 0%, transparent 40%, var(--color-secondary-soft) 100%)',
        }}
      />
      
      {/* Fairy lights - dark mode only */}
      {isDark && lightPositions.map((light, index) => {
        const isScattered = scatteredLights.includes(index);
        const isResettingNow = isResetting && !isScattered;
        const isOffScreenNow = offScreenRef.current[index] || false;
        const progress = departureProgressRef.current[index] || 0;
        
        let displayTop = light.top;
        if (isScattered && light.type === 'scroll') {
          const scrollPercentage = (scrollOffset / window.innerHeight) * 100;
          displayTop = light.top + scrollPercentage;
        }
        
        if (isOffScreenNow) {
          return null;
        }
        
        const color = 'var(--color-gallery-light)';
        const glowColor = 'var(--color-accent-soft)';
        const glowIntensity = 0.6 + Math.random() * 0.3;
        
        const shouldPulse = isScattered || isResettingNow;
        const pulseDuration = '2s';
        
        let size = 2 + Math.random() * 2;
        if (isScattered || isResettingNow) {
          size = 3 + Math.random() * 2.5;
        }
        
        return (
          <div 
            key={`light-${index}`}
            className="absolute z-[25]"
            style={{
              top: `${displayTop}%`,
              left: `${light.left}%`,
              transform: 'scaleX(-1)',
              transitionProperty: isResettingNow ? 'all' : 'none',
              transitionDuration: isResettingNow ? '3s' : '0s',
              transitionTimingFunction: isResettingNow ? 'cubic-bezier(0.34, 1.2, 0.64, 1)' : 'ease',
              transitionDelay: isResettingNow ? `${index * 0.05}s` : '0s',
            }}
          >
            {!isScatteringRef.current && !isResetting && (
              <div 
                className="absolute cursor-pointer"
                style={{
                  width: '40px',
                  height: '40px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => handleLightHover(index)}
              />
            )}
            
            <div className="relative">
              <div 
                className="rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: isScattered || isResettingNow
                    ? `0 0 ${8 + glowIntensity * 8}px ${3 + glowIntensity * 3}px ${glowColor}, 0 0 ${16 + glowIntensity * 12}px ${6 + glowIntensity * 4}px ${glowColor}`
                    : `0 0 4px 2px ${glowColor}, 0 0 8px 3px rgba(255, 217, 160, 0.15)`,
                  opacity: glowIntensity,
                  animation: shouldPulse ? `pulse ${pulseDuration} ease-in-out infinite` : 'none',
                  transform: 'scale(1)',
                  transitionProperty: 'transform, box-shadow, background-color',
                  transitionDuration: '0.5s',
                  transitionTimingFunction: 'ease-out',
                }}
              />
              {isScattered && (
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '1px',
                    height: '1px',
                    backgroundColor: color,
                    opacity: 0.2,
                    transform: `translate(${-5 + Math.random() * 10}px, ${-5 + Math.random() * 10}px)`,
                    filter: 'blur(2px)',
                    animation: 'twinkle 3s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
      
      {/* Content - Centered */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center">
          
          {!isDark && (
            <div className="absolute -inset-4 sm:-inset-6 md:-inset-8 lg:-inset-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-accent-soft)] via-[var(--color-secondary-soft)] to-[var(--color-accent-soft)] rounded-2xl md:rounded-3xl blur-xl md:blur-2xl" />
          )}
          {isDark && (
            <div className="absolute -inset-4 sm:-inset-6 md:-inset-8 lg:-inset-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-accent-soft)] via-[var(--color-secondary-soft)] to-[var(--color-accent-soft)] rounded-2xl md:rounded-3xl blur-xl md:blur-2xl" />
          )}
          
          <div className="relative">
            <div 
              className="w-12 h-[2px] mx-auto mb-6 md:mb-8"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
              }}
            />
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
              style={textStyles.name}
            >
              Douaa Benhharroud
            </h1>
            
            <p 
              className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl tracking-wider"
              style={textStyles.subtitle}
            >
              AI · Data · Software · Product
            </p>
            
            <div 
              className="w-16 h-px mx-auto my-4 md:my-5"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-secondary), transparent)',
                opacity: '0.4',
              }}
            />
         

           
            
            <div className="home-cta-group mt-4 md:mt-6 lg:mt-8 xl:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
              <MuseumButton
                className="home-cta-button"
                variant="primary"
                onMouseEnter={() => setHoveredButton('primary')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Explore Projects
              </MuseumButton>
              
              <MuseumButton
                className="home-cta-button"
                variant="secondary"
                onMouseEnter={() => setHoveredButton('secondary')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Let's Build Something
              </MuseumButton>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        .home-section {
          min-height: clamp(500px, 74vh, 920px);
        }
        
        .museum-btn {
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (max-width: 640px) {
          .home-section {
            min-height: clamp(430px, 78vh, 620px);
          }

          .home-cta-group {
            width: min(100%, 320px);
            margin-left: auto;
            margin-right: auto;
            gap: 0.75rem;
          }

          .home-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================
// ABOUT SECTION
// ============================================
function AboutSection() {
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
            background: 'radial-gradient(ellipse at center, transparent 0%, var(--color-background) 100%)'
          }}
        />
      </div>

      {/*
        SEAMLESS FADE FROM HOME SECTION (new)
        - Mirrors Home's bottom fade so the seam is softened from both sides.
        - Sits above the ambient radial glows (z-[2]) but below the content
          and particles, so it never dulls the profile photo or text.
        - Uses the exact same background colors as both sections, so it's
          purely an opacity ramp, not a color shift.
      */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[2]"
        style={{
          height: '160px',
          background: 'linear-gradient(to top, transparent 0%, var(--color-background) 100%)',
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-secondary-soft) 0%, transparent 70%)'
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-atmosphere-soft) 0%, transparent 70%)'
          }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {particles.map((particle) => {
          const target = particleTargets[particle.id] || { top: particle.top, left: particle.left };
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
                backgroundColor: 'var(--color-accent)',
                opacity: particle.opacity,
                animation: `fairyFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.size * 0.8}px var(--color-accent-soft),
                     0 0 ${particle.size * 6}px ${particle.size * 1.5}px var(--color-secondary-soft)`,
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
        <div className="about-grid grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-6 lg:gap-8 xl:gap-10 items-center md:items-center min-h-[80vh] md:min-h-screen py-4 sm:py-6 md:py-8">
          
          <div
            className={`about-portrait order-1 md:order-2 flex justify-center items-center transition-all duration-1000 ease-out ${
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
              className="about-portrait-frame relative w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[320px] mx-auto"
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
                        ? 'linear-gradient(to right, var(--color-gallery-light), var(--color-accent), var(--color-gallery-light))'
                        : 'linear-gradient(to right, var(--color-primary-soft), var(--color-secondary-soft), var(--color-primary-soft))')
                      : (isLightOn
                        ? 'linear-gradient(to right, var(--color-accent-soft), var(--color-accent), var(--color-accent-soft))'
                        : 'linear-gradient(to right, var(--color-border), var(--color-border-strong), var(--color-border))'),
                    boxShadow: isLightOn ? '0 0 20px var(--color-accent-soft), 0 0 40px var(--color-secondary-soft)' : 'none',
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
                    background: isLightOn ? 'var(--color-secondary-soft)' : 'var(--color-primary-soft)',
                    border: isLightOn ? '1px solid var(--color-border)' : '1px solid var(--color-border-strong)',
                    boxShadow: isLightOn ? '0 1px 8px var(--color-secondary-soft)' : '0 1px 4px rgba(0,0,0,0.08)',
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
                    background: isLightOn ? 'var(--color-accent-soft)' : 'var(--color-border)',
                    border: isLightOn ? '1px solid var(--color-border)' : '1px solid var(--color-border-strong)',
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
                            var(--color-gallery-light-soft) 0%,
                            var(--color-accent-soft) 30%,
                            var(--color-secondary-soft) 55%,
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
                            var(--color-accent-soft) 0%,
                            var(--color-secondary-soft) 30%,
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
                            var(--color-accent-soft) 0%,
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
                            var(--color-accent-soft) 0%,
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
                        background: 'linear-gradient(to bottom, var(--color-accent-soft), transparent)',
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
                            var(--color-accent-soft) 0%,
                            var(--color-accent-soft) 30%,
                            var(--color-secondary-soft) 55%,
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
                            var(--color-accent-soft) 0%,
                            var(--color-secondary-soft) 30%,
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
                            var(--color-secondary-soft) 0%,
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
                            var(--color-accent-soft) 0%,
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
                        background: 'linear-gradient(to bottom, var(--color-accent-soft), transparent)',
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
                  background: isLightOn
                    ? 'radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%)'
                    : 'radial-gradient(circle, var(--color-border) 0%, transparent 70%)',
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

          <div
            className={`about-copy order-2 md:order-1 transition-all duration-1000 ease-out ${
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
                color: 'var(--color-text)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              About Me
            </h2>

            <p
              className="font-body text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-0.5 sm:mb-1 md:mb-1.5"
              style={{
                color: 'var(--color-accent)',
                fontFamily: 'Symphony, serif',
              }}
            >
              Building products where AI, data, and design work together.
            </p>

            <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
              <p
                className="font-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed"
                style={{
                  color: isDark ? 'rgba(243,242,239,0.85)' : 'rgba(31,44,46,0.82)',
                }}
              >
                I work across AI, data, and software engineering to turn ideas into usable digital products. My background in software engineering and data science lets me move between building models, developing applications, and thinking about how people actually use them.
              </p>
              <p
                className="font-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed"
                style={{
                  color: isDark ? 'rgba(243,242,239,0.85)' : 'rgba(31,44,46,0.82)',
                }}
              >
                I'm particularly interested in products where technology has a practical human impact — from intelligent systems to tools that make everyday processes simpler.
              </p>
            </div>

            <div className="mt-2 sm:mt-2.5 md:mt-3 lg:mt-4">
              <button
                onClick={handleDownloadCV}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 text-sm sm:text-base md:text-lg transition-all duration-300 font-medium tracking-[0.08em]"
                style={{
                  ...(isHovered ? {
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-text-inverse)',
                    border: '1px solid var(--color-secondary)',
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 24px -14px rgba(44, 79, 190, 0.45)',
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

        @media (max-width: 767px) {
          .about-grid {
            min-height: calc(100vh - 5.5rem);
            gap: 0.85rem;
            padding-top: 1rem;
            padding-bottom: 1.25rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .about-portrait {
            width: 100%;
            margin-top: 0;
            display: flex;
            justify-content: center;
          }

          .about-portrait-frame {
            width: clamp(170px, 58vw, 220px);
            max-width: 220px;
          }

          .about-copy {
            margin-top: 0;
            max-width: 34rem;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .about-copy h2 {
            font-size: clamp(1.7rem, 8vw, 2.8rem);
            line-height: 1.05;
            margin-bottom: 0.35rem;
          }

          .about-copy p {
            font-size: clamp(0.8rem, 3.4vw, 1rem);
            line-height: 1.6;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export default function HomeAndAbout() {
  return (
    <>
      <HomeSection />
      <AboutSection />
    </>
  );
}