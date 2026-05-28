import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

export default function PensumDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pensum, setPensum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materiasPensum, setMateriasPensum] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/pensum/${id}`).then((res) => {
      setPensum(res.data.data);
      setMateriasPensum(res.data.data.materias || []);
      setLoading(false);
    }).catch(() => navigate("/admin/pensum"));
  }, [id]);

  const preReqNombre = (idPrereq) => {
    if (!idPrereq) return "—";
    const m = materiasPensum.find((x) => x.id === idPrereq);
    return m ? `${m.codigo} — ${m.nombre}` : "—";
  };

  const dependientes = (materiaId) => {
    return materiasPensum.filter((m) => m.idPrerequisito === materiaId);
  };

  const semsDisponibles = [...new Set(materiasPensum.map((m) => m.semestre).filter(Boolean))].sort((a, b) => a - b);

  if (loading) return <div style={styles.loader}>Cargando...</div>;
  if (!pensum) return null;

  const creditosReales = materiasPensum.reduce((s, m) => s + (m.creditos || 0), 0);
  const metaCreditos = pensum.creditos_totales;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{pensum.carrera?.nombre || "Pensum"}</h1>
          <p style={styles.subtitle}>
            Código: {pensum.carrera?.codigo || "—"} · Año: {pensum.anioCreacion}
            {pensum.estado ? " · Activo" : " · Inactivo"} · {materiasPensum.length} materias
          </p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => navigate(`/admin/pensum/${id}/arbol`)} style={{ ...styles.btnOutline, background: "#eff6ff", color: "#1D4ED8", borderColor: "#bfdbfe" }}>
            Ver diagrama
          </button>
          <button onClick={() => navigate("/admin/pensum")} style={styles.btnOutline}>
            ← Volver
          </button>
        </div>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Año</span>
            <span style={styles.infoVal}>{pensum.anioCreacion}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Materias</span>
            <span style={styles.infoVal}>{materiasPensum.length}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Créditos</span>
            <span style={{ ...styles.infoVal, ...(metaCreditos ? { fontWeight: 700 } : {}) }}>
              {creditosReales}{metaCreditos ? ` / ${metaCreditos}` : ""}
              {metaCreditos ? ` (${Math.round((creditosReales / metaCreditos) * 100)}%)` : ""}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Semestres</span>
            <span style={styles.infoVal}>{semsDisponibles.length > 0 ? `1 - ${Math.max(...semsDisponibles)}` : "—"}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Estado</span>
            <span style={{ ...styles.infoVal, color: pensum.estado ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
              {pensum.estado ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
        {pensum.descripcion && (
          <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
            <span style={styles.infoLabel}>Descripción</span>
            <p style={{ ...styles.infoVal, margin: "0.3rem 0 0", lineHeight: 1.6, fontSize: "0.85rem" }}>{pensum.descripcion}</p>
          </div>
        )}
      </div>

      <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0f172a", margin: "0 0 1rem" }}>Materias del pensum</h2>

      {materiasPensum.length === 0 ? (
        <div style={styles.empty}>
          <p>Este pensum no tiene materias registradas.</p>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Semestre</th>
                <th style={styles.th}>Créditos</th>
                <th style={styles.th}>Prerrequisito</th>
                <th style={styles.th}>Dependientes</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {materiasPensum.map((m) => {
                const deps = dependientes(m.id);
                return (
                  <tr key={m.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontWeight: 600, fontSize: "0.8rem" }}>{m.codigo}</td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{m.nombre}</td>
                    <td style={styles.td}>
                      {m.semestre ? (
                        <span style={{ ...styles.badgeSem, background: "#e0f2fe", color: "#0369a1" }}>Sem {m.semestre}</span>
                      ) : "—"}
                    </td>
                    <td style={styles.td}>{m.creditos}</td>
                    <td style={styles.td}>
                      {m.idPrerequisito ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: "0.7rem" }}>⬅</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.78rem", background: "#fef3c7", padding: "0.1rem 0.4rem", borderRadius: 4 }}>{preReqNombre(m.idPrerequisito)}</span>
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Ninguno</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {deps.length > 0 ? (
                        <span style={{ ...styles.badgeSem, background: "#f0fdfa", color: "#0d9488" }}>
                          {deps.length} materia{deps.length > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>—</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: m.estado ? "#dcfce7" : "#fef2f2", color: m.estado ? "#16a34a" : "#dc2626" }}>
                        {m.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
}

const styles = {
  root: { maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  loader: { textAlign: "center", padding: "4rem", color: "#64748b", fontSize: "1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "0.75rem" },
  title: { fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: "0.85rem", color: "#64748b", margin: "0.3rem 0 0" },
  headerActions: { display: "flex", gap: 8 },
  btnOutline: {
    padding: "0.4rem 0.85rem", background: "white", color: "#1e293b", border: "1.5px solid #e2e8f0",
    borderRadius: 6, fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
  },
  tableWrap: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: {
    textAlign: "left", padding: "0.65rem 0.85rem", background: "#f8fafc", color: "#64748b",
    fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em",
    borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "0.55rem 0.85rem", color: "#1e293b" },
  badge: { padding: "0.15rem 0.5rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600 },
  badgeSem: { padding: "0.1rem 0.45rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600 },
  empty: { textAlign: "center", padding: "3rem", color: "#64748b", background: "white", borderRadius: 12, border: "1px solid #e2e8f0" },
  infoCard: { background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.25rem", marginBottom: "1.5rem" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem" },
  infoItem: { display: "flex", flexDirection: "column", gap: "0.15rem" },
  infoLabel: { fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  infoVal: { fontSize: "0.95rem", color: "#1e293b", fontWeight: 500 },
};
