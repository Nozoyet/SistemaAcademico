import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Bienvenida from './pages/Bienvenida.jsx';
import Reportes from './pages/admin/Reportes.jsx';
import ReportesMenu from './pages/admin/ReportesMenu.jsx';
import ReportesEstudiantes from './pages/admin/ReportesEstudiantes.jsx';
import ReportesDocentes from './pages/admin/ReportesDocentes.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import GestionarUsuarios from './pages/admin/GestionarUsuarios.jsx';
import PensumLista from './pages/admin/pensum/PensumLista.jsx';
import PensumForm from './pages/admin/pensum/PensumForm.jsx';
import PensumDetalle from './pages/admin/pensum/PensumDetalle.jsx';
import PensumArbol from './pages/admin/pensum/PensumArbol.jsx';
import CursosDisponibles from './pages/estudiante/CursosDisponibles.jsx';
import MisInscripciones from './pages/estudiante/MisInscripciones.jsx';

import GestionCursos from './pages/admin/GestionCursos.jsx';
import ConsultarCursos from './pages/admin/ConsultarCursos.jsx'; 

import Perfil from './pages/Perfil.jsx';

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
    path: '/admin/reportes/menu',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <ReportesMenu />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reportes/estudiantes',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <ReportesEstudiantes />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reportes/docentes',
    element: (
      <ProtectedRoute roles={['Administrador']}>
        <ReportesDocentes />
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
  path: '/admin/cursos/gestion',
  element: (
    <ProtectedRoute roles={['Administrador']}>
      <GestionCursos />
    </ProtectedRoute>
  ),
},
{
  path: '/admin/cursos/consulta',
  element: (
    <ProtectedRoute roles={['Administrador']}>
      <ConsultarCursos />
    </ProtectedRoute>
  ),
},
{ path: '/estudiante/cursos', element: <ProtectedRoute roles={['Estudiante']}><CursosDisponibles /></ProtectedRoute> },
{ path: '/estudiante/inscripciones', element: <ProtectedRoute roles={['Estudiante']}><MisInscripciones /></ProtectedRoute> },

// dentro del router, agregar estas 3:
{ path: '/admin/perfil',      element: <ProtectedRoute roles={['Administrador']}><Perfil /></ProtectedRoute> },
{ path: '/docente/perfil',    element: <ProtectedRoute roles={['Docente']}><Perfil /></ProtectedRoute> },
{ path: '/estudiante/perfil', element: <ProtectedRoute roles={['Estudiante']}><Perfil /></ProtectedRoute> },

]);

export default router;