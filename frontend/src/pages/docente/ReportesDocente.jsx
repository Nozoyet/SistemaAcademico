import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { docenteService } from "../../services/docenteService";
import useAuthStore from "../../stores/useAuthStore";
import FiltrosReportes from "../../components/common/FiltrosReportes";

const C = {
  bg: "#f0f9ff", surface: "#ffffff", border: "#e0f2fe", borderMid: "#bae6fd",
  accent: "#0369a1", accentDim: "#e0f2fe", green: "#059669", greenDim: "#d1fae5",
  amber: "#d97706", amberDim: "#fef3c7", red: "#dc2626", redDim: "#fee2e2",
  gray: "#64748b", grayDim: "#f1f5f9", text: "#0f172a", textSub: "#475569", textMuted: "#94a3b8",
};

export default function ReportesDocente() {
  const navigate = useNavigate();
  const { cursoId: paramCursoId } = useParams();
  const { user, logout } = useAuthStore();
  const [filtros, setFiltros] = useState({ periodo_id: "", materia_id: "", curso_id: paramCursoId || "", condicion: "" });
  const [opciones, setOpciones] = useState({ periodos: [], materias: [], cursos: [] });
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  const cargarPreview = async (f) => {
    setLoading(true);
    setError("");
    try {
      const payload = {};
      if (f.periodo_id) payload.periodo_id = f.periodo_id;
      if (f.materia_id) payload.materia_id = f.materia_id;
      if (f.curso_id) payload.curso_id = f.curso_id;
      if (f.condicion) payload.estado = f.condicion;
      const r = await docenteService.reportePreview('calificaciones', payload);
      setReporte({ estudiantes: r.data });
    } catch (err) {
      setError(err.response?.data?.message || "Error al generar reporte");
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    docenteService.obtenerFiltrosReportes()
      .then(data => {
        setOpciones(data);
        if (paramCursoId) {
          const curso = data.cursos.find(c => Number(c.id) === Number(paramCursoId));
          if (curso) {
            setFiltros({
              periodo_id: String(curso.idPeriodoAcademico),
              materia_id: String(curso.idMateria),
              curso_id: String(curso.id),
            });
          }
        }
      })
      .catch(err => setError("Error al cargar filtros"));
  }, [paramCursoId]);

  useEffect(() => {
    if (opciones.cursos.length === 0) return;
    const tieneFiltro = filtros.periodo_id || filtros.materia_id || filtros.curso_id;
    if (!tieneFiltro) {
      setReporte(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => cargarPreview(filtros), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filtros, opciones.cursos.length]);

  const changeFiltros = (nuevos) => setFiltros(nuevos);

  const exportFiltros = () => {
    const p = {};
    if (filtros.periodo_id) p.periodo_id = filtros.periodo_id;
    if (filtros.materia_id) p.materia_id = filtros.materia_id;
    if (filtros.curso_id) p.curso_id = filtros.curso_id;
    if (filtros.condicion) p.estado = filtros.condicion;
    return p;
  };

  const estudiantesFiltrados = reporte?.estudiantes?.map(e => ({
    ...e,
    notaFinal: e.notaFinal,
    estado: e.estado,
  })) || [];

  const resumenFiltrado = {
    aprobados: estudiantesFiltrados.filter(e => e.estado === "Aprobado").length,
    reprobados: estudiantesFiltrados.filter(e => e.estado === "Reprobado").length,
    cursando: estudiantesFiltrados.filter(e => e.estado !== "Aprobado" && e.estado !== "Reprobado").length,
    promedio: estudiantesFiltrados.length > 0
      ? (estudiantesFiltrados.reduce((s, e) => s + (Number(e.notaFinal) || 0), 0) / estudiantesFiltrados.length)
      : 0,
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "white", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => navigate("/docente/bienvenida")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><i className="bi bi-arrow-left"></i> Volver</button>
          <div style={{ width: 1, height: 20, background: C.border }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Reportes Docente</span>
        </div>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 7, padding: "0.45rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 8, background: "white", color: C.textSub, fontSize: "0.84rem", fontWeight: 500, cursor: "pointer" }}>Cerrar sesión</button>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: `4px solid ${C.accent}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.35rem 0.85rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, background: C.accentDim, color: C.accent, marginBottom: "1.25rem" }}>
            <i className="bi bi-bar-chart-fill" style={{fontSize:14}}></i> Calificaciones
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: C.text, margin: "0 0 0.6rem", letterSpacing: "-0.02em" }}>
            Reporte de <span style={{ color: C.accent }}>Calificaciones</span>
          </h1>
          <p style={{ fontSize: "0.92rem", color: C.textSub, margin: "0 0 1.75rem", lineHeight: 1.65 }}>
            Consulta las calificaciones de tus cursos. Selecciona cualquier filtro para ver resultados al instante.
          </p>

          {error && (
            <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "12px 16px", color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="bi bi-exclamation-triangle-fill" style={{fontSize:14}}></i> {error}
            </div>
          )}

          <FiltrosReportes
            campos={["periodo", "materia", "curso", "condicion"]}
            opciones={opciones}
            filtros={filtros}
            onChange={changeFiltros}
            loading={loading}
            color={C.accent}
            titulo="Calificaciones"
            descripcion="Selecciona filtros para ver las calificaciones al instante"
            condicionOpciones={[
              { value: "Aprobado", label: "Aprobado" },
              { value: "Reprobado", label: "Reprobado" },
            ]}
          />
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
            <i className="bi bi-hourglass-split" style={{fontSize:32}}></i>
            <p style={{ margin: 0 }}>Generando reporte…</p>
          </div>
        )}

        {reporte && !loading && (
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: C.text, margin: 0 }}>Calificaciones</h2>
              <div style={{ display: "flex", gap: 12 }}>
                {[["aprobados", C.green], ["reprobados", C.red], ["cursando", C.amber]].map(([k, col]) => (
                  <div key={k} style={{ textAlign: "center", padding: "0.4rem 0.8rem", background: col + "12", borderRadius: 8, border: `1px solid ${col}33` }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: col, lineHeight: 1 }}>{resumenFiltrado[k]}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: C.textSub, padding: "1rem 0", flexWrap: "wrap" }}>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Registros:</strong> {estudiantesFiltrados.length}
              </div>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Promedio:</strong> {resumenFiltrado.promedio ? resumenFiltrado.promedio.toFixed(1) : "—"}
              </div>
            </div>

            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.grayDim }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>#</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Estudiante</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Materia</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Nota</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map((e, idx) => {
                    const estadoColor = e.estado === "Aprobado" ? C.green : e.estado === "Reprobado" ? C.red : C.amber;
                    return (
                      <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: idx % 2 === 0 ? "#f8fafc" : "white" }}>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.textMuted }}>{idx + 1}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>{e.estudiante}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.textSub }}>{e.materia || e.curso?.materia?.nombre || "—"}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", textAlign: "center", color: e.notaFinal !== null ? C.text : C.textMuted, fontWeight: e.notaFinal !== null ? 700 : 400 }}>
                          {e.notaFinal !== null ? Number(e.notaFinal).toFixed(1) : "—"}
                        </td>
                        <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                          <span style={{ background: estadoColor + "18", color: estadoColor, borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{e.estado}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={async () => {
                try { await docenteService.exportarPreviewPdf('calificaciones', exportFiltros()); }
                catch (err) { setError("Error al descargar PDF: " + (err.response?.data?.message || err.message)); }
              }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                <i className="bi bi-file-earmark-pdf-fill"></i> Descargar PDF
              </button>
              <button onClick={async () => {
                try { await docenteService.exportarPreviewExcel('calificaciones', exportFiltros()); }
                catch (err) { setError("Error al descargar Excel: " + (err.response?.data?.message || err.message)); }
              }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
              </button>
            </div>
          </div>
        )}

        {!loading && !reporte && (filtros.periodo_id || filtros.materia_id || filtros.curso_id) && (
          <div style={{ background: "white", borderRadius: 16, padding: "3rem 2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textAlign: "center", color: C.textMuted }}>
            <i className="bi bi-inbox" style={{fontSize:40}}></i>
            <p style={{ fontWeight: 600 }}>No hay registros para los filtros seleccionados</p>
          </div>
        )}

        {!loading && !reporte && !filtros.periodo_id && !filtros.materia_id && !filtros.curso_id && (
          <div style={{ background: "white", borderRadius: 16, padding: "3rem 2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textAlign: "center", color: C.textMuted }}>
            <i className="bi bi-search" style={{fontSize:40}}></i>
            <p style={{ fontWeight: 600 }}>Selecciona un filtro para ver las calificaciones</p>
          </div>
        )}
      </main>


    </div>
  );
}
