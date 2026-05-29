import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Bienvenida from './pages/Bienvenida.jsx';
import Reportes from './pages/admin/Reportes.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import GestionarUsuarios from './pages/admin/GestionarUsuarios.jsx';
import PensumLista from './pages/admin/pensum/PensumLista.jsx';
import PensumForm from './pages/admin/pensum/PensumForm.jsx';
import PensumDetalle from './pages/admin/pensum/PensumDetalle.jsx';
import PensumArbol from './pages/admin/pensum/PensumArbol.jsx';
import GestionCursos from './pages/admin/GestionCursos.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },

  {
    path: '/admin/bienvenida',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <Bienvenida />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reportes',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <Reportes />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/pensum',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <PensumLista />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/pensum/nuevo',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <PensumForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/pensum/:id/arbol',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <PensumArbol />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/pensum/:id',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <PensumDetalle />
      </ProtectedRoute>
    ),
  },
  {
    path: '/docente/bienvenida',
    element: (
      <ProtectedRoute roles={['Docente']}>
        <Bienvenida />
      </ProtectedRoute>
    ),
  },
  {
    path: '/estudiante/bienvenida',
    element: (
      <ProtectedRoute roles={['Estudiante']}>
        <Bienvenida />
      </ProtectedRoute>
    ),
  },

  {
    path: '/admin/GestionarUsuarios',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <GestionarUsuarios />
      </ProtectedRoute>
    ),
  },
  {
  path: '/admin/cursos',
  element: (
    <ProtectedRoute roles={['Administrador']}>
      <GestionCursos />
    </ProtectedRoute>
  ),
}
]);


export default router;