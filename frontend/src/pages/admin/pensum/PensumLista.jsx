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
                  {p.duracion && <span style={{ ...styles.badge, background: "rgba(16,185,129,0.15)", color: "#34d399" }}>{p.duracion} sem</span>}
                  <span style={{ ...styles.badge, background: p.estado ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: p.estado ? "#34d399" : "#f87171" }}>
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
                <button onClick={() => { setDeleteTarget(p); setDeleteError(""); }} style={{ ...styles.btnOutline, color: "#f87171", borderColor: "#7f1d1d" }}>
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
  root: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#ffffff", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" },
  title: { fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { fontSize: "0.88rem", color: "#64748b", margin: "0.3rem 0 0" },
  btnPrimary: {
    padding: "0.55rem 1.2rem", background: "#7c3aed", color: "white", border: "none",
    borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  },
  btnOutline: {
    padding: "0.4rem 0.85rem", background: "transparent", color: "#cbd5e1", border: "1.5px solid #334155",
    borderRadius: 6, fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
  },
  btnBack: {
    marginTop: "2rem", padding: "0.5rem 1rem", background: "none", border: "none",
    color: "#7c3aed", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1rem" },
  card: {
    background: "#1e293b", borderRadius: 12, border: "1px solid #334155",
    overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },
  cardBody: { padding: "1.25rem 1.25rem 0.75rem" },
  cardTitle: { fontSize: "1.05rem", fontWeight: 600, color: "#f1f5f9", margin: "0 0 0.5rem" },
  cardMeta: { display: "flex", gap: 8, marginBottom: "0.4rem" },
  badge: {
    padding: "0.2rem 0.6rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600,
    background: "rgba(255,255,255,0.1)", color: "#cbd5e1",
  },
  cardCodigo: { fontSize: "0.82rem", color: "#94a3b8", margin: 0 },
  cardActions: {
    display: "flex", gap: 8, padding: "0.6rem 1.25rem 1rem",
    borderTop: "1px solid #334155", background: "rgba(255,255,255,0.03)",
  },
  loader: { textAlign: "center", padding: "4rem", color: "#64748b", fontSize: "1rem" },
  empty: { textAlign: "center", padding: "4rem 1rem", color: "#64748b" },
  errorBar: {
    marginTop: "1rem", padding: "0.6rem 0.85rem", background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 8, fontSize: "0.84rem", color: "#dc2626", textAlign: "center",
  },
};
