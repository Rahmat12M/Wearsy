import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import Header from "../components/Header";
import "./Wardrobe.css";

const NAV_ITEMS_KEYS = [
  { path: "/", key: "home", icon: "⌂" },
  { path: "/dashboard", key: "dashboard", icon: "⊞" },
  { path: "/wardrobe", key: "wardrobe", icon: "👗" },
  { path: "/planner", key: "planner", icon: "📅" },
  { path: "/gallery", key: "gallery", icon: "🖼" },
  { path: "/profile", key: "profile", icon: "◯" },
];

const CATEGORIES = [
  { value: "all", label: "Alle" },
  { value: "top", label: "Oberteil" },
  { value: "pants", label: "Hose" },
  { value: "dress", label: "Kleid" },
  { value: "shoes", label: "Schuhe" },
  { value: "jacket", label: "Jacke" },
  { value: "accessory", label: "Accessoire" }
];
const COLORS_DE     = ["Alle", "Weiß", "Schwarz", "Grau", "Beige", "Blau", "Rot", "Grün", "Rosa"];
const SEASONS_DE    = ["Alle", "Frühling", "Sommer", "Herbst", "Winter"];
const CARE_ICONS    = { clean: "✓", dirty: "🧺", dry_cleaning: "👔" };

const MOCK_CLOTHES = [
  { id: 1, name: "Weißes Leinenhemd", category: "Oberteil", color: "Weiß",    season: "Sommer",   used: 12, clean: "clean",        image: "https://images.unsplash.com/photo-1623686202980-4fdf80e5529c?q=80&w=780&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 2, name: "Schwarze Hose",     category: "Hose",     color: "Schwarz", season: "Alle",     used: 20, clean: "dirty",        image: "https://images.pexels.com/photos/13258318/pexels-photo-13258318.jpeg" },
  { id: 3, name: "Seidenkleid",       category: "Kleid",    color: "Rosa",    season: "Frühling", used: 3,  clean: "clean",        image: "https://plus.unsplash.com/premium_photo-1675186049530-33e9479f0298?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: "sport",        category: "Jacke",    color: "Beige",   season: "Winter",   used: 8,  clean: "dry_cleaning", image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80" },
  { id: 5, name: "Weiße Sneaker",     category: "Schuhe",   color: "Weiß",    season: "Alle",     used: 0,  clean: "clean",        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "beige T-Shirt",    category: "Oberteil", color: "beige",    season: "Sommer",   used: 5,  clean: "dirty",        image: "https://plus.unsplash.com/premium_photo-1755422107149-e47860ae16bb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const usageLabel = (n) => n === 0 ? "nie" : n <= 5 ? "selten" : "oft";

export default function Wardrobe() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { lang } = useLang();
  const t = translations[lang].wardrobe;
  const tNav = translations[lang].nav;

  const USAGE_OPTIONS = [t.all, t.often, t.rarely, t.never];

  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [clothes, setClothes]           = useState(MOCK_CLOTHES);
  const [search, setSearch]             = useState("");
  const [filterCat, setFilterCat]       = useState("all");
  const [filterColor, setFilterColor]   = useState("Alle");
  const [filterSeason, setFilterSeason] = useState("Alle");
  const [filterUsage, setFilterUsage]   = useState(t.all);
  const [showModal, setShowModal]       = useState(false);
  const [deleteId, setDeleteId]         = useState(null);
  const [user, setUser] = useState(null);
  const [newItem, setNewItem] = useState({
  name: "",
  category: "top",
  color: "Weiß",
  season: "Alle",
  clean: "clean",
  image: null,
  preview: null,
});

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setNewItem((p) => ({ ...p, image: file, preview: e.target.result }));
    reader.readAsDataURL(file);
  };

  // const handleAddItem = () => {
  //   if (!newItem.name.trim()) return;
  //   setClothes([{ id: Date.now(), name: newItem.name, category: newItem.category,
  //     color: newItem.color, season: newItem.season, clean: newItem.clean, used: 0,
  //     image: newItem.preview || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80",
  //   }, ...clothes]);
  //   setNewItem({ name: "", category: "Oberteil", color: "Weiß", season: "Alle", clean: "clean", image: null, preview: null });
  //   setShowModal(false);
  // };

  const handleAddItem = async () => {
  if (!newItem.name.trim()) return;

  try {
    const token = localStorage.getItem("token");
   const formData = new FormData();

      formData.append("title", newItem.name);
      formData.append("category", newItem.category);
      formData.append("color", newItem.color);
      formData.append("season", newItem.season);
      formData.append("clean", newItem.clean);

      if (newItem.image) {
        formData.append("image", newItem.image);
      }
    const res = await fetch("http://localhost:5000/albums", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setClothes((prev) => [
        {
          id: data.post.id,
          name: data.post.title,
          category: data.post.category,
          color: data.post.color,
          season: data.post.season,
          clean: data.post.clean,
          used: 0,
          image: `http://localhost:5000/uploads/${data.post.image}`,
        },
        ...prev,
      ]);

      setNewItem({
        name: "",
        category: "top",
        color: "Weiß",
        season: "Alle",
        clean: "clean",
        image: null,
        preview: null,
      });

      setShowModal(false);
    }
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  const fetchAlbums = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/albums",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
        console.log(data.posts[0]);
      const dbClothes = data.posts.map((item) => ({
        id: item.id,
        name: item.title,
        category: item.category,
        color: item.color,
        season: item.season,
        clean: item.clean || "clean",
        used: 0,
        image: `http://localhost:5000/uploads/${item.image}`,
      }));

      setClothes([
        // ...MOCK_CLOTHES,
        ...dbClothes,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  fetchAlbums();
}, []);

  const toggleClean = (id) => {
    setClothes(clothes.map((c) => {
      if (c.id !== id) return c;
      const next = { clean: "dirty", dirty: "dry_cleaning", dry_cleaning: "clean" }[c.clean];
      return { ...c, clean: next };
    }));
  };

  const filtered = clothes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "all" || c.category === filterCat;
    const matchColor  = filterColor === "Alle" || c.color === filterColor;
    const matchSeason = filterSeason === "Alle" || c.season === filterSeason || c.season === "Alle";
    const matchUsage  = filterUsage === t.all ||
      (filterUsage === t.often  && c.used > 5) ||
      (filterUsage === t.rarely && c.used > 0 && c.used <= 5) ||
      (filterUsage === t.never  && c.used === 0);
    return matchSearch && matchCat && matchColor && matchSeason && matchUsage;
  });

const handleDelete = async (id) => {
  try {
    console.log("Deleting ID:", id);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/albums/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    console.log("DELETE RESPONSE:", data);

    if (data.success) {
      setClothes((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setDeleteId(null);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="wd-layout">
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
      <main className="wd-main">
        <Header title={t.title} subtitle={`${clothes.length} ${t.pieces}`} user={user} />

        <div className="wd-toolbar">
          <div className="wd-search-wrap">
            <span className="wd-search-icon">🔍</span>
            <input className="wd-search" placeholder={t.search}
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="wd-add-btn" onClick={() => setShowModal(true)}>{t.add}</button>
        </div>
        <div className="wd-filters">
          <div className="wd-filter-group">
            <span className="wd-filter-label">{t.category}</span>
            <div className="wd-filter-pills">
              {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    className={`wd-pill ${filterCat === c.value ? "active" : ""}`}
                    onClick={() => setFilterCat(c.value)}
                  >
                    {c.label}
                  </button>
                ))}
            </div>
          </div>
          <div className="wd-filter-row">
            <div className="wd-filter-group">
              <span className="wd-filter-label">{t.color}</span>
              <div className="wd-filter-pills">
                {COLORS_DE.map((c) => (
                  <button key={c} className={`wd-pill ${filterColor === c ? "active" : ""}`}
                    onClick={() => setFilterColor(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="wd-filter-group">
              <span className="wd-filter-label">{t.season}</span>
              <div className="wd-filter-pills">
                {SEASONS_DE.map((s) => (
                  <button key={s} className={`wd-pill ${filterSeason === s ? "active" : ""}`}
                    onClick={() => setFilterSeason(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="wd-filter-group" style={{borderRight: "none"}}>
              <span className="wd-filter-label">{t.usage}</span>
              <div className="wd-filter-pills">
                {USAGE_OPTIONS.map((u) => (
                  <button key={u} className={`wd-pill ${filterUsage === u ? "active" : ""}`}
                    onClick={() => setFilterUsage(u)}>{u}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="wd-empty"><span>👗</span><p>{t.empty}</p></div>
        ) : (
          <div className="wd-grid">
            {filtered.map((item) => (
              <div key={item.id} className="wd-card">
                <div className="wd-card-image">
                  <img src={item.image} alt={item.name} />
                  <button className={`wd-clean-badge wd-clean-${item.clean}`}
                    onClick={() => toggleClean(item.id)}>{CARE_ICONS[item.clean]}</button>
                  <span className={`wd-usage-badge wd-usage-${usageLabel(item.used)}`}>
                    {usageLabel(item.used)}
                  </span>
                </div>
                <div className="wd-card-info">
                  <p className="wd-card-name">{item.name}</p>
                  <div className="wd-card-meta">
                    <span className="wd-card-tag">{item.category}</span>
                    <span className="wd-card-season">{item.season}</span>
                  </div>
                </div>
                <button className="wd-delete-btn" onClick={() => setDeleteId(item.id)}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="wd-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="wd-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t.addTitle}</h3>
            <div className="wd-upload-area" onClick={() => fileInputRef.current.click()}>
              {newItem.preview
                ? <img src={newItem.preview} alt="preview" className="wd-upload-preview" />
                : <><span>📁</span><p>{t.selectPhoto}</p></>}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*"
              style={{ display: "none" }} onChange={(e) => handleImageFile(e.target.files[0])} />
            <button className="wd-camera-btn" onClick={() => cameraInputRef.current.click()}>
              {t.openCamera}
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
              style={{ display: "none" }} onChange={(e) => handleImageFile(e.target.files[0])} />
            <div className="wd-modal-fields">
              <div className="wd-field">
                <label>{t.name}</label>
                <input type="text" placeholder={t.namePlaceholder}
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="wd-field-row">
                <div className="wd-field">
                  <label>{t.category}</label>
                  <select value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="wd-field">
                  <label>{t.color}</label>
                  <select value={newItem.color}
                    onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}>
                    {COLORS_DE.filter(c => c !== "Alle").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="wd-field-row">
                <div className="wd-field">
                  <label>{t.season}</label>
                  <select value={newItem.season}
                    onChange={(e) => setNewItem({ ...newItem, season: e.target.value })}>
                    {SEASONS_DE.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="wd-field">
                  <label>{t.condition}</label>
                  <select value={newItem.clean}
                    onChange={(e) => setNewItem({ ...newItem, clean: e.target.value })}>
                    <option value="clean">{t.clean}</option>
                    <option value="dirty">{t.dirty}</option>
                    <option value="dry_cleaning">{t.dryClean}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="wd-modal-actions">
              <button className="wd-modal-cancel" onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button className="wd-modal-confirm" onClick={handleAddItem}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="wd-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="wd-modal wd-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h3>{t.deleteTitle}</h3>
            <p>{t.deleteWarning}</p>
            <div className="wd-modal-actions">
              <button className="wd-modal-cancel" onClick={() => setDeleteId(null)}>{t.cancel}</button>
              <button className="wd-modal-confirm wd-modal-confirm--red" 
                onClick={() => handleDelete(deleteId)}

                >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}