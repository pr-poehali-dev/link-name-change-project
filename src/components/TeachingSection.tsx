import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const SLIDES = [
  "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/33e2dbc0-9548-4b5b-a106-d184b06c525c.JPG",
  "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/d0d693e4-43d8-4269-ba17-d4d5ea7b4507.JPG",
  "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/3cc5b068-4034-4085-8b0c-40000b6c9ccc.jpg",
  "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/fb2e9865-911a-4fe6-93c0-486d1bce568a.jpg",
];

const COURSES = [
  {
    role: "Соавтор, раздел",
    title: "Курс профессиональной переподготовки по специальности «Рентгенология» (очный)",
    url: "https://univerexpert.ru/groups/2/",
    type: "Переподготовка",
  },
  {
    role: "Автор",
    title: "Углубленный практический курс по МРТ суставов «5×5 – Пять суставов × пять интересных патологий»",
    url: "https://lk.practicalradiology.ru/5x5",
    type: "Авторский курс",
  },
  {
    role: "Автор",
    title: "Курс повышения квалификации «Комплексная лучевая диагностика нормы и патологии плечевого сустава»",
    url: "https://univerexpert.ru/courses/35/",
    type: "Повышение квалификации",
  },
  {
    role: "Автор",
    title: "Курс повышения квалификации «Лучевая диагностика нетравматической патологии костно-мышечной системы»",
    url: "https://univerexpert.ru/courses/48/",
    type: "Повышение квалификации",
  },
  {
    role: "Автор",
    title: "Курс повышения квалификации «Методики лучевых исследований и лучевая диагностика травматической патологии скелетно-мышечной системы»",
    url: "https://univerexpert.ru/courses/47/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «Базовый курс по МРТ»",
    url: "https://univerexpert.ru/courses/5/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «Базовый курс по КТ»",
    url: "https://univerexpert.ru/courses/46/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «Базовый углубленный курс по МРТ»",
    url: "https://univerexpert.ru/courses/14/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «КТ-диагностика заболеваний органов грудной клетки»",
    url: "https://univerexpert.ru/courses/22/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «КТ-диагностика заболеваний опорно-двигательного аппарата»",
    url: "https://univerexpert.ru/courses/23/",
    type: "Повышение квалификации",
  },
  {
    role: "Соавтор, раздел",
    title: "Курс повышения квалификации «КТ-диагностика заболеваний органов брюшной полости, забрюшинного пространства и желудочно-кишечного тракта»",
    url: "https://univerexpert.ru/courses/26/",
    type: "Повышение квалификации",
  },
  {
    role: "Автор",
    title: "Курс повышения квалификации «МРТ-диагностика височно-нижнечелюстных суставов»",
    url: "https://univerexpert.ru/courses/56/",
    type: "Повышение квалификации",
    isNew: true,
  },
];

export default function TeachingSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Slider */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(260px, 45vw, 560px)" }}>
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.85)" }}
            />
            {/* vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)",
              }}
            />
          </div>
        ))}

        {/* dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "var(--neon, #00e5ff)" : "rgba(255,255,255,0.35)",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Teaching block */}
      <section id="teaching" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Преподавание</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600 }}>
              Авторские курсы
            </h2>
            <p className="text-muted-foreground mt-4">
              Онлайн-курсы для врачей-рентгенологов и специалистов лучевой диагностики
            </p>
          </div>

          <style>{`
            @keyframes fuchsia-pulse {
              0%, 100% { opacity: 1; text-shadow: 0 0 6px #ff00cc, 0 0 12px #ff00cc; }
              50%       { opacity: 0.35; text-shadow: none; }
            }
          `}</style>
          <div className="grid md:grid-cols-2 gap-5">
            {COURSES.map((c) => (
              <a
                key={c.url}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.35)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,229,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                {'isNew' in c && c.isNew && (
                  <span
                    className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: '#ff00cc',
                      background: 'rgba(255,0,204,0.1)',
                      border: '1px solid rgba(255,0,204,0.35)',
                      animation: 'fuchsia-pulse 1.8s ease-in-out infinite',
                    }}
                  >
                    Новый
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: "rgba(0,229,255,0.1)",
                      boxShadow: "0 0 10px rgba(0,229,255,0.25)",
                    }}
                  >
                    <Icon name="BookOpen" size={18} style={{ color: "var(--neon, #00e5ff)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.45)",
                        }}
                      >
                        {c.type}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--neon, #00e5ff)" }}
                      >
                        {c.role}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-snug font-medium group-hover:text-white transition-colors"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {c.title}
                    </p>
                  </div>
                  <svg
                    className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: "var(--neon, #00e5ff)" }}
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}