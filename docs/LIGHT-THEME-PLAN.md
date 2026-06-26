# Modo claro del Cotizador — Plan / Spec

Replicar el sistema de **light theme** del iPhone Market en el cotizador, con el
mismo criterio y calidad. Referencia: `/mnt/c/Point-iPhone-Market/src`.

## Objetivo
- **Modo claro = default.** Dark = opcional (toggle en header, persiste en
  `localStorage['ep-theme']`, **nunca** por `prefers-color-scheme`).
- Sistema de tokens CSS + `@custom-variant dark` (Tailwind v4), igual que el market.
- Transición de tema = fundido suave (View Transitions API).

## Reglas de color (idénticas al market)
- `--accent` = **azul Apple `#0071e3`** en claro / **verde `#22c55e`** en oscuro
  (`--accent-hover` `#0077ed` / `#16a34a`). CTAs sólidos: `bg-accent hover:bg-accent-hover`.
- Se mantiene **verde** semántico/marca: WhatsApp (`#25D366`) y cualquier indicador de precio.
- Light: blanco / gris suave Apple, sombras suaves, texto bien legible (no clarito).
- Toggle: sol estilo iOS (círculo dorado + 8 rayos) / luna, `role="switch"`.

## Decisiones de diseño (tomadas por Nico)
1. **Hero del intro → SE TEMATIZA (claro en claro, oscuro en oscuro).** _(Cambio 26-jun:
   originalmente se iba a dejar oscuro fijo; al verlo, Nico pidió que el hero también vaya
   a claro.)_ El fondo, los textos y el fundido de la foto siguen el tema; el CTA "Cotizar
   ahora" usa `bg-accent` (azul en claro / verde en oscuro). El **VideoPlayer** de "¿Cómo
   funciona?" SÍ queda oscuro siempre (es un reproductor de video real = media).
2. **Pantalla del iPhone simulado del wizard → va a CLARO.** En modo claro la UI dentro
   del bezel se ve como "un iPhone en modo claro" (UI blanca, texto oscuro, CTAs azul
   Apple). Página + columnas laterales + bezel también claros.

### Nota de reconciliación (resuelta)
El wizard NO usa `VideoBackground` (es dead code); su fondo es un gradiente CSS → en claro
va `bg-bg`, en oscuro el gradiente. Sin conflicto.

## Estado de partida (auditoría 25-jun)
- Stack: React 19 + Vite 7 + **Tailwind v4** (idéntico al market → porta limpio).
- **No hay sistema de tema** hoy: 0 usos de `dark:`, 0 tokens.
- **22 archivos** con ~430 clases de color hardcodeadas (oscuro). Pesos: `intro-screen`
  (154) ≫ `wizard` (58) > `step-result` (40) > `selection-card` (33) > `step-5-upgrade` (30).
- `config/colors.ts` = colores de producto (iPhone), NO del tema → no se toca.

## Fases (gate al final de cada una; sin OK no se avanza ni se deploya)
- **Fase 0 — Fundación (invisible).** Portar `lib/theme.ts`, `lib/use-theme.ts`,
  `components/theme-toggle.tsx`; tokens + `::view-transition` + skeleton claro en
  `index.css`; anti-flash + `<meta theme-color>` en `index.html`. Build OK, app igual.
- **Fase 1 — Shell + chrome + montar toggle.** Header intro, nav wizard, footer, banner
  ARS/USD, columnas laterales, fondo de página.
- **Fase 2 — Intro / landing.** `intro-screen` + `price-comparator` + `locked-offer-banner`
  + `video-hero`. Hero oscuro, body a claro.
- **Fase 3 — Wizard + pantalla del iPhone + primitives.** `wizard.tsx`, 8 steps, primitives
  (`button/card/select/checkbox/option-button/progress-bar/selection-card`). Fase grande.
- **Fase 4 — Flip a light default + QA + deploy.** QA contraste/mobile en ambos modos,
  `npm test` + build, screenshots. Deploy SOLO con OK (`npx vercel --prod --yes`).

## No romper
- Fuente de datos = Panel Admin (cutover hecho). No tocar `pricing-source`, `market-api`,
  webhook CRM, ni la lógica del wizard.
- `.env` local está en `.vercelignore`; deploy por CLI, no git-auto.
