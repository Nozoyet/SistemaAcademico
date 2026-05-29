import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

// ─── Paleta y utilidades ────────────────────────────────────────────────────
const C = {
  bg: "#f8fafc",
  surface: "#ffffff",
  card: "#ffffff",

  // Bordes
  border: "#e2e8f0",
  borderLight: "#f1f5f9",

  // Acentos principales
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
  accentDim: "#f5f3ff",

  // Estados
  green: "#10b981",
  greenDim: "#ecfdf5",

  amber: "#f59e0b",
  amberDim: "#f8f8f6",

  red: "#ef4444",
  redDim: "#fef2f2",

  // Texto
  text: "#0f172a",
  textMuted: "#475569",
  textSub: "#94a3b8",

  // Extras opcionales
  hover: "#f8fafc",
  shadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
};

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const turnos = ["Mañana", "Tarde", "Noche"];

// ─── Sub-componentes UI ──────────────────────────────────────────────────────

function StepBar({ step }) {
  const steps = [
    { n: 1, label: "Período Académico" },
    { n: 2, label: "Oferta Académica" },
    { n: 3, label: "Crear Cursos" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: step > s.n ? C.green : step === s.n ? C.accent : C.border,
              color: step >= s.n ? "#d8d2d2" : C.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, flexShrink: 0,
              transition: "background .3s",
            }}>
              {step > s.n ? "✓" : s.n}
            </div>
            <span style={{ fontSize: 11, color: step === s.n ? C.accent : C.textMuted, fontWeight: step === s.n ? 600 : 400, whiteSpace: "nowrap" }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: step > s.n ? C.green : C.border, margin: "0 8px", marginBottom: 22, transition: "background .3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 8,
            padding: "9px 12px", color: C.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, required, style }) {
  return (
    <Input label={label} required={required} style={style}>
      <select
        value={value}
        onChange={onChange}
        style={{
          background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 8,
          padding: "9px 12px", color: value ? C.text : C.textMuted, fontSize: 14, outline: "none", width: "100%",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Input>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, type = "button", style }) {
  const variants = {
    primary:  { background: C.accent, color: "#e0e0e0", border: "none" },
    ghost:    { background: "transparent", color: C.textSub, border: `1.5px solid ${C.border}` },
    success:  { background: C.green, color: "#052e16", border: "none" },
    danger:   { background: "transparent", color: C.red, border: `1.5px solid ${C.red}` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
        transition: "opacity .15s", ...style,
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children, color = C.accent }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

function Alert({ msg, type = "error" }) {
  if (!msg) return null;
  const colors = { error: C.red, success: C.green, warning: C.amber };
  return (
    <div style={{
      background: colors[type] + "18", border: `1px solid ${colors[type]}44`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13, color: colors[type], marginBottom: 16,
    }}>
      {msg}
    </div>
  );
}

// ─── PASO 1: Período Académico ───────────────────────────────────────────────
function PasoPeriodo({ onNext }) {
  const [carreras, setCarreras] = useState([]);
  const [form, setForm] = useState({ codigo: "", fechaInicio: "", fechaFin: "", idCarrera: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/carrera").then((r) => setCarreras(r.data.data || []));
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/periodos", form);
      onNext(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el período");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>
        Definir Período Académico
      </h2>
      <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 24px" }}>
        Establece el período antes de generar la oferta de cursos.
      </p>
      <Alert msg={error} />
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <Input label="Código del período" value={form.codigo} onChange={set("codigo")}
            required style={{ gridColumn: "1 / -1" }} />
          <Input label="Fecha inicio" value={form.fechaInicio} onChange={set("fechaInicio")} type="date" required />
          <Input label="Fecha fin" value={form.fechaFin} onChange={set("fechaFin")} type="date" required />
          <Select label="Carrera" value={form.idCarrera} onChange={set("idCarrera")}
            options={carreras.map((c) => ({ value: c.id, label: c.nombre }))}
            placeholder="Selecciona una carrera" required style={{ gridColumn: "1 / -1" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Btn type="submit" disabled={loading}>
            {loading ? "Creando…" : "Continuar →"}
          </Btn>
        </div>
      </form>
    </div>
  );
}

// ─── PASO 2: Oferta Académica ────────────────────────────────────────────────
function PasoOferta({ periodo, onNext, onBack }) {
  const [pensum, setPensum] = useState(null);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [extras, setExtras] = useState([]);
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [extraForm, setExtraForm] = useState({ codigo: "", nombre: "", creditos: "", semestre: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/carrera/${periodo.idCarrera}/pensum-activo`)
      .then((r) => {
        setPensum(r.data.data);
        // Pre-seleccionar todas por defecto
        const ids = new Set(r.data.data.materias.map((m) => m.id));
        setSeleccionadas(ids);
      })
      .catch(() => setError("No se pudo cargar el pensum de la carrera"))
      .finally(() => setLoading(false));
  }, [periodo.idCarrera]);

  const toggleMateria = (id) => {
    setSeleccionadas((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const addExtra = () => {
    if (!extraForm.codigo || !extraForm.nombre || !extraForm.creditos) return;
    setExtras((p) => [...p, { ...extraForm, id: `extra-${Date.now()}`, isExtra: true }]);
    setExtraForm({ codigo: "", nombre: "", creditos: "", semestre: "" });
    setShowExtraForm(false);
  };

  const removeExtra = (id) => setExtras((p) => p.filter((e) => e.id !== id));

  const handleContinuar = () => {
    if (seleccionadas.size === 0 && extras.length === 0) {
      setError("Debes seleccionar al menos una materia");
      return;
    }
    const materiasDelPensum = pensum.materias.filter((m) => seleccionadas.has(m.id));
    onNext([...materiasDelPensum, ...extras]);
  };

  if (loading) return <div style={{ color: C.textMuted, padding: 40, textAlign: "center" }}>Cargando pensum…</div>;

  // Agrupar por semestre
  const porSemestre = {};
  pensum?.materias?.forEach((m) => {
    const s = m.semestre || "Sin semestre";
    if (!porSemestre[s]) porSemestre[s] = [];
    porSemestre[s].push(m);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
            Generar Oferta Académica
          </h2>
          <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
            Período: <span style={{ color: C.accent }}>{periodo.codigo}</span>
            {" · "}{seleccionadas.size + extras.length} materias seleccionadas
          </p>
        </div>
        <Btn variant="ghost" onClick={() => setShowExtraForm((p) => !p)}>
          + Materia extra
        </Btn>
      </div>

      <Alert msg={error} />

      {/* Formulario materia extra */}
      {showExtraForm && (
        <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.amber, margin: "0 0 12px" }}>Agregar materia extraordinaria</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["código", "codigo"], ["nombre", "nombre"], ["créditos", "creditos"], ["semestre", "semestre"]].map(([lbl, k]) => (
              <Input key={k} label={lbl} value={extraForm[k]}
                onChange={(e) => setExtraForm((p) => ({ ...p, [k]: e.target.value }))} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="success" onClick={addExtra}>Agregar</Btn>
            <Btn variant="ghost" onClick={() => setShowExtraForm(false)}>Cancelar</Btn>
          </div>
        </div>
      )}

      {/* Materias extra ya agregadas */}
      {extras.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: C.amber, fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Materias extraordinarias ({extras.length})
          </p>
          {extras.map((e) => (
            <div key={e.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: C.amberDim + "44", border: `1px solid ${C.amber}33`,
              borderRadius: 8, padding: "10px 14px", marginBottom: 6,
            }}>
              <Tag color={C.amber}>Extra</Tag>
              <span style={{ flex: 1, fontSize: 13, color: C.text }}>{e.codigo} — {e.nombre}</span>
              <span style={{ fontSize: 12, color: C.textMuted }}>{e.creditos} créditos</span>
              {e.semestre && <Tag color={C.textMuted}>Sem. {e.semestre}</Tag>}
              <Btn variant="danger" onClick={() => removeExtra(e.id)} style={{ padding: "4px 10px", fontSize: 12 }}>✕</Btn>
            </div>
          ))}
        </div>
      )}

      {/* Tabla por semestres */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {Object.entries(porSemestre).sort(([a], [b]) => Number(a) - Number(b)).map(([sem, mats]) => (
          <div key={sem}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {sem === "Sin semestre" ? "Sin semestre definido" : `Semestre ${sem}`}
              </span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
              <span style={{ fontSize: 11, color: C.textMuted }}>
                {mats.filter((m) => seleccionadas.has(m.id)).length}/{mats.length} seleccionadas
              </span>
            </div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.surface }}>
                    <th style={th}>
                      <input type="checkbox"
                        checked={mats.every((m) => seleccionadas.has(m.id))}
                        onChange={(e) => {
                          setSeleccionadas((prev) => {
                            const s = new Set(prev);
                            mats.forEach((m) => e.target.checked ? s.add(m.id) : s.delete(m.id));
                            return s;
                          });
                        }}
                      />
                    </th>
                    {["Código", "Nombre", "Créditos", "Prerrequisito"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mats.map((m) => {
                    const activa = seleccionadas.has(m.id);
                    return (
                      <tr key={m.id} onClick={() => toggleMateria(m.id)}
                        style={{ cursor: "pointer", background: activa ? C.accentDim + "44" : "transparent", transition: "background .15s" }}>
                        <td style={td}>
                          <input type="checkbox" checked={activa} onChange={() => toggleMateria(m.id)} onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td style={td}><Tag color={C.accent}>{m.codigo}</Tag></td>
                        <td style={{ ...td, color: C.text, fontWeight: 500 }}>{m.nombre}</td>
                        <td style={{ ...td, color: C.textSub, textAlign: "center" }}>{m.creditos}</td>
                        <td style={{ ...td, color: C.textMuted, fontSize: 12 }}>
                          {m.prerrequisito ? m.prerrequisito.nombre : <span style={{ color: C.border }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <Btn variant="ghost" onClick={onBack}>← Atrás</Btn>
        <Btn onClick={handleContinuar}>
          Continuar con {seleccionadas.size + extras.length} materias →
        </Btn>
      </div>
    </div>
  );
}

// ─── PASO 3: Crear Cursos ────────────────────────────────────────────────────
function PasoCursos({ periodo, materias, onBack }) {
  const [docentes, setDocentes] = useState([]);
  const [cursosCreados, setCursosCreados] = useState({});   // idMateria → [cursos]
  const [modal, setModal] = useState(null);                 // null | { materia }
  const [form, setForm] = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showFinishModal, setShowFinishModal] = useState(false);

  function defaultForm() {
    return {
      codigoGrupo: "", idDocente: "", cupoMaximo: "",
      horarios: [{ diaSemana: "Lunes", horaInicio: "", horaFin: "", aula: "", edificio: "", turno: "" }],
    };
  }

  useEffect(() => {
    api.get("/docentes").then((r) => setDocentes(r.data.data || []));
  }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const setHorario = (idx, k) => (e) =>
    setForm((p) => {
      const h = [...p.horarios];
      h[idx] = { ...h[idx], [k]: e.target.value };
      return { ...p, horarios: h };
    });

  const addHorario = () =>
    setForm((p) => ({ ...p, horarios: [...p.horarios, { diaSemana: "Lunes", horaInicio: "", horaFin: "", aula: "", edificio: "", turno: "" }] }));

  const removeHorario = (idx) =>
    setForm((p) => ({ ...p, horarios: p.horarios.filter((_, i) => i !== idx) }));

  const openModal = (materia) => {
    setForm(defaultForm());
    setError("");
    setModal(materia);
  };

  const handleCrearCurso = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const payload = {
        codigoGrupo: form.codigoGrupo,
        idMateria: modal.id,
        idPeriodoAcademico: periodo.id,
        idDocente: form.idDocente,
        cupoMaximo: Number(form.cupoMaximo),
        horarios: form.horarios,
      };
      const res = await api.post("/cursos", payload);
      setCursosCreados((p) => ({
        ...p,
        [modal.id]: [...(p[modal.id] || []), res.data.data],
      }));
      setSuccess(`Curso "${form.codigoGrupo}" creado correctamente`);
      setModal(null);
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el curso");
    } finally { setSaving(false); }
  };

  const totalCreados = Object.values(cursosCreados).reduce((a, c) => a + c.length, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Crear Cursos</h2>
          <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
            Período: <span style={{ color: C.accent }}>{periodo.codigo}</span>
            {" · "}{totalCreados} cursos creados de {materias.length} materias
          </p>
        </div>
        {totalCreados > 0 && (
          <Btn variant="success" onClick={() => setShowFinishModal(true)}>
  ✓ Finalizar
</Btn>
        )}
      </div>

      <Alert msg={success} type="success" />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {materias.map((m) => {
          const cursos = cursosCreados[m.id] || [];
          const isExtra = m.isExtra;
          return (
            <div key={m.id} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{m.nombre}</span>
                    {isExtra && <Tag color={C.amber}>Extra</Tag>}
                    <Tag color={C.accent}>{m.codigo}</Tag>
                    {m.semestre && <Tag color={C.textMuted}>Sem. {m.semestre}</Tag>}
                  </div>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{m.creditos} créditos</span>
                </div>
                {cursos.length > 0 && (
                  <Tag color={C.green}>{cursos.length} grupo{cursos.length > 1 ? "s" : ""}</Tag>
                )}
                <Btn onClick={() => openModal(m)} style={{ padding: "7px 14px", fontSize: 12 }}>
                  + Agregar grupo
                </Btn>
              </div>

              {/* Cursos creados para esta materia */}
              {cursos.length > 0 && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "8px 16px", background: C.surface }}>
                  {cursos.map((c) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 12 }}>
                      <Tag color={C.green}>{c.codigoGrupo}</Tag>
                      <span style={{ color: C.textSub }}>
                        {c.docente ? `${c.docente.nombre1} ${c.docente.apellidoP}` : "Docente asignado"}
                      </span>
                      <span style={{ color: C.textMuted }}>Cupo: {c.cupoMaximo}</span>
                      {c.horarios?.map((h, i) => (
                        <Tag key={i} color={C.textMuted}>{h.diaSemana} {h.horaInicio}–{h.horaFin} · {h.aula}</Tag>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}>
        <Btn variant="ghost" onClick={onBack}>← Atrás</Btn>
      </div>

      {/* Modal crear curso */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
        }} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", padding: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>
                  Nuevo grupo — {modal.nombre}
                </h3>
                <span style={{ fontSize: 12, color: C.textMuted }}>{modal.codigo} · {modal.creditos} créditos</span>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>

            <Alert msg={error} />

            <form onSubmit={handleCrearCurso}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <Input label="Código de grupo" value={form.codigoGrupo} onChange={set("codigoGrupo")} required />
                <Input label="Cupo máximo" value={form.cupoMaximo} onChange={set("cupoMaximo")} type="number" required />
                <Select label="Docente" value={form.idDocente} onChange={set("idDocente")}
                  options={docentes.map((d) => ({ value: d.id, label: d.nombre }))}
                  placeholder="Selecciona un docente" required style={{ gridColumn: "1 / -1" }} />
              </div>

              {/* Horarios */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Horarios
                  </span>
                  <Btn variant="ghost" onClick={addHorario} style={{ padding: "5px 12px", fontSize: 12 }}>+ Añadir día</Btn>
                </div>

                {form.horarios.map((h, idx) => (
                  <div key={idx} style={{
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: "14px", marginBottom: 10,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: C.textMuted }}>Horario {idx + 1}</span>
                      {form.horarios.length > 1 && (
                        <button type="button" onClick={() => removeHorario(idx)}
                          style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 13 }}>✕ Eliminar</button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <Select label="Día" value={h.diaSemana} onChange={setHorario(idx, "diaSemana")}
                        options={dias.map((d) => ({ value: d, label: d }))} />
                      <Input label="Hora inicio" value={h.horaInicio} onChange={setHorario(idx, "horaInicio")} type="time" required />
                      <Input label="Hora fin" value={h.horaFin} onChange={setHorario(idx, "horaFin")} type="time" required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <Input label="Aula" value={h.aula} onChange={setHorario(idx, "aula")} required />
                      <Input label="Edificio" value={h.edificio} onChange={setHorario(idx, "edificio")} />
                      <Select label="Turno" value={h.turno} onChange={setHorario(idx, "turno")}
                        options={turnos.map((t) => ({ value: t, label: t }))} placeholder="— Opcional —" />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
                <Btn type="submit" disabled={saving}>
                  {saving ? "Guardando…" : "Crear curso"}
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal finalizar proceso */}
{showFinishModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 20,
    }}
  >
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: "32px",
        width: "100%",
        maxWidth: 520,
        boxShadow: C.shadow,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          margin: "0 auto 18px",
          borderRadius: "50%",
          background: C.greenDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
        }}
      >
        ✓
      </div>

      <h2
        style={{
          margin: "0 0 10px",
          fontSize: 24,
          fontWeight: 700,
          color: C.text,
        }}
      >
        Oferta académica creada
      </h2>

      <p
        style={{
          margin: "0 0 24px",
          fontSize: 14,
          lineHeight: 1.7,
          color: C.textMuted,
        }}
      >
        Se generaron correctamente{" "}
        <strong style={{ color: C.accent }}>
          {totalCreados} cursos
        </strong>{" "}
        para el período{" "}
        <strong style={{ color: C.accent }}>
          {periodo.codigo}
        </strong>.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Btn
          variant="ghost"
          onClick={() => setShowFinishModal(false)}
        >
          Seguir editando
        </Btn>

        <Btn
          onClick={() => navigate("/admin/bienvenida")}
        >
          Ir al panel
        </Btn>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

// ─── Estilos de tabla ─────────────────────────────────────────────────────────
const th = {
  padding: "10px 14px", textAlign: "left", fontSize: 11,
  color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
  borderBottom: `1px solid ${C.border}`,
};
const td = { padding: "10px 14px", fontSize: 13, color: C.textSub, borderBottom: `1px solid ${C.border}33` };

// ─── Componente principal ────────────────────────────────────────────────────
export default function GestionCursos() {
  const [step, setStep] = useState(1);
  const [periodo, setPeriodo] = useState(null);
  const [materias, setMaterias] = useState([]);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => navigate("/admin/bienvenida")}
          style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          ← Volver
        </button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Gestión de Cursos</span>
        {periodo && <Tag color={C.accent}>{periodo.codigo}</Tag>}
      </header>

      {/* Contenido */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px" }}>
        <StepBar step={step} />

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
          {step === 1 && (
            <PasoPeriodo onNext={(p) => { setPeriodo(p); setStep(2); }} />
          )}
          {step === 2 && (
            <PasoOferta
              periodo={periodo}
              onNext={(mats) => { setMaterias(mats); setStep(3); }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <PasoCursos
              periodo={periodo}
              materias={materias}
              onBack={() => setStep(2)}
              
            />
          )}
        </div>
      </main>
    </div>
  );
}