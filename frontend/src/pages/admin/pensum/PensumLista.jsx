import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function PensumLista() {
  const navigate = useNavigate();
  const [pensums, setPensums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    api.get("/pensum").then((res) => {
      setPensums(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const eliminar = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/pensum/${deleteTarget.id}`);
      setPensums((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Error al eliminar");
    }
  };

  if (loading) return <div style={styles.loader}>Cargando...</div>;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Pensums</h1>
          <p style={styles.subtitle}>Gestiona los planes de estudio de cada carrera</p>
        </div>
        <button onClick={() => navigate("/admin/pensum/nuevo")} style={styles.btnPrimary}>
          + Nuevo pensum
        </button>
      </div>

      {pensums.length === 0 ? (
        <div style={styles.empty}>
          <p>No hay pensums registrados</p>
          <button onClick={() => navigate("/admin/pensum/nuevo")} style={styles.btnPrimary}>
            Crear primer pensum
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {pensums.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{p.carrera?.nombre || "Sin carrera"}</h3>
                <div style={styles.cardMeta}>
                  <span style={styles.badge}>{p.anioCreacion}</span>
                  {p.duracion && <span style={{ ...styles.badge, background: "#f0fdfa", color: "#0d9488" }}>{p.duracion} sem</span>}
                  <span style={{ ...styles.badge, background: p.estado ? "#dcfce7" : "#fef2f2", color: p.estado ? "#16a34a" : "#dc2626" }}>
                    {p.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p style={styles.cardCodigo}>Código carrera: {p.carrera?.codigo || "—"}</p>
                {p.creditos_totales && <p style={{ ...styles.cardCodigo, marginTop: "0.2rem" }}>Créditos: {p.creditos_totales}</p>}
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => navigate(`/admin/pensum/${p.id}`)} style={styles.btnOutline}>
                  Ver detalle
                </button>
                <button onClick={() => { setDeleteTarget(p); setDeleteError(""); }} style={{ ...styles.btnOutline, color: "#dc2626", borderColor: "#fecaca" }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar pensum"
        message={`¿Estás seguro de eliminar el pensum de ${deleteTarget?.carrera?.nombre || "esta carrera"} (${deleteTarget?.anioCreacion})?`}
        onConfirm={eliminar}
        onCancel={() => { setDeleteTarget(null); setDeleteError(""); }}
      />
      {deleteError && <div style={styles.errorBar}>{deleteError}</div>}

      <button onClick={() => navigate("/admin/bienvenida")} style={styles.btnBack}>
        ← Volver al panel
      </button>
    </div>
  );
}

const styles = {
  root: { maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" },
  title: { fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: "0.88rem", color: "#64748b", margin: "0.3rem 0 0" },
  btnPrimary: {
    padding: "0.55rem 1.2rem", background: "#1D4ED8", color: "white", border: "none",
    borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  },
  btnOutline: {
    padding: "0.4rem 0.85rem", background: "white", color: "#1e293b", border: "1.5px solid #e2e8f0",
    borderRadius: 6, fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
  },
  btnBack: {
    marginTop: "2rem", padding: "0.5rem 1rem", background: "none", border: "none",
    color: "#1D4ED8", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer",
  },
  grid: { display: "flex", flexDirection: "column", gap: "0.85rem" },
  card: {
    background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
    overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  cardBody: { padding: "1.25rem 1.25rem 0.75rem" },
  cardTitle: { fontSize: "1.05rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.5rem" },
  cardMeta: { display: "flex", gap: 8, marginBottom: "0.4rem" },
  badge: {
    padding: "0.2rem 0.6rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600,
    background: "#e0f2fe", color: "#0369a1",
  },
  cardCodigo: { fontSize: "0.82rem", color: "#64748b", margin: 0 },
  cardActions: {
    display: "flex", gap: 8, padding: "0.6rem 1.25rem 1rem",
    borderTop: "1px solid #f1f5f9", background: "#fafafa",
  },
  loader: { textAlign: "center", padding: "4rem", color: "#64748b", fontSize: "1rem" },
  empty: { textAlign: "center", padding: "4rem 1rem", color: "#64748b" },
  errorBar: {
    marginTop: "1rem", padding: "0.6rem 0.85rem", background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 8, fontSize: "0.84rem", color: "#dc2626", textAlign: "center",
  },
};
