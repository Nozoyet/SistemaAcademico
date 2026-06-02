import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { docenteService } from "../../services/docenteService";
import { getNoLeidasCount } from "../../services/notificationService";

const C = {
  bg: "#f0f9ff", color: "#0369a1", accent: "#e0f2fe",
  text: "#0f172a", textSub: "#475569", textMuted: "#94a3b8",
  border: "#e2e8f0", surface: "#ffffff",
};

export default function DashboardDocente() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noLeidas, setNoLeidas] = useState(0);
  const prevCountRef = useRef(0);
  const [newNotifCount, setNewNotifCount] = useState(0);

  const fetchNoLeidas = useCallback(async () => {
    try {
      const res = await getNoLeidasCount();
      const count = res.data.data.count;
      const prev = prevCountRef.current;

      if (count > prev) {
        setNewNotifCount(count - prev);
        setTimeout(() => setNewNotifCount(0), 4000);
      }

      prevCountRef.current = count;
      setNoLeidas(count);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchNoLeidas();
    const interval = setInterval(fetchNoLeidas, 30000);
    return () => clearInterval(interval);
  }, [fetchNoLeidas]);

  useEffect(() => {
    docenteService.obtenerCursos()
      .then(r => {
        const cursos = r.data || [];
        setStats({
          total: cursos.length,
          activos: cursos.filter(c => c.periodo).length,
          estudiantes: cursos.reduce((s, c) => s + (c.cupoActual || 0), 0),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @keyframes notifPop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "white", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill={C.color} fillOpacity=".12" />
            <path d="M12 34L24 14L36 34H12Z" stroke={C.color} strokeWidth="2.2" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="24" r="3.5" fill={C.color} fillOpacity=".7" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: C.color }}>Sistema Académico</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => {
              setNewNotifCount(0);
              navigate("/docente/notificaciones");
            }}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.textSub,
            }}
            title="Notificaciones"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {newNotifCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -10,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  background: "#dcfce7",
                  borderRadius: 8,
                  padding: "0 5px",
                  lineHeight: "16px",
                  animation: "notifPop 0.4s ease-out",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                +{newNotifCount}
              </span>
            )}
            {noLeidas > 0 && (
              <span
                className="badge rounded-pill bg-danger"
                style={{
                  position: "absolute",
                  top: -2,
                  right: -4,
                  fontSize: "0.6rem",
                  minWidth: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                {noLeidas}
              </span>
            )}
          </button>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 7, padding: "0.45rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 8, background: "white", color: C.textSub, fontSize: "0.84rem", fontWeight: 500, cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: `4px solid ${C.color}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.35rem 0.85rem", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, background: C.accent, color: C.color, marginBottom: "1.25rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18 }}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Docente
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: C.text, margin: "0 0 0.6rem", letterSpacing: "-0.02em" }}>
            Bienvenido, <span style={{ color: C.color }}>{user?.nombre1 || "docente"}</span>
          </h1>
          <p style={{ fontSize: "0.92rem", color: C.textSub, margin: "0 0 1.75rem", lineHeight: 1.65 }}>
            Gestiona tus cursos asignados, registra calificaciones y genera reportes académicos.
          </p>

          {!loading && stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Mis Cursos", value: stats.total, color: C.color },
                { label: "Cursos activos", value: stats.activos, color: "#059669" },
                { label: "Estudiantes", value: stats.estudiantes, color: "#d97706" },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg, border: `1px solid ${C.accent}`, borderRadius: 12, padding: "16px 18px" }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Mis Cursos", icon: "🎓", href: "/docente/cursos" },
              { label: "Calificaciones", icon: "✏️", href: "/docente/cursos" },
              { label: "Reportes", icon: "📊", href: "/docente/reportes" },
              { label: "Mi Perfil", icon: "👤", href: "/docente/perfil" },
            ].map(link => (
              <button key={link.href} onClick={() => navigate(link.href)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.85rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: "#f8fafc", cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = C.color}
                onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
                <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>{link.icon}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 500, color: C.text }}>{link.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.color} strokeWidth="2.5" style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.73rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Usuario</span>
            <span style={{ fontSize: "0.88rem", color: C.text }}>{user?.username}</span>
          </div>
          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.73rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Correo</span>
            <span style={{ fontSize: "0.88rem", color: C.text }}>{user?.email}</span>
          </div>
          <div style={{ width: 1, height: 32, background: C.border, flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.73rem", color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rol</span>
            <span style={{ fontSize: "0.88rem", color: C.color, fontWeight: 600 }}>{user?.rol}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
