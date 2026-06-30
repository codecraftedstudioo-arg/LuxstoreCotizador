# Electronic Point · Cotizador

> Calculadora de precios de iPhone: el cliente arma su cotización paso a paso y la recibís como lead.

Wizard donde el cliente elige modelo, estado y características de su iPhone y obtiene un precio al instante (venta o Plan Canje), con sus datos enviados al CRM.

## ✨ Características
- 🧮 Cotización paso a paso (wizard guiado)
- 💵 Precios en vivo + tipo de cambio actualizado
- 🔄 Plan Canje integrado con el market
- 📱 Captura de leads al CRM
- 🌗 Modo claro / oscuro
- ⚡ Diseño responsive (mobile + desktop)

## 🛠️ Stack
- **React 19** + **TypeScript**
- **Vite 7** (build y dev server)
- **Tailwind CSS 4**
- **React Router 7**
- **Vitest** + **ESLint**

## 🚀 Puesta en marcha
Requisitos: **Node.js 20+** y **npm**.

```bash
npm install            # 1. instalar dependencias
cp .env.example .env   # 2. configurar variables (completar valores)
npm run dev            # 3. levantar dev server → http://localhost:5173
```

## 🔑 Variables de entorno
| Variable | Para qué sirve |
|---|---|
| `VITE_EXCHANGE_RATE_URL` | Tipo de cambio del dólar (Google Apps Script) |
| `VITE_MARKET_PRICES_URL` | Precios del market (Google Apps Script) — fallback |
| `VITE_PANEL_API_URL` | API del Panel Admin. Si está definida, las cotizaciones salen del panel |
| `VITE_CRM_WEBHOOK_URL` | Webhook donde se envían los leads |

> Los valores reales nunca se commitean: viven en tu `.env` local y en Vercel.

## 📜 Scripts
| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run test` | Tests unitarios |
| `npm run lint` | Linter (ESLint) |

## ☁️ Deploy
Desplegado en **Vercel**. Las variables de entorno se configuran en el dashboard de Vercel (Settings → Environment Variables).

---
© Electronic Point — Repositorio privado.
