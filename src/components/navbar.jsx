"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "About Me", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills & Tools", href: "#skills" },
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
        stroke="var(--color-secondary)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  const [userClickedContact, setUserClickedContact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const scrollTimeout = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = navigation.map((item) => item.href.replace("#", ""));
      const viewportMid = window.innerHeight / 2;

      // Collect each section's rect. For sticky sections, getBoundingClientRect
      // returns the *visual* position, which is what we want for nav highlighting.
      const sectionData = sections
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top, bottom: rect.bottom };
        })
        .filter(Boolean);

      // Pick the section that contains the viewport midpoint.
      // Falls back to the nearest section above the midpoint if none contain it.
      let current = sectionData.find(
        (s) => s.top <= viewportMid && s.bottom > viewportMid
      );

      if (!current) {
        // Nothing spans the midpoint (e.g. gap between sections) —
        // choose the last section whose top is above the midpoint.
        const above = sectionData
          .filter((s) => s.top <= viewportMid)
          .sort((a, b) => b.top - a.top);
        current = above[0] || sectionData[0];
      }

      if (current && current.id !== activeSection) {
        setActiveSection(current.id);
        if (!userClickedContact || current.id !== "contact") {
          setIsContactActive(current.id === "contact");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isScrolling, userClickedContact, activeSection]);

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
      setIsScrolling(true);
      setActiveSection(targetId);

      if (targetId === "contact") {
        setIsContactActive(true);
        setUserClickedContact(true);
      } else {
        setIsContactActive(false);
        setUserClickedContact(false);
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 900);

      window.history.pushState(null, "", href);
      closeMenu();
    }
  };

  const isAnyNavActive = navigation.some((item) => isActive(item.href));

  const getLinkStyles = (item) => {
    const active = isActive(item.href);
    const isContact = item.name === "Contact Me";
    const isHovered = hoveredLink === item.name;

    if (isContact) {
      const isActiveContact = isContactActive || active;
      return {
        fontFamily: isActiveContact ? 'var(--font-heading)' : "inherit",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        padding: "0.8rem 1.75rem",
        borderRadius: "9999px",
        border: "1px solid",
        borderColor: isActiveContact ? "var(--color-secondary)" : "var(--color-primary)",
        backgroundColor: isActiveContact ? "transparent" : "var(--color-primary)",
        color: isActiveContact ? "var(--color-secondary)" : "var(--color-text-inverse)",
        transition: "all 0.3s ease",
        fontWeight: "600",
        fontSize: "0.875rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        cursor: "pointer",
        outline: "none",
        whiteSpace: "nowrap",
        ...(isHovered && !isActiveContact && {
          backgroundColor: "var(--color-primary-hover)",
          borderColor: "var(--color-primary-hover)",
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-sm)",
        }),
        ...(isHovered && isActiveContact && {
          color: "var(--color-text-inverse)",
          backgroundColor: "var(--color-secondary)",
          borderColor: "var(--color-secondary)",
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-sm)",
        }),
      };
    }

    return {
      fontFamily: active ? 'var(--font-heading)' : "inherit",
      color: isHovered ? "var(--color-link)" : (active ? "var(--color-primary)" : "var(--color-text-secondary)"),
      paddingBottom: active ? "4px" : "0",
      fontWeight: active ? "600" : "400",
      fontSize: active ? "1.125rem" : "0.875rem",
      letterSpacing: "0.05em",
      cursor: "pointer",
      outline: "none",
      transition: "color 0.2s ease, transform 0.2s ease",
      ...(isHovered && {
        transform: "translateY(-1px)",
      }),
    };
  };

  const getMobileLinkStyles = (item) => {
    const active = isActive(item.href);
    const isContact = item.name === "Contact Me";
    const isHovered = hoveredLink === item.name;

    if (isContact) {
      const isActiveContact = isContactActive || active;
      return {
        fontFamily: isActiveContact ? 'var(--font-heading)' : "inherit",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        padding: "0.8rem 1.75rem",
        borderRadius: "9999px",
        border: "1px solid",
        borderColor: isActiveContact ? "var(--color-secondary)" : "var(--color-primary)",
        backgroundColor: isActiveContact ? "transparent" : "var(--color-primary)",
        color: isActiveContact ? "var(--color-secondary)" : "var(--color-text-inverse)",
        transition: "all 0.3s ease",
        fontWeight: "600",
        fontSize: "0.875rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        cursor: "pointer",
        outline: "none",
        minWidth: "120px",
        whiteSpace: "nowrap",
        ...(isHovered && !isActiveContact && {
          backgroundColor: "var(--color-primary-hover)",
          borderColor: "var(--color-primary-hover)",
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-sm)",
        }),
        ...(isHovered && isActiveContact && {
          color: "var(--color-text-inverse)",
          backgroundColor: "var(--color-secondary)",
          borderColor: "var(--color-secondary)",
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-sm)",
        }),
      };
    }

    return {
      fontFamily: active ? 'var(--font-heading)' : "inherit",
      color: isHovered ? "var(--color-link)" : (active ? "var(--color-primary)" : "var(--color-text-secondary)"),
      fontWeight: active ? "600" : "400",
      fontSize: active ? "1.5rem" : "1rem",
      letterSpacing: active ? "0.05em" : "normal",
      padding: "4px 0",
      outline: "none",
      transition: "color 0.2s ease, transform 0.2s ease",
      ...(isHovered && {
        transform: "translateX(4px)",
      }),
    };
  };

  const dropdownContent = (
    <div className="flex flex-col items-center py-8 px-4 gap-6" style={{ fontWeight: 400 }}>
      {navigation.map((item) => {
        return (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.href)}
            className="relative w-full text-center"
            style={getMobileLinkStyles(item)}
            onMouseEnter={() => setHoveredLink(item.name)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {item.name}
          </a>
        );
      })}
      
      <button
        onClick={toggleDarkMode}
        className="mt-4 p-3 rounded-full transition flex items-center gap-3"
        style={{
          color: "var(--color-text-secondary)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--border-light)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-medium)";
          e.currentTarget.style.backgroundColor = "var(--color-surface-alt)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)";
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }}
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
        <span className="text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
      </button>
    </div>
  );

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--color-background)]/80 backdrop-blur-md transition-all duration-700 ease-out"
        style={{
          opacity: isNavVisible ? 1 : 0,
          transform: isNavVisible ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center uppercase gap-1 text-lg font-bold tracking-wide transition hover:opacity-80"
            style={{
              fontFamily: isAnyNavActive ? 'var(--font-heading)' : 'var(--font-accent)',
              fontSize: isAnyNavActive ? "1.5rem" : "1.125rem",
              color: "var(--color-primary)",
              outline: "none"
            }}
          >
            <span className="relative inline-block">
              Douaa
              <span className="absolute -top-2 -right-4">
                <FourPointedStar />
              </span>
            </span>
          </Link>

          <div
            className="hidden md:flex flex-wrap items-center justify-end gap-4 text-sm sm:gap-6"
            style={{ fontWeight: 400 }}
          >
            {navigation.map((item) => {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="relative transition"
                  style={getLinkStyles(item)}
                  onMouseEnter={() => setHoveredLink(item.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span>{item.name}</span>
                  {isActive(item.href) && item.name !== "Contact Me" && <SignatureUnderline />}
                </a>
              );
            })}
            
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full transition ml-2"
              aria-label="Toggle dark mode"
              style={{
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-surface)",
                outline: "none",
                border: "1px solid var(--border-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-medium)";
                e.currentTarget.style.backgroundColor = "var(--color-surface-alt)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
                e.currentTarget.style.backgroundColor = "var(--color-surface)";
              }}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 transition"
            aria-label="Toggle menu"
            style={{
              color: "var(--color-text-secondary)",
              outline: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-link)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </header>

      {isOpen &&
        createPortal(
          <div
            className="fixed left-0 right-0 z-40 overflow-hidden bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--border-light)]"
            style={{
              top: `${headerHeight}px`,
              maxHeight: "calc(100vh - 80px)",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-10px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {dropdownContent}
          </div>,
          document.body
        )}
    </>
  );
}