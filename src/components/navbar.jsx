"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Skills & Tools", href: "#skills" },
  { name: "About Me", href: "#about" },
  { name: "Contact Me", href: "#contact" },
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function FourPointedStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-primary)]" fill="currentColor">
      <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" />
    </svg>
  );
}

function SignatureUnderline() {
  return (
    <svg
      viewBox="0 0 1200 300"
      className="absolute left-0 w-full h-4"
      style={{ bottom: '-8px' }}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M60 172
          C180 152 360 132 560 120
          C760 108 910 98 1038 92
          C1048 91 1055 90 1062 90
          L305 218
          C332 214 390 210 470 206
          C555 202 635 198 722 196
        "
        stroke="var(--color-primary)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  const [userClickedContact, setUserClickedContact] = useState(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Don't update active section during smooth scroll
      if (isScrolling) return;
      
      const sections = navigation.map(item => item.href.replace("#", ""));
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            // Only update isContactActive if user hasn't manually clicked it
            if (!userClickedContact || section !== "contact") {
              setIsContactActive(section === "contact");
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isScrolling, userClickedContact]);

  // Reset userClickedContact when scrolling to a different section naturally
  useEffect(() => {
    if (activeSection !== "contact") {
      setUserClickedContact(false);
    }
  }, [activeSection]);

  const isActive = (href) => {
    const section = href.replace("#", "");
    return activeSection === section;
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      // Set scrolling state to true to prevent active section updates during scroll
      setIsScrolling(true);
      
      // Immediately set active section to the clicked one
      setActiveSection(targetId);
      
      // Check if the clicked section is "contact"
      if (targetId === "contact") {
        // Toggle contact active state only if it's already active
        if (userClickedContact && isContactActive) {
          // If already active and user clicked, don't toggle - keep it active
          setIsContactActive(true);
        } else {
          // First time clicking or coming from another section
          setIsContactActive(true);
          setUserClickedContact(true);
        }
      } else {
        setIsContactActive(false);
        setUserClickedContact(false);
      }
      
      element.scrollIntoView({ behavior: "smooth" });
      
      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Re-enable scroll detection after smooth scroll completes
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800); // Slightly longer than the scroll animation
      
      window.history.pushState(null, "", href);
      closeMenu();
    }
  };

  // Check if any navigation item is active
  const isAnyNavActive = navigation.some(item => isActive(item.href));

  return (
    <header className={`sticky top-0 z-50 border-b border-[var(--color-highlight)] bg-transparent backdrop-blur-md ${geist.className}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo - Changes font when nav items are active */}
        <Link 
          href="/" 
          className="flex items-center uppercase gap-1 text-lg font-bold  tracking-wide text-[var(--color-primary)] transition hover:text-[var(--color-secondary)]" 
          style={{ 
            fontFamily: isAnyNavActive ? 'Caveat, "Comic Neue", cursive' : 'Playfair Display, serif',
            fontSize: isAnyNavActive ? '1.5rem' : '1.125rem'
          }}
        >
          <span className="relative inline-block">
            Douaa
            <span className="absolute -top-2 -right-4">
              <FourPointedStar />
            </span>
          </span>
        </Link>

        {/* Desktop Navigation - Geist */}
        <div className="hidden  md:flex flex-wrap items-center justify-end gap-4 text-sm sm:gap-6" style={{ fontWeight: 550 }}>
          {navigation.map((item) => {
            const active = isActive(item.href);
            const isContact = item.name === "Contact Me";
            
            return isContact ? (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`relative contact-button ${isContactActive ? 'contact-button-active' : 'contact-button-inactive'}`}
                style={{
                  fontFamily: 'inherit',
                }}
              >
                {item.name}
              </a>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`relative transition ${
                  active
                    ? "text-[var(--color-primary)] uppercase"
                    : "text-[var(--color-dark-text)] hover:text-[var(--color-primary)] uppercase"
                }`}
                style={{
                  fontFamily: active ? 'Caveat, "Comic Neue", cursive' : 'inherit',
                  paddingBottom: active ? '4px' : '0'
                }}
              >
                <span className={active ? 'text-l' : ''}>
                  {item.name}
                </span>
                {active && <SignatureUnderline />}
              </a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-[var(--color-dark-text)] transition hover:text-[var(--color-primary)]"
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Mobile Navigation Dropdown - Geist */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-400 ease-in-out bg-transparent backdrop-blur-md border-b border-[var(--color-highlight)] ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center py-6 px-4 gap-4" style={{ fontWeight: 550 }}>
            {navigation.map((item) => {
              const active = isActive(item.href);
              const isContact = item.name === "Contact Me";
              
              return isContact ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`relative contact-button w-full text-center ${isContactActive ? 'contact-button-active' : 'contact-button-inactive'}`}
                  style={{
                    fontFamily: 'inherit',
                  }}
                >
                  {item.name}
                </a>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`relative transition text-base w-full text-center py-2 rounded-lg ${
                    active
                      ? "text-[var(--color-primary)] bg-[var(--color-highlight)]/20"
                      : "text-[var(--color-dark-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-highlight)]/10"
                  }`}
                  style={{
                    fontFamily: active ? 'Caveat, "Comic Neue", cursive' : 'inherit',
                  }}
                >
                  <span className={active ? 'text-2xl' : ''}>
                    {item.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        /* Contact button base styles */
        .contact-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
          min-height: 40px;
          padding: 8px 20px;
          border-radius: 9999px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }
        
        /* Inactive state - gradient background */
        .contact-button-inactive {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 30%, #EC4899 60%, #F472B6 80%, #FFFFFF 100%);
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
          color: white;
          border: none;
        }
        
        /* Active state - transparent with gradient border using pseudo-element */
        .contact-button-active {
          position: relative;
          background: transparent;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-image: linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899, #F472B6, #FFFFFF);
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
        }
        
        /* Gradient border using ::before pseudo-element */
        .contact-button-active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 9999px;
          padding: 2px;
          background: linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899, #F472B6, #FFFFFF);
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }
        
        /* Hover effects */
        .contact-button-inactive:hover,
        .contact-button-active:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);
        }
        
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </header>
  );
}