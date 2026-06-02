import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../stores/useAuthStore";

const DOCENTE_CONFIG = {
  color: "#2563eb",
  bg: "#eff6ff",
  accent: "#dbeafe",
};

export default function ReporteEstudiantes() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [filtros, setFiltros] = useState({
    periodo_id: "",
    materia_id: "",
    curso_id: "",
    estado: "",
    nombre: "",
  });

  const [preview, setPreview] = useState([]);
  const [generado, setGenerado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const change = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const generarPreview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/docente/reportes/estudiantes/preview", {
        params: filtros,
      });

      setPreview(res.data.data || []);
      setGenerado(true);
    } catch (err) {
      setError("Error al generar la previsualización: " + (err.response?.data?.message || err.message));
      setGenerado(false);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo) => {
    if (preview.length === 0) return;
    setModalType(tipo);
    setShowModal(true);
  };

  const confirmarDescarga = () => {
    const params = new URLSearchParams(filtros).toString();
    window.open(`${api.defaults.baseURL}/docente/reportes/estudiantes/${modalType}?${params}`, "_blank");
    setShowModal(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ ...styles.root, background: DOCENTE_CONFIG.bg }}>
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <div style={{ ...styles.logoBox, background: DOCENTE_CONFIG.accent }}>
            <span style={{ color: DOCENTE_CONFIG.color, fontSize: 20 }}>📊</span>
          </div>
          <span style={{ ...styles.headerTitle, color: DOCENTE_CONFIG.color }}>
            Sistema Académico
          </span>
        </div>

        <div style={styles.headerActions}>
          <button onClick={() => navigate("/docente")} style={styles.backBtn}>
            ← Volver
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={{ ...styles.heroCard, borderTop: `4px solid ${DOCENTE_CONFIG.color}` }}>
          <div style={{ ...styles.roleChip, background: DOCENTE_CONFIG.accent, color: DOCENTE_CONFIG.color }}>
            👨‍🎓 Reporte de Estudiantes
          </div>

          <h1 style={styles.heroTitle}>
            Reporte de <span style={{ color: DOCENTE_CONFIG.color }}>Estudiantes</span>
          </h1>

          <p style={styles.heroDesc}>
            Consulta estudiantes inscritos en tus cursos asignados usando filtros. Primero se genera una previsualización y luego puedes descargar en PDF o Excel.
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.filterSection}>
            <div style={styles.filterRow}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Periodo académico</label>
                <input name="periodo_id" value={filtros.periodo_id} onChange={change} placeholder="ID periodo" style={styles.filterInput} />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Materia</label>
                <input name="materia_id" value={filtros.materia_id} onChange={change} placeholder="ID materia" style={styles.filterInput} />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Curso</label>
                <input name="curso_id" value={filtros.curso_id} onChange={change} placeholder="ID curso" style={styles.filterInput} />
              </div>
            </div>

            <div style={styles.filterRow}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Nombre estudiante</label>
                <input name="nombre" value={filtros.nombre} onChange={change} placeholder="Buscar por nombre" style={styles.filterInput} />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Estado</label>
                <select name="estado" value={filtros.estado} onChange={change} style={styles.filterInput}>
                  <option value="">Todos</option>
                  <option value="inscrito">Inscrito</option>
                  <option value="retirado">Retirado</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={{ ...styles.filterLabel, visibility: "hidden" }}>Buscar</label>
                <button onClick={generarPreview} disabled={loading} style={styles.searchBtn}>
                  {loading ? "Generando..." : "Generar previsualización"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {generado && preview.length > 0 && (
          <section style={styles.resultsCard}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>Previsualización del reporte</h2>
              <div style={styles.statBadge}>
                <span style={styles.statLabel}>Total</span>
                <span style={{ ...styles.statValue, color: DOCENTE_CONFIG.color }}>{preview.length}</span>
              </div>
            </div>

            <TablaEstudiantes data={preview} />

            <div style={styles.infoStrip}>
              <div>
                <span style={styles.infoLabel}>Usuario</span>
                <p style={styles.infoVal}>{user?.username || user?.name || "Docente"}</p>
              </div>
              <div>
                <span style={styles.infoLabel}>Correo</span>
                <p style={styles.infoVal}>{user?.email || "Sin correo"}</p>
              </div>
              <div>
                <span style={styles.infoLabel}>Rol</span>
                <p style={{ ...styles.infoVal, color: DOCENTE_CONFIG.color }}>{user?.rol || "Docente"}</p>
              </div>
            </div>

            <div style={styles.exportSection}>
              <button onClick={() => abrirModal("pdf")} style={{ ...styles.exportBtn, background: "#dc2626" }}>
                Descargar PDF
              </button>
              <button onClick={() => abrirModal("excel")} style={{ ...styles.exportBtn, background: "#16a34a" }}>
                Descargar Excel
              </button>
            </div>
          </section>
        )}

        {generado && preview.length === 0 && (
          <section style={styles.emptyStateCard}>
            <h3 style={styles.emptyStateTitle}>Sin resultados</h3>
            <p style={styles.emptyStateDesc}>No se encontraron estudiantes con los filtros seleccionados.</p>
          </section>
        )}
      </main>

      {showModal && (
        <div style={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Previsualización - Exportar {modalType.toUpperCase()}</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.previewInfo}>
                <strong>Total registros:</strong> {preview.length}
              </div>
              <TablaEstudiantes data={preview} compact />
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancelar</button>
              <button onClick={confirmarDescarga} style={{ ...styles.confirmBtn, background: DOCENTE_CONFIG.color }}>
                Confirmar descarga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TablaEstudiantes({ data, compact = false }) {
  return (
    <div style={{ overflowX: "auto", maxHeight: compact ? 360 : "none", overflowY: compact ? "auto" : "visible" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} style={styles.tableHeaderCell}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={{ background: index % 2 === 0 ? "#f8fafc" : "white" }}>
              {Object.values(row).map((value, i) => (
                <td key={i} style={styles.tableCell}>
                  {typeof value === "object" ? JSON.stringify(value) : String(value ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "white", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 },
  headerBrand: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: { width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center" },
  headerTitle: { fontWeight: 700, fontSize: "1rem" },
  headerActions: { display: "flex", gap: 10 },
  backBtn: { padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc", cursor: "pointer" },
  logoutBtn: { padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, background: "white", cursor: "pointer" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" },
  heroCard: { background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,.06)" },
  roleChip: { display: "inline-flex", gap: 8, padding: ".35rem .85rem", borderRadius: 999, fontWeight: 700, fontSize: ".82rem", marginBottom: "1.2rem" },
  heroTitle: { fontSize: "2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 .6rem" },
  heroDesc: { color: "#64748b", lineHeight: 1.6, marginBottom: "1.5rem" },
  errorBox: { padding: ".85rem 1rem", background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 10, marginBottom: "1rem" },
  filterSection: { display: "flex", flexDirection: "column", gap: 16, padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 },
  filterRow: { display: "flex", gap: 14, flexWrap: "wrap" },
  filterGroup: { flex: 1, minWidth: 180 },
  filterLabel: { display: "block", fontSize: ".82rem", fontWeight: 700, color: "#64748b", marginBottom: ".45rem" },
  filterInput: { width: "100%", padding: ".65rem .8rem", border: "1.5px solid #e2e8f0", borderRadius: 10, boxSizing: "border-box" },
  searchBtn: { width: "100%", padding: ".65rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
  resultsCard: { background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,.06)" },
  resultsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" },
  resultsTitle: { fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" },
  statBadge: { padding: ".6rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, textAlign: "center" },
  statLabel: { display: "block", fontSize: ".72rem", color: "#94a3b8", fontWeight: 700 },
  statValue: { display: "block", fontSize: "1.25rem", fontWeight: 800 },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderCell: { padding: ".8rem 1rem", background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left", fontSize: ".78rem", fontWeight: 800, color: "#475569", textTransform: "uppercase" },
  tableCell: { padding: ".85rem 1rem", borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontSize: ".9rem" },
  infoStrip: { display: "flex", gap: 24, padding: "1rem 0", marginTop: "1rem", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap" },
  infoLabel: { fontSize: ".72rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase" },
  infoVal: { margin: ".25rem 0 0", color: "#0f172a", fontWeight: 700 },
  exportSection: { display: "flex", gap: 12, marginTop: "1rem" },
  exportBtn: { color: "white", border: "none", borderRadius: 10, padding: ".7rem 1.25rem", fontWeight: 700, cursor: "pointer" },
  emptyStateCard: { background: "white", borderRadius: 16, padding: "2.5rem", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,.06)" },
  emptyStateTitle: { color: "#0f172a", marginBottom: ".5rem" },
  emptyStateDesc: { color: "#64748b" },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, padding: "30px 15px", overflowY: "auto" },
  modalContent: { maxWidth: 1000, margin: "0 auto", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0" },
  modalTitle: { margin: 0, fontSize: "1.05rem", color: "#0f172a" },
  closeBtn: { border: "none", background: "transparent", fontSize: 24, cursor: "pointer" },
  modalBody: { padding: "1.25rem" },
  previewInfo: { padding: ".75rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 12 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "1rem 1.25rem", borderTop: "1px solid #e2e8f0" },
  cancelBtn: { padding: ".55rem 1.25rem", borderRadius: 10, border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 700 },
  confirmBtn: { padding: ".55rem 1.25rem", borderRadius: 10, border: "none", color: "white", cursor: "pointer", fontWeight: 700 },
};