export interface PortfolioExperience {
  role: string;
  organization: string;
  period: string;
  description: string;
  badges: string[];
}

export interface PortfolioAchievement {
  title: string;
  event: string;
  role: string;
  year: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export const PORTFOLIO_PROFILE = {
  name: "Raditya Rai Zeeshan",
  handle: "radityarz",
  role: "Fullstack Web Developer & AI Enthusiast",
  education: "SMKN 1 Depok (Rekayasa Perangkat Lunak)",
  location: "Depok, Jawa Barat, Indonesia",
  email: "radityaraizeeshan@gmail.com",
  status: "Open for freelance projects and full-time opportunities",
  bio: [
    "Halo! Saya Raditya Rai Zeeshan, seorang Fullstack Web Developer yang berfokus pada pembangunan aplikasi web modern, terstruktur, dan memiliki performa tinggi.",
    "Memiliki ketertarikan mendalam pada ekosistem Next.js, arsitektur backend TypeScript/PostgreSQL, integrasi kecerdasan buatan (Gemini AI), serta kepemimpinan tim.",
  ],
  stats: [
    { label: "Pengalaman Praktis", value: "2+ Tahun" },
    { label: "Proyek Selesai", value: "10+ Proyek" },
    { label: "Dedikasi Sistem", value: "100%" },
    { label: "Penghargaan Marching Band", value: "5 Prestasi" },
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/zshnrdtya", username: "zshnrdtya" },
    { name: "LinkedIn", url: "https://linkedin.com/in/raditya-rai-zeeshan", username: "Raditya Rai Zeeshan" },
    { name: "Instagram", url: "https://instagram.com/zshnrdtya", username: "@zshnrdtya" },
    { name: "Email", url: "mailto:radityaraizeeshan@gmail.com", username: "radityaraizeeshan@gmail.com" },
  ],
};

export const PORTFOLIO_SKILLS: SkillCategory[] = [
  {
    category: "Bahasa Pemrograman",
    items: ["TypeScript", "JavaScript", "PHP", "Kotlin", "Java", "HTML5", "CSS3"],
  },
  {
    category: "Frontend & UI",
    items: ["Next.js", "React.js", "Tailwind CSS", "Framer Motion", "Three.js", "Responsive Design"],
  },
  {
    category: "Backend & Database",
    items: ["Node.js", "Laravel", "PostgreSQL", "Supabase", "Prisma ORM", "MySQL", "NextAuth.js", "RESTful API"],
  },
  {
    category: "Kecerdasan Buatan & Otomasi",
    items: ["Google Gemini AI SDK", "Function Calling", "WebAuthn / Passkeys", "Realtime SSE Telemetry"],
  },
  {
    category: "Alat & Lingkungan Kerja",
    items: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Vercel", "Laragon"],
  },
];

export const PORTFOLIO_EXPERIENCES: PortfolioExperience[] = [
  {
    role: "Founder & Project Manager",
    organization: "Z - Project",
    period: "2023 - Sekarang",
    description:
      "Mendirikan dan memimpin platform layanan digital untuk penulisan karya akademik, desain presentasi PowerPoint interaktif, dan pembuatan CV berstandar ATS bagi mahasiswa dan profesional.",
    badges: ["Project Management", "Document Design", "ATS CV", "Presentation"],
  },
  {
    role: "FullStack Developer (Internship)",
    organization: "Indi Technology",
    period: "2024",
    description:
      "Bertanggung jawab dalam pengembangan aplikasi company profile modern, implementasi fitur interaktif 3D scrollytelling, manajemen deployment ke server produksi, dan pengujian Quality Assurance (QA).",
    badges: ["Next.js", "React", "Laravel", "Inertia.js", "QA Testing"],
  },
  {
    role: "Assistant Coach & Head of Equipment",
    organization: "Al-Hidayah Marching Band",
    period: "2024 - 2025",
    description:
      "Mengelola inventaris instrumen, melatih disiplin ritme musikal, serta memimpin anggota marching band dalam menjaga sinkronisasi visual dan musikal pada kejuaraan tingkat daerah dan nasional.",
    badges: ["Leadership", "Team Coordination", "Equipment Logistics", "Crisis Management"],
  },
];

export const PORTFOLIO_ACHIEVEMENTS: PortfolioAchievement[] = [
  {
    title: "Juara 3 Umum Marching Band",
    event: "Jungle Marching Adventure #7",
    role: "Snare Player",
    year: "2023",
  },
  {
    title: "Juara 3 Umum Marching Band",
    event: "Islamic Solidarity Marching Competition",
    role: "Snare Player",
    year: "2023",
  },
  {
    title: "Juara 2 Umum Marching Band",
    event: "Islamic Marching Band Competition",
    role: "Asisten Pelatih",
    year: "2024",
  },
  {
    title: "Juara 4 Umum Drum Battle",
    event: "Kejuaraan Daerah (Kejurda) DKI Jakarta",
    role: "Snare Player",
    year: "2025",
  },
  {
    title: "Juara 2 Umum Drum Battle",
    event: "Patriot Competition Marching Band",
    role: "Snare Player",
    year: "2025",
  },
];

export const TERMINAL_COMMANDS_LIST = [
  { command: "help", desc: "Menampilkan daftar seluruh perintah yang tersedia" },
  { command: "about", desc: "Biodata, latar belakang, dan ringkasan profesional Raditya" },
  { command: "projects", desc: "Daftar proyek unggulan live dari database" },
  { command: "skills", desc: "Keahlian teknologi, bahasa pemrograman, dan framework" },
  { command: "experience", desc: "Riwayat pengalaman kerja, proyek, dan organisasi" },
  { command: "awards", desc: "Daftar pencapaian dan kejuaraan yang pernah diraih" },
  { command: "guestbook", desc: "Buku tamu interaktif pengunjung portofolio" },
  { command: "contact", desc: "Informasi kontak langsung dan tautan sosial media" },
  { command: "stats", desc: "Lihat metrik kunjungan dan telemetri real-time" },
  { command: "login", desc: "Pintu masuk administrator ke Dashraditya (Face ID / Passkey)" },
  { command: "clear", desc: "Membersihkan seluruh baris tampilan terminal" },
];
