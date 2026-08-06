"use client";

import { useEffect, useState, useRef } from "react";

function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold font-poppins text-accent">
      {count}
      {suffix}
    </div>
  );
}

export default function Statistics() {
  const stats = [
    { label: "Projects Completed", value: 10, suffix: "+" },
    { label: "Years of Learning", value: 2, suffix: "+" },
    { label: "Core Technologies", value: 5, suffix: "+" },
    { label: "Internship Experience", value: 1, suffix: "" },
  ];

  return (
    <section id="statistics" className="pt-4 md:pt-0 pb-20 bg-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-surface shadow-neu-out rounded-3xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="w-full py-6 rounded-2xl shadow-neu-in mb-4 flex justify-center items-center">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="text-textMain font-medium text-lg">{stat.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
