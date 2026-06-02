import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { docenteService } from "../../services/docenteService";

const C = {
  bg: "#f0f9ff", surface: "#ffffff", border: "#e0f2fe", borderMid: "#bae6fd",
  accent: "#0369a1", accentDim: "#e0f2fe", green: "#059669", amber: "#d97706",
  red: "#dc2626", gray: "#64748b", grayDim: "#f1f5f9",
  text: "#0f172a", textSub: "#475569", textMuted: "#94a3b8",
};

const diasOrden = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

function Tag({ children, color = C.accent }) {
  return (
    <span style={{ background: color + "18", color, border: `1px solid ${color}33`,
      borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export default function MisCursos() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");

  useEffect(() => {
    setLoading(true);
    docenteService.obtenerCursos()
      .then(r => setCursos(r.data || []))
      .catch(err => setError(err.response?.data?.message || "Error al cargar cursos"))
      .finally(() => setLoading(false));
  }, []);

  const periodos = [...new Set(cursos.map(c => c.periodo?.codigo).filter(Boolean))];

  const filtrados = cursos.filter(c => {
    if (periodoFiltro !== "todos" && c.periodo?.codigo !== periodoFiltro) return false;
    if (busqueda) {
      const b = busqueda.toLowerCase();
      return c.materia?.nombre?.toLowerCase().includes(b) ||
             c.materia?.codigo?.toLowerCase().includes(b) ||
             c.codigoGrupo?.toLowerCase().includes(b);
    }
    return true;
  });

  const totalEstudiantes = cursos.reduce((s, c) => s + (c.cupoActual || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <button onClick={() => navigate("/docente/bienvenida")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><i className="bi bi-arrow-left"></i> Volver</button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Mis Cursos</span>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Cursos asignados", value: cursos.length, color: C.accent },
              { label: "Estudiantes totales", value: totalEstudiantes, color: C.green },
              { label: "Periodos activos", value: periodos.length, color: C.amber },
            ].map(s => (
              <div key={s.label} style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por materia, código o grupo…"
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", color: C.text }} />
          {periodos.length > 0 && (
            <select value={periodoFiltro} onChange={e => setPeriodoFiltro(e.target.value)}
              style={{ padding: "7px 12px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textSub, outline: "none", background: "white" }}>
              <option value="todos">Todos los periodos</option>
              {periodos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
<i className="bi bi-hourglass-split" style={{ fontSize: 32, marginBottom: 12, display: "block" }}></i>
            <p style={{ margin: 0 }}>Cargando cursos…</p>
          </div>
        ) : error ? (
          <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#991b1b", fontSize: 13 }}>{error}</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
<i className="bi bi-inbox" style={{ fontSize: 40, marginBottom: 12, display: "block" }}></i>
            <p style={{ margin: 0, fontWeight: 600 }}>No tienes cursos asignados</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtrados.map(curso => (
              <div key={curso.id} style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ height: 4, background: C.accent }} />
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: C.accentDim, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{curso.materia?.semestre || "—"}</span>
                      <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>SEM</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{curso.materia?.nombre}</span>
                        <Tag color={C.accent}>Grupo {curso.codigoGrupo}</Tag>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Tag color={C.textMuted}>{curso.materia?.codigo}</Tag>
                        <Tag color={C.textSub}>{curso.materia?.creditos} créditos</Tag>
                        {curso.periodo && <Tag color={C.textMuted}>{curso.periodo.codigo}</Tag>}
                        {curso.periodo?.carrera && <Tag color={C.textMuted}>{curso.periodo.carrera}</Tag>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{curso.cupoActual}</div>
                      <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>/{curso.cupoMaximo} cupos</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {curso.horarios?.sort((a, b) => diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana)).map((h, i) => (
                      <span key={i} style={{ fontSize: 11, color: C.accent, background: C.accentDim, borderRadius: 6, padding: "4px 10px", fontWeight: 500 }}>
                        {h.diaSemana.slice(0, 3)} {h.horaInicio}–{h.horaFin} · {h.aula}
                      </span>
                    ))}
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 14, paddingTop: 14, display: "flex", gap: 10 }}>
                    <button onClick={() => navigate(`/docente/cursos/${curso.id}/estudiantes`)}
                      style={{ flex: 1, padding: "9px 16px", borderRadius: 10, border: "none", background: C.accent, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <i className="bi bi-pencil-fill" style={{ marginRight: 6 }}></i>Ingresar Calificaciones
                    </button>
                    <button onClick={() => navigate(`/docente/reportes/curso/${curso.id}`)}
                      style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${C.accent}`, background: "white", color: C.accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
<i className="bi bi-bar-chart-fill" style={{ marginRight: 6 }}></i>Reporte
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
