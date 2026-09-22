# DESIGN.md

> **Direction and Identity Specification: Raditya Rai Zeeshan Portfolio**  
> antislop is a filter, not a beautifier. This document gives the design its soul: identity, personality, palette, typography, and mood.  
> Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

---

## 1. Identity & Purpose

- **Product Name:** Raditya Rai Zeeshan Personal Portfolio & Showcase
- **One-Line Value Proposition:** Interactive developer and designer showcase presenting real projects, leadership experience, creative design works, and direct communication channels.
- **Target Audience:** Potential employers, tech recruiters, collaboration partners, and digital design clients.
- **Brand Personality:** Tactile, Authentic, Disciplined, Purposeful.

---

## 2. Visual Theme & Surface

- **Theme Mode:** Soft Mint Neumorphism (Tactile Embossed Surface)
  - *Rationale:* Unites tactile physical depth with a soothing natural palette, creating a distinctive and memorable personality away from generic dark-mode templates.
- **Visual Motif:** Tactile hardware/nametag physical presence, subtle embossed and debossed inner/outer surface depth, smooth continuous curves.
- **Surface Treatment:** Dual-layer soft shadow extrusion and recessed cavities (`--shadow-neu-out` and `--shadow-neu-in`).

---

## 3. Color Palette

> **Antislop Constraint:** Cap active palette at 2-3 core colors + 1 deliberate accent (R-29). No generic AI blue-to-purple gradients (R-01).

- **Background & Canvas:** `#C6E0D2` (Soft Mint / Sage Green surface)
- **Primary Text:** `#284435` (Dark Pine Green, contrast ratio 7.62:1 against surface, WCAG AA compliant)
- **Deliberate Accent:** `#136846` (Deep Emerald, contrast ratio 4.84:1 against surface, WCAG AA compliant for normal and large text)
  - *Accent Function:* Active navigation tabs, focal CTA highlights, primary interaction indicators.
- **Highlight / Light Shadow:** `rgba(255, 255, 255, 0.9)`
- **Lowlight / Dark Shadow:** `rgba(150, 175, 161, 0.7)`

---

## 4. Typography Hierarchy

- **Display & Heading Font:** Poppins (`var(--font-poppins)`, weights: 700, 900)
- **Body & Interface Font:** Inter (`var(--font-inter)`, weights: 400, 500, 600, 700)
- **Type Scale Rhythm:**
  - Hero Display: `clamp(2.5rem, 6vw, 4.5rem)`
  - Section Title: `clamp(1.875rem, 4vw, 3rem)`
  - Card Heading: `1.25rem - 1.5rem`
  - Body Text: `1rem` (16px) with line height 1.6
  - Small Meta / Badge: `0.75rem - 0.875rem`

---

## 5. Antislop Dials (R-37)

- **ENERGY (2 - Balanced):** Confident personal identity, tactile neumorphic depth without overwhelming neon distractions.
- **RHYTHM (2 - Structured Variation):** Alternating compositions across sections (interactive lanyard showcase, project grid with pagination, scrolling tech track, timeline narrative, lightbox gallery).
- **MOTION (2 - Functional Transitions):** Purpose-driven 200-300ms transitions, drag-physics for interactive ID cards, interactive modal drawers with Escape key accessibility.

---

## 6. Layout & Sizing Rules

- **Container Max-Width:** `1280px` (`max-w-7xl`)
- **Border Radii Hierarchy (R-11):**
  - Primary interactive CTAs and Floating Dock: `rounded-full`
  - Tech tags & metadata badges: `rounded-xl` or `rounded-lg` (structured, avoiding universal pill syndrome)
  - Cards, panels, and modal containers: `rounded-3xl` and `rounded-2xl`
- **Elevation & Shadows:** Soft dual-source neumorphism, with flat/recessed treatment on internal wells.

---

## 7. Voice & Copywriting Directives

- **Tone:** Honest, humble yet competent, personal, and evidence-based (SMKN 1 Depok, Z-Project, Marching Band leadership).
- **Hard Bans:** Zero em dash characters (`—`), zero fabricated metrics, zero empty AI buzzwords (*seamless, revolutionary, cutting-edge*).
