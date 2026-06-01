import { useState } from "react";
import { crearUsuario } from "../../services/api";

const ROLES = ["Estudiante", "Docente"];

export default function FormCrearUsuario({ onUsuarioCreado, onCancelar }) {
  const [form, setForm] = useState({
    nombre1: "", nombre2: "", apellidoP: "", apellidoM: "",
    email: "", nombreUsuario: "", contrasena: "", rol: "Estudiante",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await crearUsuario(form);
      onUsuarioCreado(res.data.usuario);
    } catch (err) {
      const errores = err.response?.data?.errors;
      if (errores) {
        setError(Object.values(errores)[0][0]);
      } else {
        setError(err.response?.data?.message || "Error al crear el usuario.");
      }
    } finally {
      setCargando(false);
    }
    
  };

const generarCredenciales = (nombre1, apellidoP) => {
      const base = `${nombre1?.[0] ?? "u"}${apellidoP ?? "user"}`.toLowerCase().replace(/\s/g, "");
      const num = Math.floor(Math.random() * 900) + 100;
      const nombreUsuario = `${base}${num}`;
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      const contrasena = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      return { nombreUsuario, contrasena };
    };
const [contrasenaVisible, setContrasenaVisible] = useState("");
  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0",
    borderRadius: 8, fontSize: 13, outline: "none",
    backgroundColor: "#F8FAFC", boxSizing: "border-box", color: "#0F172A",
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 4px" }}>
          Gestión de Usuarios
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>
          Crear nuevo usuario
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
          padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16,
        }}>
          ✕ {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Nombres */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Primer nombre <span style={{ color: "#EF4444" }}>*</span></label>
            <input type="text" name="nombre1" value={form.nombre1} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
          <div>
            <label style={labelStyle}>Segundo nombre</label>
            <input type="text" name="nombre2" value={form.nombre2} onChange={handleChange} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
        </div>

        {/* Apellidos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Apellido paterno <span style={{ color: "#EF4444" }}>*</span></label>
            <input type="text" name="apellidoP" value={form.apellidoP} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
          <div>
            <label style={labelStyle}>Apellido materno</label>
            <input type="text" name="apellidoM" value={form.apellidoM} onChange={handleChange} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Correo electrónico <span style={{ color: "#EF4444" }}>*</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#6366F1"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
        </div>


        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => {
            const { nombreUsuario, contrasena } = generarCredenciales(form.nombre1, form.apellidoP);
            setForm(f => ({ ...f, nombreUsuario, contrasena }));
            setContrasenaVisible(contrasena);
          }} style={{
            fontSize: 12, fontWeight: 600, color: "#6366F1",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            ⚡ Generar automáticamente
          </button>
        </div>

        {contrasenaVisible && (
  <p style={{ fontSize: 12, color: "#047857", backgroundColor: "#D1FAE5", padding: "4px 10px", borderRadius: 6, margin: "4px 0 0" }}>
    Contraseña: <strong>{contrasenaVisible}</strong> — guárdala antes de continuar
  </p>
)}
        {/* Usuario y contraseña */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Nombre de usuario <span style={{ color: "#EF4444" }}>*</span></label>
            <input type="text" name="nombreUsuario" value={form.nombreUsuario} onChange={handleChange} required style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
          <div>
            <label style={labelStyle}>Contraseña <span style={{ color: "#EF4444" }}>*</span></label>
            <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} required minLength={6} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6366F1"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
          </div>
        </div>

        {/* Rol */}
        <div>
          <label style={labelStyle}>Rol <span style={{ color: "#EF4444" }}>*</span></label>
          <select name="rol" value={form.rol} onChange={handleChange} style={{
            ...inputStyle, cursor: "pointer",
            backgroundColor: form.rol === "Docente" ? "#E0F2FE" : "#D1FAE5",
            color: form.rol === "Docente" ? "#0369A1" : "#047857",
            fontWeight: 700, border: "1px solid",
            borderColor: form.rol === "Docente" ? "#BAE6FD" : "#A7F3D0",
          }}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Divisor */}
        <div style={{ height: 1, backgroundColor: "#F1F5F9", margin: "4px 0" }} />

        {/* Botones */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancelar} style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #E2E8F0",
            backgroundColor: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#F8FAFC"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#fff"}
          >
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} disabled={cargando} style={{
            padding: "10px 20px", borderRadius: 8, border: "none",
            backgroundColor: cargando ? "#A5B4FC" : "#6366F1",
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: cargando ? "not-allowed" : "pointer",
            boxShadow: cargando ? "none" : "0 4px 14px rgba(99,102,241,0.35)",
          }}
            onMouseOver={e => { if (!cargando) e.currentTarget.style.backgroundColor = "#4F46E5"; }}
            onMouseOut={e => { if (!cargando) e.currentTarget.style.backgroundColor = "#6366F1"; }}
          >
            {cargando ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}