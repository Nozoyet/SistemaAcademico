import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

const SEM_COLORS = [
  { label: "Sem 1", color: "#3b82f6", bg: "#eff6ff" },
  { label: "Sem 2", color: "#10b981", bg: "#ecfdf5" },
  { label: "Sem 3", color: "#f59e0b", bg: "#fffbeb" },
  { label: "Sem 4", color: "#ef4444", bg: "#fef2f2" },
  { label: "Sem 5", color: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Sem 6", color: "#ec4899", bg: "#fdf2f8" },
  { label: "Sem 7", color: "#14b8a6", bg: "#f0fdfa" },
  { label: "Sem 8", color: "#f97316", bg: "#fff7ed" },
  { label: "Sem 9", color: "#6366f1", bg: "#eef2ff" },
  { label: "Sem 10", color: "#84cc16", bg: "#f7fee7" },
];

function cs(sem) {
  if (!sem || sem < 1 || sem > SEM_COLORS.length) return { color: "#64748b", bg: "#f1f5f9" };
  return SEM_COLORS[sem - 1];
}

function buildTree(materias) {
  const map = {};
  materias.forEach((m) => { map[m.id] = { ...m, children: [] }; });
  const roots = [];
  materias.forEach((m) => {
    if (m.idPrerequisito && map[m.idPrerequisito]) {
      map[m.idPrerequisito].children.push(map[m.id]);
    } else {
      roots.push(map[m.id]);
    }
  });
  return roots;
}

function MateriaCard({ m, onTip }) {
  const sc = cs(m.semestre);
  return (
    <div
      style={{ ...css.card, borderColor: sc.color, background: sc.bg }}
      onMouseEnter={(e) => onTip && onTip(m.descripcion, e)}
      onMouseMove={(e) => onTip && onTip(m.descripcion, e)}
      onMouseLeave={() => onTip && onTip(null)}
    >
      <div style={css.ch}>
        <span style={{ ...css.code, background: sc.color, color: "#fff" }}>{m.codigo}</span>
        <span style={css.cr}>{m.creditos} cr</span>
      </div>
      <div style={css.name}>{m.nombre}</div>
      <div style={css.cf}>
        <span style={css.st}>{sc.label}</span>
      </div>
    </div>
  );
}

function ConnectorLine() {
  return (
    <div style={css.connector}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ display: "block" }}>
        <line x1="0" y1="14" x2="28" y2="14" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    </div>
  );
}

function Subtree({ node, padres = [], onTip }) {
  const hasKids = node.children.length > 0;
  const todos = [...padres, node];

  return (
    <div style={css.subtree}>
      {padres.length > 0 && <ConnectorLine />}
      <MateriaCard m={node} onTip={onTip} />
      {hasKids && (
        <div style={css.kids}>
          {node.children.length === 1 ? (
            <Subtree node={node.children[0]} padres={todos} onTip={onTip} />
          ) : (
            <div style={css.branch}>
              <div style={css.branchLine} />
              <div style={css.branchKids}>
                {node.children.map((child) => (
                  <div key={child.id} style={css.branchItem}>
                    <div style={css.branchConn}>
                      <svg width="20" height="30" viewBox="0 0 20 30" fill="none" style={{ display: "block" }}>
                        <line x1="0" y1="15" x2="20" y2="15" stroke="#94a3b8" strokeWidth="2" />
                      </svg>
                    </div>
                    <Subtree node={child} padres={todos} onTip={onTip} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PensumArbol() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pensum, setPensum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState(null);
  const [tip, setTip] = useState(null);

  const onTip = (texto, e) => {
    if (!texto) { setTip(null); return; }
    setTip({ texto, x: e.clientX, y: e.clientY - 12 });
  };

  useEffect(() => {
    api.get(`/pensum/${id}`).then((res) => {
      setPensum(res.data.data);
      setLoading(false);
    }).catch(() => navigate("/admin/pensum"));
  }, [id]);

  if (loading) return <div style={css.loader}>Cargando...</div>;
  if (!pensum) return null;

  const todas = pensum.materias || [];
  const totalM = todas.length;
  const totalC = todas.reduce((s, m) => s + (m.creditos || 0), 0);
  const sems = [...new Set(todas.map((m) => m.semestre).filter(Boolean))].sort((a, b) => a - b);

  let arbol = buildTree(todas);
  if (filtro) arbol = todas.filter((m) => m.semestre == filtro).map((m) => ({ ...m, children: [] }));

  return (
    <div style={css.root}>
      <div style={css.header}>
        <div>
          <h1 style={css.tt}>{pensum.carrera?.nombre || "Pensum"}</h1>
          <p style={css.sb}>{pensum.anioCreacion} · {totalM} materias · {totalC} créditos{pensum.creditos_totales ? ` / meta: ${pensum.creditos_totales}` : ""}</p>
        </div>
        <button onClick={() => navigate(`/admin/pensum/${id}`)} style={css.btn}>← Detalle</button>
      </div>

      <div style={css.filters}>
        <button onClick={() => setFiltro(null)} style={{ ...css.fb, ...(filtro === null ? css.fba : {}) }}>Todas</button>
        {SEM_COLORS.filter((_, i) => sems.includes(i + 1)).map((s, i) => (
          <button key={s.label} onClick={() => setFiltro(filtro === i + 1 ? null : i + 1)} style={{
            ...css.fb, borderColor: s.color, color: filtro === i + 1 ? "#fff" : s.color,
            background: filtro === i + 1 ? s.color : "white",
          }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={css.canvas}>
        {arbol.length > 0 ? (
          <div style={css.forest}>
            {arbol.map((root, i) => (
              <div key={root.id} style={css.tree}>
                <Subtree node={root} onTip={onTip} />
              </div>
            ))}
          </div>
        ) : (
          <div style={css.empty}>No hay materias en este semestre</div>
        )}
      </div>

      {tip && (
        <div style={{ ...css.tooltip, left: tip.x, top: tip.y }}>{tip.texto}</div>
      )}

      <div style={css.footer}>
        <button onClick={() => navigate("/admin/pensum")} style={{ ...css.btn, border: "none", color: "#1D4ED8", padding: "0.5rem 0" }}>← Volver a pensums</button>
      </div>
    </div>
  );
}

const css = {
  root: { maxWidth: "100%", margin: "0 auto", padding: "2rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#fafafa" },
  loader: { textAlign: "center", padding: "4rem", color: "#64748b", fontSize: "1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem", maxWidth: 960, margin: "0 auto 1rem" },
  tt: { fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  sb: { fontSize: "0.85rem", color: "#64748b", margin: "0.3rem 0 0" },
  btn: { padding: "0.4rem 0.85rem", background: "white", color: "#1e293b", border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: "0.82rem", fontWeight: 500, cursor: "pointer" },
  filters: { display: "flex", gap: "0.5rem", flexWrap: "wrap", maxWidth: 960, margin: "0 auto 1.5rem" },
  fb: { padding: "0.3rem 0.85rem", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, border: "2px solid #e2e8f0", cursor: "pointer", transition: "all .12s" },
  fba: { borderColor: "#1D4ED8", color: "#1D4ED8", background: "#eff6ff" },
  canvas: { overflowX: "auto", overflowY: "auto", padding: "2.5rem", background: "white", borderRadius: 12, border: "1px solid #e2e8f0", minHeight: 300, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" },
  forest: { display: "flex", flexDirection: "column", gap: "3.5rem", minWidth: "max-content" },
  tree: {},
  subtree: { display: "flex", alignItems: "center", gap: 0 },
  kids: { display: "flex", alignItems: "center" },
  connector: { display: "flex", alignItems: "center", justifyContent: "center", width: 32, flexShrink: 0 },
  branch: { display: "flex", alignItems: "stretch", marginLeft: "2px" },
  branchLine: { width: 2, background: "#cbd5e1", flexShrink: 0, marginLeft: "16px" },
  branchKids: { display: "flex", flexDirection: "column", gap: "2rem", paddingLeft: "0.75rem" },
  branchItem: { display: "flex", alignItems: "center", gap: 0 },
  branchConn: { display: "flex", alignItems: "center", justifyContent: "center", width: 20, flexShrink: 0 },
  card: { borderRadius: 10, border: "2px solid", padding: "0.65rem 0.85rem", minWidth: 170, maxWidth: 210, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  ch: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" },
  code: { fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: 4, letterSpacing: "0.02em" },
  cr: { fontSize: "0.7rem", color: "#64748b", fontWeight: 600 },
  name: { fontSize: "0.82rem", fontWeight: 500, color: "#0f172a", lineHeight: 1.3 },
  cf: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.3rem" },
  st: { fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8" },
  tooltip: {
    position: "fixed", padding: "0.5rem 0.75rem", background: "#0f172a", color: "white",
    fontSize: "0.75rem", lineHeight: 1.4, borderRadius: 8, maxWidth: 260,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9999, pointerEvents: "none", textAlign: "center",
    transform: "translateX(-50%) translateY(-100%)",
  },
  empty: { textAlign: "center", padding: "3rem", color: "#64748b" },
  footer: { marginTop: "2rem", maxWidth: 960, margin: "2rem auto 0" },
};
