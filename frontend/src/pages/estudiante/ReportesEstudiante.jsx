import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { estudianteService } from "../../services/estudianteService";
import useAuthStore from "../../stores/useAuthStore";

const C = {
  bg: "#f0fdfa", surface: "#ffffff", border: "#ccfbf1", borderMid: "#99f6e4",
  accent: "#0d9488", accentDim: "#ccfbf1", green: "#059669", greenDim: "#d1fae5",
  amber: "#d97706", amberDim: "#fef3c7", red: "#dc2626", redDim: "#fee2e2",
  gray: "#64748b", grayDim: "#f1f5f9", text: "#0f172a", textSub: "#475569", textMuted: "#94a3b8",
};

export default function ReportesEstudiante() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [semestreFiltro, setSemestreFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [hoverPreview, setHoverPreview] = useState(null);

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await estudianteService.obtenerReporte();
      setData(r);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar reporte");
    } finally {
      setLoading(false);
    }
  };

  const historial = data?.historial || [];
  const activas = data?.activas || [];
  const resumen = data?.resumen || {};
  const estudianteData = data?.estudiante || {};

  const semestres = [...new Set(historial.map(h => h.materia?.semestre).filter(Boolean))].sort((a, b) => a - b);

  const filtrados = historial.filter(h => {
    if (semestreFiltro !== "todos" && String(h.materia?.semestre) !== semestreFiltro) return false;
    if (estadoFiltro !== "todos" && h.estado !== estadoFiltro) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <button onClick={() => navigate("/estudiante/bienvenida")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><i className="bi bi-arrow-left"></i> Volver</button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Mis Reportes</span>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>
        {error && (
          <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "12px 16px", color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="bi bi-exclamation-triangle-fill" style={{fontSize:14}}></i> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
            <i className="bi bi-hourglass-split" style={{fontSize:32}}></i>
            <p style={{ margin: 0 }}>Cargando reporte académico…</p>
          </div>
        ) : data ? (
          <>
            {/* Info del estudiante */}
            <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: `4px solid ${C.accent}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.3rem 0.85rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, background: C.accentDim, color: C.accent }}>
                  <i className="bi bi-mortarboard-fill" style={{fontSize:14}}></i> Reporte Académico
                </span>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, margin: "0 0 0.5rem" }}>
                {estudianteData.nombre || user?.nombre1}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: "0.85rem", color: C.textSub }}>
                <span style={{ background: C.grayDim, padding: "0.5rem 1rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <strong>Matrícula:</strong> {estudianteData.matricula || "—"}
                </span>
                <span style={{ background: C.grayDim, padding: "0.5rem 1rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <strong>Carrera:</strong> {estudianteData.carrera || "—"}
                </span>
                <span style={{ background: C.grayDim, padding: "0.5rem 1rem", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <strong>Email:</strong> {estudianteData.email || user?.email}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Materias cursadas", value: resumen.totalMaterias || 0, color: C.accent },
                { label: "Aprobadas", value: resumen.aprobadas || 0, color: C.green },
                { label: "Reprobadas", value: resumen.reprobadas || 0, color: C.red },
                { label: "Créditos acumulados", value: resumen.creditosAcumulados || 0, color: C.amber },
              ].map(s => (
                <div key={s.label} style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Promedio y activas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.accent }}>
                  {resumen.promedioGeneral ? Number(resumen.promedioGeneral).toFixed(1) : "—"}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Promedio General</div>
              </div>
              <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.accent }}>{resumen.inscripcionesActivas || 0}</div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Cursos en curso</div>
              </div>
            </div>

            {/* Filtros */}
            <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Filtrar:</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[["todos", "Todos"], ["Aprobado", "Aprobados"], ["Reprobado", "Reprobados"]].map(([v, l]) => (
                  <button key={v} onClick={() => setEstadoFiltro(v)} style={{
                    padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: estadoFiltro === v ? C.accent : "transparent",
                    color: estadoFiltro === v ? "white" : C.textMuted,
                    border: `1.5px solid ${estadoFiltro === v ? C.accent : C.border}`,
                  }}>{l}</button>
                ))}
              </div>
              {semestres.length > 0 && (
                <select value={semestreFiltro} onChange={e => setSemestreFiltro(e.target.value)}
                  style={{ marginLeft: "auto", padding: "6px 12px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textSub, outline: "none", background: "white" }}>
                  <option value="todos">Todos los semestres</option>
                  {semestres.map(s => <option key={s} value={String(s)}>Semestre {s}</option>)}
                </select>
              )}
            </div>

            {/* Tabla de historial */}
            <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.grayDim }}>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Código</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Materia</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Créd.</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Nota</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Estado</th>
                    <th style={{ padding: "0.85rem 1rem", textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${C.border}` }}>Periodo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: C.textMuted }}>
                        No hay registros con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((h, idx) => {
                      const estadoColor = h.estado === "Aprobado" ? C.green : h.estado === "Reprobado" ? C.red : C.amber;
                      return (
                        <tr key={h.id} style={{ borderBottom: `1px solid ${C.border}`, background: idx % 2 === 0 ? "#f8fafc" : "white" }}>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.textSub }}>{h.materia?.codigo}</td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>{h.materia?.nombre}</td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", textAlign: "center", color: C.textSub }}>{h.materia?.creditos}</td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", textAlign: "center", fontWeight: 700, color: h.notaFinal !== null ? (h.notaFinal >= 51 ? C.green : C.red) : C.textMuted }}>
                            {h.notaFinal !== null ? Number(h.notaFinal).toFixed(1) : "—"}
                          </td>
                          <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                            <span style={{ background: estadoColor + "18", color: estadoColor, borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                              {h.estado}
                            </span>
                          </td>
                          <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem", textAlign: "center", color: C.textSub }}>{h.periodo?.codigo || "—"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Botones de exportación */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <div style={{ position: "relative" }}>
                <button
                  onMouseEnter={() => setHoverPreview("pdf")}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => estudianteService.exportarPDF()}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                  Descargar PDF
                </button>
                {hoverPreview === "pdf" && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 10, width: 480, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                    <div style={{ padding: "10px 14px", background: "#fef2f2", borderBottom: "1px solid #fecaca", display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="bi bi-file-earmark-pdf-fill" style={{fontSize:16,color:"#dc2626"}}></i>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}>Vista previa PDF</span>
                    </div>
                    <div style={{ padding: "12px 16px", maxHeight: 320, overflowY: "auto" }}>
                      <div style={{ borderTop: "4px solid #0d9488", marginBottom: 16 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 8 }}>Reporte Académico</div>
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>Historial completo de calificaciones</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        {[
                          { label: "Estudiante", value: estudianteData.nombre || user?.nombre1 },
                          { label: "Matrícula", value: estudianteData.matricula || "—" },
                          { label: "Carrera", value: estudianteData.carrera || "—" },
                        ].map(item => (
                          <div key={item.label} style={{ flex: 1, background: "#f8fafc", padding: "7px 10px", borderRadius: 6, borderLeft: "3px solid #0d9488" }}>
                            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px" }}>{item.label}</div>
                            <div style={{ fontSize: 11, color: "#1e293b", fontWeight: 500, marginTop: 1 }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {[
                          { label: "Aprobadas", value: resumen.aprobadas || 0, bg: "#d1fae5", color: "#059669" },
                          { label: "Reprobadas", value: resumen.reprobadas || 0, bg: "#fee2e2", color: "#dc2626" },
                          { label: "Créditos", value: resumen.creditosAcumulados || 0, bg: "#e0f2fe", color: "#0284c7" },
                        ].map(s => (
                          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: s.bg, borderRadius: 8 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 9, color: s.color, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr style={{ background: "#0d9488" }}>
                            {["Código", "Materia", "Créd.", "Nota", "Estado", "Período"].map(h => (
                              <th key={h} style={{ padding: "6px 8px", textAlign: h === "Materia" || h === "Código" || h === "Período" ? "left" : "center", color: "white", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtrados.slice(0, 4).map((h, i) => {
                            const ec = h.estado === "Aprobado" ? "#059669" : h.estado === "Reprobado" ? "#dc2626" : "#d97706";
                            return (
                              <tr key={h.id} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#f8fafc" : "#ffffff" }}>
                                <td style={{ padding: "5px 8px", color: "#64748b" }}>{h.materia?.codigo}</td>
                                <td style={{ padding: "5px 8px", color: "#0f172a", fontWeight: 500 }}>{h.materia?.nombre}</td>
                                <td style={{ padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{h.materia?.creditos}</td>
                                <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: 700, color: h.notaFinal !== null ? (h.notaFinal >= 51 ? "#059669" : "#dc2626") : "#94a3b8" }}>{h.notaFinal !== null ? Number(h.notaFinal).toFixed(1) : "—"}</td>
                                <td style={{ padding: "5px 8px", textAlign: "center" }}>
                                  <span style={{ background: ec + "18", color: ec, borderRadius: 999, padding: "1px 10px", fontSize: 10, fontWeight: 600 }}>{h.estado}</span>
                                </td>
                                <td style={{ padding: "5px 8px", color: "#64748b" }}>{h.periodo?.codigo || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {filtrados.length > 4 && (
                        <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", padding: "5px 0 0" }}>... y {filtrados.length - 4} más</div>
                      )}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #e2e8f0", fontSize: 10, color: "#64748b" }}>
                        <span><strong>Promedio General:</strong> {resumen.promedioGeneral ? Number(resumen.promedioGeneral).toFixed(1) : "—"}</span>
                        <span style={{ marginLeft: 16 }}><strong>Fecha de generación:</strong> {new Date().toLocaleDateString("es-BO")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onMouseEnter={() => setHoverPreview("excel")}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => estudianteService.exportarExcel()}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.25rem", background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                  Descargar Excel
                </button>
                {hoverPreview === "excel" && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 10, width: 480, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                    <div style={{ padding: "10px 14px", background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="bi bi-file-earmark-spreadsheet-fill" style={{fontSize:16,color:"#16a34a"}}></i>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#16a34a" }}>Vista previa Excel</span>
                    </div>
                    <div style={{ padding: "12px 16px", maxHeight: 320, overflowY: "auto" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Reporte Académico</div>
                      <div style={{ fontSize: 11, color: "#1e293b", marginTop: 4 }}>Estudiante: {estudianteData.nombre || user?.nombre1}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>Matrícula: {estudianteData.matricula || "—"} | Carrera: {estudianteData.carrera || "—"}</div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr>
                            {["Código", "Materia", "Créditos", "Nota Final", "Estado", "Período"].map(h => (
                              <th key={h} style={{ padding: "7px 8px", background: "#0d9488", color: "white", fontWeight: 700, fontSize: 12, textAlign: "center", border: "1px solid #0b7a6f" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtrados.slice(0, 4).map((h, i) => {
                            const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
                            return (
                              <tr key={h.id}>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg }}>{h.materia?.codigo}</td>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg, fontWeight: 500 }}>{h.materia?.nombre}</td>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg, textAlign: "center" }}>{h.materia?.creditos}</td>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg, textAlign: "center", fontWeight: 700, color: h.notaFinal !== null ? (h.notaFinal >= 51 ? "#059669" : "#dc2626") : "#94a3b8" }}>{h.notaFinal !== null ? Number(h.notaFinal).toFixed(1) : "—"}</td>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg, textAlign: "center" }}>
                                  <span style={{
                                    background: (h.estado === "Aprobado" ? "#059669" : h.estado === "Reprobado" ? "#dc2626" : "#d97706") + "18",
                                    color: h.estado === "Aprobado" ? "#059669" : h.estado === "Reprobado" ? "#dc2626" : "#d97706",
                                    borderRadius: 999, padding: "1px 10px", fontSize: 10, fontWeight: 600
                                  }}>{h.estado}</span>
                                </td>
                                <td style={{ padding: "5px 8px", border: "1px solid #e2e8f0", background: bg }}>{h.periodo?.codigo || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {filtrados.length > 4 && (
                        <div style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", padding: "5px 0 0" }}>... y {filtrados.length - 4} más</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
