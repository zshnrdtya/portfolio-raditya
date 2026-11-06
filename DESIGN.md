# DESIGN.md — Portofolio Web V2 (3D Spatial Minimalist)

> **Dokumen Panduan Desain Resmi (Design Direction)**  
> Mengikuti standar **Rules-Raditya CODE / Antislop (Mode DURING)**. Dokumen ini menjadi pedoman visual tunggal untuk seluruh implementasi UI, komponen 3D, tipografi, dan palet warna di branch `main-two`.

---

## 1. Identitas & Kepribadian (Identity & Personality)

- **Subjek:** Raditya Rai Zeeshan (17 Tahun) — Fullstack Web Developer, Founder of Z - Project, Asisten Pelatih Marching Band.
- **Karakter Visual:** *Spatial, Precise, Tactile, Modern Minimalist*.
- **Intensi:** Menghadirkan web portofolio yang memadukan rekayasa perangkat lunak modern dengan kedalaman visual 3D yang elegan. Bukan sekadar template generik atau pameran animasi berat, melainkan pengalaman antarmuka yang interaktif, taktil, dan berorientasi pada konten nyata.

---

## 2. Pengaturan Dials (Anti-Slop R-37)

| Dial | Level (1–3) | Penjelasan Implementasi |
|---|:---:|---|
| **ENERGY** | **2** | Tenang namun hidup (*controlled & purposeful*). Tidak datar membosankan (Level 1), dan tidak berisik penuh neon/partikel kacau (Level 3). Partikel 3D bergerak halus merespons kursor. |
| **RHYTHM** | **2** | Struktur memiliki variasi fungsi yang jelas. Hero berorientasi spatial canvas, metrik berorientasi grid presisi, dan showcase proyek menggunakan kartu perspektif 3D interaktif. |
| **MOTION** | **2** | Pergerakan fisika halus terinspirasi ekosistem *react-bits* (kemiringan 3D kartu saat disentuh kursor, teks terdekripsi terminal, tombol magnetik). Seluruh gerakan wajib memiliki fallback instan untuk pengguna `prefers-reduced-motion`. |

---

## 3. Sistem Palet Warna & Kalibrasi Kontras WCAG AA

Sesuai aturan `antislop-ui` (R-29), palet dibatasi ketat: 2 warna netral dasar + 1 aksen fungsional terkalibrasi. Tidak ada gradasi ungu-biru klise atau pencahayaan berlebihan di seluruh elemen.

### Tabel Token Warna
- **Latar Belakang Dasar (Base Void):** `#08090C` (Hitam obsidian pekat)
- **Permukaan Kartu / Surface:** `#11141B` (Slate gelap matte)
- **Border Subtil (Struktur):** `#1E2433`
- **Border Hover / Interaktif:** `#2E384D`
- **Warna Aksen Tunggal (Cyber Emerald):** `#00F59B` (Aksen hidup terkalibrasi)
- **Teks Utama (Primary):** `#F1F5F9`
- **Teks Sekunder (Muted):** `#94A3B8`
- **Teks Tersier / Subtle:** `#64748B`

### Hasil Uji Kontras Resmi (`contrast-check.py`)
| Pasangan Warna | Rasio Terukur | Standar WCAG AA Normal (4.5:1) | Status |
|---|:---:|:---:|:---:|
| `#F1F5F9` (Teks Utama) di atas `#08090C` (Base) | **18.17 : 1** | Lulus (Melebihi AAA) | **PASS** |
| `#94A3B8` (Teks Sekunder) di atas `#08090C` (Base) | **7.77 : 1** | Lulus (Melebihi AA) | **PASS** |
| `#00F59B` (Aksen) di atas `#08090C` (Base) | **13.78 : 1** | Lulus (Melebihi AAA) | **PASS** |
| `#F1F5F9` (Teks Utama) di atas `#11141B` (Surface) | **16.82 : 1** | Lulus (Melebihi AAA) | **PASS** |
| `#94A3B8` (Teks Sekunder) di atas `#11141B` (Surface) | **7.19 : 1** | Lulus (Melebihi AA) | **PASS** |
| `#08090C` (Teks Gelap) di atas `#00F59B` (Tombol Aksen) | **13.78 : 1** | Lulus (Melebihi AAA) | **PASS** |

> **Dose Cap:** Warna aksen `#00F59B` hanya digunakan pada titik fokus: indikator status aktif, animasi dekripsi, dan tombol aksi utama (CTA). Tidak disebarkan secara sembarangan di semua elemen.

---

## 4. Tipografi (Typography Hierarchy)

1. **Font Heading / Display:** `Space Grotesk` (`--font-space-grotesk`)
   - Memberikan impresi rekayasa modern yang tegas, proporsional, dan futuristik.
2. **Font Monospace / Kode / Metrik / Label:** `Space Mono` (`--font-space-mono`)
   - Digunakan untuk status badge, metrik angka, efek *DecryptedText*, dan tag teknologi.
3. **Fallback:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

---

## 5. Komponen 3D & Spatial Primitives (Inspirasi React-Bits)

1. **`AmbientCanvas` (Spatial Hero Background):**
   - WebGL / Canvas 2D partikel interaktif berkecepatan rendah.
   - Render loop efisien (menggunakan `requestAnimationFrame`, otomatis *throttle/pause* saat tab tidak aktif atau pengguna berada di luar viewport).
   - Di perangkat layar sentuh/mobile, densitas partikel dikurangi hingga 60% untuk menghemat baterai.
2. **`DecryptedText` (Terminal Headline Shift):**
   - Animasi pengacakan karakter biner/hexadecimal yang menyusun teks nama dan peran secara organik.
3. **`TiltedCard` (Spatial Perspective 3D):**
   - Menghitung rotasi sumbu X dan Y berdasarkan koordinat pointer kursor mouse (`perspective: 1000px`).
   - Menyertakan pantulan cahaya lokal (*ambient spotlight*) yang mengikuti arah kursor.
4. **`MagnetButton` (Tactile Physics Button):**
   - Tombol dengan pegas magnetik halus saat kursor mendekati area batas sentuh.

---

## 6. Prinsip Aksesibilitas & Responsif (`antislop-human` & `antislop-layoutmobile`)

- **Keyboard Focus:** Semua elemen interaktif memiliki visual outline yang jelas: `focus-visible:ring-2 focus-visible:ring-[#00F59B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]`.
- **Reduced Motion:** Saat `window.matchMedia('(prefers-reduced-motion: reduce)')` bernilai `true`, rotasi 3D dan partikel dinonaktifkan secara otomatis menjadi tata letak statis yang bersih.
- **Mobile First Reflow:** Tampilan di ponsel (375px–640px) bukan versi desktop yang diciutkan paksa, melainkan tata letak kartu bertumpuk vertikal dengan area sentuh minimal 44x44px.
