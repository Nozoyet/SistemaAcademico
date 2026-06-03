# Sistema de Gestión Académica - Gastronomía

Sistema web para la gestión académica de una universidad, desarrollado como proyecto formativo.

## Descripción del Proyecto

Plataforma digital diseñada para modernizar los procesos académicos de una institución educativa. 
Permite gestionar carreras, pensum, periodos académicos, cursos, inscripciones, calificaciones, 
horarios y reportes, adaptándose a diferentes modalidades (Mensual, Semestral y Anual).

---

## Tecnologías Utilizadas

### Backend
- **Laravel 11** (PHP)
- **MySQL**
- **Laravel DomPDF** + **Maatwebsite Excel**

### Frontend
- **React.js** + **Vite**
- **Zustand** (gestión de estado)
- **Axios** + **React Router**

### Patrones y Arquitectura
- Arquitectura Cliente-Servidor (API REST)
- Patrones: Singleton, Observer
- Capas: Controllers, Services, Repositories, Resources

---

## Estructura del Proyecto
sistemaAcademico
├── .gitignore
├── README.txt
├── SistemaAcademico2.sql
├── SistemaAcademicocMigrate.sql
├── backend
│   ├── .editorconfig
│   ├── .env.example
│   ├── .gitattributes
│   ├── .gitignore
│   ├── README.md
│   ├── app
│   │   ├── Exports
│   │   │   └── MateriasPorCarreraExport.php
│   │   ├── Http
│   │   │   ├── Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CarreraController.php
│   │   │   │   ├── Controller.php
│   │   │   │   ├── CursoController.php
│   │   │   │   ├── DocenteController.php
│   │   │   │   ├── EstudianteReporteController.php
│   │   │   │   ├── InscripcionController.php
│   │   │   │   ├── MateriaController.php
│   │   │   │   ├── NotificacionController.php
│   │   │   │   ├── PensumController.php
│   │   │   │   ├── PeriodoAcademicoController.php
│   │   │   │   ├── ReporteController.php
│   │   │   │   ├── ReporteDocenteController.php
│   │   │   │   └── UsuarioController.php
│   │   │   ├── Middleware
│   │   │   │   └── AdminMiddleware.php
│   │   │   └── Requests
│   │   │       └── UsuarioRequest.php
│   │   ├── Models
│   │   │   ├── Calificacion.php
│   │   │   ├── Carrera.php
│   │   │   ├── Curso.php
│   │   │   ├── Estudiante.php
│   │   │   ├── HistorialAcademico.php
│   │   │   ├── Horario.php
│   │   │   ├── Inscripcion.php
│   │   │   ├── Materia.php
│   │   │   ├── Modalidad.php
│   │   │   ├── Notificacion.php
│   │   │   ├── Pensum.php
│   │   │   ├── PeriodoAcademico.php
│   │   │   ├── Usuario.php
│   │   │   └── UsuarioModel.php
│   │   ├── Providers
│   │   │   └── AppServiceProvider.php
│   │   ├── Repositories
│   │   │   └── UsuarioRepository.php
│   │   └── Services
│   │       ├── ReporteDocenteService.php
│   │       ├── ReporteService.php
│   │       └── UsuarioService.php
│   ├── artisan
│   ├── bootstrap
│   │   ├── app.php
│   │   └── providers.php
│   ├── composer.json
│   ├── composer.lock
│   ├── config
│   │   ├── app.php
│   │   ├── auth.php
│   │   ├── cors.php
│   │   ├── database.php
│   │   ├── dompdf.php
│   │   ├── excel.php
│   │   ├── filesystems.php
│   │   ├── jwt.php
│   │   ├── logging.php
│   │   ├── mail.php
│   │   ├── queue.php
│   │   ├── sanctum.php
│   │   ├── services.php
│   │   └── session.php
│   ├── database
│   │   ├── .gitignore
│   │   ├── database.sqlite
│   │   ├── factories
│   │   │   └── UserFactory.php
│   │   ├── migrations
│   │   │   ├── 0001_01_01_000000_create_users_table.php
│   │   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   │   ├── 2026_05_26_040218_create_personal_access_tokens_table.php
│   │   │   ├── 2026_05_27_002033_create_personal_access_tokens_table.php
│   │   │   ├── 2026_05_28_002524_add_semestre_to_materia_table.php
│   │   │   ├── 2026_05_28_011912_add_campos_to_pensum_table.php
│   │   │   └── 2026_06_02_000001_add_tipo_to_notificacion_table.php
│   │   └── seeders
│   │       └── DatabaseSeeder.php
│   ├── package-lock.json
│   ├── package.json
│   ├── phpunit.xml
│   ├── public
│   │   ├── .htaccess
│   │   ├── favicon.ico
│   │   ├── index.php
│   │   └── robots.txt
│   ├── resources
│   │   ├── css
│   │   │   └── app.css
│   │   ├── js
│   │   │   ├── app.js
│   │   │   └── bootstrap.js
│   │   └── views
│   │       ├── reportes
│   │       │   └── docente-curso.blade.php
│   │       └── welcome.blade.php
│   ├── routes
│   │   ├── api.php
│   │   ├── console.php
│   │   └── web.php
│   ├── tests
│   │   ├── Feature
│   │   │   └── ExampleTest.php
│   │   ├── TestCase.php
│   │   └── Unit
│   │       └── ExampleTest.php
│   └── vite.config.js
└── frontend
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   ├── assets
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   ├── components
    │   │   ├── common
    │   │   │   ├── ConfirmModal.jsx
    │   │   │   ├── FiltrosReportes.jsx
    │   │   │   ├── Loading.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── ReportePreviewModal.jsx
    │   │   └── forms
    │   │       └── FormCrearUsuario.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── Bienvenida.jsx
    │   │   ├── Notificaciones.jsx
    │   │   ├── Perfil.jsx
    │   │   ├── admin
    │   │   │   ├── ConsultarCursos.jsx
    │   │   │   ├── GestionCursos.jsx
    │   │   │   ├── GestionarUsuarios.jsx
    │   │   │   ├── Reportes.jsx
    │   │   │   ├── ReportesDocentes.jsx
    │   │   │   ├── ReportesEstudiantes.jsx
    │   │   │   ├── ReportesMenu.jsx
    │   │   │   └── pensum
    │   │   │       ├── PensumArbol.jsx
    │   │   │       ├── PensumDetalle.jsx
    │   │   │       ├── PensumForm.jsx
    │   │   │       └── PensumLista.jsx
    │   │   ├── auth
    │   │   │   └── Login.jsx
    │   │   ├── docente
    │   │   │   ├── CursoEstudiantes.jsx
    │   │   │   ├── MisCursos.jsx
    │   │   │   ├── ReporteCalificaciones.jsx
    │   │   │   ├── ReporteCursos.jsx
    │   │   │   ├── ReporteEstudiantes.jsx
    │   │   │   ├── ReporteMaterias.jsx
    │   │   │   ├── ReportePeriodoAcademico.jsx
    │   │   │   └── ReportesDocente.jsx
    │   │   └── estudiante
    │   │       ├── CursosDisponibles.jsx
    │   │       ├── MisInscripciones.jsx
    │   │       └── ReportesEstudiante.jsx
    │   ├── routes.jsx
    │   ├── services
    │   │   ├── api.js
    │   │   ├── docenteService.js
    │   │   ├── estudianteService.js
    │   │   ├── notificationService.js
    │   │   ├── reporteDocenteService.js
    │   │   └── reporteService.js
    │   └── stores
    │       └── useAuthStore.js
    └── vite.config.js

---

## Instalación y Ejecución

### 1. Backend (Laravel)

```bash
cd universidad-backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env

# Generar clave
php artisan key:generate
php artisan jwt:secret

# Configurar base de datos en .env
DB_DATABASE=sistema_academico

# Migraciones y datos de prueba
php artisan migrate
php artisan db:seed

### 1. Frontend (React)
cd universidad-frontend

npm install
npm run dev

Credenciales de Prueba
Administrador:

Usuario: adminp
Contraseña: 1234567

Docente:

Usuario: cpapas
Contraseña: 1234567

Estudiante:

Usuario: atorres
Contraseña: 1234567

######Próximas Mejoras (Roadmap)

-Sistema Multi-Tenant (soporte para múltiples universidades)
-Notificaciones por correo electrónico
-Modo oscuro y accesibilidad mejorada
-Pruebas automatizadas (Jest + PHPUnit)
-Aplicación móvil

######Autores
Equipo de Desarrollo:
-Nozomi Odris Callisaya Pacheco
-Jhannely Mayte Carvajal
-Alejandra Chavez Paye
-Eddy Limber Vargas Apaza
