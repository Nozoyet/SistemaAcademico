import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const ADMIN_CONFIG = {
  color: "#7c3aed",
  bg: "#faf5ff",
  accent: "#ede9fe",
};

const REPORT_OPTIONS = [
  {
    label: "Reportes por Carrera",
    desc: "Consulta materias, créditos y semestres de cada carrera.",
    href: "/admin/reportes",
    icon: "📚",
  },
  {
    label: "Reportes de Estudiantes",
    desc: "Visualiza estudiantes inscritos, notas y avance por carrera.",
    href: "/admin/reportes/estudiantes",
    icon: "👨‍🎓",
  },
  {
    label: "Reportes de Docentes",
    desc: "Consulta docentes, cursos asignados y carga académica.",
    href: "/admin/reportes/docentes",
    icon: "👨‍🏫",
  },
];

export default function ReportesMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ ...styles.root, background: ADMIN_CONFIG.bg }}>
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill={ADMIN_CONFIG.color} fillOpacity=".12" />
            <path d="M12 34L24 14L36 34H12Z" stroke={ADMIN_CONFIG.color} strokeWidth="2.2" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="24" r="3.5" fill={ADMIN_CONFIG.color} fillOpacity=".7" />
          </svg>
          <span style={{ ...styles.headerTitle, color: ADMIN_CONFIG.color }}>Sistema Académico</span>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => navigate("/admin/bienvenida")} style={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={{ ...styles.heroCard, borderTop: `4px solid ${ADMIN_CONFIG.color}` }}>
          <div style={{ ...styles.roleChip, background: ADMIN_CONFIG.accent, color: ADMIN_CONFIG.color }}>
            <span style={{ display: "flex" }}>📊</span>
            Centro de Reportes
          </div>

          <h1 style={styles.heroTitle}>
            Reportes <span style={{ color: ADMIN_CONFIG.color }}>Académicos</span>
          </h1>
          <p style={styles.heroDesc}>
            Selecciona el tipo de reporte que deseas consultar y exportar.
          </p>

          <div style={styles.optionsGrid}>
            {REPORT_OPTIONS.map((opt) => (
              <button
                key={opt.href}
                onClick={() => navigate(opt.href)}
                style={styles.optionCard}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = ADMIN_CONFIG.color)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
              >
                <span style={styles.optionIcon}>{opt.icon}</span>
                <div style={styles.optionContent}>
                  <span style={styles.optionLabel}>{opt.label}</span>
                  <span style={styles.optionDesc}>{opt.desc}</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ADMIN_CONFIG.color} strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

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
            <span style={{ ...styles.infoVal, color: ADMIN_CONFIG.color, fontWeight: 600 }}>{user?.rol}</span>
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
  headerActions: { display: "flex", alignItems: "center", gap: 10 },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "0.45rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    background: "#f8fafc",
    color: "#475569",
    fontSize: "0.84rem",
    fontWeight: 500,
    cursor: "pointer",
  },
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
  },
  main: {
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
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "1.1rem 1.25rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    background: "#f8fafc",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color .15s, background .15s",
    width: "100%",
  },
  optionIcon: { fontSize: "1.5rem", flexShrink: 0 },
  optionContent: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  optionLabel: { fontSize: "0.95rem", fontWeight: 600, color: "#1e293b" },
  optionDesc: { fontSize: "0.82rem", color: "#64748b", lineHeight: 1.4 },
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
