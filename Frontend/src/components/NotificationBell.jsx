import { useState, useEffect, useRef } from "react";
import { useLang } from "../context/LanguageContext";
import "./NotificationBell.css";

const NOTIF_TEXT = {
  de: {
    title: "Benachrichtigungen",
    empty: "Keine neuen Benachrichtigungen",
    markAll: "Alle als gelesen markieren",
    types: {
      weather:     "🌧️ Wetteränderung",
      event:       "📅 Event steht bevor",
      dry_cleaning:"👔 Reinigung nötig",
      unused:      "👗 Selten getragen",
    }
  },
  en: {
    title: "Notifications",
    empty: "No new notifications",
    markAll: "Mark all as read",
    types: {
      weather:     "🌧️ Weather change",
      event:       "📅 Upcoming event",
      dry_cleaning:"👔 Dry cleaning needed",
      unused:      "👗 Rarely worn",
    }
  }
};

export default function NotificationBell() {
  const { lang } = useLang();
  const t = NOTIF_TEXT[lang];
  const dropdownRef = useRef(null);

  const [open, setOpen]               = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]         = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // fetch از backend
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
<<<<<<< HEAD
        if (data.success) {
          setNotifications([
            ...data.notifications,
            ...MOCK_NOTIFICATIONS
          ]);
=======
        if (data.success && data.notifications) {
          setNotifications(data.notifications);
        } else {
          setNotifications(MOCK_NOTIFICATIONS);
>>>>>>> origin/sahar
        }
      } catch {
        setNotifications(MOCK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* silent */ }
  };

  return (
    <div className="notif-wrap" ref={dropdownRef}>
      {/* Bell button */}
      <button className="notif-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>{t.title}</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllAsRead}>
                {t.markAll}
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-loading">
                <span className="notif-spinner" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <span>🔕</span>
                <p>{t.empty}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notif-item-content">
                    <p className="notif-item-type">{t.types[notif.type] || "📌"}</p>
                    <p className="notif-item-text">{notif.text}</p>
                    <p className="notif-item-time">{notif.time}</p>
                  </div>
                  {!notif.read && <span className="notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data — وقتی backend آماده نبود نشون می‌ده
const MOCK_NOTIFICATIONS = [
  { id: 1, type: "weather",      text: "Morgen Regen erwartet — Outfit anpassen?",         time: "Vor 5 Min",  read: false },
  { id: 2, type: "event",        text: "Dinner-Event in 2 Tagen — Outfit noch nicht geplant", time: "Vor 1 Std",  read: false },
  { id: 3, type: "dry_cleaning", text: "Wollmantel braucht Reinigung",                       time: "Vor 3 Std",  read: false },
  { id: 4, type: "unused",       text: "Seidenkleid seit 30 Tagen nicht getragen",           time: "Gestern",    read: true  },
];