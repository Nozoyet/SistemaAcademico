-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 04:55:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_academico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `idModalidad` int(11) NOT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrera`
--

INSERT INTO `carrera` (`id`, `codigo`, `nombre`, `descripcion`, `estado`, `idModalidad`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'GAST-001', 'Gastronomía', 'Carrera enfocada en formación integral de chefs profesionales con énfasis en técnicas culinarias, gestión y gastronomía internacional.', 1, 2, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `id` int(11) NOT NULL,
  `codigoGrupo` varchar(20) NOT NULL,
  `idMateria` int(11) NOT NULL,
  `idPeriodoAcademico` int(11) NOT NULL,
  `idDocente` int(11) NOT NULL,
  `cupoMaximo` int(11) NOT NULL,
  `cupoActual` int(11) DEFAULT 0 CHECK (`cupoActual` <= `cupoMaximo`),
  `estado` tinyint(1) DEFAULT 1,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`id`, `codigoGrupo`, `idMateria`, `idPeriodoAcademico`, `idDocente`, `cupoMaximo`, `cupoActual`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, '01', 1, 1, 2, 45, 0, 1, '1', '2026-05-31 19:23:41', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `idUsuario` int(11) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente`
--

INSERT INTO `docente` (`idUsuario`, `especialidad`, `telefono`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(2, 'Chef Ejecutivo - Cocina Internacional', '76543210', '1', '2026-05-25 18:45:40', 1),
(4, 'Chef Ejecutivo - Cocina Internacional', '71543210', 'adminp', '2026-05-28 21:25:33', 1),
(5, 'Panadería y Pastelería Artística', '72214567', 'adminp', '2026-05-28 21:25:33', 1),
(6, 'Enología y Maridaje', '73339876', 'adminp', '2026-05-28 21:25:33', 1),
(7, 'Garde Manger y Cocina Fría', '74445678', 'adminp', '2026-05-28 21:25:33', 1),
(8, 'Gestión y Emprendimiento Gastronómico', '75556789', 'adminp', '2026-05-28 21:25:33', 1),
(9, 'Técnicas Avanzadas de Cocina', '76667890', 'adminp', '2026-05-28 21:25:33', 1),
(10, 'Sostenibilidad y Cocina Ecológica', '77778901', 'adminp', '2026-05-28 21:25:33', 1),
(11, 'Servicio y Protocolo Profesional', '78889012', 'adminp', '2026-05-28 21:25:33', 1),
(12, 'Marketing y Comunicación Gastronómica', '79990123', 'adminp', '2026-05-28 21:25:33', 1),
(13, 'Pastelería Francesa y Repostería Moderna', '71111234', 'adminp', '2026-05-28 21:25:33', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `idUsuario` int(11) NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fechaNac` date DEFAULT NULL,
  `fechaInscripcion` datetime DEFAULT current_timestamp(),
  `idCarrera` int(11) NOT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`idUsuario`, `matricula`, `telefono`, `fechaNac`, `fechaInscripcion`, `idCarrera`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(3, 'MAT-2025001', '71234567', '2003-05-15', '2026-05-25 18:45:40', 1, '1', '2026-05-25 18:45:40', 1),
(14, 'MAT-2025002', '71567890', '2004-03-12', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(15, 'MAT-2025003', '72345678', '2005-01-25', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(16, 'MAT-2025004', '73456789', '2004-11-08', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(17, 'MAT-2025005', '74567890', '2003-09-15', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(18, 'MAT-2025006', '75678901', '2004-07-20', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(19, 'MAT-2025007', '76789012', '2005-02-10', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(20, 'MAT-2025008', '77890123', '2004-05-30', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(21, 'MAT-2025009', '78901234', '2003-12-18', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(22, 'MAT-2025010', '79012345', '2004-08-05', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1),
(23, 'MAT-2025011', '70123456', '2005-04-22', '2026-06-01 22:51:45', 1, 'adminp', '2026-06-01 22:51:45', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialacademico`
--

CREATE TABLE `historialacademico` (
  `id` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idMateria` int(11) NOT NULL,
  `idPeriodoAcademico` int(11) NOT NULL,
  `idInscripcion` int(11) DEFAULT NULL,
  `notaFinal` float DEFAULT NULL,
  `estado` enum('Aprobado','Reprobado','Retirado') NOT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historialacademico`
--

INSERT INTO `historialacademico` (`id`, `idEstudiante`, `idMateria`, `idPeriodoAcademico`, `idInscripcion`, `notaFinal`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 18, 1, 1, NULL, 8.5, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(2, 18, 2, 1, NULL, 9, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(3, 18, 3, 1, NULL, 8, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(4, 18, 4, 1, NULL, 7.5, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(5, 18, 5, 2, NULL, 8.2, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(6, 18, 6, 2, NULL, 9.5, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(7, 18, 7, 2, NULL, 7.8, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(8, 18, 8, 2, NULL, 8.7, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(9, 18, 9, 3, NULL, 8, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(10, 18, 10, 3, NULL, 7.2, 'Aprobado', 'adminp', '2026-06-01 22:51:45', 1),
(11, 18, 11, 3, NULL, NULL, 'Reprobado', 'adminp', '2026-06-01 22:51:45', 1),
(12, 18, 12, 3, NULL, 4.5, 'Reprobado', 'adminp', '2026-06-01 22:51:45', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `diaSemana` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFin` time NOT NULL,
  `aula` varchar(50) NOT NULL,
  `edificio` varchar(50) DEFAULT NULL,
  `turno` enum('Mañana','Tarde','Noche') DEFAULT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id`, `idCurso`, `diaSemana`, `horaInicio`, `horaFin`, `aula`, `edificio`, `turno`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 1, 'Lunes', '08:30:00', '11:45:00', '101', 'BLOQUE A', 'Mañana', '1', '2026-05-31 19:23:41', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcion`
--

CREATE TABLE `inscripcion` (
  `id` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `fechaInscripcion` datetime DEFAULT current_timestamp(),
  `estado` enum('Activa','Completada','Cancelada') DEFAULT 'Activa',
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materia`
--

CREATE TABLE `materia` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `creditos` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `idPrerequisito` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `idPensum` int(11) DEFAULT NULL,
  `semestre` int(11) NOT NULL,
  `esElectiva` tinyint(1) DEFAULT 0,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materia`
--

INSERT INTO `materia` (`id`, `codigo`, `nombre`, `creditos`, `descripcion`, `idPrerequisito`, `estado`, `idPensum`, `semestre`, `esElectiva`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'GAST101', 'Introducción a la Gastronomía', 4, 'Historia, conceptos básicos y panorama de la profesión', NULL, 1, 1, 1, 0, '1', '2026-05-25 18:39:24', 1),
(2, 'GAST102', 'Técnicas Básicas de Cocina', 5, 'Cortes, métodos de cocción y mise en place', NULL, 1, 1, 1, 0, '1', '2026-05-25 18:39:24', 1),
(3, 'GAST103', 'Higiene y Seguridad Alimentaria', 3, 'Normas sanitarias y manipulación de alimentos', NULL, 1, 1, 1, 0, '1', '2026-05-25 18:39:24', 1),
(4, 'GAST104', 'Arroz Básico', 3, 'Técnicas de cocción de arroz básicas', NULL, 1, 1, 1, 0, '1', '2026-05-25 18:39:24', 1),
(5, 'GAST201', 'Arroz I', 5, 'Arroces de Europa y América', 4, 1, 1, 2, 0, '1', '2026-05-25 18:39:24', 1),
(6, 'GAST202', 'Panadería y Pastelería Básica', 4, 'Fundamentos de masas y repostería', 2, 1, 1, 2, 0, '1', '2026-05-25 18:39:24', 1),
(7, 'GAST203', 'Pollo al Horno I', 3, 'Principios nutricionales del pollo', NULL, 1, 1, 2, 0, '1', '2026-05-25 18:39:24', 1),
(8, 'GAST204', 'Postres I', 3, 'Dulces', NULL, 1, 1, 2, 0, '1', '2026-05-25 18:39:24', 1),
(9, 'GAST301', 'Arroz II', 5, 'Arroz de Asia', 5, 1, 1, 3, 0, '1', '2026-05-25 18:39:24', 1),
(10, 'GAST302', 'Garde Manger y Entradas Frías', 4, 'Técnicas de preparación en frío', 2, 1, 1, 3, 0, '1', '2026-05-25 18:39:24', 1),
(11, 'GAST303', 'Enología y Maridaje', 3, 'Vinos y armonización con platos', NULL, 1, 1, 3, 0, '1', '2026-05-25 18:39:24', 1),
(12, 'GAST304', 'Pollo al Horno II', 3, 'Uso de equipos y nuevas tecnologías', 7, 1, 1, 3, 0, '1', '2026-05-25 18:39:24', 1),
(13, 'GAST401', 'Arroz III', 5, 'Arroz mágico', 9, 1, 1, 4, 0, '1', '2026-05-25 18:39:24', 1),
(14, 'GAST402', 'Pastelería Avanzada', 4, 'Técnicas modernas de repostería', 6, 1, 1, 4, 0, '1', '2026-05-25 18:39:24', 1),
(15, 'GAST403', 'Postres II', 4, 'Diabetes', 8, 1, 1, 4, 0, '1', '2026-05-25 18:39:24', 1),
(16, 'GAST404', 'Sostenibilidad y Cocina Ecológica', 3, 'Prácticas sostenibles en gastronomía', NULL, 1, 1, 4, 0, '1', '2026-05-25 18:39:24', 1),
(17, 'GAST501', 'Pollo al Horno III', 5, 'Innovación gastronómica', 12, 1, 1, 5, 0, '1', '2026-05-25 18:39:24', 1),
(18, 'GAST502', 'Emprendimiento Gastronómico', 4, 'Creación y gestión de negocios', 11, 1, 1, 5, 0, '1', '2026-05-25 18:39:24', 1),
(19, 'GAST503', 'Servicio y Protocolo', 3, 'Atención al cliente y sommeliería', NULL, 1, 1, 5, 0, '1', '2026-05-25 18:39:24', 1),
(20, 'GAST504', 'Prácticas Profesionales I', 4, 'Experiencia en cocina real', 9, 1, 1, 5, 0, '1', '2026-05-25 18:39:24', 1),
(21, 'GAST601', 'Proyecto Final de Grado', 6, 'Desarrollo de menú completo y tesis', 13, 1, 1, 6, 0, '1', '2026-05-25 18:39:24', 1),
(22, 'GAST602', 'Prácticas Profesionales II', 6, 'Pasantía avanzada', 13, 1, 1, 6, 0, '1', '2026-05-25 18:39:24', 1),
(23, 'GAST603', 'Marketing Gastronómico', 3, 'Estrategias de promoción', 11, 1, 1, 6, 0, '1', '2026-05-25 18:39:24', 1),
(24, 'GAST604', 'Legislación y Normativa Alimentaria', 3, 'Aspectos legales del sector', NULL, 1, 1, 6, 0, '1', '2026-05-25 18:39:24', 1),
(25, 'GAST505', 'Cocina Molecular y Técnicas Avanzadas', 4, 'Esferificaciones, espumas, nitrógeno líquido y otras técnicas modernas de cocina', NULL, 1, 1, 5, 1, 'adminp', '2026-05-31 23:49:42', 1),
(26, 'GAST506', 'Gastronomía Asiática y Fusión', 4, 'Técnicas de cocina asiática y creación de platos fusión', NULL, 1, 1, 5, 1, 'adminp', '2026-05-31 23:49:42', 1),
(27, 'GAST605', 'Cocina de Autor y Creatividad Gastronómica', 5, 'Desarrollo de identidad culinaria y platos de autor', NULL, 1, 1, 6, 1, 'adminp', '2026-05-31 23:49:42', 1),
(28, 'GAST606', 'Gestión de Restaurantes y Alta Cocina', 4, 'Administración avanzada de restaurantes, costos y experiencia del cliente', NULL, 1, 1, 6, 1, 'adminp', '2026-05-31 23:49:42', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_26_040218_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidad`
--

CREATE TABLE `modalidad` (
  `id` int(11) NOT NULL,
  `nombre` enum('Mensual','Semestral','Anual') NOT NULL,
  `maxMateriasPermitidas` int(11) NOT NULL,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modalidad`
--

INSERT INTO `modalidad` (`id`, `nombre`, `maxMateriasPermitidas`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'Mensual', 2, '1', '2026-05-25 18:39:24', 1),
(2, 'Semestral', 6, '1', '2026-05-25 18:39:24', 1),
(3, 'Anual', 12, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fechaEnvio` datetime DEFAULT current_timestamp(),
  `estado` enum('Pendiente','Enviada','Leida') DEFAULT 'Pendiente',
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pensum`
--

CREATE TABLE `pensum` (
  `id` int(11) NOT NULL,
  `idCarrera` int(11) NOT NULL,
  `anioCreacion` year(4) NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pensum`
--

INSERT INTO `pensum` (`id`, `idCarrera`, `anioCreacion`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 1, '2025', 1, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodoacademico`
--

CREATE TABLE `periodoacademico` (
  `id` int(11) NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `idCarrera` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `periodoacademico`
--

INSERT INTO `periodoacademico` (`id`, `codigo`, `fechaInicio`, `fechaFin`, `idCarrera`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, '02', '2026-06-01', '2026-07-05', 1, 1, '1', '2026-05-31 19:19:48', 1),
(2, '2025-1S', '2025-03-01', '2025-07-31', 1, 1, 'adminp', '2026-06-01 22:51:45', 1),
(3, '2025-2S', '2025-08-15', '2025-12-20', 1, 1, 'adminp', '2026-06-01 22:51:45', 1),
(4, '2026-1S', '2026-03-01', '2026-07-31', 1, 1, 'adminp', '2026-06-01 22:51:45', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(11, 'App\\Models\\Usuario', 1, 'auth_token', '0ce9bcdbeabb7b4f12ff577f40780c8d72fef0b17ed20d3d474aadddf6218fff', '[\"*\"]', '2026-06-02 04:57:48', NULL, '2026-06-02 04:57:30', '2026-06-02 04:57:48'),
(12, 'App\\Models\\Usuario', 17, 'auth_token', '21fbb4072f41c092750224fd6e87101c69b8803fa0dd00666dfbad97c83ba8dd', '[\"*\"]', '2026-06-02 06:40:23', NULL, '2026-06-02 06:39:36', '2026-06-02 06:40:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('Estudiante','Docente','Administrador') NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1,
  `nombre1` varchar(50) NOT NULL,
  `nombre2` varchar(50) DEFAULT NULL,
  `apellidoP` varchar(50) NOT NULL,
  `apellidoM` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `nombreUsuario`, `contrasena`, `rol`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`, `nombre1`, `nombre2`, `apellidoP`, `apellidoM`) VALUES
(1, 'adminpedro@universidad.edu', 'adminp', '$2y$10$RTr0NhvjZdaZmtAMKEQrNe1tBOuEDd8wrPUq2pJC4MsFRi6o7CRlO', 'Administrador', 1, '1', '2026-05-25 18:44:01', 1, 'Pedro', NULL, 'Panqueques', NULL),
(2, 'charliep@universidad.edu', 'cpapas', '123', 'Docente', 1, '1', '2026-05-25 18:44:01', 1, 'Charlie', NULL, 'Papas', NULL),
(3, 'aliciat@universidad.edu', 'atorres', '123', 'Estudiante', 1, '1', '2026-05-25 18:44:42', 1, 'Alicia', NULL, 'Torres', NULL),
(4, 'laura.mendoza@universidad.edu', 'lmendoza', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Laura', 'Isabel', 'Mendoza', 'Vargas'),
(5, 'carlos.rivera@universidad.edu', 'crivera', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Carlos', 'Andrés', 'Rivera', 'Lopez'),
(6, 'maria.fernandez@universidad.edu', 'mjfernandez', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'María', 'José', 'Fernández', 'Torres'),
(7, 'roberto.suarez@universidad.edu', 'rsuarez', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Roberto', NULL, 'Suárez', 'García'),
(8, 'ana.morales@universidad.edu', 'agmorales', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Ana', 'Gabriela', 'Morales', 'Pérez'),
(9, 'diego.vargas@universidad.edu', 'dvargas', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Diego', 'Alejandro', 'Vargas', 'Castillo'),
(10, 'sofia.ramirez@universidad.edu', 'sramirez', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Sofía', 'Elena', 'Ramírez', 'Herrera'),
(11, 'jorge.castro@universidad.edu', 'jlcastro', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Jorge', 'Luis', 'Castro', 'Molina'),
(12, 'valentina.ortega@universidad.edu', 'vortega', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Valentina', NULL, 'Ortega', 'Silva'),
(13, 'miguel.navarro@universidad.edu', 'mnavarro', '123', 'Docente', 1, 'adminp', '2026-05-28 21:22:10', 1, 'Miguel', 'Ángel', 'Navarro', 'Rojas'),
(14, 'juan.mendoza@universidad.edu', 'jmendoza', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Juan', 'Carlos', 'Mendoza', 'Rojas'),
(15, 'maria.vargas@universidad.edu', 'mvargas', '$2y$10$didLsoJxR63bf8Al914oL.KSRGE760J7fh79GwicGxHr7fXH82fqi', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'María', 'Laura', 'Vargas', 'López'),
(16, 'luis.gomez@universidad.edu', 'lagomez', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Luis', 'Alejandro', 'Gómez', 'Torres'),
(17, 'ana.ramirez@universidad.edu', 'asramirez', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Ana', 'Sofía', 'Ramírez', 'Castillo'),
(18, 'diego.morales@universidad.edu', 'dmorales', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Diego', 'Fernando', 'Morales', 'Herrera'),
(19, 'valeria.ortega@universidad.edu', 'vortex', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Valeria', NULL, 'Ortega', 'Silva'),
(20, 'andres.navarro@universidad.edu', 'anavarro', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Andrés', 'Felipe', 'Navarro', 'Pérez'),
(21, 'camila.rojas@universidad.edu', 'crojas', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Camila', 'Andrea', 'Rojas', 'Molina'),
(22, 'mateo.fernandez@universidad.edu', 'mfernandez', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Mateo', NULL, 'Fernández', 'Vargas'),
(23, 'isabella.castro@universidad.edu', 'icastro', '123', 'Estudiante', 1, 'adminp', '2026-05-31 19:31:06', 1, 'Isabella', 'Valentina', 'Castro', 'Suárez');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idModalidad` (`idModalidad`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_curso_periodo` (`idPeriodoAcademico`),
  ADD KEY `idx_curso_materia` (`idMateria`),
  ADD KEY `idx_curso_docente` (`idDocente`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `idCarrera` (`idCarrera`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `historialacademico`
--
ALTER TABLE `historialacademico`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_estudiante_materia_periodo` (`idEstudiante`,`idMateria`,`idPeriodoAcademico`),
  ADD KEY `idPeriodoAcademico` (`idPeriodoAcademico`),
  ADD KEY `idInscripcion` (`idInscripcion`),
  ADD KEY `idx_historial_estudiante` (`idEstudiante`),
  ADD KEY `idx_historial_materia` (`idMateria`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_horario_curso` (`idCurso`);

--
-- Indices de la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_estudiante_curso` (`idEstudiante`,`idCurso`),
  ADD KEY `idx_inscripcion_estudiante` (`idEstudiante`),
  ADD KEY `idx_inscripcion_curso` (`idCurso`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idPrerequisito` (`idPrerequisito`),
  ADD KEY `idPensum` (`idPensum`),
  ADD KEY `idx_materia_semestre` (`semestre`),
  ADD KEY `idx_materia_electiva` (`esElectiva`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modalidad`
--
ALTER TABLE `modalidad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pensum`
--
ALTER TABLE `pensum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCarrera` (`idCarrera`);

--
-- Indices de la tabla `periodoacademico`
--
ALTER TABLE `periodoacademico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_periodo_carrera` (`idCarrera`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nombreUsuario` (`nombreUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historialacademico`
--
ALTER TABLE `historialacademico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materia`
--
ALTER TABLE `materia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `modalidad`
--
ALTER TABLE `modalidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pensum`
--
ALTER TABLE `pensum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `periodoacademico`
--
ALTER TABLE `periodoacademico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD CONSTRAINT `carrera_ibfk_1` FOREIGN KEY (`idModalidad`) REFERENCES `modalidad` (`id`);

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`idMateria`) REFERENCES `materia` (`id`),
  ADD CONSTRAINT `curso_ibfk_2` FOREIGN KEY (`idPeriodoAcademico`) REFERENCES `periodoacademico` (`id`),
  ADD CONSTRAINT `curso_ibfk_3` FOREIGN KEY (`idDocente`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);

--
-- Filtros para la tabla `historialacademico`
--
ALTER TABLE `historialacademico`
  ADD CONSTRAINT `historialacademico_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiante` (`idUsuario`),
  ADD CONSTRAINT `historialacademico_ibfk_2` FOREIGN KEY (`idMateria`) REFERENCES `materia` (`id`),
  ADD CONSTRAINT `historialacademico_ibfk_3` FOREIGN KEY (`idPeriodoAcademico`) REFERENCES `periodoacademico` (`id`),
  ADD CONSTRAINT `historialacademico_ibfk_4` FOREIGN KEY (`idInscripcion`) REFERENCES `inscripcion` (`id`);

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`);

--
-- Filtros para la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD CONSTRAINT `inscripcion_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiante` (`idUsuario`),
  ADD CONSTRAINT `inscripcion_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`);

--
-- Filtros para la tabla `materia`
--
ALTER TABLE `materia`
  ADD CONSTRAINT `materia_ibfk_1` FOREIGN KEY (`idPrerequisito`) REFERENCES `materia` (`id`),
  ADD CONSTRAINT `materia_ibfk_2` FOREIGN KEY (`idPensum`) REFERENCES `pensum` (`id`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `pensum`
--
ALTER TABLE `pensum`
  ADD CONSTRAINT `pensum_ibfk_1` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);

--
-- Filtros para la tabla `periodoacademico`
--
ALTER TABLE `periodoacademico`
  ADD CONSTRAINT `periodoacademico_ibfk_1` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
