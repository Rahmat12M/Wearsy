import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import NotificationBell from "./NotificationBell";
import "./Header.css";

// export default function Header({ title, subtitle, children }) {
//   const { lang } = useLang();
//   const tNav = translations[lang].nav;

//   const userName   = localStorage.getItem("wearsy_username") || "S";
//   const userAvatar = localStorage.getItem("wearsy_avatar")   || null;
//   const initials   = userName.trim().charAt(0).toUpperCase();

//   return (
//     <header className="header">
//       <div className="header-left">
//         <div className="header-titles">
//           {title    && <h1 className="header-title">{title}</h1>}
//           {subtitle && <p className="header-subtitle">{subtitle}</p>}
//         </div>
//         {children}
//       </div>

//       <div className="header-right">
//         <NotificationBell />
//         <Link to="/profile" className="header-avatar" title={tNav.profile}>
//           {userAvatar ? (
//             <img src={userAvatar} alt={userName} className="header-avatar-img" />
//           ) : (
//             <div className="header-avatar-initials">{initials}</div>
//           )}
//         </Link>
//       </div>
//     </header>
//   );
// }

export default function Header({
  title,
  subtitle,
  children,
  user,
}) {
  const { lang } = useLang();
  const tNav = translations[lang].nav;

<<<<<<< HEAD
  const initials =
    user?.nachname?.charAt(0)?.toUpperCase() || "";

  return (
    <header className="header">
      ...
      <Link to="/profile" className="header-avatar" title={tNav.profile}>
        {user?.profile_image ? (
          <img
            src={`http://localhost:5000/${user.profile_image}`}
            alt={user.nachname}
            className="header-avatar-img"
          />
        ) : (
          <div className="header-avatar-initials">
            {initials}
          </div>
        )}
      </Link>
=======
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem("wearsy_avatar") || null);
  const [userName,   setUserName]   = useState(localStorage.getItem("wearsy_username") || "S");
  const initials = userName.trim().charAt(0).toUpperCase();

  // گوش بده به تغییرات localStorage
  useEffect(() => {
    const handleStorage = () => {
      setUserAvatar(localStorage.getItem("wearsy_avatar") || null);
      setUserName(localStorage.getItem("wearsy_username") || "S");
    };

    window.addEventListener("storage", handleStorage);
    // برای تغییرات داخل همون tab
    window.addEventListener("wearsy-avatar-updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wearsy-avatar-updated", handleStorage);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-titles">
          {title    && <h1 className="header-title">{title}</h1>}
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>

      <div className="header-right">
        
        <NotificationBell />
        <Link to="/profile" className="header-avatar" title={tNav.profile}>
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="header-avatar-img" />
          ) : (
            <div className="header-avatar-initials">{initials}</div>
          )}
        </Link>
      </div>
>>>>>>> origin/sahar
    </header>
  );
}