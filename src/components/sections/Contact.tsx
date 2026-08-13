"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const contactInfo = [
    {
      type: "link",
      title: "Email",
      value: "radityaraizeeshan@gmail.com",
      link: "mailto:radityaraizeeshan@gmail.com",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: "map",
      title: "Location",
      value: "Jl. Pekapuran, Gg Ancin RT 04/24",
      link: "https://maps.google.com/maps?q=Jl.+Pekapuran,+Kota+Depok,+Jawa+Barat&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // POST ke /api/contact dengan body { nama, email, pesan }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          pesan: form.pesan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Tampilkan pesan error dari API (validasi atau server error)
        setStatus("error");
        setMessage(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
      } else {
        // res.ok = true (status 200/201) — pesan berhasil tersimpan
        setStatus("success");
        setMessage("Pesanmu berhasil terkirim! Saya akan segera menghubungi kamu. 🎉");
        setForm({ nama: "", email: "", pesan: "" });
        // Auto-reset ke idle setelah 5 detik agar user bisa kirim lagi
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setMessage("Gagal mengirim pesan. Periksa koneksi internet kamu.");
    }
  }

  return (
    <section id="contact" className="py-24 relative bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h2
          className="font-poppins font-black text-4xl md:text-5xl text-slate-900 inline-block relative mb-6 drop-shadow-sm"
          data-aos="fade-up"
        >
          Let&apos;s Connect
        </h2>

        <p
          className="font-inter font-medium text-lg text-[var(--color-textMain)] mb-16 max-w-2xl mx-auto bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-2xl p-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Have a project in mind or just want to say hi? Feel free to reach out
          to me directly through any of the channels below!
        </p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {contactInfo.map((info, index) =>
            info.type === "map" ? (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 150 + 200}
                className="bg-[var(--color-surface)] rounded-3xl p-6 shadow-[var(--shadow-neu-out)] flex flex-col gap-4"
              >
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-[var(--shadow-neu-in)] p-2 bg-[var(--color-surface)]">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <iframe
                      src={info.link}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                </div>
                <div className="text-center mt-auto pb-2">
                  <h3 className="font-poppins font-black text-xl text-[var(--color-textMain)] mb-1">
                    {info.title}
                  </h3>
                  <p className="font-inter font-medium text-[var(--color-textMain)] opacity-80 text-sm">
                    {info.value}
                  </p>
                </div>
              </div>
            ) : (
              <a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-up"
                data-aos-delay={index * 150 + 200}
                className="group bg-[var(--color-surface)] rounded-3xl p-8 shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] group-hover:shadow-[var(--shadow-neu-in)] group-hover:text-[var(--color-accent)] text-[var(--color-textMain)] flex items-center justify-center transition-all duration-300">
                  {info.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-poppins font-black text-xl text-[var(--color-textMain)] mb-2">
                    {info.title}
                  </h3>
                  <p className="font-inter font-medium text-[var(--color-textMain)] opacity-80 group-hover:opacity-100 transition-opacity">
                    {info.value}
                  </p>
                </div>
              </a>
            )
          )}
        </div>

        {/* Contact Form */}
        <div
          className="max-w-2xl mx-auto bg-[var(--color-surface)] rounded-3xl p-8 shadow-[var(--shadow-neu-out)]"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="font-poppins font-black text-2xl text-[var(--color-textMain)] mb-6 text-left">
            Kirim Pesan
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Nama */}
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="contact-nama"
                className="font-inter font-semibold text-sm text-[var(--color-textMain)] opacity-80"
              >
                Nama
              </label>
              <input
                id="contact-nama"
                type="text"
                placeholder="Nama lengkap kamu"
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                disabled={status === "loading"}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] placeholder:opacity-40 outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="contact-email"
                className="font-inter font-semibold text-sm text-[var(--color-textMain)] opacity-80"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="email@kamu.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={status === "loading"}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] placeholder:opacity-40 outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all disabled:opacity-50"
              />
            </div>

            {/* Pesan */}
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="contact-pesan"
                className="font-inter font-semibold text-sm text-[var(--color-textMain)] opacity-80"
              >
                Pesan
              </label>
              <textarea
                id="contact-pesan"
                rows={5}
                placeholder="Ceritakan project atau idemu..."
                value={form.pesan}
                onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                disabled={status === "loading"}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] placeholder:opacity-40 outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Feedback message */}
            {status !== "idle" && status !== "loading" && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-inter font-medium text-left transition-all ${
                  status === "success"
                    ? "bg-emerald-50 text-emerald-700 shadow-[var(--shadow-neu-in)]"
                    : "bg-red-50 text-red-600 shadow-[var(--shadow-neu-in)]"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              id="contact-submit-btn"
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full py-3 px-6 rounded-2xl font-poppins font-bold text-white bg-[var(--color-accent)] shadow-[var(--shadow-neu-out)] hover:brightness-110 active:shadow-[var(--shadow-neu-in)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                "Kirim Pesan →"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
