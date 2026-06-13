import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import Header from "../components/Header";
import "./Dashboard.css";

const NAV_ITEMS_KEYS = [
  { path: "/", key: "home", icon: "⌂" },
  { path: "/dashboard", key: "dashboard", icon: "⊞" },
  { path: "/wardrobe", key: "wardrobe", icon: "👗" },
  { path: "/planner", key: "planner", icon: "📅" },
  { path: "/gallery", key: "gallery", icon: "🖼" },
  { path: "/profile", key: "profile", icon: "◯" },
];

const WEEK_DAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MOCK_PLAN = {
  Mo: "Office Look", Di: "Casual Style", Mi: null,
  Do: "Sport", Fr: "Dinner Outfit", Sa: null, So: "Relaxed Sunday",
};

const WEATHER_ICON = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
  Snow: "❄️", Thunderstorm: "⛈️", Mist: "🌫️", Fog: "🌫️",
};

const MOCK_FAVORITES = [
  { id: 1, emoji: "👗", name: "Dinner Outfit", tag: "Abend",
    image: "https://plus.unsplash.com/premium_photo-1675186049530-33e9479f0298?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, emoji: "💼", name: "Office Look", tag: "Business",
    image: "https://images.pexels.com/photos/37356530/pexels-photo-37356530.jpeg" },
  // { id: 3, emoji: "👟", name: "Casual Sunday", tag: "Casual",
  //   image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=80&q=80" },
  { id: 4, emoji: "🌸", name: "Spring Spaziergang", tag: "Freizeit",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=80&q=80" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const t = translations[lang].dashboard;
  const tNav = translations[lang].nav;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");
  const [albums, setAlbums] = useState([]);
  const [user, setUser] = useState(null);
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long",
  });
  const todayShort = WEEK_DAYS_DE[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  // ── Weather ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setWeatherError(t.locationUnsupported);
      setWeatherLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=de&appid=${apiKey}`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setWeather({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            city: data.name,
            description: data.weather[0].description,
            icon: WEATHER_ICON[data.weather[0].main] || "🌡️",
          });
        } catch { setWeatherError(t.weatherError); }
        finally { setWeatherLoading(false); }
      },
      () => { setWeatherError(t.locationDenied); setWeatherLoading(false); }
    );
  }, []);

  // ── Albums fetch ──
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/albums", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAlbums(data.posts);
      } catch (error) { console.log(error); }
    };
    fetchAlbums();
  }, []);

<<<<<<< HEAD
      useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

=======
>>>>>>> origin/sahar
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("wearsy_profile");
    localStorage.removeItem("wearsy_avatar");
    localStorage.removeItem("wearsy_username");
    navigate("/login");
  };

  // ── Stats — mock وقتی database خالیه ──
  const topsCount    = albums.length > 0 ? albums.filter(i => i.category === "top").length : 2;
  const pantsCount   = albums.length > 0 ? albums.filter(i => i.category === "pants").length : 3;
  const dressesCount = albums.length > 0 ? albums.filter(i => i.category === "dress").length : 2;
  const shoesCount   = albums.length > 0 ? albums.filter(i => i.category === "shoes").length : 2;

  // ── Favorites — از backend اگه داشت، وگرنه mock ──
  const favorites = albums.length > 0 ? albums : MOCK_FAVORITES;

  return (
    <div className="db-layout">
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

      <main className="db-main">

<<<<<<< HEAD
          <div className="db-topbar-text">
            <h1>{t.title}</h1>

            <p>{today}</p>
          </div>

           <div className="db-avatar">
            {user?.profile_image ? (
              <img
                src={`http://localhost:5000/${user.profile_image}`}
                alt="Profile"
                className="db-avatar-img"
              />
            ) : (
              user?.nachname?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
        </header>
=======
        <Header title={t.title} subtitle={today} />
>>>>>>> origin/sahar

        <div className="db-grid">

          {/* Weather + Outfit */}
          <section className="db-card db-card--wide db-outfit">
            <div className="db-outfit-weather">
              {weatherLoading ? (
                <div className="db-weather-loading">
                  <span className="db-weather-spinner" />
                  <span>{t.locating}</span>
                </div>
              ) : weatherError ? (
                <div className="db-weather-err"><span>📍</span><span>{weatherError}</span></div>
              ) : (
                <>
                  <span className="db-weather-icon">{weather.icon}</span>
                  <div>
                    <p className="db-weather-temp">{weather.temp}°C</p>
                    <p className="db-weather-city">{weather.city}</p>
                    <p className="db-weather-desc">{weather.description}</p>
<<<<<<< HEAD
                    <p className="db-weather-feels">
                      {t.feelsLike} {weather.feelsLike}°C
                    </p>
=======
                    <p className="db-weather-feels">{t.feelsLike} {weather.feelsLike}°C</p>
>>>>>>> origin/sahar
                  </div>
                </>
              )}
            </div>
            <div className="db-outfit-divider" />
            <div className="db-outfit-suggestion">
              <p className="db-card-label">{t.outfitOfDay}</p>
              <h2>Leichter Trenchcoat</h2>
              <p className="db-outfit-desc">
                {t.outfitDesc}{weather ? ` — ${weather.temp}°, ${weather.description}` : ""}.
              </p>
              <button className="db-btn">{t.saveOutfit}</button>
            </div>
            <div className="db-outfit-image-wrap">
              <div className="db-outfit-image-thumb">
                <img src="https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80" alt="Outfit" />
              </div>
              <div className="db-outfit-image-expanded" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80" alt="" />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="db-card db-stats">
<<<<<<< HEAD
          <p className="db-card-label">
            {t.wardrobe}
          </p>
          <div className="db-stats-grid">
            <div className="db-stat">
              <span className="db-stat-num">
                {topsCount}
              </span>
              <span className="db-stat-label">
                {t.tops}
              </span>
              <div className="db-stat-items">
                {albums.filter((item) => item.category === "tops")
                  .map((item) => (
                    <p key={item._id}>
                      {item.title}
                    </p>
                  ))}
              </div>
            </div>
            <div className="db-stat">
              <span className="db-stat-num">
                {pantsCount}
              </span>
              <span className="db-stat-label">
                {t.pants}
              </span>
              <div className="db-stat-items">
                {albums
                  .filter((item) => item.category === "pants")
                  .map((item) => (
                    <p key={item._id}>
                      {item.title}
                    </p>
                  ))}
              </div>
            </div>
            <div className="db-stat">
              <span className="db-stat-num">
                {dressesCount}
              </span>
              <span className="db-stat-label">
                {t.dresses}
              </span>
              <div className="db-stat-items">
                {albums
                  .filter((item) => item.category === "dresses")
                  .map((item) => (
                    <p key={item._id}>
                      {item.title}
                    </p>
                  ))}
              </div>
            </div>
            <div className="db-stat">
              <span className="db-stat-num">
                {shoesCount}
              </span>

              <span className="db-stat-label">
                {t.shoes}
              </span>

              <div className="db-stat-items">
                {albums
                  .filter((item) => item.category === "shoes")
                  .map((item) => (
                    <p key={item._id}>
                      {item.title}
                    </p>
                  ))}
              </div>
            </div>

          </div>
        </section>
=======
            <p className="db-card-label">{t.wardrobe}</p>
            <div className="db-stats-grid">
              <div className="db-stat">
                <span className="db-stat-num">{topsCount}</span>
                <span className="db-stat-label">{t.tops}</span>
              </div>
              <div className="db-stat">
                <span className="db-stat-num">{pantsCount}</span>
                <span className="db-stat-label">{t.pants}</span>
              </div>
              <div className="db-stat">
                <span className="db-stat-num">{dressesCount}</span>
                <span className="db-stat-label">{t.dresses}</span>
              </div>
              <div className="db-stat">
                <span className="db-stat-num">{shoesCount}</span>
                <span className="db-stat-label">{t.shoes}</span>
              </div>
            </div>
          </section>
>>>>>>> origin/sahar

          {/* Wochenplan */}
          <section className="db-card db-week">
            <p className="db-card-label">{t.weekplan}</p>
            <div className="db-week-grid">
              {WEEK_DAYS_DE.map((day) => (
                <div key={day}
                  className={`db-week-day ${day === todayShort ? "today" : ""} ${MOCK_PLAN[day] ? "has-outfit" : ""}`}
                  data-detail={MOCK_PLAN[day] ? `${day}: ${MOCK_PLAN[day]}` : `${day}: Kein Outfit geplant`}>
                  <span className="db-week-day-label">{day}</span>
                  <span className="db-week-day-outfit">{MOCK_PLAN[day] || "—"}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Favoriten */}
          <section className="db-card db-favorites">
            <p className="db-card-label">{t.favorites}</p>
            <div className="db-fav-list">
              {favorites.map((item) => (
                <div key={item.id} className="db-fav-item">
                  {item.image ? (
                    <img
                      src={albums.length > 0
                        ? `http://localhost:5000/uploads/${item.image}`
                        : item.image}
                      alt={item.title || item.name}
                      className="db-fav-image"
                    />
                  ) : (
                    <span className="db-fav-emoji">{item.emoji || "👗"}</span>
                  )}
                  <div className="db-fav-content">
                    <span className="db-fav-name">{item.title || item.name}</span>
                    <span className="db-fav-tag">{item.category || item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}