import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import "./Home.css";

const LANGUAGES = [
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

const FEATURES = [
  { icon: "👗", key: "f1" },
  { icon: "☀️", key: "f2" },
  { icon: "📅", key: "f3" },
  { icon: "🧳", key: "f4" },
];

const FEATURES_TEXT = {
  de: [
    { title: "Digitaler Kleiderschrank", desc: "Lade deine Kleidung hoch und behalte den Überblick über alles, was du besitzt." },
    { title: "Wetter-Outfits", desc: "Erhalte tägliche Outfit-Vorschläge basierend auf dem aktuellen Wetter in deiner Stadt." },
    { title: "Wochenplaner", desc: "Plane deine Outfits für die ganze Woche und vergiss nie, was du wann getragen hast." },
    { title: "Smart Packing", desc: "Reise clever — erstelle Packlisten aus deinem eigenen Kleiderschrank." },
  ],
  en: [
    { title: "Digital Wardrobe", desc: "Upload your clothes and keep track of everything you own." },
    { title: "Weather Outfits", desc: "Get daily outfit suggestions based on the current weather in your city." },
    { title: "Weekly Planner", desc: "Plan your outfits for the whole week and never forget what you wore." },
    { title: "Smart Packing", desc: "Travel smart — create packing lists from your own wardrobe." },
  ],
};

const ABOUT_TEXT = {
  de: {
    title: "Was ist Wearsy?",
    desc: "Wearsy ist deine persönliche Mode-Assistentin. Schluss mit dem täglichen 'Was ziehe ich an?' — wir helfen dir, deinen Stil zu entdecken, deinen Kleiderschrank zu organisieren und jeden Tag mit Freude anzuziehen.",
  },
  en: {
    title: "What is Wearsy?",
    desc: "Wearsy is your personal fashion assistant. No more daily 'What should I wear?' — we help you discover your style, organize your wardrobe, and dress with joy every single day.",
  },
};

export default function Home() {
  const { lang, switchLang } = useLang();
  const features = FEATURES_TEXT[lang];
  const about = ABOUT_TEXT[lang];
  const isDE = lang === "de";

  return (
    <div className="home-layout">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="home-nav-logo">
          <span className="home-logo-mark">W</span>
          <span className="home-logo-text">Wearsy</span>
        </div>

        <div className="home-nav-right">
          {/* Language toggle */}
          <div className="home-lang-toggle">
            {LANGUAGES.map(l => (
              <button key={l.code}
                className={`home-lang-btn ${lang === l.code ? "active" : ""}`}
                onClick={() => switchLang(l.code)}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <Link to="/login" className="home-btn-outline">
            {isDE ? "Anmelden" : "Sign in"}
          </Link>
          <Link to="/register" className="home-btn-filled">
            {isDE ? "Registrieren" : "Get started"}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">
            {isDE ? "Dein digitaler Kleiderschrank" : "Your digital wardrobe"}
          </p>
          <h1 className="home-hero-title">
            {isDE ? <>Style ohne<br />Stress.</> : <>Style without<br />Stress.</>}
          </h1>
          <p className="home-hero-desc">
            {isDE
              ? "Organisiere deine Kleidung, erhalte tägliche Outfit-Vorschläge und plane deine Woche — alles an einem Ort."
              : "Organize your clothes, get daily outfit suggestions and plan your week — all in one place."}
          </p>
          <div className="home-hero-btns">
            <Link to="/register" className="home-btn-filled home-btn-lg">
              {isDE ? "Kostenlos starten" : "Start for free"}
            </Link>
            <Link to="/login" className="home-btn-ghost">
              {isDE ? "Bereits registriert?" : "Already registered?"}
            </Link>
          </div>
        </div>

        <div className="home-hero-image">
          <div className="home-hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
              alt="Wardrobe"
            />
            {/* floating cards */}
            <div className="home-float-card home-float-card--top">
              <span>☀️</span>
              <div>
                <p>{isDE ? "Heute in Hamburg" : "Today in Hamburg"}</p>
                <p>18°C — {isDE ? "Leichter Trenchcoat" : "Light Trenchcoat"}</p>
              </div>
            </div>
            <div className="home-float-card home-float-card--bottom">
              <span>✓</span>
              <div>
                <p>{isDE ? "60 Kleidungsstücke" : "60 clothing items"}</p>
                <p>{isDE ? "organisiert" : "organized"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-features" id="features">
        <p className="home-section-eyebrow">Features</p>
        <h2 className="home-section-title">
          {isDE ? "Alles, was du brauchst" : "Everything you need"}
        </h2>
        <div className="home-features-grid">
          {features.map((f, i) => (
            <div key={i} className="home-feature-card">
              <span className="home-feature-icon">{FEATURES[i].icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="home-about" id="about">
        <div className="home-about-content">
          <p className="home-section-eyebrow">About</p>
          <h2 className="home-section-title">{about.title}</h2>
          <p className="home-about-desc">{about.desc}</p>
          <Link to="/register" className="home-btn-filled">
            {isDE ? "Jetzt ausprobieren" : "Try it now"}
          </Link>
        </div>
        <div className="home-about-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
            alt="Fashion"
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer-logo">
          <span className="home-logo-mark">W</span>
          <span className="home-logo-text">Wearsy</span>
        </div>
        <p className="home-footer-copy">
          © 2026 Wearsy — {isDE ? "Alle Rechte vorbehalten" : "All rights reserved"}
        </p>
        <div className="home-footer-links">
          <Link to="/login">{isDE ? "Anmelden" : "Sign in"}</Link>
          <Link to="/register">{isDE ? "Registrieren" : "Register"}</Link>
        </div>
      </footer>
    </div>
  );
}