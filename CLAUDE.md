# Hezekiah Asare — Creative Developer Portfolio (hezekiah-asare.vercel.app)

Dark, editorial portfolio. Black/charcoal backgrounds, electric lime accent (`--lime`), olive/grey/warm-white support. Original, not a template.

## Stack
React 18 + TypeScript + Vite, GSAP + ScrollTrigger, Three.js via React Three Fiber, lottie-web, lucide-react. Plain CSS files per component in `src/styles/`. No extra libraries without a reason.

## Rules
- Never invent project outcomes, metrics, testimonials, social profiles or contact details. Use `TODO` placeholders marked in `src/content/` when real details are missing.
- Projects: The Strand Brand (live), StyledByC (live), Jokel Fashion World (in development), Pistachio Café (concept / in development). Never feature Decor by Rella.
- Represent skill levels honestly; no expert claims for tools still being learned.
- Every animation needs a `prefers-reduced-motion` fallback. Use `useReducedMotion` and `useQualityTier` from `src/lib/motion.ts`. Animate transform/opacity only.
- Lazy-load the 3D scenes. Low-power devices get fewer pixels and objects.
- 3D only runs on hardware-accelerated WebGL (`detectGraphics` in `src/lib/motion.ts`); software renderers get the CSS fallback. Add `?3d=on` to the URL to force 3D when testing in headless browsers.
- Fonts are self-hosted via `@fontsource` (no Google Fonts); critical ones are preloaded by `vite.config.ts`.
- Do not deploy without explicit authorization.
- Do not claim a feature works until it has been tested.

## Commands
`npm run dev` · `npm run build` (type-check + build) · `npm run typecheck`
