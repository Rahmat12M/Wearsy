import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import "./Profile.css";
import Header from "../components/Header";
import myAvatar from "../assets/profile.jpg";

const NAV_ITEMS_KEYS = [
  { path: "/", key: "home", icon: "⌂" },
  { path: "/dashboard", key: "dashboard", icon: "⊞" },
  { path: "/wardrobe", key: "wardrobe", icon: "👗" },
  { path: "/planner", key: "planner", icon: "📅" },
  { path: "/gallery", key: "gallery", icon: "🖼" },
  { path: "/profile", key: "profile", icon: "◯" },
];

const LANGUAGES = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const COUNTRIES = [
  "Deutschland", "Österreich", "Schweiz", "Frankreich",
  "Niederlande", "Belgien", "Iran", "Türkei", "Sonstiges",
];

const GENDERS = ["Weiblich", "Männlich", "Divers", "Keine Angabe"];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { lang, switchLang } = useLang();
  const t = translations[lang].profile;
  const tNav = translations[lang].nav;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingData, setEditingData] = useState(false);
  const [profile, setProfile] = useState({
    vorname: "",
    nachname: "",
    email: "",
    stadt: "",
    land: "",
    geburtstag: "",
    gender: "",
    avatar: localStorage.getItem("wearsy_avatar") || null,
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
<<<<<<< HEAD
  const [saved, setSaved]         = useState(false);
  const [albums, setAlbums] = useState([]);


   useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/albums", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) setAlbums(data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbums();
=======
  const [saved, setSaved] = useState(false);

  // ── token check + fetch profile ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          const u = data.user;
          const updated = {
            vorname: u.vorname || "",
            nachname: u.nachname || "",
            email: u.email || "",
            stadt: u.stadt || "",
            land: u.land || "Deutschland",
            geburtstag: u.geburtstag ? u.geburtstag.split("T")[0] : "",
            gender: u.anrede || "Weiblich",
            avatar: localStorage.getItem("wearsy_avatar") || null,
          };
          setProfile(updated);
          setTempProfile(updated);
          localStorage.setItem("wearsy_profile", JSON.stringify(updated));
          localStorage.setItem("wearsy_username", u.vorname || "");
          window.dispatchEvent(new Event("wearsy-avatar-updated"));
        }
      })
      .catch(err => console.log(err));
>>>>>>> origin/sahar
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("wearsy_profile");
    localStorage.removeItem("wearsy_avatar");
    localStorage.removeItem("wearsy_username");
    navigate("/login");
  };
<<<<<<< HEAD
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

const userData = {
  nachname: data.user.nachname || "",
  email: data.user.email || "",
  stadt: data.user.stadt || "",
  land: data.user.land || "",
  geburtstag: data.user.geburtstag
    ? data.user.geburtstag.split("T")[0]
    : "",
  gender: data.user.anrede || "",
  avatar: data.user.profile_image || null,
};

setProfile(userData);
setTempProfile(userData);

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);


  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (ev) => setProfile((p) => ({ ...p, avatar: ev.target.result }));
  //   reader.readAsDataURL(file);
  // };

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await fetch("http://localhost:5000/profile/avatar", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setProfile((p) => ({
        ...p,
        avatar: `http://localhost:5000/uploads/${data.avatar}`,
      }));
    }
  } catch (err) {
    console.error(err);
  }
};
=======

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((p) => ({ ...p, avatar: ev.target.result }));
      localStorage.setItem("wearsy_avatar", ev.target.result);
      window.dispatchEvent(new Event("wearsy-avatar-updated"));
    };
    reader.readAsDataURL(file);
  };
>>>>>>> origin/sahar

  const handleEditStart = () => { setTempProfile({ ...profile }); setEditingData(true); };
  const handleEditCancel = () => { setTempProfile({ ...profile }); setEditingData(false); };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...tempProfile });
    setEditingData(false);
    setSaved(true);
    localStorage.setItem("wearsy_profile", JSON.stringify(tempProfile));
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess(false);
    if (!passwords.current) { setPwError(t.errorCurrentPw); return; }
    if (passwords.next.length < 6) { setPwError(t.errorMinLength); return; }
    if (passwords.next !== passwords.confirm) { setPwError(t.errorMatch); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/changePwd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
          confirmPassword: passwords.confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.message || "Password change failed"); return; }
      setPwSuccess(true);
      setPasswords({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 2500);
    } catch { setPwError("Server error"); }
  };

  // token check before render
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

<<<<<<< HEAD
  const initials = profile.nachname.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const topsCount = albums.filter(item => item.category === "tops").length;
    const pantsCount = albums.filter(item => item.category === "pants").length;
    const dressesCount = albums.filter(item => item.category === "dress").length;
    const shoesCount = albums.filter(item => item.category === "shoes").length;
  console.log('albums', albums);
  
=======
  const fullName = `${profile.vorname} ${profile.nachname}`.trim();
  const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

>>>>>>> origin/sahar
  return (
    <div className="pf-layout">
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

      <main className="pf-main">
        <Header title={t.title} subtitle={t.subtitle} user={profile}  />

        <div className="pf-grid">
          <div className="pf-col-left">
            <div className="pf-card pf-avatar-card">
              <div className="pf-avatar-wrap" onClick={() => fileInputRef.current.click()}>
                {profile.avatar
                  ? <img src={profile.avatar} alt="Avatar" className="pf-avatar-img" />
                  : <div className="pf-avatar-initials">{initials}</div>
                }
                <div className="pf-avatar-overlay">📷</div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleAvatarChange} />
              <p className="pf-avatar-name">{fullName}</p>
              <p className="pf-avatar-email">{profile.email}</p>
              <button className="pf-avatar-edit-btn" onClick={() => fileInputRef.current.click()}>
                ✏️ {lang === "de" ? "Foto ändern" : "Change photo"}
              </button>
            </div>

<<<<<<< HEAD
            {/* Stats */}

            <section className="db-card db-stats">
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

            {/* Language */}
=======
            <div className="pf-card pf-stats-card">
              <p className="pf-card-label">{t.wardrobe}</p>
              <div className="pf-stats-grid">
                <div className="pf-stat"><span className="pf-stat-num">60</span><span className="pf-stat-label">{t.pieces}</span></div>
                <div className="pf-stat"><span className="pf-stat-num">42</span><span className="pf-stat-label">{t.outfits}</span></div>
                <div className="pf-stat"><span className="pf-stat-num">8</span><span className="pf-stat-label">{t.favorites}</span></div>
                <div className="pf-stat"><span className="pf-stat-num">12</span><span className="pf-stat-label">{t.planned}</span></div>
              </div>
            </div>

>>>>>>> origin/sahar
            <div className="pf-card">
              <p className="pf-card-label">{t.language}</p>
              <div className="pf-lang-btns">
                {LANGUAGES.map(l => (
                  <button key={l.code}
                    className={`pf-lang-btn ${lang === l.code ? "active" : ""}`}
                    onClick={() => switchLang(l.code)}>
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pf-col-right">
            <div className="pf-card">
              <div className="pf-card-head">
                <p className="pf-card-label">{t.personalData}</p>
                {!editingData ? (
                  <button className="pf-edit-btn" onClick={handleEditStart}>
                    ✏️ {lang === "de" ? "Bearbeiten" : "Edit"}
                  </button>
                ) : (
                  <button className="pf-edit-btn pf-edit-btn--cancel" onClick={handleEditCancel}>
                    ✕ {lang === "de" ? "Abbrechen" : "Cancel"}
                  </button>
                )}
              </div>

              {!editingData ? (
                <div className="pf-view-grid">
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.name}</span>
                    <span className="pf-view-value">{fullName}</span>
                  </div>
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.email}</span>
                    <span className="pf-view-value">{profile.email}</span>
                  </div>
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.birthdate}</span>
                    <span className="pf-view-value">{profile.geburtstag}</span>
                  </div>
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.gender}</span>
                    <span className="pf-view-value">{profile.gender}</span>
                  </div>
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.city}</span>
                    <span className="pf-view-value">{profile.stadt}</span>
                  </div>
                  <div className="pf-view-field">
                    <span className="pf-view-label">{t.country}</span>
                    <span className="pf-view-value">{profile.land}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="pf-form">
                  <div className="pf-field-row">
                    <div className="pf-field">
                      <label>Vorname</label>
                      <input type="text" value={tempProfile.vorname}
                        onChange={e => setTempProfile(p => ({ ...p, vorname: e.target.value }))} />
                    </div>
                    <div className="pf-field">
                      <label>Nachname</label>
                      <input type="text" value={tempProfile.nachname}
                        onChange={e => setTempProfile(p => ({ ...p, nachname: e.target.value }))} />
                    </div>
                  </div>
                  <div className="pf-field-row">
                    <div className="pf-field">
                      <label>{t.email}</label>
                      <input type="email" value={tempProfile.email}
                        onChange={e => setTempProfile(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="pf-field">
                      <label>{t.birthdate}</label>
                      <input type="date" value={tempProfile.geburtstag}
                        onChange={e => setTempProfile(p => ({ ...p, geburtstag: e.target.value }))} />
                    </div>
                  </div>
                  <div className="pf-field-row">
                    <div className="pf-field">
                      <label>{t.city}</label>
                      <input type="text" value={tempProfile.stadt}
                        onChange={e => setTempProfile(p => ({ ...p, stadt: e.target.value }))} />
                    </div>
                    <div className="pf-field">
                      <label>{t.country}</label>
                      <select value={tempProfile.land}
                        onChange={e => setTempProfile(p => ({ ...p, land: e.target.value }))}>
                        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="pf-form-footer">
                    {saved && <span className="pf-success">{t.saved}</span>}
                    <button type="submit" className="pf-save-btn">{t.save}</button>
                  </div>
                </form>
              )}
            </div>

            <div className="pf-card">
              <p className="pf-card-label">{t.changePassword}</p>
              <form onSubmit={handlePasswordChange} className="pf-form">
                <div className="pf-field">
                  <label>{t.currentPw}</label>
                  <input type="password" placeholder="••••••••"
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="pf-field-row">
                  <div className="pf-field">
                    <label>{t.newPw}</label>
                    <input type="password" placeholder="••••••••"
                      value={passwords.next}
                      onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} />
                  </div>
                  <div className="pf-field">
                    <label>{t.confirmPw}</label>
                    <input type="password" placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                </div>
                {pwError && <div className="pf-error">{pwError}</div>}
                {pwSuccess && <div className="pf-success">{t.pwChanged}</div>}
                <div className="pf-form-footer">
                  <button type="submit" className="pf-save-btn">{t.change}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}