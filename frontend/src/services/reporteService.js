import api from './api';

export const reporteService = {
  obtenerCarreras: async () => {
    const res = await api.get('/reportes/carreras');
    return res.data;
  },

  obtenerMateriasPorCarrera: async (carreraId) => {
    const res = await api.get('/reportes/materias', { params: { carrera_id: carreraId } });
    return res.data;
  },

  exportarPDF: async (carreraId) => {
    const res = await api.get(`/reportes/exportar-pdf/${carreraId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-materias-${carreraId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportarExcel: async (carreraId) => {
    const res = await api.get(`/reportes/exportar-excel/${carreraId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte-materias-${carreraId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
