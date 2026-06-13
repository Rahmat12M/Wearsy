import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import translations from "../context/translations";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

              localStorage.setItem("token", data.token);
        localStorage.setItem("wearsy_username", data.user.vorname || "");
        localStorage.removeItem("wearsy_profile");
        localStorage.removeItem("wearsy_avatar");
        navigate("/dashboard");
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel" aria-hidden="true">
        <div className="panel-logo">W</div>
        <div className="panel-tagline">
          <p>Your wardrobe,</p>
          <p>reimagined.</p>
        </div>
        <div className="panel-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome back</h1>
            <p>Sign in to your wardrobe</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Sign in"}
            </button>
          </form>

          <p className="register-link">
            New to Wearsy?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}