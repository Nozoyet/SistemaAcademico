import { useState } from "react";
import api from "../../services/api";

export default function ReporteMaterias() {
  const [filtros, setFiltros] = useState({ periodo_id: "", carrera_id: "", materia_id: "", nombre: "", estado: "" });
  const [preview, setPreview] = useState([]);

  const change = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const generarPreview = async () => {
    const res = await api.get("/docente/reportes/materias/preview", { params: filtros });
    setPreview(res.data.data || []);
  };

  const descargar = (formato) => {
    const params = new URLSearchParams(filtros).toString();
    window.open(`${api.defaults.baseURL}/docente/reportes/materias/${formato}?${params}`, "_blank");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reporte de materias</h1>

      <div className="bg-white p-5 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="periodo_id" placeholder="ID periodo" value={filtros.periodo_id} onChange={change} className="border p-2 rounded" />
        <input name="carrera_id" placeholder="ID carrera" value={filtros.carrera_id} onChange={change} className="border p-2 rounded" />
        <input name="materia_id" placeholder="ID materia" value={filtros.materia_id} onChange={change} className="border p-2 rounded" />
        <input name="nombre" placeholder="Nombre materia" value={filtros.nombre} onChange={change} className="border p-2 rounded" />
        <select name="estado" value={filtros.estado} onChange={change} className="border p-2 rounded">
          <option value="">Todos</option>
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
        </select>
        <button onClick={generarPreview} className="bg-blue-600 text-white p-2 rounded">Generar previsualización</button>
      </div>

      <Preview data={preview} onPdf={() => descargar("pdf")} onExcel={() => descargar("excel")} />
    </div>
  );
}

function Preview({ data, onPdf, onExcel }) {
  if (!data.length) return <p className="text-gray-500">Genere una previsualización antes de descargar.</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Previsualización</h2>
        <div className="flex gap-2">
          <button onClick={onPdf} className="bg-red-600 text-white px-4 py-2 rounded">PDF</button>
          <button onClick={onExcel} className="bg-green-600 text-white px-4 py-2 rounded">Excel</button>
        </div>
      </div>
      <Tabla data={data} />
    </div>
  );
}

function Tabla({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead><tr>{Object.keys(data[0]).map((k) => <th key={k} className="border p-2 text-left">{k}</th>)}</tr></thead>
        <tbody>{data.map((row, i) => <tr key={i}>{Object.values(row).map((v, j) => <td key={j} className="border p-2">{String(v ?? "")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}