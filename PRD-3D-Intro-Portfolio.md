# PRD — 3D Interactive Intro "Walk to the House"

**Produk:** Portfolio Website Raditya Rai Zeeshan
**Status:** Final v2 (semua open question sudah diputuskan)
**Fitur:** Intro 3D berbasis Three.js sebelum masuk ke halaman portfolio

---

## 1. Ringkasan

Saat pengunjung pertama kali membuka website, mereka disambut scene 3D: seorang anak kecil berdiri di halaman sebuah rumah. Pengunjung menggerakkan karakter berjalan menuju rumah. Saat karakter sampai dan masuk pintu, terjadi transisi dan pengunjung masuk ke portfolio yang sudah ada (Hero dst).

Seluruh visual (karakter, rumah, lingkungan) dan musik latar dibuat **100% lewat kode**, tanpa file model atau aset eksternal.

Tujuan utama: kesan pertama yang memorable dan menunjukkan kemampuan kreatif + teknis, tanpa menghalangi orang yang hanya ingin melihat portfolio.

## 2. Keputusan Final

| # | Topik | Keputusan |
|---|---|---|
| 1 | Skip dan kunjungan ulang | Intro bisa langsung di-skip kapan saja. Di akhir portfolio, dekat footer, tersedia tombol **"Ulangi Intro"**. |
| 2 | Audio | Musik latar santai dan enak didengar, dibuat lewat **Web Audio API** (procedural). Default muted sampai ada interaksi pertama, ada tombol mute/unmute. |
| 3 | Aset | Semua dibuat lewat kode. **Tanpa GLB/model eksternal.** Karakter dari primitif Three.js. |
| 4 | Kontrol | Desktop: **WASD** (panah juga didukung). Mobile: **tombol on-screen** (D-pad), bukan joystick. |
| 5 | Durasi | Target 15 sampai 20 detik jika berjalan lurus ke rumah. |
| 6 | Route | Intro hanya tampil di `/`. |

## 3. Tujuan & Non-Tujuan

**Tujuan**
- Kesan pertama unik yang memperkuat personal branding.
- Playable di desktop dan mobile.
- Transisi mulus ke portfolio existing tanpa mengubah isi portfolio.
- Performa baik di HP menengah, ukuran aset hampir nol.

**Non-Tujuan (v1)**
- Bukan game penuh (tidak ada skor, musuh, level).
- Tidak menggantikan navigasi portfolio.
- Tidak ada multiplayer.
- Tidak ada model realistis atau file 3D eksternal; gaya stylized low-poly.

## 4. Target Pengguna

| Persona | Kebutuhan | Implikasi |
|---|---|---|
| Recruiter / HR | Cepat lihat portfolio | Tombol **Skip** jelas sejak detik pertama |
| Client potensial | Kesan profesional | Intro singkat (15-20 detik) |
| Sesama developer | Apresiasi teknis | Kode rapi, performa baik |
| Pengunjung mobile | Layar kecil, koneksi bervariasi | Kontrol tombol, scene ringan |

## 5. User Flow

1. Buka `/` → **loading singkat** (splash RRZ yang sudah ada dipakai ulang).
2. Scene 3D muncul: anak di halaman, rumah di ujung jalan setapak. Muncul petunjuk kontrol singkat. Tombol **Skip** dan **Mute** selalu terlihat.
3. Pengunjung menggerakkan karakter ke arah rumah. Interaksi pertama (tap/tombol) juga mengaktifkan audio.
4. Mendekati pintu → trigger zone aktif, pintu terbuka.
5. Kamera masuk / fade ke terang.
6. **Transisi** ke portfolio (Hero muncul), scene dibuang dari memori.
7. Kunjungan berikutnya: intro langsung dilewati dan portfolio tampil.
8. Di akhir portfolio dekat footer: tombol **"Ulangi Intro"** memutar ulang dari awal.

## 6. Requirement Fungsional

### 6.1 Scene & Lingkungan (procedural)
- Halaman: plane rumput, jalan setapak dari box/plane, pagar dari box berulang (InstancedMesh), pohon dari silinder + kerucut/bola, bunga/batu kecil sebagai dekorasi.
- Rumah: badan dari box, atap prisma/kerucut, pintu yang bisa dianimasikan (pivot engsel), jendela sederhana.
- Langit gradient + pencahayaan ambient + directional; palet selaras Soft Mint `#C6E0D2` dan Deep Emerald `#136846`.
- Kamera third-person mengikuti karakter dengan smoothing, sudut tetap agar mudah dikontrol.

### 6.2 Karakter (procedural)
- Anak kecil dari primitif: kepala (sphere), badan (capsule/box), tangan dan kaki (capsule), rambut dan baju berwarna.
- Animasi idle (napas halus) dan walk (ayunan kaki dan tangan pakai fungsi sinus, bobbing badan) dibuat lewat kode.
- Rotasi halus mengikuti arah gerak.
- Collision sederhana (bounding box/circle) terhadap rumah, pagar, pohon, dan batas area.

### 6.3 Kontrol
| Platform | Kontrol |
|---|---|
| Desktop | WASD, tombol panah juga didukung |
| Mobile | D-pad 4 tombol di kiri bawah; tahan tombol untuk bergerak terus |

Kontrol dipilih otomatis berdasarkan deteksi input (pointer coarse / touch).

### 6.4 Audio
- Musik ambient santai digenerate dengan **Web Audio API**: pad lembut, melodi pentatonik pelan, tempo lambat, dengan loop yang tidak terasa berulang kasar.
- Mulai hanya setelah interaksi pertama (kebijakan autoplay browser).
- Tombol mute/unmute, preferensi disimpan.
- Fade in saat mulai, fade out saat transisi ke portfolio.
- Audio berhenti dan `AudioContext` ditutup setelah intro selesai atau di-skip.
- Opsional: efek langkah kaki dan bunyi pintu sederhana (juga procedural).

### 6.5 Interaksi & Transisi
- Trigger zone di depan pintu.
- Pintu terbuka → fade/zoom masuk → unmount scene → tampilkan portfolio.
- Dispose penuh: geometry, material, texture, renderer, event listener, AudioContext.

### 6.6 Skip, Ulangi, dan Persistensi
- Tombol **Skip** selalu tersedia dan bisa diakses keyboard.
- Penanda "sudah lihat intro" disimpan di localStorage; kunjungan berikutnya langsung ke portfolio.
- Tombol **"Ulangi Intro"** dekat footer: menghapus penanda, scroll ke atas, lalu init ulang scene dari awal.
- Hormati `prefers-reduced-motion`: intro dilewati atau dibuat tanpa animasi kamera.

### 6.7 Fallback
- WebGL tidak tersedia atau perangkat sangat lemah → lewati intro, langsung portfolio.
- Error saat init scene atau audio → portfolio tetap tampil, intro tidak memblokir.

## 7. Requirement Non-Fungsional

| Aspek | Target |
|---|---|
| FPS | 60 di desktop, minimal 30 stabil di HP menengah |
| Ukuran aset | Hampir nol (tanpa model dan tekstur eksternal); tambahan bundle hanya Three.js + kode intro, di-load lazy |
| Waktu ke interaktif | < 3 detik pada koneksi 4G |
| Dampak ke portfolio | LCP/SEO halaman utama tidak menurun signifikan |
| Memori | Dispose penuh setelah intro selesai |
| Browser | Chrome, Safari (iOS), Firefox, Edge versi terbaru |
| Aksesibilitas | Skip via keyboard, kontras teks WCAG AA, hormati reduced-motion |

## 8. Arsitektur Teknis

**Integrasi (Next.js 16 App Router)**
- `IntroScene` sebagai Client Component, dimuat dengan `dynamic(() => import(...), { ssr: false })` agar Three.js tidak masuk bundle awal maupun SSR.
- State `introStatus` (`loading | playing | transitioning | done | skipped`) di context ringan.
- Portfolio tetap Server-rendered dan konten SEO tetap ada di HTML; intro berupa overlay fullscreen (`position: fixed`) di atasnya.
- `ReplayIntroButton` di bagian footer memanggil aksi reset pada context.

**Library:** Three.js murni (sesuai permintaan full coding) dibungkus satu komponen React dengan lifecycle bersih (init di `useEffect`, cleanup di return). Audio memakai Web Audio API bawaan browser, tanpa library tambahan.

**Struktur modul**
```text
src/components/intro/
├── IntroScene.tsx          # wrapper React, lifecycle
├── IntroProvider.tsx       # state introStatus, replay, persistensi
├── engine/
│   ├── createScene.ts      # renderer, kamera, lighting
│   ├── world.ts            # tanah, jalan, pagar, pohon
│   ├── house.ts            # rumah + animasi pintu
│   ├── player.ts           # karakter procedural + animasi
│   ├── controls.ts         # WASD + D-pad
│   ├── collision.ts
│   ├── audio.ts            # musik ambient Web Audio
│   └── transition.ts
├── ui/
│   ├── LoadingOverlay.tsx
│   ├── DPad.tsx
│   ├── SkipButton.tsx
│   ├── MuteButton.tsx
│   └── ReplayIntroButton.tsx  # dipakai dekat footer
```

**Optimasi:** batasi pixel ratio (max 2), InstancedMesh untuk objek berulang, tanpa real-time shadow berat di mobile (gunakan blob shadow sederhana), pause render saat tab tidak aktif, `requestAnimationFrame` dihentikan saat done.

## 9. Desain & Konten

- Gaya low-poly stylized, palet Soft Mint `#C6E0D2` dan Deep Emerald `#136846`, selaras Neumorphism existing.
- Splash RRZ existing dipakai sebagai loading agar konsisten.
- Petunjuk kontrol singkat dalam bahasa Indonesia, sesuai `DESIGN.md`.
- Opsional: papan nama "Z-Project" di depan rumah sebagai easter egg.

## 10. Metrik Keberhasilan

- Skip rate dan completion rate intro.
- Bounce rate sebelum dan sesudah fitur.
- Klik tombol "Ulangi Intro" (indikator intro disukai).
- Web Vitals (LCP, INP, CLS) tidak memburuk.
- Rata-rata FPS dan error rate WebGL di perangkat nyata.

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Intro menghalangi recruiter | Kehilangan peluang | Skip jelas, intro pendek, kunjungan ulang langsung dilewati |
| Performa buruk di HP | UX rusak | Low-poly, tanpa aset berat, fallback otomatis |
| Musik procedural terdengar monoton | Kesan kurang | Variasi nada, tempo lambat, mudah dimute; siapkan opsi MP3 royalty-free bila perlu |
| Autoplay diblokir | Musik tidak bunyi | Mulai setelah interaksi pertama |
| SEO/Web Vitals turun | Ranking turun | Konten portfolio tetap di HTML, intro `ssr:false` dan lazy |
| Memory leak Three.js/Audio | Lag setelah intro | Dispose disiplin dan uji di DevTools, terutama saat replay berulang |
| Scope membengkak | Molor | Bangun bertahap sesuai milestone |
| Karakter procedural kurang detail | Kurang menarik | Fokus pada proporsi imut, warna, dan animasi yang hidup |

## 12. Milestone

| Fase | Isi | Hasil |
|---|---|---|
| M1 | Scene dasar: renderer, kamera, tanah, rumah sederhana, lighting, `IntroScene` dengan `ssr:false` | Scene tampil |
| M2 | Karakter procedural + animasi + kontrol WASD | Bisa jalan |
| M3 | Collision, trigger pintu, animasi pintu, transisi ke portfolio, Skip | Alur end-to-end |
| M4 | D-pad mobile, persistensi, tombol Ulangi Intro dekat footer, reduced-motion, fallback | Lengkap dan aksesibel |
| M5 | Audio procedural + mute + fade | Musik latar jalan |
| M6 | Optimasi performa, dispose, uji perangkat nyata, polish visual | Siap rilis |

## 13. Di Luar Scope v1

Mode siang/malam, mini-game, interior rumah yang bisa dijelajahi, multi-ruangan sebagai navigasi section, karakter yang bisa dikustomisasi, dan intro di route selain `/`.
