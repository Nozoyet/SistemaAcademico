import { useState } from "react";
import { crearUsuario } from "../../services/api";

const ROLES = ["Estudiante", "Docente", "Administrador"];


export default function FormCrearUsuario({ onUsuarioCreado, onCancelar }) {
  const [form, setForm] = useState({
    nombre1: "",
    nombre2: "",
    apellidoP: "",
    apellidoM: "",
    email: "",
    nombreUsuario: "",
    contrasena: "",
    rol: "Estudiante",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await crearUsuario(form);
      onUsuarioCreado(res.data.usuario);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al crear el usuario.";
      const errores = err.response?.data?.errors;
      if (errores) {
        // Mostrar primer error de validación
        const primerError = Object.values(errores)[0][0];
        setError(primerError);
      } else {
        setError(msg);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Crear nuevo usuario</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
      )}

      {/* Nombres */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primer nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre1"
            value={form.nombre1}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Segundo nombre</label>
          <input
            type="text"
            name="nombre2"
            value={form.nombre2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Apellidos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido paterno <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellidoP"
            value={form.apellidoP}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido materno</label>
          <input
            type="text"
            name="apellidoM"
            value={form.apellidoM}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Nombre de usuario y contraseña */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol <span className="text-red-500">*</span>
        </label>
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {cargando ? "Creando..." : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}