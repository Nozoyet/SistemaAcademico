import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import api from "../services/api";

const ROL_CONFIG = {
  Administrador: { color: "#7C3AED", bg: "#EDE9FE", icon: "🛡️" },
  Docente:       { color: "#0369A1", bg: "#E0F2FE", icon: "👨‍🏫" },
  Estudiante:    { color: "#047857", bg: "#D1FAE5", icon: "🎓" },
};

export default function Perfil() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const rol = user?.rol ?? "Estudiante";
  const cfg = ROL_CONFIG[rol] ?? ROL_CONFIG.Estudiante;

  const [form, setForm] = useState({
    nombreUsuario: user?.username ?? "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError]       = useState("");
  const [exito, setExito]       = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(""); setExito("");
    if (form.contrasena && form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden."); return;
    }
    if (form.contrasena && form.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres."); return;
    }
    const payload = { nombreUsuario: form.nombreUsuario };
    if (form.contrasena) payload.contrasena = form.contrasena;
    setCargando(true);
    try {
      await api.put("/perfil", payload);
      setExito("Datos actualizados correctamente.");
      setForm(f => ({ ...f, contrasena: "", confirmar: "" }));
    } catch (err) {
      const errores = err.response?.data?.errors;
      if (errores) setError(Object.values(errores)[0][0]);
      else setError(err.response?.data?.message || "Error al actualizar.");
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0",
    borderRadius: 8, fontSize: 13, outline: "none",
    backgroundColor: "#F8FAFC", boxSizing: "border-box", color: "#0F172A",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#94A3B8", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8,
  };

  const initials = `${user?.nombre1?.[0] ?? user?.nombre?.[0] ?? ""}${user?.apellidoP?.[0] ?? ""}`.toUpperCase();

  const nombreCompleto = [user?.nombre1, user?.nombre2, user?.apellidoP, user?.apellidoM]
    .filter(Boolean).join(" ");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "32px 24px" }}>

        {/* Botón volver */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#6366F1", fontSize: 13, fontWeight: 600, marginBottom: 24,
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>
          ← Volver
        </button>

        {/* Card principal */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>

          {/* Header */}
          <div style={{ backgroundColor: cfg.bg, padding: "28px 28px 24px", borderBottom: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%",
                backgroundColor: cfg.color, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 800, flexShrink: 0,
                boxShadow: `0 4px 14px ${cfg.color}44`,
              }}>
                {initials || "?"}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "#0F172A", letterSpacing: -0.3 }}>
                  {nombreCompleto || user?.nombre || "Usuario"}
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>{user?.email}</p>
                <span style={{
                  display: "inline-block", marginTop: 8,
                  backgroundColor: cfg.color, color: "#fff",
                  fontSize: 11, fontWeight: 700, padding: "3px 12px",
                  borderRadius: 20, letterSpacing: 0.4,
                }}>
                  {cfg.icon} {rol}
                </span>
              </div>
            </div>
          </div>

          {/* Información personal (solo lectura) */}
          <div style={{ padding: "22px 28px", borderBottom: "1px solid #F1F5F9" }}>
            <p style={{ ...labelStyle, marginBottom: 14 }}>Información personal</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Primer nombre",    valor: user?.nombre1 },
                { label: "Segundo nombre",   valor: user?.nombre2  || "—" },
                { label: "Apellido paterno", valor: user?.apellidoP },
                { label: "Apellido materno", valor: user?.apellidoM || "—" },
                { label: "Correo electrónico", valor: user?.email },
                { label: "Nombre de usuario", valor: user?.username },
              ].map(({ label, valor }) => (
                <div key={label} style={{ backgroundColor: "#F8FAFC", borderRadius: 8, padding: "10px 14px" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{valor}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: "#94A3B8" }}>
              ℹ️ Para modificar tus datos personales, contacta al administrador.
            </p>
          </div>

          {/* Editar credenciales */}
          <div style={{ padding: "22px 28px" }}>
            <p style={{ ...labelStyle, marginBottom: 16 }}>Editar credenciales</p>

            {error && (
              <div style={{ backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                ✕ {error}
              </div>
            )}
            {exito && (
              <div style={{ backgroundColor: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                ✓ {exito}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Nuevo nombre de usuario</label>
                <input type="text" name="nombreUsuario" value={form.nombreUsuario} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366F1"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Nueva contraseña</label>
                  <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange}
                    placeholder="Dejar vacío para no cambiar"
                    style={{ ...inputStyle, fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = "#6366F1"}
                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar contraseña</label>
                  <input type="password" name="confirmar" value={form.confirmar} onChange={handleChange}
                    placeholder="Repetir nueva contraseña"
                    style={{ ...inputStyle, fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = "#6366F1"}
                    onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: "#F1F5F9" }} />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSubmit} disabled={cargando} style={{
                  padding: "10px 24px", borderRadius: 8, border: "none",
                  backgroundColor: cargando ? "#A5B4FC" : "#6366F1",
                  color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: cargando ? "not-allowed" : "pointer",
                  boxShadow: cargando ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
                }}>
                  {cargando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cerrar sesión */}
        <button onClick={handleLogout} style={{
          width: "100%", padding: "12px", borderRadius: 10,
          border: "1px solid #FECACA", backgroundColor: "#FEF2F2",
          color: "#DC2626", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = "#DC2626"; e.currentTarget.style.color = "#fff"; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}
        >
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}