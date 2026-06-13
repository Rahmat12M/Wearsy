import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    anrede: "",
    vorname: "",
    nachname:"",
    geburtstag: "",
    stadt: "",
    land: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("anrede", formData.anrede);
      form.append("vorname", formData.vorname);
      form.append("nachname", formData.nachname);
      form.append("geburtstag", formData.geburtstag);
      form.append("stadt", formData.stadt);
      form.append("land", formData.land);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("confirmPassword", formData.confirmPassword);

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registrierung fehlgeschlagen");
        return;
      }
      navigate("/login");
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel" aria-hidden="true">
        <div className="panel-logo">W</div>
        <div className="panel-tagline">
          <p>Baue deinen</p>
          <p>Traumkleiderschrank.</p>
        </div>
        <div className="panel-dots"><span /><span /><span /></div>
      </div>

      <div className="login-form-side">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Konto erstellen</h1>
            <p>Heute bei Wearsy einsteigen</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>

            <div className="field-group">
              <label htmlFor="anrede">Anrede</label>
              <select id="anrede" name="anrede" value={formData.anrede}
                onChange={handleChange} required
                style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300,
                  color: "var(--charcoal)", background: "var(--cream)", border: "1px solid transparent",
                  borderRadius: "6px", padding: "0.85rem 1rem", outline: "none", width: "100%" }}>
                <option value="">— Bitte wählen —</option>
                <option value="Frau">Frau</option>
                <option value="Herr">Herr</option>
                <option value="Divers">Divers</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="vorname">vorName</label>

              <input
                id="vorname"
                type="text"
                name="vorname"
                value={formData.vorname}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="vorname">nachName</label>

              <input
                id="nachname"
                type="text"
                name="nachname"
                value={formData.nachname}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="geburtstag">Geburtsdatum</label>
              <input id="geburtstag" type="date" name="geburtstag"
                value={formData.geburtstag} onChange={handleChange}
                required lang="de" />
            </div>

            <div className="field-group">
              <label htmlFor="stadt">Stadt</label>
              <input id="stadt" type="text" name="stadt"
                value={formData.stadt} onChange={handleChange}
                placeholder="Stadt" required />
            </div>

            <div className="field-group">
              <label htmlFor="land">Land</label>
              <input id="land" type="text" name="land"
                value={formData.land} onChange={handleChange}
                placeholder="Land" required />
            </div>

            <div className="field-group">
              <label htmlFor="email">E-Mail</label>
              <input id="email" type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required autoComplete="email" />
            </div>

            <div className="field-group">
              <label htmlFor="password">Passwort</label>
              <input id="password" type="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required autoComplete="new-password" />
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Passwort bestätigen</label>
              <input id="confirmPassword" type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••" required autoComplete="new-password" />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Konto erstellen"}
            </button>
          </form>

          <p className="register-link">
            Bereits ein Konto?{" "}
            <Link to="/login">Anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
}