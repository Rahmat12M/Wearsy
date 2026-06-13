import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import "./Gallery.css";
import Header from "../components/Header";

const NAV_ITEMS_KEYS = [
  { path: "/", key: "home", icon: "⌂" },
  { path: "/dashboard", key: "dashboard", icon: "⊞" },
  { path: "/wardrobe", key: "wardrobe", icon: "👗" },
  { path: "/planner", key: "planner", icon: "📅" },
  { path: "/gallery", key: "gallery", icon: "🖼" },
  { path: "/profile", key: "profile", icon: "◯" },
];

const TAG_FILTERS = ["Alle", "Abend", "Business", "Casual", "Freizeit"];

const MOCK_OUTFITS = [
  { id: 1, name: "Dinner Outfit",      date: "23. Mai 2026", tag: "Abend",    liked: true,  image: "https://images.pexels.com/photos/28002665/pexels-photo-28002665.jpeg" },
  { id: 2, name: "Office Look",        date: "20. Mai 2026", tag: "Business", liked: false, image: "https://images.pexels.com/photos/37356530/pexels-photo-37356530.jpeg" },
  { id: 3, name: "Casual Sunday",      date: "18. Mai 2026", tag: "Casual",   liked: true,  image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80" },
  { id: 4, name: "Spring Spaziergang", date: "15. Mai 2026", tag: "Freizeit", liked: false, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80" },
];

export default function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const t = translations[lang].gallery;
  const tNav = translations[lang].nav;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [outfits, setOutfits]         = useState(MOCK_OUTFITS);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [deleteId, setDeleteId]       = useState(null);
  const [copiedId, setCopiedId]       = useState(null);
  const [user, setUser] = useState(null);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("wearsy_profile");
  localStorage.removeItem("wearsy_avatar");
  localStorage.removeItem("wearsy_username");
  navigate("/login");
}; 

const toggleLike = (id) => setOutfits(outfits.map((o) => o.id === id ? { ...o, liked: !o.liked } : o));

  const handleShare = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/outfit/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = activeFilter === t.all || activeFilter === "Alle"
    ? outfits
    : outfits.filter((o) => o.tag === activeFilter);

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

//-----------------------------
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/outfits/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.success) {
      setOutfits((prev) =>
        prev.filter((item) => item.id !== id)
      );
      setDeleteId(null);
    } else {
      alert("Fehler beim Löschen");
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="gl-layout">
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

      <main className="gl-main">
<<<<<<< HEAD
        <header className="db-topbar">
          <button className="db-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="db-topbar-text">
            <h1>{t.title}</h1>
            <p>{outfits.length} {t.outfits}</p>
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
     

        <Header title={t.title} subtitle={`${outfits.length} ${t.outfits}`} />
>>>>>>> origin/sahar

        <div className="gl-filters">
          {TAG_FILTERS.map((tag) => (
            <button key={tag}
              className={`gl-filter-btn ${activeFilter === tag ? "active" : ""}`}
              onClick={() => setActiveFilter(tag)}>{tag}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="gl-empty"><span>🪞</span><p>{t.empty}</p></div>
        ) : (
          <div className="gl-list">
            {filtered.map((outfit) => (
              <div key={outfit.id} className="gl-item">
                <div className="gl-item-image-wrap">
                  <div className="gl-item-image">
                    <img src={outfit.image} alt={outfit.name} />
                  </div>
                  <div className="gl-item-image-expanded" aria-hidden="true">
                    <img src={outfit.image} alt="" />
                  </div>
                </div>
                <div className="gl-item-info">
                  <div className="gl-item-top">
                    <h2>{outfit.name}</h2>
                    <span className="gl-tag">{outfit.tag}</span>
                  </div>
                  <p className="gl-item-date">{outfit.date}</p>
                </div>
                <div className="gl-item-actions">
                  <button className={`gl-btn-like ${outfit.liked ? "liked" : ""}`}
                    onClick={() => toggleLike(outfit.id)} title="Favorit">
                    {outfit.liked ? "♥" : "♡"}
                  </button>
                  <button className="gl-btn-share"
                    onClick={() => handleShare(outfit.id)} title={t.share}>
                    {copiedId === outfit.id ? "✓" : "⤴"}
                  </button>
                  <button className="gl-btn-delete"
                     onClick={() => setDeleteId(outfit.id)} title={t.delete}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {deleteId && (
        <div className="gl-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="gl-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t.deleteTitle}</h3>
            <p>{t.deleteWarning}</p>
            <div className="gl-modal-actions">
              <button className="gl-modal-cancel" onClick={() => setDeleteId(null)}>{t.cancel}</button>
              <button className="gl-modal-confirm"
                onClick={() => { setOutfits(outfits.filter(o => o.id !== deleteId)); setDeleteId(null); }}>
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}