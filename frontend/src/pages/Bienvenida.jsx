import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

const ROL_CONFIG = {
  Administrador: {
    color: "#7c3aed",
    bg: "#faf5ff",
    accent: "#ede9fe",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
        <path d="M20 21v-1a6 6 0 0 0-6-6H10a6 6 0 0 0-6 6v1" />
        <path d="M16 11h6M19 8v6" />
      </svg>
    ),
    greeting: "Panel de Administración",
    desc: "Gestiona carreras, cursos, usuarios y toda la configuración del sistema académico.",
    links: [
      {
        label: "Gestionar Oferta Académica",
        icon: "📚",
        // Estructura interna para habilitar el despliegue dinámico
        subLinks: [
          { label: "Crear Oferta Académica", href: "/admin/cursos/gestion", icon: "⚙️" },
          { label: "Consultar Oferta Académica", href: "/admin/cursos/consulta", icon: "🔍" }
        ]
      },
      { label: "Usuarios", href: "/admin/GestionarUsuarios", icon: "👥" },
      {
        label: "Reportes",
        icon: "📊",
        subLinks: [
          { label: "Reportes por carrera", href: "/admin/reportes", icon: "📋" },
          { label: "Reportes de estudiantes", href: "/admin/reportes/estudiantes", icon: "👨‍🎓" },
          { label: "Reportes de docentes", href: "/admin/reportes/docentes", icon: "👨‍🏫" }
        ]
      },
      { label: "Gestionar Pensum", href: "/admin/pensum", icon: "🗂️" },
      { label: "Perfil", href: "/admin/perfil", icon: "👤" },
    ],
  },
  Docente: {
    color: "#0369a1",
    bg: "#f0f9ff",
    accent: "#e0f2fe",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    greeting: "Portal Docente",
    desc: "Consulta tus cursos asignados, registra calificaciones y gestiona horarios.",
    links: [
      { label: "Mis cursos", href: "/docente/cursos", icon: "🎓" },
      { label: "Calificaciones", href: "/docente/calificaciones", icon: "✏️" },
      { label: "Horarios", href: "/docente/horarios", icon: "🗓️" },
    ],
  },
  Estudiante: {
    color: "#0d9488",
    bg: "#f0fdfa",
    accent: "#ccfbf1",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    greeting: "Portal Estudiantil",
    desc: "Consulta cursos disponibles, tus inscripciones y el progreso en tu carrera.",
    links: [
      { label: "Mis Cursos", href: "/estudiante/inscripciones", icon: "📋" },
      { label: "Registro de Materia", href: "/estudiante/cursos", icon: "🔍" },
      { label: "Generar Reportes", href: "/estudiante/reportes", icon: "📊" },
      { label: "Mi Perfil", href: "/estudiante/perfil", icon: "👤" },
    ],
  },
};

export default function Bienvenida() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Estado para alternar menús desplegables (almacena el índice del menú abierto, o null)
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const config = ROL_CONFIG[user?.rol] || ROL_CONFIG.Estudiante;
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ ...styles.root, background: config.bg }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill={config.color} fillOpacity=".12" />
            <path d="M12 34L24 14L36 34H12Z" stroke={config.color} strokeWidth="2.2" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="24" r="3.5" fill={config.color} fillOpacity=".7" />
          </svg>
          <span style={{ ...styles.headerTitle, color: config.color }}>Sistema Académico</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {/* Hero card */}
        <div style={{ ...styles.heroCard, borderTop: `4px solid ${config.color}` }}>
          <div style={{ ...styles.roleChip, background: config.accent, color: config.color }}>
            <span style={{ display: "flex" }}>{config.icon}</span>
            {user?.rol}
          </div>

          <h1 style={styles.heroTitle}>
            {saludo}, <span style={{ color: config.color }}>{user?.nombre || "usuario"}</span>
          </h1>
          <p style={styles.heroDesc}>{config.desc}</p>

          {/* Quick links */}
          <div style={styles.linksGrid}>
            {config.links.map((link, index) => {

              // Renderizado condicional si el botón posee sub-enlaces
              if (link.subLinks) {
                const isOpen = openMenuIndex === index;
                return (
                  <div key={index} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={() => setOpenMenuIndex(isOpen ? null : index)}
                      style={{ ...styles.linkCard, "--accent": config.color }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = config.color)}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                    >
                      <span style={styles.linkEmoji}>{link.icon}</span>
                      <span style={styles.linkLabel}>{link.label}</span>
                      {/* La flecha rota 90 grados si el menú está activo */}
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5"
                        style={{ marginLeft: "auto", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Sub-enlaces que aparecen únicamente al hacer clic */}
                    {isOpen && link.subLinks.map((subLink) => (
                      <button
                        key={subLink.href}
                        onClick={() => navigate(subLink.href)}
                        style={{ ...styles.linkCard, marginLeft: "1.5rem", width: "calc(100% - 1.5rem)", background: "#ffffff", borderColor: config.accent }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = config.color)}
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = config.accent)}
                      >
                        <span style={styles.linkEmoji}>{subLink.icon}</span>
                        <span style={{ ...styles.linkLabel, fontSize: "0.85rem" }}>{subLink.label}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" style={{ marginLeft: "auto" }}>
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                );
              }

              // Renderizado normal para enlaces estándar sin dependencias
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  style={{ ...styles.linkCard, "--accent": config.color }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = config.color)}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                >
                  <span style={styles.linkEmoji}>{link.icon}</span>
                  <span style={styles.linkLabel}>{link.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2.5" style={{ marginLeft: "auto", flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info strip */}
        <div style={styles.infoStrip}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Usuario</span>
            <span style={styles.infoVal}>{user?.username}</span>
          </div>
          <div style={styles.infoSep} />
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Correo</span>
            <span style={styles.infoVal}>{user?.email}</span>
          </div>
          <div style={styles.infoSep} />
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Rol</span>
            <span style={{ ...styles.infoVal, color: config.color, fontWeight: 600 }}>{user?.rol}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerBrand: { display: "flex", alignItems: "center", gap: 10 },
  headerTitle: { fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "0.45rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    background: "white",
    color: "#475569",
    fontSize: "0.84rem",
    fontWeight: 500,
    cursor: "pointer",
  }, main: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "3rem 1.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  heroCard: {
    background: "white",
    borderRadius: 16,
    padding: "2rem 2rem 1.75rem",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  roleChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "0.35rem 0.85rem",
    borderRadius: 999,
    fontSize: "0.82rem",
    fontWeight: 600,
    marginBottom: "1.25rem",
  },
  heroTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.6rem",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  heroDesc: {
    fontSize: "0.92rem",
    color: "#64748b",
    margin: "0 0 1.75rem",
    lineHeight: 1.65,
  },
  linksGrid: { display: "flex", flexDirection: "column", gap: 10 },
  linkCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0.85rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    background: "#f8fafc",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color .15s, background .15s",
    width: "100%",
  }, linkEmoji: { fontSize: "1.15rem", flexShrink: 0 },
  linkLabel: { fontSize: "0.9rem", fontWeight: 500, color: "#1e293b" },
  infoStrip: {
    background: "white",
    borderRadius: 12,
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },
  infoItem: { display: "flex", flexDirection: "column", gap: 2 },
  infoLabel: { fontSize: "0.73rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  infoVal: { fontSize: "0.88rem", color: "#1e293b" },
  infoSep: { width: 1, height: 32, background: "#e2e8f0", flexShrink: 0 },
};