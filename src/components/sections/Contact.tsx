"use client";

import { useState } from "react";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import { SectionEditTrigger } from "@/components/cms/SectionEditTrigger";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { content } = useSiteContent();
  const contact = content.contact;

  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const contactInfo = [
    {
      type: "link",
      title: "Email",
      value: contact?.email || "radityaraizeeshan@gmail.com",
      link: `mailto:${contact?.email || "radityaraizeeshan@gmail.com"}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: "map",
      title: "Location",
      value: contact?.location || "Jl. Pekapuran, Gg Ancin RT 04/24",
      link: "https://maps.google.com/maps?q=Jl.+Pekapuran,+Kota+Depok,+Jawa+Barat&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
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
        setStatus("error");
        setMessage(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
      } else {
        setStatus("success");
        setMessage("Your message has been successfully sent! I will contact you shortly. 🎉");
        setForm({ nama: "", email: "", pesan: "" });
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setMessage("Failed to send message. Please check your internet connection.");
    }
  }

  return (
    <section id="contact" className="py-24 relative bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <SectionEditTrigger section="contact" label="Edit Contact Section" />

        <h2
          className="font-poppins font-black text-4xl md:text-5xl text-slate-900 inline-block relative mb-6 drop-shadow-sm"
          data-aos="fade-up"
        >
          {contact?.title || "Let's Connect"}
        </h2>

        <p
          className="font-inter font-medium text-lg text-[var(--color-textMain)] mb-16 max-w-2xl mx-auto bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] rounded-2xl p-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {contact?.subtitle ||
            "Have a project in mind or just want to say hi? Feel free to reach out to me directly through any of the channels below!"}
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
                    />
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
                data-aos="fade-up"
                data-aos-delay={index * 150 + 200}
                className="bg-[var(--color-surface)] rounded-3xl p-8 shadow-[var(--shadow-neu-out)] hover:shadow-[var(--shadow-neu-in)] transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer"
              >
                <div className="p-5 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-poppins font-black text-xl text-[var(--color-textMain)] mb-1">
                    {info.title}
                  </h3>
                  <p className="font-inter font-medium text-[var(--color-textMain)] opacity-80 text-sm">
                    {info.value}
                  </p>
                </div>
              </a>
            )
          )}
        </div>

        {/* Contact Form Card */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="bg-[var(--color-surface)] shadow-[var(--shadow-neu-out)] rounded-3xl p-8 md:p-12 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label
                htmlFor="contact-nama"
                className="block text-left font-poppins font-bold text-sm text-[var(--color-textMain)] mb-2"
              >
                Nama
              </label>
              <input
                id="contact-nama"
                type="text"
                required
                placeholder="Masukkan nama Anda"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-textMain)]/40"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="block text-left font-poppins font-bold text-sm text-[var(--color-textMain)] mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="Masukkan email Anda"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-textMain)]/40"
              />
            </div>

            {/* Pesan */}
            <div>
              <label
                htmlFor="contact-pesan"
                className="block text-left font-poppins font-bold text-sm text-[var(--color-textMain)] mb-2"
              >
                Pesan
              </label>
              <textarea
                id="contact-pesan"
                required
                rows={5}
                placeholder="Tulis pesan Anda di sini..."
                value={form.pesan}
                onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-neu-in)] font-inter text-[var(--color-textMain)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all placeholder:text-[var(--color-textMain)]/40 resize-none"
              />
            </div>

            {/* Feedback Message */}
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
              className="w-full py-3 px-6 rounded-2xl font-poppins font-bold text-white bg-[var(--color-accent)] shadow-[var(--shadow-neu-out)] hover:brightness-110 active:shadow-[var(--shadow-neu-in)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
