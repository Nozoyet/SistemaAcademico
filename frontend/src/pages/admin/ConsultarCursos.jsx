import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const C = {
  bg:"#f8fafc",surface:"#ffffff",card:"#ffffff",border:"#e2e8f0",borderLight:"#f1f5f9",
  accent:"#7c3aed",accentSoft:"#ede9fe",accentDim:"#f5f3ff",
  green:"#10b981",greenDim:"#ecfdf5",amber:"#f59e0b",amberDim:"#fffbeb",
  red:"#ef4444",redDim:"#fef2f2",text:"#0f172a",textMuted:"#475569",textSub:"#94a3b8",
  shadow:"0 2px 12px rgba(15,23,42,0.06)",
};
const dias=["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
const turnos=["Mañana","Tarde","Noche"];

// ── UI ────────────────────────────────────────────────────────────────────────
function Tag({children,color=C.accent}){
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:999,padding:"2px 10px",fontSize:11,fontWeight:600}}>{children}</span>;
}

function Btn({children,onClick,variant="primary",disabled,type="button",style,title}){
  const vs={
    primary:{background:C.accent,color:"#fff",border:"none"},
    ghost:{background:"transparent",color:C.textMuted,border:`1.5px solid ${C.border}`},
    success:{background:C.green,color:"#052e16",border:"none"},
    danger:{background:"transparent",color:C.red,border:`1.5px solid ${C.red}`},
    warning:{background:C.amber,color:"#1c1000",border:"none"},
  };
  return(
    <button type={type} onClick={onClick} disabled={disabled} title={title} style={{...vs[variant],
      padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:600,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,
      display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",transition:"all .15s",...style}}>
      {children}
    </button>
  );
}

function Alert({msg,type="error"}){
  if(!msg)return null;
  const col={error:C.red,success:C.green,warning:C.amber,info:C.accent}[type];
  return <div style={{background:col+"18",border:`1px solid ${col}44`,borderRadius:8,padding:"10px 14px",fontSize:13,color:col,marginBottom:16}}>{msg}</div>;
}

function FieldWrap({label,required,error,style,children}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5,...style}}>
      {label&&<label style={{fontSize:11,fontWeight:600,color:C.textSub,letterSpacing:"0.05em",textTransform:"uppercase"}}>
        {label}{required&&<span style={{color:C.red}}> *</span>}
      </label>}
      {children}
      {error&&<span style={{color:C.red,fontSize:11,fontWeight:500}}>⚠ {error}</span>}
    </div>
  );
}

function Input({label,value,onChange,type="text",required,error,style,placeholder,min}){
  return(
    <FieldWrap label={label} required={required} error={error} style={style}>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} min={min}
        style={{background:C.surface,border:`1.5px solid ${error?C.red:C.border}`,borderRadius:8,
          padding:"9px 12px",color:C.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
    </FieldWrap>
  );
}

function Sel({label,value,onChange,options,placeholder,required,error,style}){
  return(
    <FieldWrap label={label} required={required} error={error} style={style}>
      <select value={value} onChange={onChange}
        style={{background:C.surface,border:`1.5px solid ${error?C.red:C.border}`,borderRadius:8,
          padding:"9px 12px",color:value?C.text:C.textMuted,fontSize:14,outline:"none",width:"100%"}}>
        {placeholder&&<option value="">{placeholder}</option>}
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldWrap>
  );
}

function ConfirmModal({open,title,message,onConfirm,onCancel,confirmLabel="Confirmar",variant="danger"}){
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,width:"100%",maxWidth:400,boxShadow:C.shadow}}>
        <h3 style={{fontSize:17,fontWeight:700,color:C.text,margin:"0 0 10px"}}>{title}</h3>
        <p style={{fontSize:14,color:C.textSub,margin:"0 0 24px",lineHeight:1.6}}>{message}</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
          <Btn variant={variant} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Validación choque docente dentro del período ──────────────────────────────
function detectarChoque(idDocente,nuevosHorarios,todosLosCursosPeriodo,excluirCursoId=null){
  const cursosDocente=todosLosCursosPeriodo.filter(
    c=>String(c.idDocente)===String(idDocente)&&c.id!==excluirCursoId
  );
  for(const curso of cursosDocente){
    for(const ex of (curso.horarios||[])){
      for(const nuevo of nuevosHorarios){
        if(nuevo.diaSemana===ex.diaSemana&&nuevo.horaInicio&&nuevo.horaFin){
          if(nuevo.horaInicio<ex.horaFin&&nuevo.horaFin>ex.horaInicio){
            return `El docente ya tiene clase el ${ex.diaSemana} de ${ex.horaInicio} a ${ex.horaFin} en este período (grupo: ${curso.codigoGrupo})`;
          }
        }
      }
    }
  }
  return null;
}

// ── HorarioForm ───────────────────────────────────────────────────────────────
function HorarioForm({horarios,onChange,errores={}}){
  const set=(idx,k)=>e=>{const h=[...horarios];h[idx]={...h[idx],[k]:e.target.value};onChange(h);};
  const add=()=>onChange([...horarios,{diaSemana:"Lunes",horaInicio:"",horaFin:"",aula:"",edificio:"",turno:""}]);
  const remove=idx=>onChange(horarios.filter((_,i)=>i!==idx));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:11,fontWeight:600,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.05em"}}>Horarios</span>
        <Btn variant="ghost" onClick={add} style={{padding:"4px 12px",fontSize:12}}>+ Añadir bloque</Btn>
      </div>
      {errores.horariosGeneral&&<span style={{color:C.red,fontSize:11,display:"block",marginBottom:8}}>⚠ {errores.horariosGeneral}</span>}
      {horarios.map((h,idx)=>{
        const eH=errores.horarios?.[idx]||{};
        return(
          <div key={idx} style={{background:C.bg,border:`1.5px solid ${Object.keys(eH).length?C.red:C.border}`,borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,color:C.textMuted}}>Bloque {idx+1}</span>
              {horarios.length>1&&<button type="button" onClick={()=>remove(idx)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:12}}>✕ Eliminar</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              <Sel label="Día" value={h.diaSemana} onChange={set(idx,"diaSemana")} options={dias.map(d=>({value:d,label:d}))} error={eH.diaSemana}/>
              <Input label="Hora inicio" value={h.horaInicio} onChange={set(idx,"horaInicio")} type="time" required error={eH.horaInicio}/>
              <Input label="Hora fin" value={h.horaFin} onChange={set(idx,"horaFin")} type="time" required error={eH.horaFin}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Input label="Aula" value={h.aula} onChange={set(idx,"aula")} required error={eH.aula}/>
              <Input label="Edificio" value={h.edificio} onChange={set(idx,"edificio")}/>
              <Sel label="Turno" value={h.turno||""} onChange={set(idx,"turno")} options={turnos.map(t=>({value:t,label:t}))} placeholder="— Opcional —"/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Modal editar curso existente ──────────────────────────────────────────────
function EditModal({open,curso,docentes,cursosDelPeriodo,onSave,onClose}){
  const [form,setForm]=useState({idDocente:"",cupoMaximo:"",horarios:[]});
  const [saving,setSaving]=useState(false);
  const [errorGeneral,setErrorGeneral]=useState("");
  const [fe,setFe]=useState({});

  useEffect(()=>{
    if(!open||!curso)return;
    setForm({
      idDocente:String(curso.idDocente||""),
      cupoMaximo:String(curso.cupoMaximo||""),
      horarios:(curso.horarios||[]).map(h=>({
        diaSemana:h.diaSemana,horaInicio:h.horaInicio?.slice(0,5)||"",
        horaFin:h.horaFin?.slice(0,5)||"",aula:h.aula||"",
        edificio:h.edificio||"",turno:h.turno||"",
      })),
    });
    setFe({});setErrorGeneral("");
  },[open,curso]);

  if(!open)return null;

  const validar=()=>{
    const errs={};
    if(!form.idDocente) errs.idDocente="Selecciona un docente.";
    if(!form.cupoMaximo) errs.cupoMaximo="El cupo es obligatorio.";
    else if(parseInt(form.cupoMaximo)<(curso.inscritosCount||0))
      errs.cupoMaximo=`No puede ser menor a los inscritos actuales (${curso.inscritosCount}).`;
    else if(parseInt(form.cupoMaximo)<1) errs.cupoMaximo="Mínimo 1.";
    if(!form.horarios||form.horarios.length===0){
      errs.horariosGeneral="Agrega al menos un bloque.";
    }else{
      const errH=[];
      form.horarios.forEach((h,i)=>{
        const e={};
        if(!h.horaInicio) e.horaInicio="Requerida.";
        if(!h.horaFin) e.horaFin="Requerida.";
        if(h.horaInicio&&h.horaFin&&h.horaInicio>=h.horaFin) e.horaFin="Debe ser mayor a inicio.";
        if(!h.aula?.trim()) e.aula="Requerida.";
        if(Object.keys(e).length) errH[i]=e;
      });
      if(errH.length) errs.horarios=errH;
    }
    return errs;
  };

  const handleSubmit=async e=>{
    e.preventDefault();setErrorGeneral("");setFe({});
    const errs=validar();
    if(Object.keys(errs).length){setFe(errs);return;}
    const choque=detectarChoque(form.idDocente,form.horarios,cursosDelPeriodo,curso.id);
    if(choque){setErrorGeneral(choque);return;}
    setSaving(true);
    try{
      const res=await api.put(`/cursos/${curso.id}`,{
        idDocente:form.idDocente,cupoMaximo:Number(form.cupoMaximo),horarios:form.horarios,
      });
      onSave(res.data.data);onClose();
    }catch(err){setErrorGeneral(err.response?.data?.message||"Error al guardar.");}
    finally{setSaving(false);}
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,width:"100%",maxWidth:660,maxHeight:"92vh",overflowY:"auto",padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <h3 style={{fontSize:17,fontWeight:700,color:C.text,margin:"0 0 3px"}}>Editar curso — {curso?.codigoGrupo}</h3>
            <span style={{fontSize:12,color:C.textMuted}}>{curso?.materia?.nombre} · {curso?.materia?.codigo}</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:20}}>✕</button>
        </div>
        {errorGeneral&&<Alert msg={errorGeneral} type="error"/>}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <Sel label="Docente" value={form.idDocente}
              onChange={e=>{setFe(p=>({...p,idDocente:""}));setForm(p=>({...p,idDocente:e.target.value}));}}
              options={docentes.map(d=>({value:d.id,label:d.nombre}))} placeholder="Selecciona un docente"
              required error={fe.idDocente} style={{gridColumn:"1 / -1"}}/>
            <Input label="Cupo máximo" value={form.cupoMaximo}
              onChange={e=>{setFe(p=>({...p,cupoMaximo:""}));setForm(p=>({...p,cupoMaximo:e.target.value}));}}
              type="number" min="1" required error={fe.cupoMaximo}/>
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:2}}>
              <span style={{fontSize:12,color:C.textMuted}}>
                Inscritos actuales: <strong style={{color:curso?.inscritosCount>0?C.amber:C.green}}>{curso?.inscritosCount||0}</strong>
              </span>
            </div>
          </div>
          <HorarioForm horarios={form.horarios}
            onChange={h=>{setFe(p=>({...p,horarios:undefined,horariosGeneral:""}));setForm(p=>({...p,horarios:h}));}}
            errores={fe}/>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
            <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn type="submit" disabled={saving}>{saving?"Guardando…":"Guardar cambios"}</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal agregar nuevo curso a un período ────────────────────────────────────
function AddCursoModal({open,periodo,docentes,cursosDelPeriodo,onSave,onClose}){
  const emptyForm=()=>({
    idMateria:"",codigoGrupo:"",idDocente:"",cupoMaximo:"",
    horarios:[{diaSemana:"Lunes",horaInicio:"",horaFin:"",aula:"",edificio:"",turno:""}],
  });

  const [materias,setMaterias]=useState([]);       // todas las materias del pensum
  const [loadingMat,setLoadingMat]=useState(false);
  const [form,setForm]=useState(emptyForm());
  const [saving,setSaving]=useState(false);
  const [errorGeneral,setErrorGeneral]=useState("");
  const [fe,setFe]=useState({});

  // IDs de materias que ya tienen al menos un curso en el período
  const materiasConCurso=new Set((cursosDelPeriodo||[]).map(c=>String(c.idMateria||c.materia?.id)));

  useEffect(()=>{
    if(!open||!periodo)return;
    setForm(emptyForm());setFe({});setErrorGeneral("");
    setLoadingMat(true);
    api.get(`/carrera/${periodo.idCarrera}/pensum-activo`)
      .then(r=>{
        const todas=(r.data.data?.materias||[]);
        setMaterias(todas);
      })
      .catch(()=>setErrorGeneral("No se pudo cargar el pensum de la carrera."))
      .finally(()=>setLoadingMat(false));
  },[open,periodo]);

  if(!open)return null;

  // Separar materias sin curso (faltan) y con curso (extras/grupos adicionales)
  const materiasSinCurso=materias.filter(m=>!materiasConCurso.has(String(m.id)));
  const materiasConGrupo=materias.filter(m=>materiasConCurso.has(String(m.id)));

  // Opciones agrupadas para el select
  const opcionesMaterias=[
    ...materiasSinCurso.map(m=>({
      value:m.id,
      label:`${m.codigo} — ${m.nombre} (Sem. ${m.semestre||"—"}) ★ Sin curso`,
      group:"sin_curso",
    })),
    ...materiasConGrupo.map(m=>({
      value:m.id,
      label:`${m.codigo} — ${m.nombre} (Sem. ${m.semestre||"—"}) + Grupo adicional`,
      group:"con_curso",
    })),
  ];

  const validar=()=>{
    const errs={};
    if(!form.idMateria)      errs.idMateria="Selecciona una materia.";
    if(!form.codigoGrupo.trim()) errs.codigoGrupo="El código de grupo es obligatorio.";
    else if(form.codigoGrupo.length>20) errs.codigoGrupo="Máximo 20 caracteres.";
    if(!form.idDocente)      errs.idDocente="Selecciona un docente.";
    if(!form.cupoMaximo)     errs.cupoMaximo="El cupo es obligatorio.";
    else if(parseInt(form.cupoMaximo)<1) errs.cupoMaximo="Mínimo 1.";
    if(!form.horarios||form.horarios.length===0){
      errs.horariosGeneral="Agrega al menos un bloque.";
    }else{
      const errH=[];
      form.horarios.forEach((h,i)=>{
        const e={};
        if(!h.horaInicio) e.horaInicio="Requerida.";
        if(!h.horaFin)    e.horaFin="Requerida.";
        if(h.horaInicio&&h.horaFin&&h.horaInicio>=h.horaFin) e.horaFin="Debe ser mayor a inicio.";
        if(!h.aula?.trim()) e.aula="Requerida.";
        if(Object.keys(e).length) errH[i]=e;
      });
      if(errH.length) errs.horarios=errH;
    }
    return errs;
  };

  const handleSubmit=async e=>{
    e.preventDefault();setErrorGeneral("");setFe({});
    const errs=validar();
    if(Object.keys(errs).length){setFe(errs);return;}
    const choque=detectarChoque(form.idDocente,form.horarios,cursosDelPeriodo,null);
    if(choque){setErrorGeneral(choque);return;}
    setSaving(true);
    try{
      const res=await api.post("/cursos",{
        codigoGrupo:form.codigoGrupo,
        idMateria:form.idMateria,
        idPeriodoAcademico:periodo.id,
        idDocente:form.idDocente,
        cupoMaximo:Number(form.cupoMaximo),
        horarios:form.horarios,
      });
      onSave(res.data.data,periodo.id);
      onClose();
    }catch(err){setErrorGeneral(err.response?.data?.message||"Error al crear el curso.");}
    finally{setSaving(false);}
  };

  // Materia seleccionada para mostrar info
  const materiaSeleccionada=materias.find(m=>String(m.id)===String(form.idMateria));
  const esSinCurso=materiaSeleccionada&&!materiasConCurso.has(String(materiaSeleccionada.id));

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,width:"100%",maxWidth:680,maxHeight:"92vh",overflowY:"auto",padding:28}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <h3 style={{fontSize:17,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Agregar curso al período</h3>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Tag color={C.accent}>{periodo?.codigo}</Tag>
              {periodo?.carrera&&<Tag color={C.textMuted}>{periodo.carrera}</Tag>}
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:20}}>✕</button>
        </div>

        {errorGeneral&&<Alert msg={errorGeneral} type="error"/>}

        {loadingMat?(
          <div style={{textAlign:"center",padding:30,color:C.textMuted}}>Cargando materias del pensum…</div>
        ):(
          <form onSubmit={handleSubmit} noValidate>

            {/* Info de materias */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              {materiasSinCurso.length>0&&(
                <div style={{background:C.redDim,border:`1px solid ${C.red}33`,borderRadius:8,padding:"8px 14px",fontSize:12,color:C.red}}>
                  ⚠ <strong>{materiasSinCurso.length}</strong> materia{materiasSinCurso.length!==1?"s":""} sin curso en este período
                </div>
              )}
              {materiasConGrupo.length>0&&(
                <div style={{background:C.greenDim,border:`1px solid ${C.green}33`,borderRadius:8,padding:"8px 14px",fontSize:12,color:C.green}}>
                  ✓ <strong>{materiasConGrupo.length}</strong> materia{materiasConGrupo.length!==1?"s":""} ya con curso(s)
                </div>
              )}
            </div>

            {/* Selector de materia con indicador visual */}
            <div style={{marginBottom:16}}>
              <FieldWrap label="Materia" required error={fe.idMateria}>
                <select value={form.idMateria}
                  onChange={e=>{setFe(p=>({...p,idMateria:""}));setForm(p=>({...p,idMateria:e.target.value}));}}
                  style={{background:C.surface,border:`1.5px solid ${fe.idMateria?C.red:C.border}`,borderRadius:8,
                    padding:"9px 12px",color:form.idMateria?C.text:C.textMuted,fontSize:14,outline:"none",width:"100%"}}>
                  <option value="">Selecciona una materia</option>
                  {materiasSinCurso.length>0&&(
                    <optgroup label="── Sin curso en este período (faltan) ──">
                      {materiasSinCurso.map(m=>(
                        <option key={m.id} value={m.id}>
                          {m.codigo} — {m.nombre} (Sem. {m.semestre||"—"}, {m.creditos} cr.)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {materiasConGrupo.length>0&&(
                    <optgroup label="── Ya tienen curso · agregar grupo adicional ──">
                      {materiasConGrupo.map(m=>{
                        const grupos=(cursosDelPeriodo||[]).filter(c=>String(c.idMateria||c.materia?.id)===String(m.id));
                        return(
                          <option key={m.id} value={m.id}>
                            {m.codigo} — {m.nombre} ({grupos.length} grupo{grupos.length!==1?"s":""} existente{grupos.length!==1?"s":""})
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                </select>
              </FieldWrap>

              {/* Badge informativo de la materia seleccionada */}
              {materiaSeleccionada&&(
                <div style={{marginTop:8,background:esSinCurso?C.redDim:C.accentDim,border:`1px solid ${esSinCurso?C.red:C.accent}33`,borderRadius:8,padding:"8px 14px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <Tag color={esSinCurso?C.red:C.accent}>{esSinCurso?"Sin curso":"Grupo adicional"}</Tag>
                  <span style={{fontSize:12,color:C.textMuted}}>{materiaSeleccionada.nombre}</span>
                  <Tag color={C.textMuted}>{materiaSeleccionada.creditos} créditos</Tag>
                  {materiaSeleccionada.semestre&&<Tag color={C.textMuted}>Semestre {materiaSeleccionada.semestre}</Tag>}
                  {materiaSeleccionada.prerrequisito&&(
                    <span style={{fontSize:11,color:C.textMuted}}>Prereq: {materiaSeleccionada.prerrequisito?.nombre}</span>
                  )}
                </div>
              )}
            </div>

            {/* Datos del curso */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <Input label="Código de grupo" value={form.codigoGrupo}
                onChange={e=>{setFe(p=>({...p,codigoGrupo:""}));setForm(p=>({...p,codigoGrupo:e.target.value}));}}
                required error={fe.codigoGrupo} placeholder="Ej: GR-01"/>
              <Input label="Cupo máximo" value={form.cupoMaximo}
                onChange={e=>{setFe(p=>({...p,cupoMaximo:""}));setForm(p=>({...p,cupoMaximo:e.target.value}));}}
                type="number" min="1" required error={fe.cupoMaximo}/>
              <Sel label="Docente" value={form.idDocente}
                onChange={e=>{setFe(p=>({...p,idDocente:""}));setForm(p=>({...p,idDocente:e.target.value}));}}
                options={docentes.map(d=>({value:d.id,label:d.nombre}))} placeholder="Selecciona un docente"
                required error={fe.idDocente} style={{gridColumn:"1 / -1"}}/>
            </div>

            <HorarioForm horarios={form.horarios}
              onChange={h=>{setFe(p=>({...p,horarios:undefined,horariosGeneral:""}));setForm(p=>({...p,horarios:h}));}}
              errores={fe}/>

            <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
              <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
              <Btn type="submit" variant="success" disabled={saving}>
                {saving?"Creando…":"✓ Crear curso"}
              </Btn>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ConsultaCursos(){
  const navigate=useNavigate();
  const [periodos,setPeriodos]=useState([]);
  const [todasCarreras,setTodasCarreras]=useState([]);
  const [docentes,setDocentes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  // Filtros
  const [filtroCarrera,setFiltroCarrera]=useState("");
  const [filtroCodigo,setFiltroCodigo]=useState("");
  const [filtroDesde,setFiltroDesde]=useState("");
  const [filtroHasta,setFiltroHasta]=useState("");

  // Modales
  const [editingCurso,setEditingCurso]=useState(null);
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [addCursoPeriodo,setAddCursoPeriodo]=useState(null); // período al que se agrega

  const toast=(msg,type="success")=>{
    if(type==="success")setSuccess(msg); else setError(msg);
    setTimeout(()=>{setSuccess("");setError("");},3500);
  };

  const fetchData=useCallback(async()=>{
    setLoading(true);
    try{
      const [resCursos,resDocentes,resCarreras]=await Promise.all([
        api.get("/cursos/historial-periodos"),
        api.get("/docentes"),
        api.get("/carrera"),
      ]);
      const ordenados=(resCursos.data.data||[]).sort((a,b)=>new Date(b.fechaInicio)-new Date(a.fechaInicio));
      setPeriodos(ordenados);
      setDocentes(resDocentes.data.data||[]);
      setTodasCarreras(resCarreras.data.data||[]);
    }catch{toast("Error al cargar el historial de cursos.","error");}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{fetchData();},[fetchData]);

  const periodosFiltrados=periodos.filter(p=>{
    if(filtroCarrera&&String(p.idCarrera)!==String(filtroCarrera))return false;
    if(filtroCodigo&&!p.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()))return false;
    if(filtroDesde&&p.fechaInicio<filtroDesde)return false;
    if(filtroHasta&&p.fechaFin>filtroHasta)return false;
    return true;
  });

  const hoy=new Date().toISOString().slice(0,10);
  const esPeriodoVigente=p=>p.fechaInicio<=hoy&&p.fechaFin>=hoy;

  const handleDelete=async()=>{
    if(!deleteConfirm)return;
    try{
      await api.delete(`/cursos/${deleteConfirm.id}`);
      toast("Curso eliminado exitosamente.");
      fetchData();
    }catch(err){toast(err.response?.data?.message||"No se pudo eliminar el curso.","error");}
    setDeleteConfirm(null);
  };

  const handleSaveEdit=(cursoActualizado)=>{
    setPeriodos(prev=>prev.map(p=>({
      ...p,
      cursos:(p.cursos||[]).map(c=>c.id===cursoActualizado.id?{
        ...c,
        idDocente:cursoActualizado.idDocente,
        cupoMaximo:cursoActualizado.cupoMaximo,
        horarios:cursoActualizado.horarios,
        docente:cursoActualizado.docente,
      }:c),
    })));
    toast("Curso actualizado correctamente.");
  };

  const handleSaveNewCurso=(nuevoCurso,periodoId)=>{
    // Agregar el nuevo curso al período correspondiente localmente
    setPeriodos(prev=>prev.map(p=>{
      if(p.id!==periodoId)return p;
      const cursoMapeado={
        id:nuevoCurso.id,
        codigoGrupo:nuevoCurso.codigoGrupo,
        idDocente:nuevoCurso.idDocente,
        idMateria:nuevoCurso.idMateria,
        cupoMaximo:nuevoCurso.cupoMaximo,
        cupoActual:0,
        inscritosCount:0,
        materia:nuevoCurso.materia,
        docente:nuevoCurso.docente,
        horarios:nuevoCurso.horarios,
      };
      return {...p,cursos:[...(p.cursos||[]),cursoMapeado]};
    }));
    toast("Curso agregado correctamente al período.");
  };

  const cursosDelPeriodoEditando=editingCurso
    ?(periodos.find(p=>p.cursos?.some(c=>c.id===editingCurso.id))?.cursos||[])
    :[];

  const cursosDelPeriodoAgregando=addCursoPeriodo
    ?(periodos.find(p=>p.id===addCursoPeriodo.id)?.cursos||[])
    :[];

  if(loading)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center",color:C.textMuted}}>
        <div style={{fontSize:36,marginBottom:12}}>⏳</div>
        <p style={{margin:0}}>Cargando historial de cursos…</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <ConfirmModal open={!!deleteConfirm} title="¿Eliminar este curso?"
        message={`Se eliminará el grupo "${deleteConfirm?.codigoGrupo}" de la materia "${deleteConfirm?.materia?.nombre}". Esta acción no se puede deshacer.`}
        onConfirm={handleDelete} onCancel={()=>setDeleteConfirm(null)} confirmLabel="Eliminar"/>

      <EditModal open={!!editingCurso} curso={editingCurso} docentes={docentes}
        cursosDelPeriodo={cursosDelPeriodoEditando}
        onSave={handleSaveEdit} onClose={()=>setEditingCurso(null)}/>

      <AddCursoModal open={!!addCursoPeriodo} periodo={addCursoPeriodo} docentes={docentes}
        cursosDelPeriodo={cursosDelPeriodoAgregando}
        onSave={handleSaveNewCurso} onClose={()=>setAddCursoPeriodo(null)}/>

      {/* Header */}
      <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 32px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:10,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <button onClick={()=>navigate("/admin/bienvenida")} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13}}>← Volver</button>
        <div style={{width:1,height:20,background:C.border}}/>
        <span style={{fontSize:15,fontWeight:700,color:C.text}}>Consulta de Cursos</span>
        <span style={{fontSize:13,color:C.textMuted,marginLeft:"auto"}}>
          {periodosFiltrados.length} período{periodosFiltrados.length!==1?"s":""} · {periodosFiltrados.reduce((s,p)=>s+(p.cursos?.length||0),0)} cursos
        </span>
      </header>

      <main style={{maxWidth:980,margin:"0 auto",padding:"28px 24px"}}>
        <Alert msg={error} type="error"/>
        <Alert msg={success} type="success"/>

        {/* Filtros */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 20px",marginBottom:24,boxShadow:C.shadow}}>
          <p style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 12px"}}>Filtros</p>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:12,alignItems:"end"}}>
            <Sel label="Carrera" value={filtroCarrera} onChange={e=>setFiltroCarrera(e.target.value)}
              options={todasCarreras.map(c=>({value:c.id,label:c.nombre}))} placeholder="Todas las carreras"/>
            <Input label="Código período" value={filtroCodigo} onChange={e=>setFiltroCodigo(e.target.value)} placeholder="Ej: 2025-1S"/>
            <Input label="Desde" value={filtroDesde} onChange={e=>setFiltroDesde(e.target.value)} type="date"/>
            <Input label="Hasta" value={filtroHasta} onChange={e=>setFiltroHasta(e.target.value)} type="date"/>
          </div>
          {(filtroCarrera||filtroCodigo||filtroDesde||filtroHasta)&&(
            <button onClick={()=>{setFiltroCarrera("");setFiltroCodigo("");setFiltroDesde("");setFiltroHasta("");}}
              style={{background:"none",border:"none",color:C.accent,fontSize:12,cursor:"pointer",marginTop:10,fontWeight:600}}>
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {periodosFiltrados.length===0?(
          <div style={{textAlign:"center",padding:60,color:C.textMuted,background:C.card,borderRadius:16,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:40,marginBottom:12}}>📭</div>
            <p style={{margin:0,fontWeight:600}}>No se encontraron períodos con los filtros aplicados</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {periodosFiltrados.map((p,idx)=>{
              const vigente=esPeriodoVigente(p);
              const esPrimero=idx===0;
              return(
                <div key={p.id} style={{background:C.card,border:`2px solid ${vigente?C.accent:C.border}`,borderRadius:16,padding:24,boxShadow:vigente?`0 4px 20px ${C.accent}18`:C.shadow}}>

                  {/* Header período */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.borderLight}`}}>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <h3 style={{fontSize:18,fontWeight:700,color:C.text,margin:0}}>{p.codigo}</h3>
                        {vigente&&<Tag color={C.green}>● Período actual</Tag>}
                        {esPrimero&&!vigente&&<Tag color={C.accent}>Más reciente</Tag>}
                        {p.carrera&&<Tag color={C.textMuted}>{p.carrera}</Tag>}
                      </div>
                      <span style={{fontSize:12,color:C.textMuted}}>
                        {new Date(p.fechaInicio+"T12:00:00").toLocaleDateString("es-BO",{day:"2-digit",month:"short",year:"numeric"})}
                        {" — "}
                        {new Date(p.fechaFin+"T12:00:00").toLocaleDateString("es-BO",{day:"2-digit",month:"short",year:"numeric"})}
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:22,fontWeight:800,color:C.accent,display:"block"}}>{p.cursos?.length||0}</span>
                        <span style={{fontSize:11,color:C.textMuted}}>curso{(p.cursos?.length||0)!==1?"s":""}</span>
                      </div>
                      {/* Botón agregar curso al período */}
                      <Btn variant="primary" onClick={()=>setAddCursoPeriodo(p)} style={{padding:"8px 14px",fontSize:12}}>
                        + Agregar curso
                      </Btn>
                    </div>
                  </div>

                  {/* Lista de cursos */}
                  {!p.cursos||p.cursos.length===0?(
                    <div style={{textAlign:"center",padding:"20px 0",color:C.textSub}}>
                      <p style={{margin:"0 0 10px",fontStyle:"italic",fontSize:13}}>No se crearon cursos en este período.</p>
                      <Btn variant="ghost" onClick={()=>setAddCursoPeriodo(p)} style={{margin:"0 auto",fontSize:12}}>
                        + Agregar el primer curso
                      </Btn>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {p.cursos.map(c=>{
                        const inscritos=c.inscritosCount||0;
                        const tieneInscritos=inscritos>0;
                        const pct=Math.round((inscritos/c.cupoMaximo)*100);
                        const cupoColor=pct>=90?C.red:pct>=70?C.amber:C.green;
                        return(
                          <div key={c.id} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                                <Tag color={C.green}>{c.codigoGrupo}</Tag>
                                <span style={{fontSize:14,fontWeight:600,color:C.text}}>{c.materia?.nombre||"Materia"}</span>
                                <span style={{fontSize:12,color:C.textSub}}>({c.materia?.codigo})</span>
                                {c.materia?.creditos&&<Tag color={C.textMuted}>{c.materia.creditos} cr.</Tag>}
                              </div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center",marginBottom:8}}>
                                <span style={{fontSize:12,color:C.textMuted}}>
                                  👤 {c.docente?c.docente.nombre:<span style={{color:C.red}}>Sin docente</span>}
                                </span>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                  <div style={{width:70,height:5,background:C.border,borderRadius:99,overflow:"hidden"}}>
                                    <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:cupoColor,borderRadius:99,transition:"width .3s"}}/>
                                  </div>
                                  <span style={{fontSize:12,color:cupoColor,fontWeight:600}}>{inscritos}/{c.cupoMaximo}</span>
                                  <span style={{fontSize:11,color:C.textMuted}}>inscritos</span>
                                </div>
                              </div>
                              {c.horarios&&c.horarios.length>0&&(
                                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                  {c.horarios.map((h,i)=>(
                                    <span key={i} style={{fontSize:11,background:"#e2e8f0",color:C.textMuted,padding:"2px 9px",borderRadius:6}}>
                                      {h.diaSemana} {h.horaInicio}–{h.horaFin} · {h.aula}{h.edificio?` (${h.edificio})`:""}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                              <Btn variant="ghost" onClick={()=>setEditingCurso({...c,_periodoId:p.id})} style={{padding:"6px 12px"}}>✏️ Editar</Btn>
                              <Btn variant="danger" disabled={tieneInscritos}
                                title={tieneInscritos?"No se puede eliminar: tiene estudiantes inscritos":"Eliminar curso"}
                                onClick={()=>setDeleteConfirm(c)} style={{padding:"6px 12px"}}>
                                🗑️ Eliminar
                              </Btn>
                              {tieneInscritos&&(
                                <span style={{fontSize:10,color:C.amber,textAlign:"center",maxWidth:100}}>
                                  {inscritos} inscrito{inscritos!==1?"s":""}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}