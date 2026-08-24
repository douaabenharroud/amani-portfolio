"use client";

import { useState, useEffect, useRef } from "react";

export default function HomeSection() {
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

  // Store initial positions on mount
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

  // Trigger loaded state after mount with seamless animation
  useEffect(() => {
    // Disable scroll immediately
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    
    // Small delay then start the animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    // After animation completes, re-enable scroll
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
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for theme changes
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

  // Preload birds image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log('Birds image loaded successfully');
      setBirdsLoaded(true);
    };
    img.onerror = () => console.log('Birds image failed to load');
    img.src = '/birds.png';
  }, []);

  // Initialize light positions - messy natural cluster around pole
  useEffect(() => {
    if (!particlesGeneratedRef.current) {
      particlesGeneratedRef.current = true;
      setLightPositions(INITIAL_POSITIONS);
      setOriginalPositions(INITIAL_POSITIONS);
      
      // Initialize firefly states
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
      
      // Generate unique flight paths for each firefly
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

  // Function to reset fireflies to original positions with smooth animation
  const resetFireflies = () => {
    // Clear any existing timeouts
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

    // Set cooldown to prevent immediate re-scattering
    cooldownRef.current = true;
    isResettingRef.current = true;
    isScatteringRef.current = false;
    
    // Clear cooldown after 3 seconds
    cooldownTimeoutRef.current = setTimeout(() => {
      cooldownRef.current = false;
      isResettingRef.current = false;
    }, 3000);

    setIsResetting(true);
    
    // Reset to original positions with smooth transition
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
    
    // Reset departure progress and off-screen status
    departureProgressRef.current = {};
    offScreenRef.current = {};
    
    // Reset firefly states
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
    
    // Clear scattered state
    setScatteredLights([]);
    setIsScattering(false);
    setHoveredLight(null);
    setScrollOffset(0);
    
    // After a short delay, clear the reset state
    resetTimeoutRef.current = setTimeout(() => {
      setIsResetting(false);
      isResettingRef.current = false;
      resetTimeoutRef.current = null;
    }, 100);
  };

  // Check if a firefly is off-screen
  const isOffScreen = (top, left) => {
    const margin = 10;
    return top < -margin || top > 110 || left < -margin || left > 110;
  };

  // Generate bee-like wobble path for a firefly
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

  // Scroll-triggered scattering with reset when leaving section
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
      
      // RESET: If section was in view but now isn't, reset fireflies
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

  // Animation loop for bee-like movement
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

  // Function to trigger scatter effect
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

  // Handle light hover - scatter completely off-screen in various directions
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

  // Button styles matching the navbar "Contact Me" button
  const getButtonStyles = (buttonName, isPrimary = false) => {
    const isHovered = hoveredButton === buttonName;
    
    if (isPrimary) {
      return {
        backgroundColor: isHovered ? 'var(--button-primary-hover)' : 'var(--color-primary)',
        color: isHovered ? 'var(--color-text-light)' : 'var(--color-text-light)',
        border: '1px solid transparent',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 10px 20px -8px rgba(67, 32, 51, 0.35)' : 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-body)',
        fontWeight: '500',
        fontSize: '0.875rem',
        padding: '8px 20px',
        borderRadius: '9999px',
        cursor: 'pointer',
        outline: 'none',
      };
    } else {
      return {
        backgroundColor: isHovered ? 'var(--color-primary)' : 'transparent',
        color: isHovered ? 'var(--color-text-light)' : 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 10px 20px -8px rgba(67, 32, 51, 0.35)' : 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-body)',
        fontWeight: '500',
        fontSize: '0.875rem',
        padding: '8px 20px',
        borderRadius: '9999px',
        cursor: 'pointer',
        outline: 'none',
      };
    }
  };

  return (
    <>
      {/* Wrapper div that animates as one unit */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[30%] opacity-0'
        }`}
        style={{
          transitionProperty: 'transform, opacity',
          transitionDuration: '1200ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform, opacity',
        }}
      >
        <section
          ref={sectionRef}
          id="home"
          className="relative w-full flex items-center overflow-hidden pt-16 md:pt-20 lg:pt-24"
          style={{ minHeight: '70vh' }}
        >
          {/* Background image container - flipped and cropped */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${isDark ? '/landingDark.png' : '/landingLight.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              backgroundRepeat: 'no-repeat',
              transform: 'scaleX(-1)',
            }}
          ></div>
          
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
            
            // Same color for all fireflies - lighter version of the warm color
            const color = isDark ? '#FFE8E0' : '#EED4D1';
            const glowColor = isDark ? 'rgba(255, 232, 224, 0.4)' : 'rgba(238, 212, 209, 0.4)';
            const glowIntensity = 0.7 + Math.random() * 0.3;
            
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
                {/* Larger invisible hover area - only when not scattered */}
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
                
                {/* Fairy light with glow effect */}
                <div className="relative">
                  <div 
                    className="rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      boxShadow: isScattered || isResettingNow
                        ? `0 0 ${8 + glowIntensity * 8}px ${3 + glowIntensity * 3}px ${glowColor}, 0 0 ${16 + glowIntensity * 12}px ${6 + glowIntensity * 4}px ${glowColor}, 0 0 ${30 + glowIntensity * 20}px ${12 + glowIntensity * 8}px ${glowColor}`
                        : `0 0 4px 2px ${glowColor}, 0 0 8px 3px rgba(238, 212, 209, 0.15)`,
                      opacity: glowIntensity,
                      animation: shouldPulse ? `pulse ${pulseDuration} ease-in-out infinite` : 'none',
                      transform: 'scale(1)',
                      transitionProperty: 'transform, box-shadow, background-color',
                      transitionDuration: '0.5s',
                      transitionTimingFunction: 'ease-out',
                    }}
                  />
                  {/* Glow trail for scattered fireflies */}
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
          
          {/* Content - not flipped */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20">
            <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto lg:mx-0 lg:ml-[5%] xl:ml-[8%] 2xl:ml-[10%]">
              {/* Soft light effect behind text - only in light mode */}
              {!isDark && (
                <div className="absolute -inset-4 sm:-inset-6 md:-inset-8 lg:-inset-10 bg-gradient-to-r from-[#EED4D1]/30 via-[#EED4D1]/15 to-transparent rounded-2xl md:rounded-3xl blur-xl md:blur-2xl"></div>
              )}
              
              <div className="relative max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
                <h1 className={`font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold leading-tight ${isDark ? 'text-white' : 'text-[#432033]'}`}>
                  Where <span style={{ fontFamily: 'Symphony, serif' }} className="text-[#AF6384]">thoughtful</span> design meets <span style={{ fontFamily: 'Symphony, serif' }} className="text-[#AF6384]">intelligent</span> technology
                </h1>
                <p className={`font-body mt-3 md:mt-4 lg:mt-6 max-w-xl lg:max-w-2xl xl:max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ${isDark ? 'text-white/80' : 'text-[#432033]/80'}`}>
                  I design and build modern websites, AI-powered applications, and visual identities that help startups and businesses stand out. Every project combines strategy, engineering, and design to create experiences people actually enjoy using.
                </p>
                
                {/* CTA Buttons - styled like navbar Contact Me */}
                <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10 flex flex-wrap gap-3 md:gap-4">
                  <button
                    style={getButtonStyles('primary', true)}
                    onMouseEnter={() => setHoveredButton('primary')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    View Exhibition
                  </button>
                  <button
                    style={getButtonStyles('secondary', false)}
                    onMouseEnter={() => setHoveredButton('secondary')}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    Let's Build Something
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}