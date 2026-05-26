import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ nombreUsuario: "", contrasena: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.nombreUsuario, form.contrasena);
      const routes = {
        Administrador: "/admin/bienvenida",
        Docente: "/docente/bienvenida",
        Estudiante: "/estudiante/bienvenida",
      };
      navigate(routes[user.rol] || "/bienvenida", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Left panel — decorative */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logoMark}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="white" fillOpacity=".12" />
              <path d="M12 34L24 14L36 34H12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
              <circle cx="24" cy="24" r="4" fill="white" fillOpacity=".7" />
            </svg>
          </div>
          <h1 style={styles.brandName}>Sistema<br />Académico</h1>
          <p style={styles.brandSub}>Gestión universitaria integral para estudiantes, docentes y administradores.</p>
          <div style={styles.dots}>
            {[...Array(9)].map((_, i) => (
              <span key={i} style={{ ...styles.dot, opacity: 0.15 + (i % 3) * 0.12 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Bienvenido</h2>
          <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {/* Usuario */}
            <div style={styles.field}>
              <label style={styles.label} htmlFor="nombreUsuario">
                Usuario
              </label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </span>
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  type="text"
                  autoComplete="username"
                  placeholder="nombre.usuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div style={styles.field}>
              <label style={styles.label} htmlFor="contrasena">
                Contraseña
              </label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="contrasena"
                  name="contrasena"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.contrasena}
                  onChange={handleChange}
                  style={{ ...styles.input, paddingRight: "2.75rem" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={styles.eyeBtn}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox} role="alert">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const BRAND = "#1D4ED8";
const BRAND_DARK = "#1e3a8a";

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  /* LEFT */
  left: {
    flex: "0 0 42%",
    background: `linear-gradient(145deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    position: "relative",
    overflow: "hidden",
  },
  leftInner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 340,
  },
  logoMark: { marginBottom: "1.5rem" },
  brandName: {
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "white",
    lineHeight: 1.15,
    margin: "0 0 1rem",
    letterSpacing: "-0.02em",
  },
  brandSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: "0.95rem",
    lineHeight: 1.65,
    margin: 0,
  },
  dots: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 10,
    marginTop: "3rem",
    width: 80,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "white",
    display: "inline-block",
  },
  /* RIGHT */
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "2rem",
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "2.5rem 2.25rem",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.35rem",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: "0 0 2rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#374151", letterSpacing: "0.02em" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: 12,
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.85rem 0.65rem 2.5rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: "0.92rem",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    padding: 4,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "0.6rem 0.85rem",
    fontSize: "0.84rem",
    color: "#dc2626",
  },
  btn: {
    padding: "0.75rem",
    background: BRAND,
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    transition: "background .15s",
    marginTop: "0.25rem",
  },
  btnDisabled: { background: "#93c5fd", cursor: "not-allowed" },
  spinner: {
    width: 18,
    height: 18,
    border: "2.5px solid rgba(255,255,255,0.35)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};