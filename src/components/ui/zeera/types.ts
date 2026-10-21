export interface ZeeraMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'navigate' | 'fill_contact';
    payload: {
      section?: string;
      pesan?: string;
    };
  };
}

export const INITIAL_MESSAGES: ZeeraMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      'Halo! Aku Zeera AI, copilot cerdas portofolio Raditya Rai Zeeshan. Mau tahu tentang proyek unggulan, keahlian teknis, atau butuh bantuan navigasi ke bagian tertentu? Tanyakan saja langsung!',
  },
];

export const QUICK_PROMPTS = [
  { label: '🚀 Proyek Unggulan', text: 'Tolong tunjukkan proyek-proyek unggulan buatan Raditya.' },
  { label: '⚡ Keahlian & Stack', text: 'Apa saja keahlian dan tech stack utama yang dikuasai Raditya?' },
  { label: '💼 Pengalaman', text: 'Ceritakan tentang pengalaman kerja dan organisasi Raditya.' },
  { label: '✉️ Hubungi Raditya', text: 'Aku ingin menghubungi Raditya untuk tawaran kerja sama.' },
];
