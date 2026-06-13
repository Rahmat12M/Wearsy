import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import Header from "../components/Header";
import "./Planner.css";

const NAV_ITEMS_KEYS = [
  { path: "/", key: "home", icon: "⌂" },
  { path: "/dashboard", key: "dashboard", icon: "⊞" },
  { path: "/wardrobe", key: "wardrobe", icon: "👗" },
  { path: "/planner", key: "planner", icon: "📅" },
  { path: "/gallery", key: "gallery", icon: "🖼" },
  { path: "/profile", key: "profile", icon: "◯" },
];

const MOCK_WEATHER_WEEK = [
  { icon: "☀️", temp: 20, desc: "Sonnig" },
  { icon: "⛅", temp: 17, desc: "Bewölkt" },
  { icon: "🌧️", temp: 13, desc: "Regen" },
  { icon: "☀️", temp: 22, desc: "Sonnig" },
  { icon: "🌤️", temp: 19, desc: "Heiter" },
  { icon: "☁️", temp: 15, desc: "Grau" },
  { icon: "☀️", temp: 21, desc: "Sonnig" },
];

const OUTFIT_SUGGESTIONS = {
  "Sonnig":  { name: "Sommerkleid", emoji: "👗" },
  "Bewölkt": { name: "Leichter Trenchcoat", emoji: "🧥" },
  "Regen":   { name: "Regenjacke + Boots", emoji: "🧥" },
  "Heiter":  { name: "Jeans + Bluse", emoji: "👚" },
  "Grau":    { name: "Strickpullover", emoji: "🧶" },
};

const MOCK_OUTFITS = [
  { id: 1, name: "Weißes Hemd", emoji: "👔" },
  { id: 2, name: "Sommerkleid", emoji: "👗" },
  { id: 3, name: "Jeans + Blazer", emoji: "👖" },
  { id: 4, name: "Sportoutfit", emoji: "🩱" },
  { id: 5, name: "Abendkleid", emoji: "✨" },
];

const EVENT_TYPES_DE = ["Arbeit", "Sport", "Party", "Dinner", "Casual", "Reise", "Sonstiges"];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { offset: (firstDay + 6) % 7, daysInMonth };
}

export default function Planner() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const { lang } = useLang();
  const t = translations[lang].planner;
  const tNav = translations[lang].nav;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView]               = useState("week");
  const [calMonth, setCalMonth]       = useState(today.getMonth());
  const [calYear, setCalYear]         = useState(today.getFullYear());
  const [weekOffset, setWeekOffset]   = useState(0);
  const [dayData, setDayData]         = useState({});
  const [activeDay, setActiveDay]     = useState(null);
  const [user, setUser] = useState(null);
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("wearsy_profile");
  localStorage.removeItem("wearsy_avatar");
  localStorage.removeItem("wearsy_username");
  navigate("/login");
};
  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
    });
  };

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setUser(data.user);
  };
  fetchProfile();
}, []);

  const weekDates = getWeekDates();
  const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const updateDay = (key, field, value) =>
    setDayData((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  const { offset, daysInMonth } = getMonthDays(calYear, calMonth);

  return (
    <div className="pl-layout">
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-logo">W</div>
        <nav className="db-nav">
          {NAV_ITEMS_KEYS.map((item) => (
            <Link key={item.path} to={item.path}
              className={`db-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{tNav[item.key]}</span>
            </Link>
          ))}
        </nav>
        <button className="db-logout" onClick={handleLogout}>
          <span>↩</span><span>{tNav.logout}</span>
        </button>
      </aside>

      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="pl-main">
        <Header
          title={t.title}
          subtitle={today.toLocaleDateString("de-DE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          user={user}
        />


        {view === "week" && (
          <div className="pl-week">
            <div className="pl-nav-row">
              <div className="pl-week-nav">
                <button onClick={() => setWeekOffset(w => w - 1)}>‹</button>
                <span>
                  {weekDates[0].toLocaleDateString("de-DE", { day: "numeric", month: "short" })} —{" "}
                  {weekDates[6].toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <button onClick={() => setWeekOffset(w => w + 1)}>›</button>
              </div>
              <div className="pl-view-toggle">
                <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>{t.week}</button>
                <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>{t.month}</button>
              </div>
            </div>

            <div className="pl-week-grid">
              {weekDates.map((date, i) => {
                const key = dayKey(date);
                const data = dayData[key] || {};
                const weather = MOCK_WEATHER_WEEK[i];
                const suggestion = OUTFIT_SUGGESTIONS[weather.desc] || { name: "Freie Wahl", emoji: "👗" };
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div key={key} className={`pl-day-card ${isToday ? "today" : ""}`}>
                    <div className="pl-day-header">
                      <span className="pl-day-name">{t.weekDays[i]}</span>
                      <span className={`pl-day-num ${isToday ? "today-num" : ""}`}>{date.getDate()}</span>
                    </div>
                    <div className="pl-day-weather">
                      <span>{weather.icon}</span><span>{weather.temp}°</span>
                      <span className="pl-day-weather-desc">{weather.desc}</span>
                    </div>
                    <div className="pl-day-suggestion">
                      <span className="pl-suggestion-label">{t.suggestion}</span>
                      <span>{suggestion.emoji} {suggestion.name}</span>
                    </div>
                    {data.outfit ? (
                      <div className="pl-day-outfit-selected">
                        <span>{data.outfit.emoji}</span><span>{data.outfit.name}</span>
                        <button onClick={() => updateDay(key, "outfit", null)}>×</button>
                      </div>
                    ) : (
                      <button className="pl-pick-btn"
                        onClick={() => { setActiveDay(key); setShowOutfitPicker(true); }}>
                        {t.pickOutfit}
                      </button>
                    )}
                    <select className="pl-event-select"
                      value={data.event || ""}
                      onChange={(e) => updateDay(key, "event", e.target.value)}>
                      <option value="">{t.noEvent}</option>
                      {EVENT_TYPES_DE.map(ev => <option key={ev}>{ev}</option>)}
                    </select>
                    <textarea className="pl-note" placeholder={t.note}
                      value={data.note || ""}
                      onChange={(e) => updateDay(key, "note", e.target.value)} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "month" && (
          <div className="pl-month">
            <div className="pl-nav-row">
              <div className="pl-month-nav">
                <button onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                  else setCalMonth(m => m - 1);
                }}>‹</button>
                <span>{t.months[calMonth]} {calYear}</span>
                <button onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                  else setCalMonth(m => m + 1);
                }}>›</button>
              </div>
              <div className="pl-view-toggle">
                <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>{t.week}</button>
                <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>{t.month}</button>
              </div>
            </div>
            <div className="pl-cal-grid">
              {t.weekDays.map(d => <div key={d} className="pl-cal-header">{d}</div>)}
              {Array.from({ length: offset }, (_, i) => (
                <div key={`e-${i}`} className="pl-cal-cell pl-cal-cell--empty" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = new Date(calYear, calMonth, i + 1);
                const key = dayKey(d);
                const data = dayData[key] || {};
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div key={key}
                    className={`pl-cal-cell ${isToday ? "today" : ""} ${data.outfit ? "has-outfit" : ""}`}
                    onClick={() => { setActiveDay(key); setShowOutfitPicker(true); }}>
                    <span className="pl-cal-day-num">{i + 1}</span>
                    {data.outfit && <span className="pl-cal-outfit-dot">{data.outfit.emoji}</span>}
                    {data.event && <span className="pl-cal-event-dot">{data.event}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {showOutfitPicker && (
        <div className="pl-modal-overlay" onClick={() => setShowOutfitPicker(false)}>
          <div className="pl-modal" onClick={e => e.stopPropagation()}>
            <h3>{t.pickTitle}</h3>
            <div className="pl-outfit-list">
              {MOCK_OUTFITS.map(outfit => (
                <button key={outfit.id} className="pl-outfit-option"
                  onClick={() => { updateDay(activeDay, "outfit", outfit); setShowOutfitPicker(false); }}>
                  <span className="pl-outfit-emoji">{outfit.emoji}</span>
                  <span>{outfit.name}</span>
                </button>
              ))}
            </div>
            <button className="pl-modal-close" onClick={() => setShowOutfitPicker(false)}>
              {translations[lang].wardrobe.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}