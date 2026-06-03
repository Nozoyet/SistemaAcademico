import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from "../services/notificationService";
import useAuthStore from "../stores/useAuthStore";

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TIPO_CONFIG = {
  curso_asignado: {
    icon: <BookIcon />,
    bg: "#e0f2fe",
    color: "#0369a1",
    redirect: (user) => "/docente/cursos",
  },
  inscripcion_exitosa: {
    icon: <CheckCircleIcon />,
    bg: "#d1fae5",
    color: "#065f46",
    redirect: (user) => "/estudiante/inscripciones",
  },
  calificacion_asignada: {
    icon: <EditIcon />,
    bg: "#fef3c7",
    color: "#92400e",
    redirect: (user) => "/estudiante/inscripciones",
  },
};

export default function Notificaciones() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      const res = await getNotificaciones();
      setNotificaciones(res.data.data);
    } catch (err) {
      setError("Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notif) => {
    if (!notif.leida) {
      try {
        await marcarLeida(notif.id);
      } catch (_) {}
    }
    const config = TIPO_CONFIG[notif.tipo];
    if (config) {
      const ruta = typeof config.redirect === "function" ? config.redirect(user) : config.redirect;
      navigate(ruta);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas();
      setNotificaciones((prev) =>
        prev.map((n) => ({ ...n, estado: "Leida", leida: true }))
      );
    } catch (_) {}
  };

  const handleVolver = () => {
    const rutas = {
      Administrador: "/admin/bienvenida",
      Docente: "/docente/bienvenida",
      Estudiante: "/estudiante/bienvenida",
    };
    navigate(rutas[user?.rol] || "/login");
  };

  const noLeidasCount = notificaciones.filter((n) => !n.leida).length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill="#7c3aed" fillOpacity=".12" />
            <path d="M12 34L24 14L36 34H12Z" stroke="#7c3aed" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="24" r="3.5" fill="#7c3aed" fillOpacity=".7" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>Notificaciones</span>
          {noLeidasCount > 0 && (
            <span className="badge rounded-pill bg-danger" style={{ fontSize: "0.75rem" }}>
              {noLeidasCount} sin leer
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {noLeidasCount > 0 && (
            <button className="btn btn-outline-secondary btn-sm" onClick={handleMarcarTodas}>
              Marcar todas como leídas
            </button>
          )}
          <button className="btn btn-outline-secondary btn-sm" onClick={handleVolver}>
            Volver
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> {error}
          </div>
        )}

        {!error && notificaciones.length === 0 && (
          <div className="text-center py-5">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ marginBottom: "1rem" }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h5 style={{ color: "#64748b", fontWeight: 500 }}>No tienes notificaciones</h5>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Las notificaciones aparecerán aquí cuando tengas actividad nueva.</p>
          </div>
        )}

        <div className="list-group">
          {notificaciones.map((notif) => {
            const tipoCfg = TIPO_CONFIG[notif.tipo] || {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
              bg: "#f1f5f9", color: "#475569",
            };

            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className="list-group-item list-group-item-action d-flex gap-3 py-3 border-0"
                style={{
                  background: notif.leida ? "#ffffff" : "#f8fafc",
                  borderBottom: "1px solid #e2e8f0 !important",
                  borderRadius: 0,
                  opacity: notif.leida ? 0.75 : 1,
                  cursor: "pointer",
                  textAlign: "left",
                  border: "none",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: tipoCfg.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {tipoCfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{notif.titulo}</strong>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {!notif.leida && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#ef4444",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <small style={{ color: "#94a3b8", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                        {notif.fechaEnvio ? new Date(notif.fechaEnvio + "Z").toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : ""}
                      </small>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>
                    {notif.mensaje}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
