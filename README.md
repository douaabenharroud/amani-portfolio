This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Portfolio Color System

The website palette is defined in [src/app/theme.css](src/app/theme.css) and can be used throughout the app.

### Color tokens

- Primary: `#6D5BD0`
- Secondary: `#8B7BFF`
- Highlight: `#C8B8FF`
- Dark Text: `#1F1B2E`
- Background: `#F8F7FC`
- Surface: `#FFFFFF`
- Accent Gold: `#D8B45A`

### How to use them in the design

Use the CSS variables directly in components:

```css
background-color: var(--color-primary);
color: var(--color-dark-text);
border: 1px solid var(--color-highlight);
```

You can also reuse the helper classes already added in [src/app/theme.css](src/app/theme.css):

```css
.btn-primary
.btn-secondary
.card-surface
.text-accent-gold
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
