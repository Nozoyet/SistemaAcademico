import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from "../services/notificationService";
import useAuthStore from "../stores/useAuthStore";

const TIPO_CONFIG = {
  curso_asignado: {
    icon: "📚",
    bg: "#e0f2fe",
    color: "#0369a1",
    redirect: (user) => "/docente/cursos",
  },
  inscripcion_exitosa: {
    icon: "✅",
    bg: "#d1fae5",
    color: "#065f46",
    redirect: (user) => "/estudiante/inscripciones",
  },
  calificacion_asignada: {
    icon: "📝",
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
            <span>⚠️</span> {error}
          </div>
        )}

        {!error && notificaciones.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
            <h5 style={{ color: "#64748b", fontWeight: 500 }}>No tienes notificaciones</h5>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Las notificaciones aparecerán aquí cuando tengas actividad nueva.</p>
          </div>
        )}

        <div className="list-group">
          {notificaciones.map((notif) => {
            const tipoCfg = TIPO_CONFIG[notif.tipo] || { icon: "🔔", bg: "#f1f5f9", color: "#475569" };

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
