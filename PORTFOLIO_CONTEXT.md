# PORTFOLIO CONTEXT AUDIT

> Discovery-only snapshot of the `vishvraj-portfolio` codebase and live deployment.  
> Generated for future redesign / feature work — **no code changes beyond this document**.  
> Audit date: **2026-07-23**.

---

## 0. Ground Truth Check

| Item | Value |
|---|---|
| **Repo root** | `/workspace` |
| **GitHub remote** | `https://github.com/vishvrajsolanki-dev/vishvraj-portfolio` |
| **Live deployment URL** | `https://vishvraj-portfolio.vercel.app/` |
| **Homepage field (GitHub)** | `https://vishvraj-portfolio.vercel.app` (matches live URL — no drift) |
| **Current branch (at audit start)** | `main` |
| **Working tree** | Clean — no uncommitted changes; `main` up to date with `origin/main` |
| **HEAD SHA** | `9d446c157107e48352b30ddc082fcef0590a6ab4` |
| **Live Vercel production SHA** | `9d446c157107e48352b30ddc082fcef0590a6ab4` (matches HEAD — **no local/deploy drift**) |
| **Hosting confirmed** | Vercel (`server: Vercel` response headers; `vercel[bot]` GitHub deployments) |

### Last 10 commits

| Hash | Message | Date |
|---|---|---|
| `9d446c1` | fix: remove black background from About section on mobile — restore gradient continuity | 2026-06-22 |
| `362917a` | feat: mobile responsiveness pass + JSX fixes + Skills layout alignment | 2026-06-22 |
| `69fe370` | feat: GSAP ScrollTrigger animation pass — fade-ups, stagger reveals, StatsBar count-up | 2026-06-18 |
| `a2b857c` | fix: correct WebGLErrorBoundary import path in Hero | 2026-06-18 |
| `7b2170a` | fix: navbar scroll buttons + section IDs all working | 2026-06-18 |
| `32a3c8d` | fix: section IDs — replace missing files | 2026-06-18 |
| `0a5a1c3` | fix: navbar scrollIntoView replacing hash hrefs (React Router conflict) | 2026-06-18 |
| `d59c103` | fix: add section IDs for navbar anchor links | 2026-06-18 |
| `7dac480` | feat: resume placeholder, LetterLens placeholder, Education mobile breakpoint | 2026-06-18 |
| `f3961ac` | feat: wrap Canvas in WebGLErrorBoundary (Hero + Projects) | 2026-06-18 |

Earlier foundation commits (for context): `0db8dc1` portfolio v2 complete → `2371d23` Experience → `28bfda4` About → `f34e5bd` Hero R3F + Navbar → `7f71469` Phase 0 scaffold/tokens/project data.

---

## 1. Tech Stack & Dependency Audit

### Full `package.json`

```json
{
  "name": "vishvraj-portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@react-three/drei": "^9.105.0",
    "@react-three/fiber": "^9.1.0",
    "gsap": "^3.15.0",
    "lottie-react": "^2.4.1",
    "lucide-react": "^0.383.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.17.0",
    "three": "^0.169.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "vite": "^8.0.12"
  }
}
```

### Resolved lockfile versions (`package-lock.json`)

| Package | Range in package.json | Resolved |
|---|---|---|
| `@gsap/react` | `^2.1.2` | `2.1.2` |
| `@react-three/drei` | `^9.105.0` | `9.105.0` |
| `@react-three/fiber` | `^9.1.0` | `9.1.0` |
| `gsap` | `^3.15.0` | `3.15.0` |
| `lottie-react` | `^2.4.1` | `2.4.1` |
| `lucide-react` | `^0.383.0` | `0.383.0` |
| `react` | `^19.2.6` | `19.2.7` |
| `react-dom` | `^19.2.6` | `19.2.7` |
| `react-router-dom` | `^7.17.0` | `7.17.0` |
| `three` | `^0.169.0` | `0.169.0` |
| `@eslint/js` | `^10.0.1` | `10.0.1` |
| `@types/react` | `^19.2.14` | `19.2.17` |
| `@types/react-dom` | `^19.2.3` | `19.2.3` |
| `@vitejs/plugin-react` | `^6.0.1` | `6.0.2` |
| `eslint` | `^10.3.0` | `10.5.0` |
| `eslint-plugin-react-hooks` | `^7.1.1` | `7.1.1` |
| `eslint-plugin-react-refresh` | `^0.5.2` | `0.5.2` |
| `globals` | `^17.6.0` | `17.6.0` |
| `vite` | `^8.0.12` | `8.0.16` |

### Pinned / notable dependency flags

- **`three`: `^0.169.0`** — caret-pinned to the `0.169.x` line (not floating to latest Three). **No README or code comment explains why.** Likely intentional for R3F/drei peer compatibility (`@react-three/fiber@9.1.0` / `@react-three/drei@9.105.0`).
- **`lucide-react`** and **`lottie-react`** are declared but **never imported** in any source file. Education uses a class named `lottieBox` but renders an inline SVG neural-net diagram, not Lottie.
- No exact (`"1.2.3"` without caret) pins beyond what lockfile freezes.

### Install method / peer-deps flags

- **Not referenced anywhere** (`README`, scripts, CI, `.npmrc`): no `--legacy-peer-deps`, no `.npmrc`, no custom install instructions.
- Install assumed: plain `npm install` (lockfile present).

### Node / package manager

| Item | Status |
|---|---|
| `.nvmrc` | **Absent** |
| `engines` in `package.json` | **Absent** |
| Package manager | **npm** (only `package-lock.json` present; no yarn.lock / pnpm-lock.yaml) |
| Lockfile | `package-lock.json` present |
| Environment Node (audit host) | `v22.14.0` available; npm at nvm path `v22.22.2` |

### Vite config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- **Aliases:** none
- **Plugins:** `@vitejs/plugin-react` only
- **Base path:** default (`/`)
- **Env vars:** none referenced in config or source (`import.meta.env` not used)
- **Output dir:** Vite default `dist`

### Banned / avoided libraries (from comments & structure)

| Note | Where | Why |
|---|---|---|
| Spline watermark CSS kill must live in global CSS | `src/styles/globals.css` | “Spline injects `<a>` into `<body>` outside React tree. CSS Modules `:global()` in Skills.module.css cannot reach it reliably.” |
| Hash `#href` nav avoided in favor of `scrollIntoView` | Commit `0a5a1c3` | React Router conflict with hash links |
| No Framer Motion / Zustand / Context stores found | Codebase scan | Local React state + GSAP only |
| `index.css` (Vite template light/purple tokens) is **orphaned** — not imported by `main.jsx` | `src/index.css` vs `src/main.jsx` imports `./styles/globals.css` | Dead template leftover; do not treat as active design system |

README is still the stock Vite template — **no portfolio-specific constraints documented there**.

---

## 2. Directory & File Structure

### Tree (≤3 levels, excluding `node_modules`, `dist`, `.git`)

```
/workspace
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── vishvraj_photo.PNG
│   └── logos/
│       ├── adit.png
│       ├── anthropic.png
│       ├── cems.png
│       ├── codealpha.png
│       ├── codsoft.png
│       ├── cvm.png
│       ├── gcloud.png
│       ├── iith.png
│       ├── spec.png
│       └── ssip.png
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css              ← unused Vite template CSS
    ├── assets/
    │   ├── hero.png           ← unused
    │   └── vite.svg           ← unused
    ├── components/
    │   ├── sections/
    │   │   ├── About/
    │   │   ├── Achievements/
    │   │   ├── Certifications/
    │   │   ├── Contact/
    │   │   ├── CurrentlyBuilding/
    │   │   ├── Education/
    │   │   ├── Experience/
    │   │   ├── Footer/
    │   │   ├── Hero/
    │   │   ├── Projects/
    │   │   ├── Skills/
    │   │   └── StatsBar/
    │   └── ui/
    │       ├── Navbar/
    │       └── WebGLErrorBoundary.jsx
    ├── data/
    │   └── projects.js
    ├── pages/
    │   ├── ProjectPage.jsx
    │   └── ProjectPage.module.css
    └── styles/
        └── globals.css
```

### Top-level `src/` folder purpose

| Folder / file | Purpose |
|---|---|
| `src/components/sections/` | Full-page scroll sections composing the home page |
| `src/components/ui/` | Shared chrome: Navbar + WebGL error boundary |
| `src/pages/` | Routed project detail page (`/projects/:id`) |
| `src/data/` | Project catalogue + case-study detail payloads |
| `src/styles/` | Global design tokens, resets, grain overlay, Spline watermark kill |
| `src/assets/` | Leftover Vite template assets (currently unused) |
| `src/App.jsx` | Router + `MainPage` section composition |
| `src/main.jsx` | React 19 `createRoot` entry; imports `globals.css` only |

### Routing approach

**Hybrid:**
1. **Home** = single-page scroll of stacked sections (`MainPage` in `App.jsx`), with Navbar using `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })` (not hash routes).
2. **React Router v7** `BrowserRouter` with:
   - `/` → `MainPage`
   - `/projects/:id` → `ProjectPage`

### State management

**Local component state only** (`useState` / `useRef`). No Context providers, no Zustand/Redux/Jotai. Cross-component project data is a static ES module import from `src/data/projects.js`. Shared Three.js hover color in Projects uses a module-level mutable `sharedColor` ref object.

---

## 3. Component Inventory

> Almost all section components accept **no props**. Shared usage is limited to `WebGLErrorBoundary` and the local `TiltCard` / R3F helpers.

| Name | Path | Purpose | Props | Multi-use? | TODO/FIXME/HACK |
|---|---|---|---|---|---|
| **App** | `src/App.jsx` | Routes + MainPage composition | none | N/A (root) | — |
| **MainPage** | `src/App.jsx` (local) | Stacks all home sections | none | once | — |
| **Navbar** | `src/components/ui/Navbar/Navbar.jsx` | Fixed nav, desktop links, mobile hamburger, CTA → contact | none | once (home only; ProjectPage has its own nav) | CSS comment FIX for mobile menu display |
| **WebGLErrorBoundary** | `src/components/ui/WebGLErrorBoundary.jsx` | Class boundary; silent transparent fallback on Canvas crash | `children` | **Yes** — Hero + Projects | Comment: “Silent fallback — dark box, no white screen” |
| **Hero** | `src/components/sections/Hero/Hero.jsx` | Full-viewport hero + R3F wireframe spheres | none | once | — |
| **AbstractHero** | inside Hero.jsx | R3F scene (nested spheres + torus) | none | once (Hero Canvas) | — |
| **StatsBar** | `src/components/sections/StatsBar/StatsBar.jsx` | Metric strip with GSAP count-up | none | once | — |
| **About** | `src/components/sections/About/About.jsx` | Bio, facts, skill clusters, photo | none | once | — |
| **Experience** | `src/components/sections/Experience/Experience.jsx` | Career timeline (hardcoded array) | none | once | Placeholder URL `[LETTERLENS_URL_PLACEHOLDER]` |
| **Projects** | `src/components/sections/Projects/Projects.jsx` | Featured/other project list + R3F torusKnot preview | none | once | — |
| **ProjectMesh** | inside Projects.jsx | R3F torusKnot + OrbitControls | none | once | — |
| **Skills** | `src/components/sections/Skills/Skills.jsx` | Service cards + Spline iframe + marquees | none | once | — |
| **TiltCard** | inside Skills.jsx | Mouse-tilt card wrapper | `children` | 6× within Skills only | — |
| **Education** | `src/components/sections/Education/Education.jsx` | Degree header + horizontal card track | none | once | Class name `lottieBox` is misleading (SVG, not Lottie) |
| **Certifications** | `src/components/sections/Certifications/Certifications.jsx` | Issuer cards + verify links | none | once | — |
| **Achievements** | `src/components/sections/Achievements/Achievements.jsx` | 2×2 achievement grid | none | once | — |
| **CurrentlyBuilding** | `src/components/sections/CurrentlyBuilding/CurrentlyBuilding.jsx` | Upcoming / WIP projects | none | once | — |
| **Contact** | `src/components/sections/Contact/Contact.jsx` | Contact CTA, socials, resume link | none | once | **`// TODO: Replace with real Google Drive resume link`** |
| **Footer** | `src/components/sections/Footer/Footer.jsx` | Bottom nav + socials + copyright | none | once | — |
| **ProjectPage** | `src/pages/ProjectPage.jsx` | Full case-study page for `/projects/:id` | via `useParams` (`id`) | once (route) | — |
| **ArchDiagram** | inside ProjectPage.jsx | SVG horizontal architecture flow | `layers`, `accentColor` | once (ProjectPage) | — |

**TODO/FIXME/HACK summary:**
- Only explicit `TODO`: Contact resume placeholder.
- CSS `FIX:` comments in `Navbar.module.css` (mobile menu) and `About.module.css` (photo bleed).
- No `FIXME` / `HACK` markers found.

---

## 4. Styling System

### Methodology

**Primary: CSS Modules** (one `*.module.css` per section/page) **+ global plain CSS** (`src/styles/globals.css`).

- **Not used:** Tailwind, styled-components, Emotion, Sass.
- **Orphan:** `src/index.css` — Vite template with light/purple tokens and `#root { width: 1126px }` — **not imported**; inactive.

### Design tokens (`src/styles/globals.css` `:root`)

**Colors**
- `--color-bg: #0a0810`
- `--color-bg-raised: #110e1a`
- `--color-surface: rgba(255,255,255,0.04)` / hover `0.07`
- `--color-border: rgba(255,255,255,0.08)` / hover `0.16`
- `--color-accent: #FFFFFF` (+ dim/muted variants)
- `--color-text-primary / secondary / muted`
- Per-project canvas tokens: `--canvas-lexis`, `--canvas-rupeeiq`, `--canvas-trackbot`, `--canvas-plotsense`, `--canvas-letterlens`

**Typography**
- `--font-display: 'Space Grotesk'`
- `--font-body: 'Inter'`
- `--font-mono: 'JetBrains Mono'`
- Scale: `--text-xs` … `--text-5xl`, `--text-hero` (comment: “fixed px, no vw”)

**Spacing:** `--space-xs` … `--space-4xl`  
**Radii:** `--radius-sm` … `--radius-full`  
**Motion:** easings (`--ease-out-expo`, `--ease-cinematic`, …) + durations (`--dur-fast` … `--dur-cinematic`)  
**Layout:** `--max-width: 1280px`, `--nav-height: 72px`, `--projects-left/right: 35%/65%`  
**Z-index:** `--z-base` … `--z-cursor`

Also: fixed grain SVG overlay on `body::after`; radial dark purple-black gradient background.

### Responsive breakpoints in use

| Breakpoint | Where / notes |
|---|---|
| **`max-width: 1024px`** | Navbar, About, Projects, Skills, CurrentlyBuilding; also dead `index.css` |
| **`max-width: 768px`** | globals (tablet token scale), Hero, Experience, Contact, Footer, Certifications, Education, ProjectPage, CurrentlyBuilding |
| **`max-width: 640px`** | About, Achievements, Skills, StatsBar |
| **`max-width: 480px`** | globals comment: **“Mobile ≤480px — Standardized Breakpoint”**; Hero, Experience, Projects, ProjectPage |
| **`max-width: 390px`** | globals + Hero — “iPhone 14 / 13 / SE” |
| **`(hover: none) and (pointer: coarse)`** | globals (cursor), Projects (touch interaction) |
| **`prefers-reduced-motion: reduce`** | globals |

**“Locked / do not change”:** No explicit “do not change” / “locked” wording. Closest signal is **“Standardized Breakpoint”** on **480px** in `globals.css`. Spline watermark CSS is marked as must-live-in-globals (architectural constraint, not breakpoint lock).

### Visual direction (as implemented)

**Dark editorial / cinematic portfolio** — near-black violet-tinted gradient, white accent, Space Grotesk display type, grain overlay, wireframe R3F accents, glass-adjacent translucent surfaces — not glassmorphism-heavy, not brutalist.

---

## 5. 3D / Animation Layer

### React Three Fiber

| Location | Canvas? | Scene contents | Perf notes |
|---|---|---|---|
| **Hero** | Yes — `<Canvas>` wrapped in `WebGLErrorBoundary` | `AbstractHero`: nested white wireframe `sphereGeometry` (r=2.2, 1.6), translucent metal sphere (r=0.6), thin `torusGeometry` ring; ambient + directional + point lights; continuous `useFrame` rotation | `frameloop="always"`, `dpr={1}`, `antialias: false`, `powerPreference: 'high-performance'`; camera FOV/Z adapts if `innerWidth < 768` |
| **Projects** | Yes — same boundary pattern | `ProjectMesh`: `torusKnotGeometry`, wireframe `meshStandardMaterial`, color lerps toward active project `canvasColor`; `OrbitControls` autoRotate, zoom disabled | Same Canvas gl settings as Hero |
| **Skills** | **No R3F** | Third-party **Spline** via iframe | See below |

No `.glb` / `.gltf` models in the repo. Geometries are procedural Three.js primitives only.

### Spline (iframe) vs native R3F

- **Skills** embeds:  
  `https://my.spline.design/genkubgreetingrobot-XAb0RzB8mNapbMFImFTEOVrd/`
- Mouse/touch positions forwarded via `postMessage` to the iframe.
- Dual watermark-kill CSS (modules + globals) because Spline injects links outside React.
- **Stated reason for dual approach:** not fully documented in README; code implies Spline for the greeting robot character while R3F is used for lightweight procedural hero/project accents. Footer claims “Built with React + R3F” (understates Spline/GSAP).

### GSAP inventory

All use `@gsap/react` `useGSAP` + `ScrollTrigger`, typically `start: 'top 80%'` (StatsBar `top 90%`), `once: true`.

| Section | Trigger | Targets / structure |
|---|---|---|
| **About** | scroll | Timeline: label → heading → bio `<p>` stagger → stats → clusters; photo parallel from `0.1` |
| **StatsBar** | scroll | Strip fade-up; per-stat **count-up** `gsap.to` on numeric values (1.6s, staggered delay) |
| **Experience** | scroll | Header fade; each `.entry` independent ScrollTrigger fade-up |
| **Projects** | scroll | Timeline: header → project rows stagger (x:-24) → canvas panel fade |
| **Education** | scroll | Timeline: label → topRow → cards stagger (x:40) |
| **Certifications** | scroll | Label → issuer cards stagger |
| **Achievements** | scroll | Label → cards stagger (y + slight scale) |
| **CurrentlyBuilding** | scroll | Label → heading → cards stagger |
| **Contact** | scroll | Label → heading → sub → socialRow → contact rows stagger (x:24) |
| **Skills** | *none (GSAP)* | CSS marquee animations + JS tilt on cards; Spline handles 3D |
| **Hero** | *none (GSAP)* | R3F `useFrame` continuous rotation; CSS scroll-hint |

No load-triggered GSAP timelines beyond ScrollTrigger `once`. Hover animations are CSS / manual DOM transform (TiltCard), not GSAP.

### Performance-sensitive setup

- WebGL canvases: `dpr={1}`, no antialias, high-performance preference, error boundary fallbacks.
- **No** `React.lazy` / `Suspense` for 3D or routes.
- **No** lazy-loading of Spline iframe (always mounted when Skills mounts).
- Spline is an external network dependency for Skills section interactivity.

---

## 6. Content & Data Inventory

### Content pattern

| Content type | Pattern |
|---|---|
| **Projects + case studies** | Centralized data file: `src/data/projects.js` |
| **Experience, Education, Certifications, Achievements, Skills, Contact, Stats, Currently Building, About bio** | **Hardcoded arrays / JSX strings inside each component file** |
| **No** `content.json` / CMS | — |

---

### Bio / About (verbatim)

**File:** `src/components/sections/About/About.jsx`

**Heading:**  
`Building systems` / italic `that think.`

**Paragraphs:**
> I'm Vishvrajsinh — an AI & Data Science undergraduate at ADIT, Gujarat, with an obsession for shipping things that actually work. Not notebooks. Not demos. Deployed, live, production-grade systems.

> My stack runs from PyTorch and XGBoost down to ESP32 firmware — I've built RAG pipelines, fraud detection engines on 1.29M rows, and an RFID-guided robot that earned institutional funding. The through-line is the same: data in, intelligent behaviour out.

> Currently in my second year, targeting IIT MTech via GATE DA and a senior ML role in fintech by 2033.

**About facts row:**
- `3+` — ML Internships  
- `5` — Production Apps  
- `0.9771` — Best AUC Score  
- `2029` — Graduation  

**About skill clusters:**
- ML / AI: XGBoost, PyTorch, SHAP, RAG, LLMs, Scikit-learn  
- Infra & Deploy: Streamlit, Docker, Render, ChromaDB, SQLite, GCP  
- Hardware: ESP32, C++, RFID, IMU, FreeRTOS, A*  

**Hero copy** (`Hero.jsx`):
- Tagline: `AI · Data Science · Embedded Systems`
- Name: `Vishvrajsinh` / `Solanki`
- Descriptor: `Building intelligent systems — from ML pipelines to autonomous hardware.`
- Scroll hint: `Scroll`

**StatsBar** (`StatsBar.jsx`):
- `1` — AI & Data Science Internship  
- `5` — Production Apps Deployed  
- `2` — ML Internships  
- `99%` — CNN accuracy on MNIST  
- `1` — Recognised by SSIP  

---

### Full project list (`src/data/projects.js`)

#### 1. Lexis (`id: lexis`) — Featured
- **Subtitle:** Multimodal Exam Intelligence Platform  
- **Tags:** Python, RAG, ChromaDB, Groq, Llama 3.1, spaCy, Docker, Streamlit  
- **Metric:** `78/82 QA tests passing · Deployed on Render`  
- **canvasColor:** `#7B61FF`  
- **GitHub:** `https://github.com/vishvrajsolanki-dev/lexis`  
- **Live:** `https://lexis-evx3.onrender.com`  
- **Description:** Multimodal RAG platform that ingests PDFs, images of handwritten notes, or plain text and generates flashcards, MCQs, and long-answer questions grounded in the actual uploaded material.  
- **Details (summary fields):**  
  - category: `AI/ML · Full-Stack · EdTech`  
  - duration: `2 weeks`  
  - status: `Live on Render`  
  - brief: `AI study tool — upload your notes or a PDF, and it automatically generates flashcards, MCQs, and practice questions grounded in your actual material. Built for students who want to study smarter, not spend hours making revision cards.`  
  - headline: `Full AI pipeline — OCR → chunking → RAG → LLM → ML prediction — built solo in 2 weeks.`  
  - metrics: 42→0 critical bugs; 78/82 QA; 18.4s generation; 2.1s startup; 7.8/10 UI score  
  - liveNote: `Render free tier sleeps after 15 min inactivity — first load may take 30+ seconds.`  
- **Images/assets:** none (procedural R3F color only)

#### 2. RupeeIQ (`id: rupeeiq`) — Featured
- **Subtitle:** Personal Finance Intelligence App  
- **Tags:** Python, LinearRegression, Streamlit, spaCy, scikit-learn, Plotly  
- **Metric:** `Crisis predictor · Bloomberg Terminal UI`  
- **canvasColor:** `#00C896`  
- **GitHub:** `https://github.com/vishvrajsolanki-dev/rupeeiq`  
- **Live:** `null`  
- **Description:** Finance personality profiler and crisis predictor built for Indian students with a Bloomberg-inspired terminal UI.  
- **Status:** `Local / In progress`  
- **Brief:** Personal finance app built specifically for Indian students. It tracks your spending, learns your money personality, and predicts when you might run out of cash — before it happens.

#### 3. TrackBot AGV (`id: trackbot-agv`) — Featured
- **Subtitle:** ESP32 Autonomous Guided Vehicle  
- **Tags:** ESP32-S3, C++, A* Pathfinding, PID Control, RFID, WebSocket, Python, KNN  
- **Metric:** `CVM Hackathon · SSIP Funded · ₹30,000 grant`  
- **canvasColor:** `#FF6B35`  
- **GitHub:** `https://github.com/vishvrajsolanki-dev/trackbot`  
- **Live:** `null`  
- **Description:** RFID-guided autonomous warehouse AGV with mecanum drive, A* pathfinding, multi-sensor fusion, and real-time WebSocket dashboard — built on ESP32-S3 and recognized by the SSIP Cell.  
- **Status:** `SSIP Funded · Active Development`  
- **Metrics include:** `₹30,000` SSIP grant awarded  

#### 4. PlotSense (`id: plotsense`) — not featured
- **Subtitle:** Movie Genre Classification from Plot Summaries  
- **Tags:** TF-IDF, Logistic Regression, NLTK, scikit-learn, Streamlit, NLP  
- **Metric:** `60.25% accuracy · 27 genres · 54,214 plots · Deployed`  
- **canvasColor:** `#E91E8C`  
- **GitHub:** `https://github.com/vishvrajsolanki-dev/CODSOFT/tree/main/Task_1_Movie_Genre_Classification`  
- **Live:** `https://codsoft-hgjtjwr3a4okoiqyowd8ut.streamlit.app/`  
- **Description:** NLP classifier that predicts movie genres from plot summaries using TF-IDF bigrams and Logistic Regression, deployed as a cinema-themed Streamlit app.

#### 5. LetterLens (`id: letterlens`) — not featured
- **Subtitle:** Handwritten Character Recognition  
- **Tags:** CNN, EMNIST, TensorFlow, Keras, BatchNorm, Streamlit  
- **Metric:** `99% accuracy on MNIST · 47 classes · 112K samples · Deployed`  
- **canvasColor:** `#FFB800`  
- **GitHub:** `https://github.com/vishvrajsolanki-dev/letterlens`  
- **Live:** `#` (placeholder / broken)  
- **Description:** CNN trained on EMNIST Balanced (47 classes, 112K samples) with BatchNorm + Dropout, deployed as an interactive Streamlit canvas where users draw characters for real-time inference.  
- **Status:** `Deployed on Streamlit Cloud` (but live URL is `#`)

Full architecture/highlights/challenges for each project live in `projects.js` (consumed by `ProjectPage`).

---

### Experience timeline (verbatim entries)

**File:** `src/components/sections/Experience/Experience.jsx`  
**Section label:** `02 — Experience` / title `Where I've Built`

#### 04 — SSIP Funded Project — TrackBot AGV
- **Company:** SSIP Cell · Gujarat Government  
- **Logo:** `/logos/ssip.png`  
- **Badge:** Institutionally Funded  
- **Period:** 2024 — Present  
- **Location:** ADIT, Gujarat  
- **Bullets:**
  - Deployed an RFID-guided AGV at CVM Hackathon 2026 (ESP32, PWM motor control, IR line-following, HTTP telemetry); recognized by the SSIP Cell for institutional-funded redevelopment.
  - Scaling to dual-core ESP32-S3 with mecanum drive, A* pathfinding, multi-sensor fusion (encoder odometry + RFID + MPU6050 IMU), and WebSocket dashboard with sub-50ms latency.
  - Layered an AI/ML/DS stack on the robot — logged per-run sensor telemetry (Python + SQLite); trained a KNN floor-surface classifier on IR logs replacing hardcoded thresholds; implemented path deviation analysis comparing planned A* routes vs actual encoder paths to auto-adjust grid weights.
- **Tags:** ESP32, C++, Python, SQLite, KNN, A* Pathfinding, RFID, IMU, WebSocket  
- **Links:** none

#### 03 — AI & Data Science Intern
- **Company:** IIT Hyderabad / via My Job Grow  
- **Logo:** `/logos/iith.png`  
- **Badge:** Letter of Recommendation Awarded  
- **Period:** Feb 2026 — Apr 2026  
- **Location:** India (Remote)  
- **Bullets:**
  - Engineered end-to-end AI pipelines across real-world capstone projects — supervised learning, clustering, and cloud-based model development to extract actionable business insights.
  - Developed and deployed scalable ML, deep learning, and reinforcement learning models on Google Cloud Platform, spanning data ingestion, preprocessing, training, evaluation, and production deployment.
  - Awarded Letter of Recommendation for outstanding AI competence — recognized for mastery of AI fundamentals, prompt engineering, and generative AI.
- **Tags:** Python, Pandas, scikit-learn, Google Cloud AI, Generative AI, Prompt Engineering, Deep Learning

#### 02 — Machine Learning Intern (CodSoft)
- **Logo:** `/logos/codsoft.png`  
- **Badge:** ISO 9001:2015 · MSME Registered  
- **Period:** May 2026 · Remote  
- **Bullets:** PlotSense (60.25% on 54,214 plots / 27 classes); Credit Card Fraud (XGBoost ROC-AUC 0.9771); Bank Churn (ROC-AUC 0.87 · Acc 86.45%); 4-script modular architecture deployed on Streamlit Cloud.  
- **Links:** PlotSense Live → Streamlit URL; GitHub → `https://github.com/vishvrajsolanki-dev/CODSOFT`

#### 01 — Machine Learning Intern (CodeAlpha)
- **Logo:** `/logos/codealpha.png`  
- **Badge:** MSME Registered  
- **Period:** Jun 2026 · Remote  
- **Bullets:** LetterLens; Heart Disease Predictor (RF AUC 0.9637); Credit Scoring (RF AUC 0.758); SHAP explainability; cold-start Streamlit Cloud deploys.  
- **Links:**
  - LetterLens App → **`[LETTERLENS_URL_PLACEHOLDER]`**
  - Heart Disease App → `https://codealphaheartdiseaseprediction-ypddp926uffnkst6sagsnr.streamlit.app/`
  - Credit Scoring App → `https://codealphacreditscoringmodel-vbbirvx3mupqfimvpsnk4x.streamlit.app/`

---

### Education timeline (verbatim)

**File:** `src/components/sections/Education/Education.jsx`  
**Section label:** `06 — Education`

**Institution block:**
- Degree: `B.Tech — AI & Data Science`
- School: `A D Patel Institute of Technology`
- Uni: `CVM University · Anand, Gujarat`
- Duration: `2025 — 2029`
- Logo: `/logos/adit.png`

**During College cards:**

1. **2026** — SSIP Grant — Under Review  
   Org: State Innovation & Startup Policy Cell  
   Detail: TrackBot AGV selected for state-level recognition. Funding evaluation in progress.  
   Logo: `/logos/ssip.png`

2. **June 2026** — ML Internship — CodeAlpha  
   Org: CodeAlpha · Remote  
   Detail: Built LetterLens, a CNN digit classifier on MNIST (99.52% accuracy), and a Random Forest heart disease risk predictor (AUC 0.96).  
   Logo: `/logos/codealpha.png`

3. **May 2026** — ML Internship — CodSoft  
   Org: CodSoft · Remote  
   Detail: Shipped 3 deployed ML apps — PlotSense movie genre classifier, an XGBoost fraud detector (ROC-AUC 0.98), and a bank churn predictor.  
   Logo: `/logos/codsoft.png`

4. **Feb – Apr 2026** — AI & DS Internship — My Job Grow × IIT Hyderabad  
   Org: My Job Grow · in association with IIT Hyderabad  
   Detail: Completed a 2-month hybrid AI fundamentals program — Python, prompt engineering, and generative AI — recognized as a model intern for fast grasp of concepts and consistent quality across assignments.  
   Logo: `/logos/iith.png`

5. **2026** — CVM Hackathon Finalist  
   Org: CVM University · held at ADIT  
   Detail: Represented TrackBot AGV at the university-level hackathon. Reached finals.  
   Logo: `/logos/adit.png`

6. **2025** — B.Tech AI & Data Science Began  
   Org: A D Patel Institute of Technology, CVM University  
   Detail: Started undergraduate degree in AI & Data Science. Expected graduation 2029.  
   Logo: `/logos/adit.png`

Hint text: `drag to explore →`

---

### Certifications (verbatim)

**File:** `src/components/sections/Certifications/Certifications.jsx`  
**Section label:** `08 — Certifications`

#### Anthropic Academy — 4 certs — logo `/logos/anthropic.png` (CSS invert)
| Title | Date | Verify |
|---|---|---|
| Claude 101 | Jun 2026 | `https://verify.skilljar.com/c/6szg665kh7a6` |
| Claude Code 101 | Jun 2026 | `https://verify.skilljar.com/c/vpp4pc9vvj8x` |
| Introduction to Model Context Protocol | Jun 2026 | `https://verify.skilljar.com/c/5khygb3xbu3j` |
| Model Context Protocol: Advanced Topics | Jun 2026 | `https://verify.skilljar.com/c/q99jeipycn3f` |

#### Google Cloud — 1 cert — logo `/logos/gcloud.png`
| Title | Date | Verify |
|---|---|---|
| Introduction to Large Language Models | Jun 2026 | `https://simpli-web.app.link/e/fyTnSuhRV3b` |

#### Microsoft — 1 cert — inline SVG logo (no PNG)
| Title | Date | Verify |
|---|---|---|
| Data Analyst 101 | Jun 2026 | `https://simpli-web.app.link/e/05ryeInRV3b` |

#### IIT Hyderabad × My Job Grow — 1 cert — logo `/logos/iith.png`
| Title | Date | Verify |
|---|---|---|
| AI Upskilling & Internship Completion | Apr 2026 | `https://drive.google.com/file/d/1TOmQwsgZIQgY43x3p8x_hA3RaTk6fgdr/view?usp=sharing` |

---

### Achievements (verbatim)

**File:** `src/components/sections/Achievements/Achievements.jsx`  
**Section label:** `09 — Achievements`

1. **2026** · Institutional Recognition · **SSIP — Gujarat Government**  
   Org: State Innovation & Startup Policy Cell  
   Detail: TrackBot AGV selected for state-level recognition. Grant funding under review.  
   Tags: ESP32, Embedded Systems, Robotics, IoT, SSIP Grant · Logo: `/logos/ssip.png`

2. **Mar 2026** · Hackathon · **CVM Hackathon Finalist**  
   Org: CVM University · ADIT  
   Detail: Finalist — TrackBot AGV Project  
   Tags: ESP32, PID Control, C++, Hardware, Autonomous Systems · Logo: `/logos/cvm.png`

3. **2024** · School · National Techfest · **SPEC Innovation Award**  
   Org: AIKYAM 1.0 — Sardar Patel College of Engineering  
   Detail: Innovation award at national-level techfest. Competed during school.  
   Tags: Innovation, AIKYAM, National Techfest · Logo: `/logos/spec.png`

4. **2024** · School · Competition · **2nd Place — Model Presentation**  
   Org: Chatkaro 2024 · Charotar Education Society  
   Detail: Secured 2nd place in model presentation. Competed during school.  
   Tags: Model Presentation, Charotar, Competition · Logo: `/logos/cems.png`

---

### Currently Building (verbatim)

**File:** `src/components/sections/CurrentlyBuilding/CurrentlyBuilding.jsx`  
**Section label:** `09 — Currently Building` ← **duplicate section number with Achievements**  
**Heading:** `What's Next`

1. **ARC — Adaptive Risk & Clarity Engine** — In Design — `#7B61FF`  
   Monte Carlo + ML + RAG fintech platform for Indian retail investors. Real-time risk profiling, portfolio simulation, and plain-language financial intelligence.  
   Stack: Monte Carlo, RAG, ChromaDB, FastAPI, React

2. **LetterLens v2** — In Progress — `#FFB800`  
   Upgrading from MNIST to EMNIST Balanced — 47-class handwritten character recognition with improved CNN architecture and live drawing canvas.  
   Stack: CNN, EMNIST, TensorFlow, Streamlit

3. **TrackBot AGV v2** — Active Build — `#FF6B35`  
   Upgrading from ESP32 to ESP32-S3 with mecanum drive, A* pathfinding, RFID navigation, and multi-sensor fusion. SSIP funding push in progress.  
   Stack: ESP32-S3, C++, A* Pathfinding, RFID, FreeRTOS

---

### Skills / tech stack as displayed

**File:** `src/components/sections/Skills/Skills.jsx`  
**Label:** `04 — Services & Skills` · Heading: `What I Build`

| # | Service | Skills |
|---|---|---|
| 01 | ML Engineering | Scikit-learn, XGBoost, PyTorch, TensorFlow, SHAP, Keras, Random Forest, SVM, SMOTE |
| 02 | NLP & LLM Integration | LangChain, Groq LLMs, RAG Pipelines, Llama 3.1, NLTK, TF-IDF, ChromaDB, Transformers, Prompt Engineering |
| 03 | AI App Development | Streamlit, FastAPI, Flask, Hugging Face, SpaCy, joblib, imbalanced-learn, Render, Streamlit Cloud |
| 04 | Data Analysis & Viz | Pandas, NumPy, Plotly, Seaborn, Matplotlib, Power BI, SQLite, SQL, Google Cloud |
| 05 | Embedded & IoT | Arduino, FreeRTOS, ROS2, ESP32, MicroPython, C++, Vector Embeddings, MCP Protocol |
| 06 | Creative Frontend & 3D | React, Three.js, GSAP, R3F, CSS Modules, Vite, Docker, Git, GitHub |

**Marquee rows (duplicated for infinite scroll):**
1. Python, TensorFlow, PyTorch, Scikit-learn, XGBoost, Keras, SHAP, SVM, Random Forest, SMOTE  
2. LangChain, Groq LLMs, RAG Pipelines, Llama 3.1, NLTK, TF-IDF, ChromaDB, Transformers, SpaCy, Prompt Engineering  
3. Streamlit, FastAPI, Flask, Pandas, NumPy, Plotly, Seaborn, Matplotlib, Power BI, SQLite  
4. Arduino, FreeRTOS, ROS2, ESP32, C++, React, Three.js, GSAP, R3F, Docker, Git, GitHub  

---

### Contact info / social links

**File:** `src/components/sections/Contact/Contact.jsx`  
**Label:** `11 — Contact`  
**Heading:** `Let's Build` / outline `Something.`  
**Sub:** `Open to internships, research collaborations, and interesting problems worth solving.`  
**Footer line:** `Based in Gujarat, India — Available globally`

| Label | Value | Href |
|---|---|---|
| EMAIL | vishvrajsolanki0207@gmail.com | `mailto:vishvrajsolanki0207@gmail.com` |
| LINKEDIN | vishvrajsinh-solanki | `https://linkedin.com/in/vishvrajsinh-solanki` |
| GITHUB | vishvrajsolanki-dev | `https://github.com/vishvrajsolanki-dev` |
| RESUME | Download CV | **`[RESUME_LINK_PLACEHOLDER]`** (TODO) |

**Social icon row:** GitHub, LinkedIn (same short URL), Email, Instagram `https://instagram.com/vishvrajsinh_solanki`

**Footer** (`Footer.jsx`) differs:
- Logo: `VS.dev`
- Nav: About, Experience, Projects, Skills, Contact (`/#...` hash links — may conflict with React Router; Navbar uses scrollIntoView instead)
- Socials: GitHub + LinkedIn **`https://www.linkedin.com/in/vishvrajsinh-solanki-1396ab37a/`** ← **different LinkedIn slug than Contact**
- Copy: `© 2026 Vishvrajsinh Solanki. All rights reserved.`
- Built: `Built with React + R3F`

**Navbar CTA:** `Let's Talk` → scrolls to `#contact`  
**Brand mark:** `VS` + `.dev`

---

## 7. Assets

| Path | Size (bytes) | Approx | Format | Used? |
|---|---:|---|---|---|
| `public/vishvraj_photo.PNG` | 2,734,913 | **~2.7 MB** | PNG (not webp/avif) | **Yes** — About |
| `public/favicon.svg` | 9,522 | ~9 KB | SVG | Yes — `index.html` |
| `public/icons.svg` | 5,031 | ~5 KB | SVG | **No references in src** (unused Vite leftover likely) |
| `public/logos/adit.png` | 5,779 | ~6 KB | PNG | Education |
| `public/logos/anthropic.png` | 1,487 | ~1.5 KB | PNG | Certifications |
| `public/logos/cems.png` | 8,302 | ~8 KB | PNG | Achievements |
| `public/logos/codealpha.png` | 4,091 | ~4 KB | PNG | Experience, Education |
| `public/logos/codsoft.png` | 3,059 | ~3 KB | PNG | Experience, Education |
| `public/logos/cvm.png` | 5,061 | ~5 KB | PNG | Achievements |
| `public/logos/gcloud.png` | 1,547 | ~1.5 KB | PNG | Certifications |
| `public/logos/iith.png` | 11,216 | ~11 KB | PNG | Experience, Education, Certifications |
| `public/logos/spec.png` | 7,212 | ~7 KB | PNG | Achievements |
| `public/logos/ssip.png` | 9,563 | ~9 KB | PNG | Experience, Education, Achievements |
| `src/assets/hero.png` | 13,057 | ~13 KB | PNG | **Unused** |
| `src/assets/vite.svg` | 8,709 | ~9 KB | SVG | **Unused** |

### Optimization notes

- **No WebP/AVIF** assets present.
- Largest concern: **`vishvraj_photo.PNG` at ~2.7 MB** — unoptimized for web.
- Logos are small PNGs; acceptable but not modern-format optimized.
- Microsoft cert logo is inline SVG (no file).

### Missing vs unused

- **Referenced but placeholder / invalid URLs (not filesystem):** LetterLens live (`#` and `[LETTERLENS_URL_PLACEHOLDER]`), Resume (`[RESUME_LINK_PLACEHOLDER]`).
- **Present but unused:** `src/assets/hero.png`, `src/assets/vite.svg`, `public/icons.svg`, and deps `lottie-react` / `lucide-react`.
- **No broken local image paths found** — all `/logos/*` and photo paths resolve.

---

## 8. Deployment Configuration

| Item | Value |
|---|---|
| **Hosting** | **Vercel** (confirmed via response headers + GitHub Deployments by `vercel[bot]`) |
| **Live URL** | `https://vishvraj-portfolio.vercel.app/` |
| **Repo homepage field** | Same URL — aligned |
| **Build command** | `vite build` (`npm run build`) — Vercel Vite preset default |
| **Output directory** | `dist` (Vite default) |
| **`vercel.json`** | **Absent** — no custom redirects/headers/rewrites in repo |
| **Env vars required** | **None** found in code or config |
| **SPA routing note** | `/projects/:id` needs Vercel rewrite-to-index for deep links; no `vercel.json` in repo — may rely on Vercel framework detection for Vite/SPA (verify if direct `/projects/lexis` refresh works) |
| **Deploy SHA vs local** | Production deployment SHA `9d446c1` **===** local `main` HEAD — **no drift** |
| **Node version for deploy** | Not pinned in repo (no engines / `.nvmrc`) |

---

## 9. Known Constraints & Gotchas

| Constraint | Source | Detail |
|---|---|---|
| Spline watermark CSS must be global | `globals.css` comment | Modules cannot reliably hide body-injected Spline links |
| Navbar uses `scrollIntoView`, not hash hrefs | Commit `0a5a1c3` | React Router conflict with `#` anchors |
| WebGL wrapped in error boundary | Commit `f3961ac` + Hero/Projects | Prevents white-screen Canvas crashes; silent transparent fallback |
| Canvas `dpr={1}`, `antialias: false` | Hero / Projects | Explicit perf choices |
| `three` caret-pinned to `^0.169.0` | `package.json` | No documented reason; treat as fragile with R3F/drei |
| Resume & LetterLens placeholders | Contact / Experience / projects.js + commit `7dac480` | Must not ship as real links |
| 480px called “Standardized Breakpoint” | `globals.css` | Soft lock signal |
| Typography “fixed px, no vw” | `globals.css` comment | Intentional against fluid type |
| About mobile black-bg regression | Commit `9d446c1` | Changing About mobile background can break gradient continuity |
| Footer still uses `/#section` links | `Footer.jsx` | Diverges from Navbar scroll strategy |
| Unused deps / assets | package.json + assets | Dead weight; removing is low-risk cleanup |
| Stock README | `README.md` | No install/deploy docs for this portfolio |
| No `--legacy-peer-deps` requirement found | Full scan | — |
| No banned-library list beyond Spline watermark handling | — | — |
| No IDE paste-corruption notes found | — | — |

---

## 10. Gaps & Open Questions

### Ambiguities / contradictions found

1. **SSIP funding status conflict**
   - Experience badge: “Institutionally Funded”; projects metric: “SSIP Funded · ₹30,000 grant”; TrackBot details: “SSIP grant awarded”.
   - Education + Achievements + Currently Building: “Under Review” / “funding evaluation in progress” / “funding push in progress”.
2. **Internship counts conflict**
   - About: `3+ ML Internships`
   - StatsBar: `2 ML Internships` + separately `1 AI & Data Science Internship`
3. **CNN accuracy conflict**
   - StatsBar / projects: `99%`
   - Education CodeAlpha card: `99.52%`
4. **LetterLens live URL**
   - `projects.js` → `live: '#'`
   - Experience → `[LETTERLENS_URL_PLACEHOLDER]`
   - Status text still says “Deployed on Streamlit Cloud”
5. **Section numbering gaps / duplicates**
   - Present: 01 About, 02 Experience, 03 Projects, 04 Skills, 06 Education, 08 Certs, **09 twice** (Achievements + Currently Building), 11 Contact  
   - Missing: 05, 07, 10
6. **LinkedIn URL mismatch**
   - Contact: `linkedin.com/in/vishvrajsinh-solanki`
   - Footer: `linkedin.com/in/vishvrajsinh-solanki-1396ab37a/`
7. **LetterLens v2 narrative vs current LetterLens**
   - Currently Building says “Upgrading from MNIST to EMNIST Balanced”
   - Experience / projects already describe EMNIST Balanced as shipped
8. **Fraud AUC rounding**
   - About / Experience: `0.9771`
   - Education CodSoft card: `ROC-AUC 0.98`
9. **Footer “Built with React + R3F”** omits GSAP + Spline (factual incompleteness, not necessarily wrong)
10. **`index.css` vs `globals.css`** — two design systems on disk; only globals active
11. **Vercel last-modified header (2026-07-22)** vs GitHub deployment timestamp (2026-06-22) — same SHA; likely redeploy/cache, not content drift

### Clarifying questions before changes

1. Which SSIP status is canonical — **funded/₹30k awarded** or **under review**?
2. What is the real **LetterLens Streamlit URL**?
3. What is the real **Google Drive resume URL**?
4. Which **LinkedIn** profile URL should be used site-wide?
5. Should section numbers be renumbered continuously (01–N), and is anything intentionally omitted for future sections 05/07/10?
6. Is **Inter** intentional for body (user design rules often discourage default stacks), or should display/body pairing change in a redesign?
7. Should Spline remain in Skills, or migrate that robot to native R3F / remove?
8. Is `/projects/:id` deep-link refresh confirmed working on Vercel without `vercel.json` rewrites?
9. Are unused packages (`lottie-react`, `lucide-react`) planned, or safe to remove?
10. Should project case-study content stay only in `projects.js`, or should Experience/Education/Certs also move to a shared data layer before content edits?

### Risk list (ripple-effect areas)

| Area | Why risky |
|---|---|
| **`src/styles/globals.css` tokens** | Every section consumes CSS variables; typography/spacing/breakpoint changes cascade globally |
| **480 / 768 / 1024 breakpoint set** | Many module CSS files hardcode the same breakpoints independently — easy to desync |
| **`three` / R3F / drei versions** | Peer-sensitive; bumping Three can break Fiber/Drei; Hero + Projects both depend on WebGL |
| **`WebGLErrorBoundary`** | Shared crash path for both Canvases |
| **Navbar scroll IDs** | Section `id`s must match Navbar `href` keys; past commits show this broke repeatedly |
| **React Router + Footer hash links** | Changing routing strategy can reintroduce the hash conflict |
| **`projects.js`** | Shared by Projects list + ProjectPage case studies — schema changes affect both |
| **Spline iframe + watermark CSS** | External dependency; watermark kill relies on global CSS selectors |
| **GSAP ScrollTrigger registrations** | Multiple sections independently `registerPlugin`; layout shifts can break trigger positions |
| **About photo + mobile CSS** | Recent regression around black background / gradient continuity |
| **Hardcoded duplicated content** | Same facts live in About, StatsBar, Experience, Education, Achievements — content edits must be multi-file or will diverge further |

---

*End of discovery document. No redesign or feature proposals included per request.*
