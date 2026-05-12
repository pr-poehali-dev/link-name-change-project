import { useState } from "react";
import Icon from "@/components/ui/icon";

const DOCTOR_IMG = "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/c52651cd-309a-488f-88f4-ec92811ed6a6.png";
const MRI_IMG = "https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/files/2bbb39b7-8dfe-4af1-81b6-2b31f86c11a6.jpg";

const SERVICES = [
  { icon: "ScanLine", title: "МРТ-диагностика", desc: "Магнитно-резонансная томография всех суставов конечностей, включая ВНЧС. Специализация на мышечно-скелетной системе.", price: "Прейскурант ВОККДЦ", priceLink: "https://vodc.ru/uslygi/" },
  { icon: "Cpu", title: "КТ-исследования", desc: "Консультирование и второе мнение по компьютерно-томографическим исследованиям костно-суставной системы.", price: "Прейскурант Smart Clinic", priceLink: "https://smart-clinica.ru/staff/vrachi/popov-aleksey-yurevich/?sphrase_id=193893" },
  { icon: "FileSearch", title: "Телерадиология", desc: "Дистанционное описание готовых лучевых исследований с развёрнутым заключением. Работаю дистанционно.", price: "Прейскурант Smart Clinic", priceLink: "https://smart-clinica.ru/staff/vrachi/popov-aleksey-yurevich/?sphrase_id=193893" },
  { icon: "GraduationCap", title: "Наставничество", desc: "Формирование правильных профессиональных навыков у начинающих врачей-рентгенологов.", price: "Прейскурант ИПКМК", priceLink: "https://univerexpert.ru/courses/" },
  { icon: "BookOpen", title: "Обучение", desc: "Формирование структурированной теоретической базы у начинающих врачей-рентгенологов. Лектор семинаров НМО.", price: "Прейскурант ИПКМК", priceLink: "https://univerexpert.ru/courses/" },
  { icon: "MessageSquare", title: "Второе мнение", desc: "Независимая экспертная оценка сложных случаев: травматология, онкология, педиатрическая патология, спортивная травма.", price: "Индивидуально", priceLink: "" },
];

const PRICES = [
  { name: "МРТ-исследования (ВОККДЦ)", price: "по прейскуранту", duration: "ВОККДЦ", link: "https://vodc.ru/uslygi/" },
  { name: "Дистанционное описание МРТ (Smart Clinic)", price: "по прейскуранту", duration: "Smart Clinic", link: "https://smart-clinica.ru/staff/vrachi/popov-aleksey-yurevich/?sphrase_id=193893" },
  { name: "Обучение врачей (АНО ДПО ИПКМК)", price: "по прейскуранту", duration: "ИПКМК", link: "https://univerexpert.ru/courses/" },
];

const REVIEWS = [
  { name: "Марина С.", rating: 5, text: "Алексей Юрьевич — настоящий профессионал. Расшифровал МРТ суставов, которое до него никто не мог объяснить. Всё чётко, понятно и без лишней воды.", date: "март 2025" },
  { name: "Дмитрий К.", rating: 5, text: "Записался дистанционно через Smart Clinic. Доктор очень внимательный, подробно разобрал снимок КТ, указал на нюансы, которые не увидели на месте.", date: "апрель 2025" },
  { name: "Анна В.", rating: 5, text: "Обратилась с МРТ плечевого сустава. Грамотное развёрнутое заключение, чёткие рекомендации. Видно, что специалист с огромным опытом.", date: "май 2025" },
];

const NAV_ITEMS = [
  { label: "Услуги", href: "#services" },
  { label: "О враче", href: "#about" },
  { label: "Где принимаю", href: "#prices" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const BUSY_SLOTS = ["09:30","11:00","14:30","16:00"];

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;
  startDow -= 1;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isPast = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (d: Date) => selected?.toDateString() === d.toDateString();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
          <Icon name="ChevronLeft" size={16} />
        </button>
        <span className="font-semibold text-sm" style={{ fontFamily: "'Golos Text', sans-serif" }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS_SHORT.map(d => (
          <div key={d} className="cal-day text-xs text-muted-foreground font-medium cursor-default" style={{ width: '100%' }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            {d ? (
              <div
                className={`cal-day ${isPast(d) ? "cal-day--disabled" : ""} ${isSelected(d) ? "cal-day--selected" : ""} ${isToday(d) && !isSelected(d) ? "cal-day--today" : ""}`}
                style={{ width: '100%' }}
                onClick={() => !isPast(d) && onSelect(d)}
              >
                {d.getDate()}
              </div>
            ) : <div className="cal-day" style={{ width: '100%' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", service: "" });
  const [booked, setBooked] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !form.name || !form.phone) return;
    setBooked(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,13,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/d0e47aed-5e28-4114-80c1-baf9a204c911.png" alt="Radiology Art" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-sm tracking-wide">
              <span className="neon-text">Radiology</span> Art
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(n => (
              <a key={n.label} href={n.href} className="nav-link">{n.label}</a>
            ))}
          </div>

          <a href="#booking" className="hidden md:block neon-btn px-5 py-2 rounded-lg text-sm">
            Записаться
          </a>

          <button className="md:hidden text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ borderTop: '1px solid rgba(0,229,255,0.1)' }}>
            {NAV_ITEMS.map(n => (
              <a key={n.label} href={n.href} className="nav-link text-base" onClick={() => setMenuOpen(false)}>{n.label}</a>
            ))}
            <a href="#booking" className="neon-btn px-5 py-2 rounded-lg text-sm text-center" onClick={() => setMenuOpen(false)}>Записаться</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center grid-bg overflow-hidden">
        <div className="orb w-96 h-96 top-10 right-10 opacity-20" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.6) 0%, transparent 70%)' }} />
        <div className="orb w-64 h-64 bottom-20 left-20 opacity-15" style={{ background: 'radial-gradient(circle, rgba(179,102,255,0.6) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-tag animate-fade-up">Лучевая диагностика — как искусство</div>
              <h1 className="animate-fade-up-delay-1 mt-2 leading-tight" style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, lineHeight: 1.1 }}>
                Алексей Юрьевич<br />
                <span className="neon-text">Попов</span>
              </h1>
              <p className="animate-fade-up-delay-2 text-muted-foreground mt-6 text-lg leading-relaxed max-w-md">
                Врач-рентгенолог высшей категории, к.м.н. Опыт более 25 лет. Специализация — МРТ и КТ мышечно-скелетной системы.
              </p>
              <div className="animate-fade-up-delay-3 flex flex-wrap gap-4 mt-8">
                <a href="#booking" className="neon-btn px-8 py-3 rounded-xl text-base flex items-center gap-2">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться онлайн
                </a>
                <a href="#services" className="px-8 py-3 rounded-xl text-base flex items-center gap-2 transition-all" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}>
                  Услуги
                  <Icon name="ArrowRight" size={16} />
                </a>
              </div>
              <div className="animate-fade-up-delay-4 flex gap-8 mt-12">
                {[["25+", "лет опыта"], ["75 000+", "пациентов"], ["70+", "публикаций"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold neon-text" style={{ fontFamily: "'Golos Text', sans-serif" }}>{n}</div>
                    <div className="text-sm text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center animate-float">
              <div className="relative" style={{ width: '100%', maxWidth: 420 }}>
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.12) 0%, transparent 70%)', transform: 'scale(1.1)' }} />
                <img
                  src={DOCTOR_IMG}
                  alt="Доктор Попов"
                  className="relative w-full object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 60px rgba(0,229,255,0.15))' }}
                />
                <div className="absolute bottom-8 left-4 right-4">
                  <div className="glass-card-neon p-4">
                    <div className="text-xs text-muted-foreground mb-1">Ближайший приём</div>
                    <div className="font-semibold flex items-center gap-2">
                      <Icon name="Clock" size={14} className="neon-text" />
                      Сегодня 14:00 — свободно
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass-card-neon p-3 flex items-center gap-2 animate-fade-up">
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px #4ade80' }} />
                <span className="text-xs font-medium">Онлайн-запись доступна</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 relative">
        <div className="orb w-80 h-80 top-0 left-1/2 -translate-x-1/2 opacity-10" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.5) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Направления работы</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Чем я занимаюсь
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Рентген, КТ и МРТ мышечно-скелетной системы — очно и дистанционно
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className="glass-card p-6 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,229,255,0.3)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 30px rgba(0,229,255,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <Icon name={s.icon} size={22} className="neon-text" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                {s.priceLink ? (
                  <a href={s.priceLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold neon-text hover:underline flex items-center gap-1">
                    {s.price} <Icon name="ExternalLink" size={12} />
                  </a>
                ) : (
                  <div className="text-sm font-bold neon-text">{s.price}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 relative" style={{ background: 'rgba(0,229,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src={MRI_IMG} alt="Оборудование" className="rounded-2xl w-full object-cover" style={{ aspectRatio: '4/3' }} />
              <div className="absolute -bottom-6 -right-6 glass-card-neon p-5">
                <div className="text-3xl font-bold neon-text" style={{ fontFamily: "'Cormorant', serif" }}>к.м.н.</div>
                <div className="text-sm text-muted-foreground mt-1">кандидат мед. наук</div>
              </div>
            </div>

            <div>
              <div className="section-tag">О специалисте</div>
              <h2 className="mt-2" style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
                Алексей Юрьевич<br />
                <span className="neon-text">Попов</span>
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                Врач-рентгенолог высшей категории, кандидат медицинских наук, член-корреспондент Академии военных наук. Окончил Саратовский ГМУ им. Разумовского. Основной опыт — военный госпиталь, включая заведование отделением.
              </p>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Специализируется на сложных случаях травматологической патологии и заболеваниях мышечно-скелетной системы, включая педиатрическую патологию, онкологию и спортивную травму. Доцент кафедры лучевой диагностики АНО ДПО «ИПКМК». Автор и соавтор более 70 печатных работ, включая 5 монографий.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: "GraduationCap", text: "Саратовский ГМУ им. Разумовского" },
                  { icon: "Award", text: "Врач высшей категории, к.м.н." },
                  { icon: "Shield", text: "Член-корр. Академии военных наук" },
                  { icon: "BookOpen", text: "70+ научных публикаций, 5 монографий" },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(0,229,255,0.1)' }}>
                      <Icon name={item.icon} size={14} className="neon-text" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICES / WHERE */}
      <section id="prices" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Места работы</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Где меня найти
            </h2>
            <p className="text-muted-foreground mt-4">Очный приём и дистанционная работа в Воронеже</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5" style={{ maxWidth: 900, margin: '0 auto' }}>
            {[
              {
                name: "ВОККДЦ",
                full: "Воронежский областной консультативно-диагностический центр",
                address: "г. Воронеж, Площадь Ленина, 5а, корп. А",
                dept: "Отдел лучевой диагностики",
                type: "Очно — МРТ-исследования",
                phone: "+7 (473) 272-02-05",
                phoneName: "Call-центр",
                priceLink: "https://vodc.ru/uslygi/",
                mapLink: "https://yandex.ru/maps/?text=Воронеж+Площадь+Ленина+5а",
              },
              {
                name: "Smart Clinic",
                full: "Smart Clinic",
                address: "г. Воронеж, Ленинский проспект, 68А",
                dept: "",
                type: "Дистанционное описание МРТ",
                phone: "+7 473 211-80-82",
                phoneName: "",
                priceLink: "https://smart-clinica.ru/staff/vrachi/popov-aleksey-yurevich/?sphrase_id=193893",
                mapLink: "https://yandex.ru/maps/?text=Воронеж+Ленинский+проспект+68А",
              },
              {
                name: "АНО ДПО ИПКМК",
                full: "Институт повышения квалификации медицинских кадров",
                address: "г. Воронеж, ул. Фридриха Энгельса, 58А",
                dept: "Кафедра лучевой диагностики",
                type: "Очно — обучение врачей",
                phone: "+7 (800) 350-94-21",
                phoneName: "",
                priceLink: "https://univerexpert.ru/courses/",
                mapLink: "https://yandex.ru/maps/?text=Воронеж+Фридриха+Энгельса+58А",
              },
            ].map(loc => (
              <div key={loc.name} className="glass-card p-6 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <Icon name="Building2" size={20} className="neon-text" />
                </div>
                <div>
                  <div className="font-bold text-base neon-text">{loc.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{loc.full}</div>
                </div>
                <div className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <Icon name="MapPin" size={12} className="neon-text shrink-0 mt-0.5" />
                  <span>{loc.address}{loc.dept ? `, ${loc.dept}` : ""}</span>
                </div>
                <div className="text-xs font-medium" style={{ color: 'rgba(0,229,255,0.8)' }}>{loc.type}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Icon name="Phone" size={12} className="neon-text shrink-0" />
                  <a href={`tel:${loc.phone.replace(/\s/g,'')}`} className="hover:text-primary transition-colors">{loc.phone}{loc.phoneName ? ` (${loc.phoneName})` : ""}</a>
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                    <Icon name="Map" size={11} /> На карте
                  </a>
                  <a href={loc.priceLink} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all neon-btn">
                    <Icon name="ExternalLink" size={11} /> Цены
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 relative" style={{ background: 'rgba(0,229,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Отзывы</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Что говорят пациенты
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map(r => (
              <div key={r.name} className="glass-card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="star text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">«{r.text}»</p>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(0,229,255,0.15)', color: 'hsl(186,100%,50%)' }}>
                      {r.name[0]}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 600 }}>
                Что говорят <span className="neon-text">врачи</span>
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Альбина А.", rating: 5, date: "май 2023", text: "Выражаю огромную благодарность Алексею Юрьевичу, за такой огромный труд. Его ценность невозможно соизмерить, низкий поклон, буду не раз возвращаться к лекциям при описании! Курс более чем оправдал мои ожидания." },
                { name: "Екатерина Ш.", rating: 5, date: "май 2023", text: "Прекрасный материал, самый мощный курс который встречала, спасибо за Ваш труд!!!" },
                { name: "Степан М.", rating: 5, date: "май 2023", text: "Курс в целом отличный, обязательно хотелось бы пройти и другие ваши курсы в будущем." },
              ].map(r => (
                <div key={r.name} className="glass-card p-6" style={{ borderColor: 'rgba(179,102,255,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <span key={i} className="star text-lg">★</span>
                      ))}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(179,102,255,0.15)', color: 'rgba(179,102,255,0.9)' }}>врач</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">«{r.text}»</p>
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(179,102,255,0.15)', color: 'rgba(179,102,255,0.9)' }}>
                        {r.name[0]}
                      </div>
                      <span className="font-medium text-sm">{r.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 relative">
        <div className="orb w-96 h-96 bottom-0 right-0 opacity-10" style={{ background: 'radial-gradient(circle, rgba(179,102,255,0.5) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Онлайн-запись</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Запись на приём
            </h2>
            <p className="text-muted-foreground mt-4">Выберите удобную дату и время</p>
          </div>

          {booked ? (
            <div className="glass-card-neon p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,229,255,0.15)' }}>
                <Icon name="CheckCircle" size={32} className="neon-text" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Запись подтверждена!</h3>
              <p className="text-muted-foreground">
                {form.name}, ваш приём записан на{" "}
                <span className="neon-text font-semibold">
                  {selectedDate?.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} в {selectedTime}
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-sm">Мы свяжемся с вами по номеру {form.phone} для подтверждения</p>
              <button onClick={() => { setBooked(false); setSelectedDate(null); setSelectedTime(null); setForm({ name: "", phone: "", service: "" }); }}
                className="mt-8 px-6 py-2.5 rounded-lg text-sm transition-all" style={{ border: '1px solid rgba(0,229,255,0.3)', color: 'hsl(186,100%,50%)' }}>
                Записать ещё раз
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Icon name="CalendarDays" size={18} className="neon-text" />
                  Выберите дату
                </h3>
                <Calendar selected={selectedDate} onSelect={setSelectedDate} />

                {selectedDate && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Icon name="Clock" size={14} className="neon-text" />
                      Доступное время на {selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map(t => (
                        <button
                          key={t}
                          disabled={BUSY_SLOTS.includes(t)}
                          onClick={() => setSelectedTime(t)}
                          className={`time-slot ${selectedTime === t ? "time-slot--selected" : ""} ${BUSY_SLOTS.includes(t) ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Icon name="UserCheck" size={18} className="neon-text" />
                  Ваши данные
                </h3>
                <form onSubmit={handleBook} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Имя и фамилия</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Иванов"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontFamily: "'Golos Text', sans-serif" }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,229,255,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Телефон</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 000-00-00"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontFamily: "'Golos Text', sans-serif" }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,229,255,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Вид исследования</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(20,24,36,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: form.service ? 'white' : 'rgba(255,255,255,0.4)', fontFamily: "'Golos Text', sans-serif" }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,229,255,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                    >
                      <option value="" style={{ background: '#141824' }}>Выберите услугу</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title} style={{ background: '#141824' }}>{s.title}</option>)}
                    </select>
                  </div>

                  {(!selectedDate || !selectedTime) && (
                    <div className="text-xs text-muted-foreground px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Icon name="Info" size={14} className="neon-text shrink-0" />
                      Выберите дату и время в календаре слева
                    </div>
                  )}

                  {selectedDate && selectedTime && (
                    <div className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}>
                      <Icon name="CalendarCheck" size={16} className="neon-text shrink-0" />
                      <span>
                        {selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })},{" "}
                        <strong className="neon-text">{selectedTime}</strong>
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="neon-btn px-6 py-3.5 rounded-xl text-base mt-2 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Icon name="CalendarCheck" size={18} />
                    Подтвердить запись
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 relative" style={{ background: 'rgba(0,229,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag">Контакты</div>
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
              Связаться со мной
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { icon: "Mail", title: "Email", value: "brainmodel@yandex.ru", href: "mailto:brainmodel@yandex.ru" },
              { icon: "Clock", title: "Часы приёма", value: "9:00 — 16:00", href: "" },
              { icon: "Phone", title: "ВОККДЦ", value: "+7 (473) 272-02-05", href: "tel:+74732720205" },
              { icon: "Phone", title: "Smart Clinic", value: "+7 473 211-80-82", href: "tel:+74732118082" },
            ].map(c => (
              <div key={c.title} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <Icon name={c.icon} size={22} className="neon-text" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{c.title}</div>
                {c.href ? (
                  <a href={c.href} className="font-medium text-sm leading-relaxed hover:text-primary transition-colors whitespace-pre-line">{c.value}</a>
                ) : (
                  <div className="font-medium text-sm leading-relaxed whitespace-pre-line">{c.value}</div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://t.me/brainmodel76" target="_blank" rel="noopener noreferrer"
              className="glass-card px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <Icon name="Send" size={18} className="neon-text" />
              <span className="font-medium text-sm">Telegram</span>
            </a>
            <a href="https://max.ru/join/W_9gST8pFWDy8yplJ8sC9WUF9XuQU6ttrbjtzG5mkG4" target="_blank" rel="noopener noreferrer"
              className="glass-card px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <Icon name="MessageCircle" size={18} className="neon-text" />
              <span className="font-medium text-sm">Макс</span>
            </a>
            <a href="https://dzen.ru/id/6625fe9426b0b07859221c96" target="_blank" rel="noopener noreferrer"
              className="glass-card px-6 py-3 flex items-center gap-3 hover:-translate-y-0.5 transition-all"
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <Icon name="Rss" size={18} className="neon-text" />
              <span className="font-medium text-sm">Дзен</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 pb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="https://cdn.poehali.dev/projects/e2a2e8fc-1c7b-4d0d-94e9-d091c4a3a812/bucket/d0e47aed-5e28-4114-80c1-baf9a204c911.png" alt="Radiology Art" className="w-7 h-7 rounded-md object-cover" />
                <span className="font-bold text-sm"><span className="neon-text">Radiology</span> Art</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Лучевая диагностика — как искусство.<br />Попов Алексей Юрьевич.<br />Воронеж, 2026.
              </p>
            </div>

            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Реквизиты</div>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                <div>Самозанятый: Попов Алексей Юрьевич</div>
                <div>ИНН: 644101988643</div>
                <div>Плательщик налога на профессиональный доход</div>
                <div className="mt-2">
                  <a href="mailto:brainmodel@yandex.ru" className="hover:text-primary transition-colors">brainmodel@yandex.ru</a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Документы</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Договор оферты", icon: "FileText" },
                  { label: "Политика конфиденциальности", icon: "Shield" },
                  { label: "Обработка персональных данных", icon: "Lock" },
                ].map(doc => (
                  <button key={doc.label} onClick={() => alert(`Документ "${doc.label}" в разработке. По запросу направляется на email.`)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors text-left">
                    <Icon name={doc.icon} size={12} className="neon-text shrink-0" />
                    {doc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-muted-foreground text-xs">© 2026 Попов Алексей Юрьевич — врач-рентгенолог высшей категории, к.м.н.</p>
            <p className="text-muted-foreground text-xs">ИНН 644101988643 · Самозанятый</p>
          </div>
        </div>
      </footer>
    </div>
  );
}