# Plan de Dependencias — joel-suarez-portfolio

Basado en el análisis del proyecto **delicius-web** (Astro 5 + React + Tailwind v4).

---

## 1. Dependencias Core

### Framework principal

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `astro` | ^5.16.6 | Framework principal (SSG) |

### Integración React (islands)

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `@astrojs/react` | ^4.4.2 | Integración oficial de React para Astro |
| `react` | ^19.2.3 | React 19 |
| `react-dom` | ^19.2.3 | React DOM |

### CSS — Tailwind v4

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `tailwindcss` | ^4.1.18 | Framework de utilidades CSS |
| `@tailwindcss/vite` | ^4.1.18 | Plugin Vite para Tailwind v4 (reemplaza PostCSS) |

> **Nota:** Tailwind v4 no requiere `tailwind.config.js` ni `postcss.config.js`. La configuración se hace directamente en CSS con `@theme {}`.

---

## 2. Dependencias para Formularios y Validación

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `react-hook-form` | ^7.71.0 | Manejo de estado de formularios |
| `@hookform/resolvers` | ^5.2.2 | Adaptadores para Yup/Zod en react-hook-form |
| `yup` | ^1.7.1 | Validación de esquemas |

---

## 3. Notificaciones / Toasts

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `notistack` | ^3.0.2 | Sistema de snackbars/toasts (funciona standalone sin MUI) |

---

## 4. DevDependencies

| Paquete | Versión ref. | Descripción |
|---|---|---|
| `prettier` | ^3.7.4 | Formateador de código |
| `prettier-plugin-astro` | ^0.14.1 | Soporte de Prettier para archivos `.astro` |

---

## 5. Configuración de Astro (`astro.config.mjs`)

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  server: { host: true },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## 6. Configuración Tailwind v4 (`src/styles/global.css`)

```css
@import "tailwindcss";

@theme {
  /* Definir tokens de diseño/marca aquí */
  --color-primary: #valor;
  --color-secondary: #valor;
}
```

---

## 7. TypeScript (`tsconfig.json`)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#*": ["./src/*"]
    }
  }
}
```

El alias `#*` permite imports como `import X from '#components/X'`.

---

## 8. Variables de Entorno (`.env`)

Los assets locales y datos sensibles se manejan vía `.env`. Astro expone al cliente solo las variables con prefijo `PUBLIC_`.

```env
# --- Datos del sitio ---
PUBLIC_SITE_NAME=
PUBLIC_SITE_TITLE=
PUBLIC_CONTACT_EMAIL=
PUBLIC_WEBSITE_URL=

# --- Assets locales (rutas relativas o URLs) ---
PUBLIC_LOGO_URL=
PUBLIC_FAVICON_URL=
PUBLIC_HERO_IMAGE_URL=
# ... más assets según necesidad

# --- API / Servicios externos ---
PUBLIC_API_URL=
PUBLIC_API_KEY=

# --- Redes sociales ---
PUBLIC_WHATSAPP_NUMBER=
```

> Los valores reales no se commitean al repositorio. Se usa un `.env.example` como referencia.

---

## 9. Estructura de Proyecto Objetivo

```
src/
├── components/       # Componentes .astro + .tsx (React islands)
├── layouts/          # Layout raíz (HTML shell, head, fonts, global CSS)
├── pages/            # Rutas del sitio
├── styles/
│   └── global.css    # Tailwind + @theme tokens
└── utils/            # Helpers (carga de fuentes, etc.)
public/               # Assets estáticos locales (imágenes, fuentes, SVGs)
docs/                 # Documentación del proyecto
```

---

## 10. Comandos de Instalación

```bash
# Crear proyecto Astro (si se parte de cero)
npm create astro@latest

# Instalar dependencias de producción
npm install @astrojs/react react react-dom react-hook-form @hookform/resolvers yup notistack tailwindcss @tailwindcss/vite

# Instalar devDependencies
npm install -D prettier prettier-plugin-astro
```

---

## 11. Lo que NO se incluye (por ahora)

- **GitHub Actions / CI-CD** — se configurará después
- **Assets remotos (CloudFront/S3)** — los assets se manejan localmente en `/public` y/o vía `.env`
- **SSR adapter** — el sitio es estático (SSG)
- **Sitemap / SEO plugins** — se pueden agregar después (`@astrojs/sitemap`)
- **Librería de iconos** — los iconos se manejan como SVGs locales
- **MDX** — las páginas de contenido son `.astro` directos
