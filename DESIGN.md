# DESIGN.md

> **Direction and Identity Specification: Raditya Rai Zeeshan Terminal Portfolio**
> antislop is a filter, not a beautifier. This document gives the design its soul: identity, personality, palette, typography, and mood.
> Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

---

## 1. Identity & Purpose

- **Product Name:** Raditya Rai Zeeshan Developer & AI Engineer Terminal Portfolio
- **One-Line Value Proposition:** An interactive, high-performance developer terminal interface showcasing real production projects, system capabilities, leadership experiences, and direct communication channels.
- **Target Audience:** Tech recruiters, engineering leads, open-source collaborators, and freelance clients looking for solid full-stack and AI development competence.
- **Brand Personality:** Technical, Disciplined, Interactive, Sharp, and Authentic.

---

## 2. Visual Theme & Surface

- **Theme Mode:** Modern Developer Terminal (Inspired by Ghostty, Warp, and Alacritty)
  - *Rationale:* Moves away from generic visual templates to an authentic engineer environment, while rejecting the 90-an retro AI slop (toxic neon green, scanlines, and blurry CRT filters) in favor of crisp modern developer tooling.
- **Visual Motif:** Clean macOS/Linux terminal window frame, interactive prompt badge (`guest@raditya-portfolio:~$`), structured command blocks, status bar with git branch indicator (`git:(main)`), and touch-friendly quick action pills.
- **Surface & Window Treatment:**
  - Base Viewport Background: `#0b0f17` (Deep Terminal Slate)
  - Shell / Terminal Window Body: `#111827` with clean subtle border `#1e293b`
  - Window Header Bar: `#0f172a` with three classic control buttons (close red `#ef4444`, minimize amber `#f59e0b`, expand emerald `#10b981`)
  - Elevated Popups / Modals: `#1e293b` with border `#334155`

---

## 3. Tipografi & Token CSS

### Font Utama (Sans-serif): Space Grotesk
- **CSS Token:** `--font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;`
- **Weights:** 400 (Normal), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Penggunaan:** Body text, heading penjelasan, navigasi, formulir, badge umum, tombol aksi quick-pill.

### Font Teknis (Monospace): Space Mono
- **CSS Token:** `--font-mono: "Space Mono", ui-monospace, monospace;`
- **Weights:** 400 (Normal), 700 (Bold)
- **Penggunaan:** Command prompt CLI, flag argumen, output tabel ASCII, angka metrik KPI, hash commit/ID referensi, rentang waktu, data tabular, spesifikasi teknis.

### Skala Tipografi
- Terminal Banner / Title: `clamp(1.5rem, 4vw, 2.25rem)`
- Section Command Headers: `1.125rem - 1.25rem`
- Body & Terminal Logs: `0.9375rem` (15px) dengan line height 1.6
- Prompt & Code Snippets: `0.875rem` (14px)
- Small Meta / Shortcut Badges: `0.75rem - 0.8125rem`

---

## 4. Color Palette & WCAG AA Contrast

> **Antislop Constraint:** Cap active palette at 2-3 core colors + 1 deliberate accent (R-29). No generic AI blue-to-purple gradients (R-01).

- **Canvas Background:** `#0b0f17` (Deep Obsidian Slate)
- **Terminal Shell Surface:** `#111827` (Charcoal Slate)
- **Primary Text:** `#f8fafc` (Slate 50, kontras ratio 14.8:1 terhadap canvas, WCAG AAA compliant)
- **Secondary / Muted Text:** `#94a3b8` (Slate 400, kontras ratio 5.3:1 terhadap shell, WCAG AA compliant)
- **Terminal Prompt & Success Accent:** `#10b981` (Emerald 500, kontras ratio 5.7:1, digunakan untuk prompt `guest@raditya:~$`, status online, dan hasil sukses)
- **Command & Link Accent:** `#38bdf8` (Sky Blue 400, kontras ratio 7.2:1, digunakan untuk nama command, hyperlink proyek, dan tag teknologi)
- **Warning & Parameter Accent:** `#f59e0b` (Amber 500, kontras ratio 6.9:1, digunakan untuk flag command `--help`, angka statistik penting, dan peringatan)
- **Terminal Border / Divider:** `#1e293b` (Slate 800)

---

## 5. Antislop Dials (R-37)

- **ENERGY (2 - Focused Technical):** Tampilan tajam dan berwibawa tanpa efek berlebihan yang melelahkan mata (tidak ada efek scanline CRT, tidak ada teks glitching acak, tidak ada warna hijau toxic).
- **RHYTHM (2 - Structured CLI Blocks):** Pembagian output terminal yang sangat terstruktur: ASCII banner sambutan, baris command yang bisa diperluas, grid kartu proyek terminal, dan tabel informasi terformat rapi.
- **MOTION (2 - Functional Developer Feedback):**
  - Kursor ketik berkedip stabil (*smooth blink* 800ms).
  - Eksekusi command instan tanpa artificial delay lambat.
  - Auto-scroll mulus ke command terbaru.
  - Tab auto-completion dan riwayat panah Atas/Bawah yang responsif.

---

## 6. Layout & Aksesibilitas (Dual-Affordance)

- **Desktop Experience:**
  - Jendela terminal responsif di tengah layar dengan margin nyaman.
  - Pengguna bebas mengetik perintah langsung (`help`, `about`, `projects`, `skills`, `contact`, `guestbook`, `stats`, `login`, `clear`).
  - Baris Quick Action Chips di bagian bawah untuk akses satu kali klik tanpa perlu mengetik.

- **Mobile First Experience (antislop-layoutmobile):**
  - Target sentuh minimal 44px pada seluruh Quick Action Chips dan tombol navigasi.
  - Terminal otomatis menyesuaikan lebar layar tanpa horizontal scroll overflow pada perangkat sekecil 320px.
  - Input teks mobile ramah keyboard virtual dengan auto-capitalization dimatikan (`autoCapitalize="none"`, `autoCorrect="off"`).

---

## 7. Directives & Copywriting Standards

- **Tone of Voice:** Jujur, lugas, ramah, dan berbasis bukti nyata (SMKN 1 Depok, karya produksi Z-Project, kepemimpinan Marching Band).
- **Aturan Baku (Rules-Raditya CODE):**
  - **Nol Em Dash:** Dilarang menggunakan karakter em dash di seluruh salinan teks, komentar kode, maupun dokumentasi.
  - **Nol Klaim Kosong:** Dilarang menggunakan buzzword klise AI (*cutting-edge, seamless, revolutionary, game-changer*).
  - **Rule of 300 Lines:** Setiap komponen `.tsx` dan modul `.ts` harus tetap di bawah 300 baris kode.
