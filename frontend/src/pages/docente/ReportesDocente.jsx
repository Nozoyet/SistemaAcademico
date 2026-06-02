import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { docenteService } from "../../services/docenteService";
import useAuthStore from "../../stores/useAuthStore";

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
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(paramCursoId || "");
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [error, setError] = useState("");
  const [hoverPreview, setHoverPreview] = useState(null);

  useEffect(() => {
    docenteService.obtenerCursos()
      .then(r => {
        const cursos = r.data || [];
        setCursos(cursos);
        if (!paramCursoId && cursos.length > 0) {
          setCursoSeleccionado(cursos[0].id);
        }
      })
      .catch(err => setError("Error al cargar cursos"))
      .finally(() => setLoadingCursos(false));
  }, [paramCursoId]);

  useEffect(() => {
    if (cursoSeleccionado) {
      cargarReporte(cursoSeleccionado);
    }
  }, [cursoSeleccionado]);

  const cargarReporte = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const r = await docenteService.obtenerReporteCurso(id);
      setReporte(r.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al generar reporte");
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  const cursoActual = cursos.find(c => c.id == cursoSeleccionado);

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
            <i className="bi bi-bar-chart-fill" style={{fontSize:14}}></i> Reporte de Curso
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: C.text, margin: "0 0 0.6rem", letterSpacing: "-0.02em" }}>
            Reportes por <span style={{ color: C.accent }}>Curso</span>
          </h1>
          <p style={{ fontSize: "0.92rem", color: C.textSub, margin: "0 0 1.75rem", lineHeight: 1.65 }}>
            Consulta las calificaciones de tus cursos. Visualiza, filtra y exporta a PDF o Excel.
          </p>

          {error && (
            <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "12px 16px", color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="bi bi-exclamation-triangle-fill" style={{fontSize:14}}></i> {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.textSub, marginBottom: "0.5rem" }}>Selecciona un curso</label>
              <select value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.85rem", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: "0.9rem", color: C.text, background: "white", cursor: "pointer" }}>
                <option value="">-- Seleccionar curso --</option>
                {cursos.map(c => (
                  <option key={c.id} value={c.id}>{c.materia?.nombre} - Grupo {c.codigoGrupo} ({c.periodo?.codigo})</option>
                ))}
              </select>
            </div>
          </div>
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
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: C.text, margin: 0 }}>Calificaciones del curso</h2>
              <div style={{ display: "flex", gap: 12 }}>
                {[["aprobados", C.green], ["reprobados", C.red], ["cursando", C.amber]].map(([k, col]) => (
                  <div key={k} style={{ textAlign: "center", padding: "0.4rem 0.8rem", background: col + "12", borderRadius: 8, border: `1px solid ${col}33` }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: col, lineHeight: 1 }}>{reporte.resumen?.[k] || 0}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: C.textSub, padding: "1rem 0", flexWrap: "wrap" }}>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Materia:</strong> {reporte.curso?.materia}
              </div>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Grupo:</strong> {reporte.curso?.codigoGrupo}
              </div>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Periodo:</strong> {reporte.curso?.periodo}
              </div>
              <div style={{ background: C.grayDim, padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <strong>Promedio:</strong> {reporte.resumen?.promedio ? Number(reporte.resumen.promedio).toFixed(1) : "—"}
              </div>
            </div>

            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.grayDim }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>#</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Matrícula</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Estudiante</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Nota</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.estudiantes?.map((e, idx) => {
                    const estadoColor = e.estado === "Aprobado" ? C.green : e.estado === "Reprobado" ? C.red : C.amber;
                    return (
                      <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: idx % 2 === 0 ? "#f8fafc" : "white" }}>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.textMuted }}>{idx + 1}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.textSub }}>{e.matricula || "—"}</td>
                        <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>{e.estudiante}</td>
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
              <div style={{ position: "relative" }}>
                <button
                  onMouseEnter={() => setHoverPreview("pdf")}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => docenteService.exportarPDF(cursoSeleccionado)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                  Descargar PDF
                </button>
                {hoverPreview === "pdf" && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 10, width: 460, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                    <div style={{ padding: "10px 14px", background: "#fef2f2", borderBottom: "1px solid #fecaca", display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="bi bi-file-earmark-pdf-fill" style={{fontSize:16,color:"#dc2626"}}></i>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}>Vista previa PDF</span>
                    </div>
                    <div style={{ padding: "12px 16px", maxHeight: 320, overflowY: "auto" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Reporte de Calificaciones</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 12 }}>Documento generado el {new Date().toLocaleDateString("es-BO")}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                        {[
                          { label: "Materia", value: `${reporte.curso?.materia || ""} - Grupo ${reporte.curso?.codigoGrupo || ""}` },
                          { label: "Docente", value: reporte.curso?.docente || "—" },
                          { label: "Período", value: reporte.curso?.periodo || "—" },
                          { label: "Carrera", value: reporte.curso?.carrera || "—" },
                        ].map(item => (
                          <div key={item.label} style={{ background: "#f8fafc", padding: "7px 10px", borderRadius: 6, borderLeft: "3px solid #0369a1" }}>
                            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px" }}>{item.label}</div>
                            <div style={{ fontSize: 11, color: "#1e293b", fontWeight: 500, marginTop: 1 }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {[
                          { label: "Aprobados", value: reporte.resumen?.aprobados || 0, bg: "#d1fae5", color: "#059669" },
                          { label: "Reprobados", value: reporte.resumen?.reprobados || 0, bg: "#fee2e2", color: "#dc2626" },
                          { label: "Cursando", value: reporte.resumen?.cursando || 0, bg: "#fef3c7", color: "#d97706" },
                        ].map(s => (
                          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: s.bg, borderRadius: 8 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 9, color: s.color, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr style={{ background: "#0369a1" }}>
                            {["Matrícula", "Estudiante", "Nota", "Estado"].map(h => (
                              <th key={h} style={{ padding: "6px 10px", textAlign: h === "Nota" || h === "Estado" ? "center" : "left", color: "white", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reporte.estudiantes?.slice(0, 5).map((e, i) => {
                            const ec = e.estado === "Aprobado" ? "#059669" : e.estado === "Reprobado" ? "#dc2626" : "#d97706";
                            return (
                              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                                <td style={{ padding: "5px 10px", color: "#64748b" }}>{e.matricula || "—"}</td>
                                <td style={{ padding: "5px 10px", color: "#0f172a", fontWeight: 500 }}>{e.estudiante}</td>
                                <td style={{ padding: "5px 10px", textAlign: "center", fontWeight: 700, color: e.notaFinal !== null ? "#0f172a" : "#94a3b8" }}>{e.notaFinal !== null ? Number(e.notaFinal).toFixed(1) : "—"}</td>
                                <td style={{ padding: "5px 10px", textAlign: "center" }}>
                                  <span style={{ background: ec + "18", color: ec, borderRadius: 999, padding: "1px 10px", fontSize: 10, fontWeight: 600 }}>{e.estado}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {(reporte.estudiantes?.length || 0) > 5 && (
                        <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", padding: "5px 0 0" }}>... y {reporte.estudiantes.length - 5} más</div>
                      )}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #e2e8f0", fontSize: 10, color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                        <span><strong>Promedio General:</strong> {reporte.resumen?.promedio ? Number(reporte.resumen.promedio).toFixed(1) : "—"}</span>
                        <span><strong>Total estudiantes:</strong> {reporte.estudiantes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onMouseEnter={() => setHoverPreview("excel")}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => docenteService.exportarExcel(cursoSeleccionado)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                  Descargar Excel
                </button>
                {hoverPreview === "excel" && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 10, width: 460, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                    <div style={{ padding: "10px 14px", background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="bi bi-file-earmark-spreadsheet-fill" style={{fontSize:16,color:"#16a34a"}}></i>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#16a34a" }}>Vista previa Excel</span>
                    </div>
                    <div style={{ padding: "12px 16px", maxHeight: 320, overflowY: "auto" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Reporte de Calificaciones</div>
                      <div style={{ fontSize: 11, color: "#1e293b", marginTop: 4 }}>Curso: {reporte.curso?.materia} - Grupo {reporte.curso?.codigoGrupo}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>Docente: {reporte.curso?.docente || "—"} | Período: {reporte.curso?.periodo} | Carrera: {reporte.curso?.carrera || "—"}</div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr>
                            {["Matrícula", "Estudiante", "Nota Final", "Estado"].map(h => (
                              <th key={h} style={{ padding: "7px 10px", background: "#0369a1", color: "white", fontWeight: 700, fontSize: 12, textAlign: "center", border: "1px solid #1e40af" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reporte.estudiantes?.slice(0, 5).map((e, i) => {
                            const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
                            return (
                              <tr key={i}>
                                <td style={{ padding: "5px 10px", border: "1px solid #e2e8f0", background: bg }}>{e.matricula || "—"}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #e2e8f0", background: bg, fontWeight: 500 }}>{e.estudiante}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #e2e8f0", background: bg, textAlign: "center", fontWeight: 700 }}>{e.notaFinal !== null ? Number(e.notaFinal).toFixed(1) : "—"}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #e2e8f0", background: bg, textAlign: "center" }}>
                                  <span style={{
                                    background: (e.estado === "Aprobado" ? "#059669" : e.estado === "Reprobado" ? "#dc2626" : "#d97706") + "18",
                                    color: e.estado === "Aprobado" ? "#059669" : e.estado === "Reprobado" ? "#dc2626" : "#d97706",
                                    borderRadius: 999, padding: "1px 10px", fontSize: 10, fontWeight: 600
                                  }}>{e.estado}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {(reporte.estudiantes?.length || 0) > 5 && (
                        <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", padding: "5px 0 0" }}>... y {reporte.estudiantes.length - 5} más</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && !reporte && cursoSeleccionado && (
          <div style={{ background: "white", borderRadius: 16, padding: "3rem 2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textAlign: "center", color: C.textMuted }}>
            <i className="bi bi-inbox" style={{fontSize:40}}></i>
            <p style={{ fontWeight: 600 }}>No hay información disponible para este curso</p>
          </div>
        )}
      </main>
    </div>
  );
}
