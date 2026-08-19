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
  const [lightingUpFireflies, setLightingUpFireflies] = useState({});
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
    setLightPositions(INITIAL_POSITIONS);
    setOriginalPositions(INITIAL_POSITIONS);
    
    // Initialize firefly states
    const states = {};
    const lightingUp = {};
    INITIAL_POSITIONS.forEach((_, index) => {
      states[index] = {
        isOffScreen: false,
        departureTime: 0,
        destTop: 0,
        destLeft: 0,
        type: 'static',
        isLit: false,
      };
      lightingUp[index] = false;
    });
    setFireflyStates(states);
    setLightingUpFireflies(lightingUp);
    
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
  }, []);

  // Function to reset fireflies to original positions with smooth animation
  const resetFireflies = () => {
    // Clear any existing timeouts
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Set cooldown to prevent immediate re-scattering
    cooldownRef.current = true;
    
    // Clear cooldown after 4 seconds
    cooldownTimeoutRef.current = setTimeout(() => {
      cooldownRef.current = false;
    }, 4000);

    setIsResetting(true);
    
    // Reset to original positions
    setLightPositions(INITIAL_POSITIONS);
    
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
        isLit: false,
      };
    });
    setFireflyStates(states);
    setLightingUpFireflies({});
    
    // After a short delay, clear the scattered state
    resetTimeoutRef.current = setTimeout(() => {
      setScatteredLights([]);
      setIsScattering(false);
      setHoveredLight(null);
      setScrollOffset(0);
      setIsResetting(false);
    }, 100);
  };

  // Check if a firefly is off-screen
  const isOffScreen = (top, left) => {
    // Consider off-screen if outside the viewport with some margin
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
    
    // Scale wobble based on progress (less wobble when starting)
    const progressScale = Math.min(progress * 1.5, 1);
    
    // If firefly is off-screen, gradually reduce wobble to make it fade away
    const offScreenFactor = fireflyStates[pathIndex]?.isOffScreen ? 0.5 : 1;
    
    // Create figure-8 or zigzag pattern
    const wobbleX = Math.sin(time * path.wobbleSpeed + path.phase) * path.wobbleAmplitude * progressScale * offScreenFactor;
    const wobbleY = Math.cos(time * path.wobbleSpeed * 1.3 + path.phase * 0.7) * path.wobbleAmplitude * 0.8 * progressScale * offScreenFactor;
    
    // Add some randomness
    const randomJitter = 0.3 * progressScale * offScreenFactor;
    const jitterX = (Math.sin(time * 0.1 + pathIndex) * 0.5) * randomJitter;
    const jitterY = (Math.cos(time * 0.12 + pathIndex * 1.2) * 0.5) * randomJitter;
    
    // Gentle drift in a direction (reduced when off-screen)
    const driftScale = fireflyStates[pathIndex]?.isOffScreen ? 0.2 : 1;
    const driftX = Math.sin(time * 0.005 + pathIndex) * 0.5 * driftScale;
    const driftY = Math.cos(time * 0.007 + pathIndex * 0.8) * 0.5 * driftScale;
    
    return {
      top: baseTop + wobbleY + jitterY + driftY,
      left: baseLeft + wobbleX + jitterX + driftX,
    };
  };

  // Scroll-triggered scattering with bottom-following effect
  useEffect(() => {
    const handleScroll = () => {
      // Ignore scroll during initial animation
      if (isAnimating) return;
      
      if (!sectionRef.current || !isDark) return;
      
      // Skip if in cooldown period
      if (cooldownRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const windowHeight = window.innerHeight;
      
      // Check if section is in view
      const isInView = sectionTop < windowHeight && sectionBottom > 0;
      
      // Reset fireflies when section comes back into view and is scattering
      if (isInView && isDark && isScattering) {
        resetFireflies();
        return;
      }
      
      if (!isInView) return;
      
      const currentScrollY = window.scrollY;
      
      // If scattering has started, track scroll for bottom-bound fireflies
      if (isScattering) {
        const scrollDelta = currentScrollY - initialScrollY.current;
        setScrollOffset(scrollDelta);
      } else {
        // Trigger scatter on significant scroll
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        if (scrollDelta > 80) {
          initialScrollY.current = currentScrollY;
          triggerScatter();
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDark, isScattering, isAnimating]);

  // Animation loop for bee-like movement
  useEffect(() => {
    let time = 0;
    let startTime = Date.now();
    
    const animate = () => {
      time += 1;
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (isScattering && !isResetting) {
        setLightPositions(prev => {
          return prev.map((pos, index) => {
            // Only animate scattered fireflies
            if (scatteredLights.includes(index)) {
              // Get the original position for this firefly
              const origin = originalPositions[index] || INITIAL_POSITIONS[index];
              
              // Calculate departure progress
              const departureTime = flightPaths[index]?.departureTime || 0;
              const timeSinceDeparture = Math.max(0, elapsed - departureTime);
              const progress = Math.min(timeSinceDeparture / 2, 1);
              
              // Store progress for this firefly
              departureProgressRef.current[index] = progress;
              
              // Check if firefly is off-screen
              const isOff = isOffScreen(pos.top, pos.left);
              if (isOff) {
                offScreenRef.current[index] = true;
                // Update firefly state
                setFireflyStates(prev => ({
                  ...prev,
                  [index]: {
                    ...prev[index],
                    isOffScreen: true,
                  }
                }));
              }
              
              // If firefly is off-screen, freeze it in place (don't animate further)
              if (offScreenRef.current[index]) {
                return pos;
              }
              
              // Generate wobble based on current position
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
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    if (isScattering && !isResetting) {
      animate();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScattering, isResetting, scatteredLights, originalPositions]);

  // Function to trigger scatter effect with lighting up phase
  const triggerScatter = () => {
    // Don't trigger if in cooldown
    if (cooldownRef.current) return;
    if (isScattering) return;
    
    setIsScattering(true);
    setScrollOffset(0);
    const startTime = Date.now() / 1000;
    
    // Base destinations - each firefly gets a unique destination
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
    
    // Staggered scatter with lighting up phase
    lightPositions.forEach((light, i) => {
      const lightingDelay = 100 + i * 120;
      const moveDelay = lightingDelay + 400 + Math.random() * 300;
      
      // Step 1: Light up the firefly
      setTimeout(() => {
        setLightingUpFireflies(prev => ({
          ...prev,
          [i]: true
        }));
        
        setFireflyStates(prev => ({
          ...prev,
          [i]: {
            ...prev[i],
            isLit: true,
          }
        }));
        
        // Step 2: Start movement after a delay (with a soft glow pulse)
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
                isLit: true,
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
      }, lightingDelay);
    });
  };

  // Handle light hover - scatter completely off-screen in various directions
  const handleLightHover = (index) => {
    if (cooldownRef.current) return;
    if (isScattering) return;
    
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
      const lightingDelay = 100 + i * 120;
      const moveDelay = lightingDelay + 400 + Math.random() * 300;
      
      setTimeout(() => {
        setLightingUpFireflies(prev => ({
          ...prev,
          [i]: true
        }));
        
        setFireflyStates(prev => ({
          ...prev,
          [i]: {
            ...prev[i],
            isLit: true,
          }
        }));
        
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
                isLit: true,
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
      }, lightingDelay);
    });
  };

  // Button styles matching the navbar "Contact Me" button
  const getButtonStyles = (buttonName, isPrimary = false) => {
    const isHovered = hoveredButton === buttonName;
    
    if (isPrimary) {
      // Primary button - filled background like navbar Contact Me in inactive state
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
      // Secondary button - outlined like navbar Contact Me in active state
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
            const isLightingUp = lightingUpFireflies[index] || false;
            const isLit = fireflyStates[index]?.isLit || false;
            
            let displayTop = light.top;
            if (isScattered && light.type === 'scroll') {
              const scrollPercentage = (scrollOffset / window.innerHeight) * 100;
              displayTop = light.top + scrollPercentage;
            }
            
            if (isOffScreenNow) {
              return null;
            }
            
            let glowIntensity = 0;
            let color = '#EED4D1';
            let glowColor = 'rgba(238, 212, 209, 0.3)';
            
            if (isLightingUp && !isScattered) {
              glowIntensity = 0.3 + (Math.random() * 0.3);
              color = '#FFD700';
              glowColor = `rgba(255, 215, 0, ${0.3 + Math.random() * 0.5})`;
            } else if (isScattered || isResettingNow) {
              glowIntensity = 0.6 + Math.random() * 0.4;
              color = '#FFD700';
              glowColor = `rgba(255, 215, 0, ${0.3 + Math.random() * 0.4})`;
            } else {
              glowIntensity = 0.6 + Math.random() * 0.4;
              color = '#EED4D1';
              glowColor = 'rgba(238, 212, 209, 0.3)';
            }
            
            const shouldPulse = isLightingUp || isScattered || isResettingNow;
            const pulseDuration = isLightingUp ? '1.5s' : '2s';
            
            let size = 2 + Math.random() * 2;
            if (isLightingUp && !isScattered) {
              size = 4 + Math.random() * 3;
            } else if (isScattered || isResettingNow) {
              size = 4 + Math.random() * 3;
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
                {!isScattering && !isResetting && !isLightingUp && (
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
                      boxShadow: isLightingUp || isScattered || isResettingNow
                        ? `0 0 ${8 + glowIntensity * 8}px ${3 + glowIntensity * 3}px ${glowColor}, 0 0 ${16 + glowIntensity * 12}px ${6 + glowIntensity * 4}px ${glowColor}, 0 0 ${30 + glowIntensity * 20}px ${12 + glowIntensity * 8}px ${glowColor}`
                        : '0 0 4px 2px rgba(238, 212, 209, 0.3), 0 0 8px 3px rgba(238, 212, 209, 0.1)',
                      opacity: glowIntensity,
                      animation: shouldPulse ? `pulse ${pulseDuration} ease-in-out infinite` : 'none',
                      transform: isLightingUp && !isScattered ? 'scale(1.3)' : 'scale(1)',
                      transitionProperty: 'transform, box-shadow, background-color',
                      transitionDuration: '0.5s',
                      transitionTimingFunction: 'ease-out',
                    }}
                  />
                  {/* Glow trail for scattered fireflies */}
                  {(isScattered || isLightingUp) && (
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: '1px',
                        height: '1px',
                        backgroundColor: isLightingUp ? '#FFD700' : '#FFD700',
                        opacity: isLightingUp ? 0.3 : 0.15,
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