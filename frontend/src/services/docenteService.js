import api from './api';

export const docenteService = {
  obtenerFiltrosReportes: async () => {
    const res = await api.get('/docente/reportes/filtros');
    return res.data.data;
  },

  obtenerCursos: async () => {
    const res = await api.get('/docente/cursos');
    return res.data;
  },

  obtenerEstudiantes: async (cursoId) => {
    const res = await api.get(`/docente/cursos/${cursoId}/estudiantes`);
    return res.data;
  },

  guardarCalificaciones: async (cursoId, calificaciones) => {
    const res = await api.put(`/docente/cursos/${cursoId}/calificaciones`, { calificaciones });
    return res.data;
  },

  obtenerReporteCurso: async (cursoId) => {
    const res = await api.get(`/docente/reportes/curso/${cursoId}`);
    return res.data;
  },

  exportarPDF: async (cursoId) => {
    const res = await api.get(`/docente/reportes/exportar-pdf/${cursoId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-curso-${cursoId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportarExcel: async (cursoId) => {
    const res = await api.get(`/docente/reportes/exportar-excel/${cursoId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-curso-${cursoId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
