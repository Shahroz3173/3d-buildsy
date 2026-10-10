# BUILDsy 3D Showroom Experience

A high-end, hand-drawn 3D showroom for BUILDsy (Tiles & Sanitaryware Store in Dehradun). It features a GLSL-shaded 3D entrance and corridor, paper-tearing page transitions, and smooth scrolling.

## Tech Stack
- React + TypeScript
- Vite + SWC
- Three.js + React Three Fiber + React Three Drei
- GSAP + Lenis (smooth scroll)
- Zustand (state management + cart)
- React i18next (English & Hindi support)
- React Helmet Async (SEO)

## How to Edit Content
The website is designed so you **do not need to touch the UI code to change content**.

All text, products, FAQs, categories, and site settings live in:
👉 `src/data/content.ts`

### Modifying Products
In `content.ts`, search for the `TILES` array or `SANITARY_PRODUCTS` array:
```typescript
{ 
  id: 't1', 
  name: 'Carrara White', 
  category: 'wall', 
  finish: 'Glossy', 
  size: '60×120 cm', 
  color: '#f5f5f0', // Placeholder swatch color 
  image: null,      // Replace 'null' with path to image like "'/assets/tiles/carrara.jpg'"
  price: '₹120/sqft', // Can be null to say "Contact for price"
  sku: 'BU-T001' 
}
```

## How to Edit Translations
Translations for English and Hindi are found in:
- `src/i18n/locales/en.json` (English)
- `src/i18n/locales/hi.json` (Hindi)

Add a new language by creating a new JSON file (e.g., `pa.json` for Punjabi) and registering it in `src/i18n/index.ts`.

## VisionRoom AI Visualizer Integration
The placeholder UI is ready in `src/sections/VisualizerSection.tsx`. You will need to implement the specific API calls or script embeds provided by the VisionRoom AI team where the `<!-- Integration Required -->` badge is located.

## How to Deploy (Vercel)
1. Commit all your changes to GitHub or GitLab.
2. Go to Vercel (https://vercel.com) and create a New Project.
3. Import your repository.
4. Framework Preset should auto-detect as `Vite`.
5. Click **Deploy**.

## Performance & SEO
- The 3D view is completely hidden when the user clicks "Classic View" or opens a section, allowing standard HTML to render for SEO bots.
- `react-helmet-async` injects LocalBusiness JSON-LD structure on load so Google understands the physical location and opening hours.
