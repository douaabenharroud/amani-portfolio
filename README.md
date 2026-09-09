# ◈ Portfolio · Digital Exhibition

> A Next.js portfolio designed as a contemporary art museum—where AI, design, and storytelling exist beneath soft light and warm materials.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design Vision](#2-design-vision)
3. [Experience Principles](#3-experience-principles)
4. [Information Architecture](#4-information-architecture)
5. [Visual Language](#5-visual-language)
6. [Complete Color System](#6-complete-color-system)
7. [Typography System](#7-typography-system)
8. [Spacing System](#8-spacing-system)
9. [Layout Principles](#9-layout-principles)
10. [Components](#10-components)
11. [Motion System](#11-motion-system)
12. [Responsive Strategy](#12-responsive-strategy)
13. [Accessibility](#13-accessibility)
14. [Performance Goals](#14-performance-goals)
15. [Technical Stack](#15-technical-stack)
16. [Folder Structure](#16-folder-structure)
17. [Design Tokens](#17-design-tokens)
18. [Illustration Guidelines](#18-illustration-guidelines)
19. [Content Guidelines](#19-content-guidelines)
20. [Future Features](#20-future-features)
21. [Development Guidelines](#21-development-guidelines)
22. [Deployment](#22-deployment)
23. [Credits](#23-credits)
24. [License](#24-license)

---

## 1. Project Overview

### Purpose
This is not a portfolio. It is a **digital exhibition**—a curated space that presents creative work with the same care and atmosphere as a contemporary art museum.

### Philosophy
Technology should feel invisible. The work should feel alive. The interface should feel like architecture—quiet, structural, and respectful of what it contains.

### Inspiration
- Museum galleries (light, materials, framing)
- Renaissance paintings (warmth, pigment, atmosphere)
- Natural light at golden hour
- Architectural minimalism
- Editorial print design
- AI hidden beneath craftsmanship

### Goals
- Present work as artwork, not as bullet points
- Create an immersive, calm browsing experience
- Tell a personal story through design
- Establish a timeless visual identity
- Allow the work to breathe through generous whitespace

### Target Audience
- Design studios and creative agencies
- Art directors and curators
- Technology companies looking for design-led thinkers
- Creative peers and collaborators
- Anyone who values craft over trends

---

## 2. Design Vision

Imagine walking through a contemporary art museum in the late afternoon. Sunlight streams through tall windows, warming the limestone walls. Every artwork is framed perfectly, with enough space around it to be seen without distraction. The architecture supports the art—it never competes with it.

This portfolio replicates that experience digitally.

### Museum Inspiration
- Each section behaves like a different gallery room
- Transitions feel like walking between spaces
- Colors shift subtly from room to room
- The user should feel the atmosphere rather than notice the interface

### Renaissance Influence
- Warm, aged pigments rather than flat digital colors
- Soft, directional lighting
- Depth through layering, not heavy shadows
- Craftsmanship visible in every detail

### Nature & Atmosphere
- Sky and water appear in soft, misty blues
- Sunsets introduce warm golden tones
- Natural materials replace generic UI surfaces

### Editorial Layouts
- Generous margins and whitespace
- Clear typographic hierarchy
- Framing that treats content as artwork
- Asymmetry that feels intentional, not random

### Quiet Luxury
- Restrained color palette
- Attention to spacing and rhythm
- Materials that feel tactile
- A sense that every decision was considered

---

## 3. Experience Principles

| Principle | Description |
|-----------|-------------|
| **Slow over Flashy** | Animations should feel deliberate and smooth, not rapid or jarring |
| **Calm over Busy** | Every page has room to breathe; content is never overcrowded |
| **Curated over Crowded** | Only the most important work is shown; quality over quantity |
| **Storytelling over Listing** | Projects are framed as narratives, not feature lists |
| **Timeless over Trendy** | Avoids design trends that will age poorly |

---

## 4. Information Architecture

```
Landing (Hero)
    ↓
About (Artist Statement)
    ↓
Experience (Timeline)
    ↓
Projects (Featured Work)
    ↓
Gallery (Visual Showcase)
    ↓
Skills (Capabilities)
    ↓
Creative Process (Behind the Scenes)
    ↓
Contact (Evening Gallery)
    ↓
Footer (Closing Space)
```

### Section Roles

| Section | Role |
|---------|------|
| **Hero** | First impression; sets the atmosphere |
| **About** | Personal narrative; establishes the artist |
| **Experience** | Professional credibility |
| **Projects** | Main exhibition; the work itself |
| **Gallery** | Visual immersion; additional artwork |
| **Skills** | Capabilities without ego |
| **Creative Process** | Humanizes the work; shows craft |
| **Contact** | Invitation to connect |
| **Footer** | Closing statement; leaves an impression |

---

## 5. Visual Language

### Materials
- Aged paper
- Limestone
- Warm plaster
- Polished wood
- Brushed metal

### Light
- Natural daylight
- Golden hour warmth
- Gallery spotlights
- Soft shadows
- Ambient glow

### Texture
- Subtle grain
- Canvas weave
- Paper fibers
- Architectural details

### Shapes
- Gentle curves
- Clean rectangles
- Framed rectangles
- Asymmetric layouts
- Soft edges

### Composition
- Generous whitespace
- Framed content
- Asymmetric balance
- Vertical rhythm
- Editorial columns

### Framing
- Content is treated as artwork
- Cards are frames, not boxes
- Padding creates matting
- Gallery walls surround content

---

## 6. Complete Color System

### Philosophy
The palette is built around temperature contrast rather than color contrast. Warm foundations with cool counterpoints create depth without harshness.

### Light Theme

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#F7F2EC` | Main gallery walls |
| Surface | `#FFFCFA` | Cards, artwork containers |
| Surface Alt | `#EFE6DE` | Alternate gallery rooms |
| Elevated | `#FFFDFC` | Floating panels |
| Primary | `#23213F` | Architecture, structure |
| Secondary | `#8073A8` | Creative identity |
| Accent | `#B27B95` | Human warmth |
| Atmosphere | `#8AAFB8` | Technology, AI |
| Gallery Light | `#E7D2B8` | Sunlight, glow |
| Text | `#2F2A36` | Primary copy |
| Muted | `#766F78` | Supporting text |
| Border | `#DED4CB` | Subtle definition |

### Dark Theme

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#181726` | Evening gallery walls |
| Surface | `#222132` | Cards, surfaces |
| Surface Alt | `#2C2B40` | Alternate rooms |
| Elevated | `#36354D` | Floating panels |
| Primary | `#ECE8E2` | Architecture |
| Secondary | `#BDB5D8` | Creative identity |
| Accent | `#D8A9BC` | Human warmth |
| Atmosphere | `#A7C8CF` | Technology, AI |
| Gallery Light | `#F0D6B7` | Warm illumination |
| Text | `#F4F1EC` | Primary copy |
| Muted | `#B5AFB8` | Supporting text |

### Section Backgrounds

| Section | Light | Dark |
|---------|-------|------|
| Hero | `#F7F2EC` | `#181726` |
| About | `#FFFCFA` | `#222132` |
| Experience | `#EFE6DE` | `#2C2B40` |
| Skills | `#F7F2EC` | `#181726` |
| Projects | `#EFE6DE` | `#2C2B40` |
| Gallery | `#23213F` | `#ECE8E2` |
| Contact | `#23213F` | `#181726` |
| Footer | `#111621` | `#0D0C17` |

### Shadows

```
Small:   0 8px 20px rgba(8,12,22,.08)
Medium:  0 16px 40px rgba(8,12,22,.12)
Large:   0 30px 80px rgba(8,12,22,.18)
```

### Gradients

```
Light:   #F7F2EC → #EFE6DE
Dark:    #181726 → #222132 → #2C2B40
```

---

## 7. Typography System

### Fonts

| Font | Usage | Weight |
|------|-------|--------|
| **Ashing** | Primary headings, hero | Regular |
| **Symphony** | Secondary headings | Regular |
| **Source Sans Pro** | Body, UI, captions | 300–700 |

### Hierarchy

| Element | Font | Size | Weight | Letter Spacing |
|---------|------|------|--------|----------------|
| Hero Title | Ashing | `clamp(3.5rem, 8vw, 6rem)` | Regular | -0.02em |
| Section Heading | Ashing | `clamp(2.5rem, 5vw, 4rem)` | Regular | -0.01em |
| Subheading | Symphony | `clamp(1.5rem, 2.5vw, 2.25rem)` | Regular | 0.02em |
| Project Title | Ashing | `clamp(1.5rem, 2vw, 2.5rem)` | Regular | -0.01em |
| Body | Source Sans Pro | `1.125rem` | 300 | 0.01em |
| Muted | Source Sans Pro | `0.875rem` | 300 | 0.02em |
| Caption | Source Sans Pro | `0.75rem` | 300 | 0.04em |

### Editorial Rules
- Avoid excessive bold
- Use letter spacing for elegance
- Keep line lengths between 65–75 characters
- Maintain generous leading

---

## 8. Spacing System

### Base
- 8px grid system
- `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`

### Container Widths
| Breakpoint | Max Width |
|------------|-----------|
| Small | 640px |
| Medium | 768px |
| Large | 1024px |
| XL | 1280px |
| 2XL | 1536px |

### Section Spacing
| Element | Desktop | Mobile |
|---------|---------|--------|
| Section Padding | `120px` | `60px` |
| Element Spacing | `48px` | `32px` |
| Card Spacing | `32px` | `20px` |

### Margins
- Side margins: `clamp(1.5rem, 5vw, 4rem)`
- Content width: `clamp(60ch, 70%, 80ch)`

---

## 9. Layout Principles

### Asymmetry
Used intentionally to create visual interest. Asymmetry should feel balanced—never chaotic.

### Framing
Every piece of content is framed like artwork. The frame is the boundary. The content is the art.

### Whitespace
Generous whitespace is the primary design tool. It creates hierarchy, breathing room, and museum-like calm.

### Galleries
Projects are displayed in a gallery grid. Cards are gallery frames. Hover reveals additional information.

### Reading Experience
Editorial layouts prioritize readability. Typography is centered. Leading is generous. Columns are narrow.

---

## 10. Components

### Navbar
- Transparent before scroll
- White after scroll
- Logo on left
- Navigation links on right
- Light/dark toggle in corner

### Buttons
| Type | Background | Text | Hover |
|------|------------|------|-------|
| Primary | `#23213F` | `#FFFCFA` | `#3A365A` |
| Secondary | `#8073A8` | `#FFFCFA` | `#6E6191` |
| Accent | `#B27B95` | `#FFFCFA` | `#9D6882` |
| Outline | Transparent | `#23213F` | `#F7F2EC` |

### Cards
- White surface (light mode)
- Slight shadow
- Framed with padding
- Hover lifts with shadow
- Subtle border radius (`8px`)

### Project Frame
- Full-width image
- Title below
- Categories as tags
- Hover reveals description

### Gallery
- Masonry or grid layout
- Framed thumbnails
- Lightbox on click
- Subtle transitions

### Timeline
- Vertical connectors
- Secondary color dots
- Muted metadata
- Clean typography

### Tags
- Dusty rose or lavender
- Small padding
- Rounded corners
- Semantic grouping

### Modals
- Centered
- Backdrop blur
- Smooth scale-in
- Close button top-right

### Footer
- Darkest section
- Simple navigation
- Social links
- Copyright

---

## 11. Motion System

### Philosophy
Motion should feel like walking through a museum—smooth, deliberate, and atmospheric.

### Timing
| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover | `300ms` | `ease-out` |
| Page Transition | `600ms` | `ease-in-out` |
| Scroll (Lenis) | Smooth | Auto |
| Gallery Lightbox | `400ms` | `ease-out` |
| Section Entry | `800ms` | `ease-out` |
| Parallax | Scroll-driven | Smooth |

### Easing
```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-smooth: cubic-bezier(0.23, 1, 0.32, 1);
```

### Hover States
- Brighten before saturation
- Lift through light and shadow
- Subtle scale (`1.02`) on cards

### Page Transitions
- Fade between sections
- Slight blur on content swap
- Scroll remains smooth (Lenis)

### Parallax
- Subtle background movement
- Depth through speed difference
- Never distracting

### Cursor
- Default cursor
- Hover: pointer with fade
- No custom cursor (keeps it clean)

### Micro-interactions
- Button press: slight scale
- Link: underline on hover
- Image: gentle zoom on hover
- Project: reveal description

---

## 12. Responsive Strategy

### Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | `0–640px` | Single column, compact spacing |
| Tablet | `641–1024px` | Two columns, adjusted spacing |
| Desktop | `1025–1440px` | Full gallery experience |
| Large | `1441px+` | Expanded margins, larger type |

### Museum Wall Behavior
- On large screens, content behaves like gallery walls with generous margins
- On smaller screens, content becomes a reading experience

### Frame Resizing
- Images scale with viewport
- Cards maintain aspect ratio
- Typography uses clamp()

### Typography Scaling
- Mobile: reduced font sizes
- Tablet: moderate scaling
- Desktop: full hierarchy

---

## 13. Accessibility

### Contrast
- WCAG AA minimum for all text
- Light text: `#2F2A36` on `#FFFCFA` (15:1)
- Muted text: `#766F78` on `#FFFCFA` (7:1)
- Dark text: `#F4F1EC` on `#181726` (14:1)

### Keyboard Navigation
- All interactive elements focusable
- Visible focus ring: `#8C98C9`
- Logical tab order
- Skip to content link

### Focus States
```css
:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
}
```

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables scroll animations
- Keeps fade transitions

### Semantic HTML
- Use `<main>`, `<section>`, `<article>`
- Proper heading hierarchy
- Meaningful button labels
- ARIA where needed

---

## 14. Performance Goals

### Lighthouse Targets
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Lazy Loading
- Images: Next.js Image with lazy loading
- Components: dynamic imports for below-fold
- Fonts: preload critical fonts

### Image Optimization
- WebP format
- Responsive srcset
- Quality: 80–85
- Priority: hero images

### Font Loading
- Preload `Ashing` and `Symphony`
- Font-display: `swap`
- Fallback: system fonts

### Animation Performance
- Use `transform` and `opacity`
- Avoid layout thrashing
- GPU acceleration via `will-change`
- Lenis for smooth scrolling

---

## 15. Technical Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Images | Next.js Image |
| Deployment | Vercel |

---

## 16. Folder Structure

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── theme.css
├── (sections)/
│   ├── Hero/
│   ├── About/
│   ├── Experience/
│   ├── Projects/
│   ├── Gallery/
│   ├── Skills/
│   ├── Process/
│   ├── Contact/
│   └── Footer/

components/
├── Navbar.tsx
├── Button.tsx
├── Card.tsx
├── ProjectFrame.tsx
├── Timeline.tsx
├── Gallery.tsx
├── Tags.tsx
├── Modal.tsx
├── ThemeToggle.tsx
└── Cursor.tsx

hooks/
├── useScroll.ts
├── useTheme.ts
├── useIntersection.ts
├── useParallax.ts
└── useReducedMotion.ts

lib/
├── colors.ts
├── typography.ts
├── spacing.ts
├── animations.ts
└── content.ts

styles/
├── variables.css
├── typography.css
└── animations.css

public/
├── fonts/
│   ├── Ashing.otf
│   └── Symphony.otf
├── images/
└── assets/

types/
└── index.ts
```

---

## 17. Design Tokens

### CSS Variables
```css
/* Light Theme */
:root {
  --color-bg: #F7F2EC;
  --color-surface: #FFFCFA;
  --color-surface-alt: #EFE6DE;
  --color-elevated: #FFFDFC;
  --color-primary: #23213F;
  --color-secondary: #8073A8;
  --color-accent: #B27B95;
  --color-atmosphere: #8AAFB8;
  --color-gallery-light: #E7D2B8;
  --color-text: #2F2A36;
  --color-muted: #766F78;
  --color-border: #DED4CB;
  
  --font-heading: 'Ashing', serif;
  --font-accent: 'Symphony', serif;
  --font-body: 'Source Sans Pro', sans-serif;
}
```

### Naming Conventions
- `--color-{role}`: semantic colors
- `--font-{role}`: font stacks
- `--spacing-{value}`: spacing units
- `--shadow-{size}`: elevation

---

## 18. Illustration Guidelines

### Painting Style
- Soft, atmospheric
- Warm tones
- Imperfect edges
- Aged texture

### Frames
- Simple, thin borders
- Gallery white matting
- Slight shadow

### Textures
- Subtle paper grain
- Canvas weave
- Soft vignette

### Icons
- Minimalist, outlined
- Delicate strokes
- Muted colors

### Photography
- Warm, natural light
- Soft focus on edges
- Muted saturation
- Subject-centered

### AI-Generated Artwork
- Should feel like paintings
- Avoid obvious AI artifacts
- Use warm palettes
- Frame like traditional art

---

## 19. Content Guidelines

### Writing Tone
- Warm, personal, reflective
- Avoids jargon
- Reads like an artist statement
- Inviting but refined

### Project Descriptions
- Narrative first, features second
- Describe the problem, approach, outcome
- Include personal insights
- Keep it concise

### About Section
- First-person narrative
- Share the journey
- Connect art and technology
- End with an invitation

### Titles
- Minimal and considered
- Use Ashing font
- Avoid punctuation if possible
- Let content speak

### Captions
- Muted color
- Small type
- Include context
- Below images

### Storytelling
- Every section tells part of the story
- Sequence creates narrative
- Transitions matter
- Leave room for interpretation

---

## 20. Future Features

| Feature | Description |
|---------|-------------|
| **Exhibitions** | Curated collections of projects |
| **Studio Journal** | Behind-the-scenes posts |
| **Process Notebook** | Sketches and prototypes |
| **Case Studies** | Deep dives into projects |
| **Interactive Paintings** | Playful AI experiments |
| **AI Assistant** | Gallery guide chatbot |
| **Blog** | Thoughts on design and AI |
| **Experimental Lab** | Creative tech experiments |

---

## 21. Development Guidelines

### Naming Conventions
- Components: `PascalCase`
- Files: `kebab-case`
- Functions: `camelCase`
- CSS variables: `--kebab-case`

### Component Rules
- One component per file
- Export default
- Use TypeScript interfaces
- Document with JSDoc

### Reusable Sections
- Sections are independent
- Accept children or props
- Use CSS variables for styling
- Maintain consistent spacing

### Animations
- Use Framer Motion
- Define presets in lib/
- Respect reduced motion
- Keep duration under 1s

### Color Usage
- Use CSS variables
- Never use hex directly
- Maintain WCAG contrast
- Test both themes

### Spacing
- Use spacing variables
- Follow 8px grid
- Maintain rhythm
- Test mobile

### Commit Conventions
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code change
perf: performance
test: testing
chore: maintenance
```

---

## 22. Deployment

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Environment Variables
```
NEXT_PUBLIC_SITE_URL=your-site-url
```

### Vercel Deployment
1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

---

## 23. Credits

### Fonts
- **Ashing** — Typogama
- **Symphony** — Unknown (local)
- **Source Sans Pro** — Adobe Fonts

### Libraries
- Next.js — Vercel
- Framer Motion — Framer
- Lenis — Guillaume Huard
- Tailwind CSS — Tailwind Labs

### Inspiration
- Contemporary art museums
- Renaissance paintings
- Architectural minimalism
- Editorial design

---

## 24. License

All rights reserved. This project is proprietary and confidential.

---

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site.

---
