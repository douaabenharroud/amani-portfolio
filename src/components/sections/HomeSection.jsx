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
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);
  const initialScrollY = useRef(0);

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
    const initialPositions = [
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
    setLightPositions(initialPositions);
  }, []);

  // Scroll-triggered scattering with bottom-following effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isDark) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const windowHeight = window.innerHeight;
      
      // Check if section is in view
      const isInView = sectionTop < windowHeight && sectionBottom > 0;
      
      if (!isInView) return;
      
      const currentScrollY = window.scrollY;
      
      // If scattering has started, track scroll for bottom-bound fireflies
      if (isScattering) {
        const scrollDelta = currentScrollY - initialScrollY.current;
        setScrollOffset(scrollDelta);
      } else {
        // Trigger scatter on significant scroll
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        if (scrollDelta > 50) {
          initialScrollY.current = currentScrollY;
          triggerScatter();
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDark, isScattering]);

  // Function to trigger scatter effect
  const triggerScatter = () => {
    if (isScattering) return;
    
    setIsScattering(true);
    setScrollOffset(0);
    
    // Base destinations - bottom-bound ones will have scroll offset added
    const baseFlightPaths = [
      { top: -15, left: -10, type: 'static' },      // Off screen top-left
      { top: -20, left: 50, type: 'static' },        // Off screen top-center
      { top: -10, left: 110, type: 'static' },       // Off screen top-right
      { top: 50, left: -15, type: 'static' },        // Off screen middle-left
      { top: 50, left: 115, type: 'static' },        // Off screen middle-right
      { top: 110, left: 20, type: 'scroll' },        // Off screen bottom-left (follows scroll)
      { top: 115, left: 60, type: 'scroll' },        // Off screen bottom-center (follows scroll)
      { top: 105, left: 90, type: 'scroll' },        // Off screen bottom-right (follows scroll)
      { top: -25, left: 80, type: 'static' },        // Off screen top (high)
      { top: -8, left: 105, type: 'static' },        // Off screen right-top
      { top: 30, left: -20, type: 'static' },        // Off screen far left
      { top: 80, left: 110, type: 'scroll' },        // Off screen right-bottom (follows scroll)
    ];
    
    // Create domino effect with increasing delays
    lightPositions.forEach((light, i) => {
      const delay = i * 200; // 200ms between each light
      
      setTimeout(() => {
        setScatteredLights(prev => [...prev, i]);
        
        setLightPositions(prev => {
          const newPositions = [...prev];
          const basePath = baseFlightPaths[i];
          // For bottom-bound fireflies, the top position will be adjusted by scroll offset later
          newPositions[i] = { 
            top: basePath.top, 
            left: basePath.left,
            type: basePath.type 
          };
          return newPositions;
        });
      }, delay);
    });
  };

  // Handle light hover - scatter completely off-screen in various directions
  const handleLightHover = (index) => {
    if (isScattering) return;
    
    setIsScattering(true);
    setHoveredLight(index);
    setScrollOffset(0);
    initialScrollY.current = window.scrollY;
    
    // Base destinations - bottom-bound ones will have scroll offset added
    const baseFlightPaths = [
      { top: -15, left: -10, type: 'static' },      // Off screen top-left
      { top: -20, left: 50, type: 'static' },        // Off screen top-center
      { top: -10, left: 110, type: 'static' },       // Off screen top-right
      { top: 50, left: -15, type: 'static' },        // Off screen middle-left
      { top: 50, left: 115, type: 'static' },        // Off screen middle-right
      { top: 110, left: 20, type: 'scroll' },        // Off screen bottom-left (follows scroll)
      { top: 115, left: 60, type: 'scroll' },        // Off screen bottom-center (follows scroll)
      { top: 105, left: 90, type: 'scroll' },        // Off screen bottom-right (follows scroll)
      { top: -25, left: 80, type: 'static' },        // Off screen top (high)
      { top: -8, left: 105, type: 'static' },        // Off screen right-top
      { top: 30, left: -20, type: 'static' },        // Off screen far left
      { top: 80, left: 110, type: 'scroll' },        // Off screen right-bottom (follows scroll)
    ];
    
    // Create domino effect with increasing delays
    lightPositions.forEach((light, i) => {
      const delay = i * 200; // 200ms between each light
      
      setTimeout(() => {
        setScatteredLights(prev => [...prev, i]);
        
        setLightPositions(prev => {
          const newPositions = [...prev];
          const basePath = baseFlightPaths[i];
          newPositions[i] = { 
            top: basePath.top, 
            left: basePath.left,
            type: basePath.type 
          };
          return newPositions;
        });
      }, delay);
    });
  };

  // Bird positions scattered across the top
  const birdPositions = [
    { top: '8%', left: '5%', size: '180px' },
    { top: '5%', left: '25%', size: '150px' },
    { top: '10%', left: '50%', size: '200px' },
    { top: '7%', left: '75%', size: '160px' },
  ];

  return (
    <>
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
        
        {/* Birds scattered across the top - light mode only */}
        {!isDark && birdsLoaded && birdPositions.map((bird, index) => {
          const offsetX = (mousePosition.x - 0.5) * 100;
          const offsetY = (mousePosition.y - 0.5) * 60;
          
          return (
            <div 
              key={`bird-${index}`}
              className="absolute z-[15]"
              style={{
                top: bird.top,
                left: bird.left,
                transform: `scaleX(-1) translate(${offsetX}px, ${offsetY}px)`,
                transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <img 
                src="/birds.png" 
                alt={`Birds ${index + 1}`}
                style={{
                  width: bird.size,
                  height: 'auto',
                  opacity: 0.7,
                }}
              />
            </div>
          );
        })}
        
        {/* Fairy lights - dark mode only */}
        {isDark && lightPositions.map((light, index) => {
          const isHovered = hoveredLight === index;
          const isScattered = scatteredLights.includes(index);
          
          // Calculate actual top position with scroll offset for bottom-bound fireflies
          let displayTop = light.top;
          if (isScattered && light.type === 'scroll') {
            // Convert scroll pixels to percentage (adjust divisor based on your needs)
            const scrollPercentage = (scrollOffset / window.innerHeight) * 100;
            displayTop = light.top + scrollPercentage;
          }
          
          return (
            <div 
              key={`light-${index}`}
              className="absolute z-[25]"
              style={{
                top: `${displayTop}%`,
                left: `${light.left}%`,
                transform: 'scaleX(-1)',
                transition: isScattered && light.type === 'scroll' 
                  ? 'left 3s cubic-bezier(0.34, 0.2, 0.64, 1)' 
                  : 'all 3s cubic-bezier(0.34, 0.2, 0.64, 1)',
                transitionDelay: isScattered ? '0s' : `${index * 0.05}s`,
              }}
            >
              {/* Larger invisible hover area */}
              {!isScattered && (
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
              
              {/* Fairy light with trailing effect */}
              <div className="relative">
                <div 
                  className="rounded-full transition-all duration-1000"
                  style={{
                    width: isScattered ? `${5 + Math.random() * 2}px` : `${2 + Math.random() * 2}px`,
                    height: isScattered ? `${3 + Math.random() * 2}px` : `${2 + Math.random() * 2}px`,
                    backgroundColor: isScattered ? '#FFD700' : '#EED4D1',
                    boxShadow: isScattered 
                      ? '0 0 6px 2px rgba(255, 215, 0, 0.6), 0 0 12px 4px rgba(255, 215, 0, 0.3), 0 0 20px 8px rgba(255, 215, 0, 0.1)'
                      : '0 0 4px 2px rgba(238, 212, 209, 0.3), 0 0 8px 3px rgba(238, 212, 209, 0.1)',
                    opacity: isScattered ? 0.5 + Math.random() * 0.3 : 0.6 + Math.random() * 0.4,
                  }}
                />
                {/* Trail effect when scattered */}
                {isScattered && (
                  <div 
                    className="absolute top-0 left-0 rounded-full"
                    style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: '#FFD700',
                      opacity: 0.2,
                      transform: `translate(${-3 + Math.random() * 6}px, ${-3 + Math.random() * 6}px)`,
                      filter: 'blur(1px)',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
        
        {/* Content - not flipped */}
        <div className="relative z-10 w-full px-6 lg:px-16 py-8 md:py-12 lg:py-16">
          <div className="max-w-[90rem] mx-auto relative">
            {/* Soft light effect behind text - only in light mode */}
            {!isDark && (
              <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-r from-[#EED4D1]/50 via-[#EED4D1]/30 to-transparent rounded-3xl blur-lg"></div>
            )}
            
            <div className="relative max-w-5xl">
              <h1 className={`font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold leading-tight ${isDark ? 'text-white' : 'text-[#323C31]'}`}>
                Where <span style={{ fontFamily: 'Symphony, serif' }} className="text-[#AF6384]">thoughtful</span> design meets <span style={{ fontFamily: 'Symphony, serif' }} className="text-[#AF6384]">intelligent</span> technology
              </h1>
              <p className={`font-body mt-3 md:mt-4 lg:mt-6 max-w-xl text-sm md:text-base lg:text-lg xl:text-xl ${isDark ? 'text-white/80' : 'text-[#323C31]/80'}`}>
                I design and build modern websites, AI-powered applications, and visual identities that help startups and businesses stand out. Every project combines strategy, engineering, and design to create experiences people actually enjoy using.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-4 md:mt-6 lg:mt-8 flex flex-wrap gap-2 md:gap-3">
                <button className={`font-body px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors ${
                  isDark 
                    ? 'bg-white text-[#323C31] hover:bg-gray-200' 
                    : 'bg-[#323C31] text-white hover:bg-[#2A3329]'
                }`}>
                  View Exhibition
                </button>
                <button className={`font-body px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors ${
                  isDark 
                    ? 'border border-white text-white hover:bg-white hover:text-[#323C31]' 
                    : 'border border-[#323C31] text-[#323C31] hover:bg-[#323C31] hover:text-white'
                }`}>
                  Let's Build Something
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lace connector - three on desktop, one on mobile */}
      <div className="relative flex justify-center z-20 overflow-hidden">
        <div className="flex w-full gap-0">
          {/* Mobile: single lace */}
          <img 
            src="/lace.png" 
            alt=""
            className="block sm:hidden w-full h-auto"
            style={{
              filter: isDark ? 'brightness(0.8)' : 'none',
              transform: 'scaleX(-1)',
            }}
          />
          {/* Desktop: three laces */}
          <img 
            src="/lace.png" 
            alt=""
            className="hidden sm:block flex-1 h-auto min-w-[33.333%]"
            style={{
              filter: isDark ? 'brightness(0.8)' : 'none',
              transform: 'scaleX(-1)',
            }}
          />
          <img 
            src="/lace.png" 
            alt=""
            className="hidden sm:block flex-1 h-auto min-w-[33.333%]"
            style={{
              filter: isDark ? 'brightness(0.8)' : 'none',
              transform: 'scaleX(-1)',
            }}
          />
          <img 
            src="/lace.png" 
            alt=""
            className="hidden sm:block flex-1 h-auto min-w-[33.333%]"
            style={{
              filter: isDark ? 'brightness(0.8)' : 'none',
              transform: 'scaleX(-1)',
            }}
          />
        </div>
      </div>
    </>
  );
}