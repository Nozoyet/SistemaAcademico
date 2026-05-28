import { useEffect, useState } from 'react';
import { reporteService } from '../../services/reporteService';
import useAuthStore from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ADMIN_CONFIG = {
  color: '#7c3aed',
  bg: '#faf5ff',
  accent: '#ede9fe',
};

export default function Reportes() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generado, setGenerado] = useState(false);

  const carreraActiva = carreras.find((c) => c.id == carreraSeleccionada);

  useEffect(() => {
    cargarCarreras();
  }, []);

  const cargarCarreras = async () => {
    try {
      setLoading(true);
      const data = await reporteService.obtenerCarreras();
      setCarreras(data);
      setError('');

      // Cargar automáticamente la primera carrera
      if (data && data.length > 0) {
        setCarreraSeleccionada(data[0].id);
        await cargarMateriasPorCarrera(data[0].id);
      }
    } catch (err) {
      setError('Error al cargar carreras: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarMateriasPorCarrera = async (id) => {
    try {
      const data = await reporteService.obtenerMateriasPorCarrera(id);
      setMaterias(data);
      setGenerado(true);
      setError('');
    } catch (err) {
      setError('Error al generar reporte: ' + (err.response?.data?.error || err.message));
      console.error(err);
      setGenerado(false);
    }
  };

  const generarReporte = async () => {
    if (!carreraSeleccionada) {
      setError('Por favor selecciona una carrera');
      return;
    }

    await cargarMateriasPorCarrera(carreraSeleccionada);
  };

  const descargarPDF = async () => {
    try {
      await reporteService.exportarPDF(carreraSeleccionada);
    } catch (err) {
      setError('Error al descargar PDF: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const descargarExcel = async () => {
    try {
      await reporteService.exportarExcel(carreraSeleccionada);
    } catch (err) {
      setError('Error al descargar Excel: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ ...styles.root, background: ADMIN_CONFIG.bg }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill={ADMIN_CONFIG.color} fillOpacity=".12" />
            <path d="M12 34L24 14L36 34H12Z" stroke={ADMIN_CONFIG.color} strokeWidth="2.2" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="24" r="3.5" fill={ADMIN_CONFIG.color} fillOpacity=".7" />
          </svg>
          <span style={{ ...styles.headerTitle, color: ADMIN_CONFIG.color }}>Sistema Académico</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {/* Hero card */}
        <div style={{ ...styles.heroCard, borderTop: `4px solid ${ADMIN_CONFIG.color}` }}>
          <div style={{ ...styles.roleChip, background: ADMIN_CONFIG.accent, color: ADMIN_CONFIG.color }}>
            <span style={{ display: 'flex' }}>📊</span>
            Reporte de Materias
          </div>

          <h1 style={styles.heroTitle}>
            Reportes por <span style={{ color: ADMIN_CONFIG.color }}>Carrera</span>
          </h1>
          <p style={styles.heroDesc}>
            Consulta todas las materias disponibles en cada carrera. Incluye información sobre créditos y semestres.
          </p>

          {/* Error message */}
          {error && (
            <div style={{ ...styles.errorBox }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Selection section */}
          <div style={styles.selectionSection}>
            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>Selecciona una carrera</label>
              <select
                value={carreraSeleccionada}
                onChange={(e) => {
                  setCarreraSeleccionada(e.target.value);
                  if (e.target.value) {
                    cargarMateriasPorCarrera(e.target.value);
                  }
                }}
                style={styles.selectInput}
                disabled={loading || carreras.length === 0}
              >
                <option value="">-- Seleccionar carrera --</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generarReporte}
              disabled={!carreraSeleccionada || loading}
              style={{
                ...styles.generateBtn,
                opacity: !carreraSeleccionada || loading ? 0.5 : 1,
                cursor: !carreraSeleccionada || loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Results section */}
        {generado && materias.length > 0 && (
          <div style={styles.resultsCard}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>Materias de la carrera</h2>
              <div style={styles.statsBadges}>
                <div style={styles.statBadge}>
                  <span style={styles.statLabel}>Total</span>
                  <span style={styles.statValue}>{materias.length}</span>
                </div>
                <div style={styles.statBadge}>
                  <span style={styles.statLabel}>Créditos</span>
                  <span style={styles.statValue}>{materias.reduce((sum, m) => sum + m.creditos, 0)}</span>
                </div>
              </div>
            </div>

            <div style={styles.reportMeta}>
              <span style={styles.reportMetaItem}><strong>Código:</strong> {carreraActiva?.codigo || '-'}</span>
              <span style={styles.reportMetaItem}><strong>Nombre Carrera:</strong> {carreraActiva?.nombre || '-'}</span>
              <span style={styles.reportMetaItem}><strong>Modalidad:</strong> {carreraActiva?.modalidad || '-'}</span>
            </div>



            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={{ ...styles.tableHeaderCell, width: '15%' }}>Código</th>
                    <th style={{ ...styles.tableHeaderCell, width: '55%' }}>Nombre</th>
                    <th style={{ ...styles.tableHeaderCell, width: '15%', textAlign: 'center' }}>Créditos</th>
                    <th style={{ ...styles.tableHeaderCell, width: '15%', textAlign: 'center' }}>Semestre</th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map((materia, idx) => (
                    <tr key={materia.id} style={{ ...styles.tableRow, background: idx % 2 === 0 ? '#f8fafc' : 'white' }}>
                      <td style={styles.tableCell}>{materia.codigo}</td>
                      <td style={styles.tableCell}>{materia.nombre}</td>
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>{materia.creditos}</td>
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>{materia.semestre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.infoStrip}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Usuario</span>
                <span style={styles.infoVal}>{user?.username}</span>
              </div>
              <div style={styles.infoSep} />
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Correo</span>
                <span style={styles.infoVal}>{user?.email}</span>
              </div>
              <div style={styles.infoSep} />
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Rol</span>
                <span style={{ ...styles.infoVal, color: ADMIN_CONFIG.color, fontWeight: 600 }}>{user?.rol}</span>
              </div>
            </div>
            <div style={styles.exportSection}>
              <button onClick={descargarPDF} style={{ ...styles.exportBtn, background: '#dc2626', borderColor: '#dc2626' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar PDF
              </button>
              <button onClick={descargarExcel} style={{ ...styles.exportBtn, background: '#16a34a', borderColor: '#16a34a' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar Excel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {generado && materias.length === 0 && (
          <div style={styles.emptyStateCard}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
            <h3 style={styles.emptyStateTitle}>Sin resultados</h3>
            <p style={styles.emptyStateDesc}>No hay materias registradas para esta carrera</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerBrand: { display: 'flex', alignItems: 'center', gap: 10 },
  headerTitle: { fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '0.45rem 1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    background: 'white',
    color: '#475569',
    fontSize: '0.84rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .15s',
  },
  main: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '3rem 1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  heroCard: {
    background: 'white',
    borderRadius: 16,
    padding: '2rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  roleChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '0.35rem 0.85rem',
    borderRadius: 999,
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 0.6rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  heroDesc: {
    fontSize: '0.92rem',
    color: '#64748b',
    margin: '0 0 1.75rem',
    lineHeight: 1.65,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0.85rem 1rem',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    color: '#991b1b',
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
  },
  selectionSection: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end',
  },
  selectGroup: {
    flex: 1,
  },
  selectLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#64748b',
    marginBottom: '0.5rem',
  },
  selectInput: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: '0.9rem',
    color: '#1e293b',
    background: 'white',
    cursor: 'pointer',
    transition: 'border-color .15s',
  },
  generateBtn: {
    padding: '0.65rem 1.5rem',
    background: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background .15s',
  },
  resultsCard: {
    background: 'white',
    borderRadius: 16,
    padding: '2rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  resultsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
  },
  resultsTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  statsBadges: {
    display: 'flex',
    gap: 12,
  },
  statBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '0.6rem 1rem',
    background: '#f8fafc',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '1.25rem',
    color: '#7c3aed',
    fontWeight: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHead: {
    background: '#f8fafc',
  },
  tableHeaderCell: {
    padding: '0.85rem 1rem',
    textAlign: 'left',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background .15s',
  },
  tableCell: {
    padding: '0.9rem 1rem',
    fontSize: '0.9rem',
    color: '#1e293b',
  },
  exportSection: {
    display: 'flex',
    gap: 12,
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  reportMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    padding: '1rem 0',
    color: '#334155',
    fontSize: '0.95rem',
  },
  reportMetaItem: {
    background: '#f8fafc',
    padding: '0.9rem 1rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
  },
  infoStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '1rem 0',
    marginBottom: '1rem',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 120,
  },
  infoLabel: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  infoVal: {
    fontSize: '0.95rem',
    color: '#0f172a',
    fontWeight: 600,
  },
  infoSep: {
    width: 1,
    height: 28,
    background: '#cbd5e1',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0.65rem 1.25rem',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all .15s',
  },
  emptyStateCard: {
    background: 'white',
    borderRadius: 16,
    padding: '3rem 2rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  emptyStateTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  emptyStateDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
};
