This is a [Next.js](https://nextjs.org) portfolio project with a museum-inspired presentation.

## Design Vision

The site is meant to feel like an art museum:

- Projects are exhibited like gallery installations
- The About section presents the creator as an artist
- Typographic hierarchy and curated spacing reinforce a calm, elegant gallery experience
- Interactive details should feel thoughtful, not loud

This README captures the color system, typography choices, and the visual direction we are aiming for.

## Palette

The app uses a moody, tactile palette with soft neutrals and rich jewel tones.

### Color Tokens

- Primary: `#432033` — Eggplant
- Secondary: `#976D90` — Tulipan Violet
- Accent: `#AF6384` — Crushed Raspberry
- Highlight: `#EED4D1` — Misty Rose
- Success / Nature: `#323C31` — Deep Olive

### Neutral Tokens

- Background: `#FAF7F6`
- Surface: `#FFFFFF`
- Surface Alt: `#F4EEED`

### Text

- Text Primary: `#2E2230`
- Text Secondary: `#6F6470`
- Text Light: `#FFFFFF`

### Borders

- Border Light: `#E7DBDA`
- Border Medium: `#CDBFC6`

### Interactive

- Button Primary: `#432033`
- Button Primary Hover: `#5A2C46`
- Button Secondary: `#976D90`
- Button Secondary Hover: `#896283`
- Link: `#AF6384`
- Link Hover: `#8E4F6C`

### Status

- Success: `#323C31`
- Focus Ring: `#AF6384`

## Typography

This project uses a custom typography system to reinforce the museum feel.

### Fonts

- `Ashing` — primary heading / display font
- `Symphony` — secondary heading / accent font
- `Source Sans Pro` — body and interface text

### Notes

- `Ashing` and `Symphony` are loaded from the local `public/` directory.
- `Source Sans Pro` is loaded from Google Fonts.
- Headings, titles, and active navigation labels should use the `--font-heading` / `--font-accent` stacks.

## Implementation files

- Color tokens and design variables: `src/app/theme.css`
- Global typography and button styles: `src/app/globals.css`
- Navbar and navigation presentation: `src/components/navbar.jsx`
- Font files: `public/typogama-ahsing.otf`, `public/Symphony.otf`

## How to use the design system

Use the CSS variables directly when styling components:

```css
background-color: var(--color-primary);
color: var(--color-text-primary);
border: 1px solid var(--border-light);
```

Buttons and cards can reuse the global styles already defined in `src/app/theme.css` and `src/app/globals.css`.

## What we are aiming for

- A portfolio that feels like an exhibit catalog rather than a standard website
- A strong, polished visual identity for the artist
- A calm, gallery-like layout with curated sections and expert typography
- Projects shown as installations rather than bullet lists
- Personal storytelling in the About section, framed as an artist statement
- Flexible room for future ideas like exhibition notes, studio visits, or creative process stories

## Getting Started

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site.
