import { useState } from "react";
import api from "../../services/api";

export default function ReportePeriodoAcademico() {
  const [filtros, setFiltros] = useState({ periodo: "", estado: "", fecha_inicio: "", fecha_fin: "" });
  const [preview, setPreview] = useState([]);

  const change = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const generarPreview = async () => {
    const res = await api.get("/docente/reportes/periodo-academico/preview", { params: filtros });
    setPreview(res.data.data || []);
  };

  const descargar = (formato) => {
    const params = new URLSearchParams(filtros).toString();
    window.open(`${api.defaults.baseURL}/docente/reportes/periodo-academico/${formato}?${params}`, "_blank");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reporte de periodo académico</h1>

      <div className="bg-white p-5 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4">
        <input name="periodo" placeholder="Periodo académico" value={filtros.periodo} onChange={change} className="border p-2 rounded" />
        <select name="estado" value={filtros.estado} onChange={change} className="border p-2 rounded">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="finalizado">Finalizado</option>
        </select>
        <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={change} className="border p-2 rounded" />
        <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={change} className="border p-2 rounded" />
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