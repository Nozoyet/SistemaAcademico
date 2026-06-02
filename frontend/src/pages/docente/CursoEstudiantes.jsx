import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { docenteService } from "../../services/docenteService";

const C = {
  bg: "#f0f9ff", surface: "#ffffff", border: "#e0f2fe", borderMid: "#bae6fd",
  accent: "#0369a1", accentDim: "#e0f2fe", green: "#059669", greenDim: "#d1fae5",
  amber: "#d97706", amberDim: "#fef3c7", red: "#dc2626", redDim: "#fee2e2",
  gray: "#64748b", grayDim: "#f1f5f9", text: "#0f172a", textSub: "#475569", textMuted: "#94a3b8",
};

function NotaSlider({ value, onChange }) {
  const num = value !== "" ? Number(value) : null;
  const pct = num !== null ? Math.min(100, Math.max(0, num)) : 0;
  const color = num !== null ? (num >= 51 ? C.green : C.red) : C.textMuted;
  return (
    <div style={{ position: "relative", width: 140 }}>
      <div style={{ height: 6, background: C.grayDim, borderRadius: 999, marginBottom: 6, position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.red}, ${C.amber} 51%, ${C.green})`, borderRadius: 999, transition: "width .15s ease" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input type="number" min="0" max="100" step="0.5"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="—"
          style={{ width: 70, padding: "6px 8px", textAlign: "center", border: `2px solid ${color}`, borderRadius: 8, fontSize: 15, fontWeight: 700, color, outline: "none", background: color === C.textMuted ? "white" : color + "08" }} />
        {num !== null ? <i className={`bi ${num >= 51 ? "bi-check-lg" : "bi-x-lg"}`} style={{ fontSize: 16, color, fontWeight: 700, minWidth: 36 }}></i> : <span style={{ minWidth: 36 }}></span>}
      </div>
    </div>
  );
}

export default function CursoEstudiantes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notas, setNotas] = useState({});
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setLoading(true);
    docenteService.obtenerEstudiantes(id)
      .then(r => {
        setCurso(r.curso);
        const estudiantes = r.data || [];
        setEstudiantes(estudiantes);
        const notasMap = {};
        estudiantes.forEach(e => {
          if (e.notaFinal !== null && e.notaFinal !== undefined) {
            notasMap[e.idInscripcion] = String(e.notaFinal);
          }
        });
        setNotas(notasMap);
      })
      .catch(err => setError(err.response?.data?.message || "Error al cargar estudiantes"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNotaChange = (idInscripcion, value) => {
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setNotas(prev => ({ ...prev, [idInscripcion]: value }));
    }
  };

  const guardarTodas = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    const calificaciones = Object.entries(notas)
      .filter(([, nota]) => nota !== "" && nota !== undefined && nota !== null)
      .map(([idInscripcion, notaFinal]) => ({
        idInscripcion: Number(idInscripcion),
        notaFinal: Number(notaFinal),
      }));

    if (calificaciones.length === 0) {
      setError("Debes ingresar al menos una calificación");
      setSaving(false);
      return;
    }

    try {
      await docenteService.guardarCalificaciones(id, calificaciones);
      setSuccess("Calificaciones guardadas correctamente");
      cargarEstudiantes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar calificaciones");
    } finally {
      setSaving(false);
    }
  };

  const cargarEstudiantes = () => {
    docenteService.obtenerEstudiantes(id)
      .then(r => {
        setEstudiantes(r.data || []);
        const notasMap = {};
        (r.data || []).forEach(e => {
          if (e.notaFinal !== null && e.notaFinal !== undefined) {
            notasMap[e.idInscripcion] = String(e.notaFinal);
          }
        });
        setNotas(notasMap);
      })
      .catch(() => {});
  };

  const filtrarNotasValidas = () => Object.values(notas).filter(n => n !== "" && n !== undefined && n !== null).length;

  const filtrados = estudiantes.filter(e => {
    if (!busqueda) return true;
    const b = busqueda.toLowerCase();
    return e.nombre?.toLowerCase().includes(b) || e.matricula?.toLowerCase().includes(b);
  });

  const conNota = filtrarNotasValidas();
  const aprobados = Object.entries(notas).filter(([, n]) => n !== "" && n !== undefined && n !== null && Number(n) >= 51).length;
  const reprobados = conNota - aprobados;
  const sinNota = estudiantes.length - conNota;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <button onClick={() => navigate("/docente/cursos")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><i className="bi bi-arrow-left"></i> Volver</button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{curso?.materia || "Curso"} — Grupo {curso?.codigoGrupo}</span>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
        {error && (
          <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "12px 16px", color: C.red, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
<i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}
        {success && (
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}33`, borderRadius: 10, padding: "12px 16px", color: C.green, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
<i className="bi bi-check-circle-fill"></i> {success}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
<i className="bi bi-hourglass-split" style={{ fontSize: 32, marginBottom: 12, display: "block" }}></i>
            <p style={{ margin: 0 }}>Cargando estudiantes…</p>
          </div>
        ) : (
          <>
            {/* Stats visuales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Inscritos", value: estudiantes.length, color: C.accent, bg: C.accentDim },
                { label: "Aprobados", value: aprobados, color: C.green, bg: C.greenDim },
                { label: "Reprobados", value: reprobados, color: C.red, bg: C.redDim },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${s.color}33` }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: "0 0 1px" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 600, opacity: 0.8 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Barra de progreso general */}
            {estudiantes.length > 0 && (
              <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Progreso de calificaciones</span>
                  <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{conNota}/{estudiantes.length}</span>
                </div>
                <div style={{ height: 10, background: C.grayDim, borderRadius: 999, overflow: "hidden", display: "flex" }}>
                  {aprobados > 0 && <div style={{ width: `${(aprobados / estudiantes.length) * 100}%`, background: C.green, transition: "width .3s" }} title={`${aprobados} aprobados`} />}
                  {reprobados > 0 && <div style={{ width: `${(reprobados / estudiantes.length) * 100}%`, background: C.red, transition: "width .3s" }} title={`${reprobados} reprobados`} />}
                  {sinNota > 0 && <div style={{ width: `${(sinNota / estudiantes.length) * 100}%`, background: C.gray, transition: "width .3s" }} title={`${sinNota} sin nota`} />}
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}><i className="bi bi-circle-fill" style={{fontSize:6, marginRight:3, verticalAlign:"middle"}}></i> {aprobados} aprobados</span>
                  <span style={{ fontSize: 10, color: C.red, fontWeight: 600 }}><i className="bi bi-circle-fill" style={{fontSize:6, marginRight:3, verticalAlign:"middle"}}></i> {reprobados} reprobados</span>
                  <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}><i className="bi bi-circle-fill" style={{fontSize:6, marginRight:3, verticalAlign:"middle"}}></i> {sinNota} sin nota</span>
                </div>
              </div>
            )}

            {/* Barra de acciones */}
            <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <i className="bi bi-search" style={{ color: C.textMuted, fontSize: 14 }}></i>
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar estudiante por nombre o matrícula…"
                style={{ flex: 1, minWidth: 180, padding: "8px 12px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: "none", color: C.text }} />
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button onClick={guardarTodas} disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 10, border: "none", background: C.accent, color: "white", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Guardando…" : <><i className="bi bi-floppy-fill" style={{fontSize:14}}></i> Guardar calificaciones</>}
              </button>
            </div>

            {filtrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>
                <i className="bi bi-inbox" style={{fontSize:40}}></i>
                <p style={{ margin: "10px 0 0", fontWeight: 600 }}>No hay estudiantes inscritos en este curso</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtrados.map((est, idx) => {
                  const nota = notas[est.idInscripcion];
                  const notaNum = nota !== undefined && nota !== "" ? Number(nota) : null;
                  const estado = est.estadoNota || (notaNum !== null ? (notaNum >= 51 ? "Aprobado" : "Reprobado") : null);
                  const rowBg = idx % 2 === 0 ? "#f8fafc" : "white";
                  const borderColor = notaNum !== null ? (notaNum >= 51 ? C.green : C.red) : C.border;
                  return (
                    <div key={est.idInscripcion} style={{ background: "white", border: `1.5px solid ${borderColor}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", transition: "border-color .15s" }}>
                      <div style={{ height: 3, background: notaNum !== null ? (notaNum >= 51 ? C.green : C.red) : C.grayDim }} />
                      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{idx + 1}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{est.nombre}</div>
                          <div style={{ fontSize: 12, color: C.textMuted, display: "flex", gap: 10, marginTop: 2 }}>
                            <span>{est.matricula || "—"}</span>
                            {est.email && <span>• {est.email}</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
                          <NotaSlider value={notas[est.idInscripcion] !== undefined ? notas[est.idInscripcion] : ""} onChange={v => handleNotaChange(est.idInscripcion, v)} />
                          {estado && (
                            <span style={{
                              background: estado === "Aprobado" ? C.greenDim : estado === "Reprobado" ? C.redDim : C.grayDim,
                              color: estado === "Aprobado" ? C.green : estado === "Reprobado" ? C.red : C.textMuted,
                              borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                            }}>{estado}</span>
                          )}
                          {est.estadoNota && (
                            <span style={{ fontSize: 10, color: C.textMuted, fontStyle: "italic" }}>guardado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
