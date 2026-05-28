import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Bienvenida from './pages/Bienvenida.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import GestionarUsuarios from './pages/admin/GestionarUsuarios.jsx';

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
]);


export default router;