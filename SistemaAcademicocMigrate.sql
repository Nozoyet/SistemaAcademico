-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2026 at 05:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistema_academico`
--
CREATE DATABASE IF NOT EXISTS `sistema_academico` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sistema_academico`;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carrera`
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
-- Dumping data for table `carrera`
--

INSERT INTO `carrera` (`id`, `codigo`, `nombre`, `descripcion`, `estado`, `idModalidad`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'GAST-001', 'Gastronomía', 'Carrera enfocada en formación integral de chefs profesionales con énfasis en técnicas culinarias, gestión y gastronomía internacional.', 1, 2, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `curso`
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

-- --------------------------------------------------------

--
-- Table structure for table `docente`
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
-- Dumping data for table `docente`
--

INSERT INTO `docente` (`idUsuario`, `especialidad`, `telefono`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(2, 'Chef Ejecutivo - Cocina Internacional', '76543210', '1', '2026-05-25 18:45:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `estudiante`
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
-- Dumping data for table `estudiante`
--

INSERT INTO `estudiante` (`idUsuario`, `matricula`, `telefono`, `fechaNac`, `fechaInscripcion`, `idCarrera`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(3, 'MAT-2025001', '71234567', '2003-05-15', '2026-05-25 18:45:40', 1, '1', '2026-05-25 18:45:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
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
-- Table structure for table `horario`
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

-- --------------------------------------------------------

--
-- Table structure for table `inscripcion`
--

CREATE TABLE `inscripcion` (
  `id` int(11) NOT NULL,
  `idEstudiante` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `fechaInscripcion` datetime DEFAULT current_timestamp(),
  `notaFinal` float DEFAULT NULL,
  `estado` enum('Activa','Completada','Cancelada') DEFAULT 'Activa',
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
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
-- Table structure for table `job_batches`
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
-- Table structure for table `materia`
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
  `usuarioA` varchar(50) NOT NULL,
  `fechaHoraA` datetime DEFAULT current_timestamp(),
  `estadoA` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materia`
--

INSERT INTO `materia` (`id`, `codigo`, `nombre`, `creditos`, `descripcion`, `idPrerequisito`, `estado`, `idPensum`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'GAST101', 'Introducción a la Gastronomía', 4, 'Historia, conceptos básicos y panorama de la profesión', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(2, 'GAST102', 'Técnicas Básicas de Cocina', 5, 'Cortes, métodos de cocción y mise en place', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(3, 'GAST103', 'Higiene y Seguridad Alimentaria', 3, 'Normas sanitarias y manipulación de alimentos', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(4, 'GAST104', 'Arroz Básico', 3, 'Técnicas de cocción de arroz básicas', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(5, 'GAST201', 'Arroz I', 5, 'Arroces de Europa y América', 4, 1, 1, '1', '2026-05-25 18:39:24', 1),
(6, 'GAST202', 'Panadería y Pastelería Básica', 4, 'Fundamentos de masas y repostería', 2, 1, 1, '1', '2026-05-25 18:39:24', 1),
(7, 'GAST203', 'Pollo al Horno I', 3, 'Principios nutricionales del pollo', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(8, 'GAST204', 'Postres I', 3, 'Dulces', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(9, 'GAST301', 'Arroz II', 5, 'Arroz de Asia', 5, 1, 1, '1', '2026-05-25 18:39:24', 1),
(10, 'GAST302', 'Garde Manger y Entradas Frías', 4, 'Técnicas de preparación en frío', 2, 1, 1, '1', '2026-05-25 18:39:24', 1),
(11, 'GAST303', 'Enología y Maridaje', 3, 'Vinos y armonización con platos', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(12, 'GAST304', 'Pollo al Horno II', 3, 'Uso de equipos y nuevas tecnologías', 7, 1, 1, '1', '2026-05-25 18:39:24', 1),
(13, 'GAST401', 'Arroz III', 5, 'Arroz mágico', 9, 1, 1, '1', '2026-05-25 18:39:24', 1),
(14, 'GAST402', 'Pastelería Avanzada', 4, 'Técnicas modernas de repostería', 6, 1, 1, '1', '2026-05-25 18:39:24', 1),
(15, 'GAST403', 'Postres II', 4, 'Diabetes', 8, 1, 1, '1', '2026-05-25 18:39:24', 1),
(16, 'GAST404', 'Sostenibilidad y Cocina Ecológica', 3, 'Prácticas sostenibles en gastronomía', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(17, 'GAST501', 'Pollo al Horno III', 5, 'Innovación gastronómica', 12, 1, 1, '1', '2026-05-25 18:39:24', 1),
(18, 'GAST502', 'Emprendimiento Gastronómico', 4, 'Creación y gestión de negocios', 11, 1, 1, '1', '2026-05-25 18:39:24', 1),
(19, 'GAST503', 'Servicio y Protocolo', 3, 'Atención al cliente y sommeliería', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1),
(20, 'GAST504', 'Prácticas Profesionales I', 4, 'Experiencia en cocina real', 9, 1, 1, '1', '2026-05-25 18:39:24', 1),
(21, 'GAST601', 'Proyecto Final de Grado', 6, 'Desarrollo de menú completo y tesis', 13, 1, 1, '1', '2026-05-25 18:39:24', 1),
(22, 'GAST602', 'Prácticas Profesionales II', 6, 'Pasantía avanzada', 13, 1, 1, '1', '2026-05-25 18:39:24', 1),
(23, 'GAST603', 'Marketing Gastronómico', 3, 'Estrategias de promoción', 11, 1, 1, '1', '2026-05-25 18:39:24', 1),
(24, 'GAST604', 'Legislación y Normativa Alimentaria', 3, 'Aspectos legales del sector', NULL, 1, 1, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `modalidad`
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
-- Dumping data for table `modalidad`
--

INSERT INTO `modalidad` (`id`, `nombre`, `maxMateriasPermitidas`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 'Mensual', 2, '1', '2026-05-25 18:39:24', 1),
(2, 'Semestral', 6, '1', '2026-05-25 18:39:24', 1),
(3, 'Anual', 12, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
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
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pensum`
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
-- Dumping data for table `pensum`
--

INSERT INTO `pensum` (`id`, `idCarrera`, `anioCreacion`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`) VALUES
(1, 1, '2025', 1, '1', '2026-05-25 18:39:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `periodoacademico`
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

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
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
-- Table structure for table `users`
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
-- Table structure for table `usuario`
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
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `nombreUsuario`, `contrasena`, `rol`, `estado`, `usuarioA`, `fechaHoraA`, `estadoA`, `nombre1`, `nombre2`, `apellidoP`, `apellidoM`) VALUES
(1, 'adminpedro@universidad.edu', 'adminp', '123', 'Administrador', 1, '1', '2026-05-25 18:44:01', 1, 'Pedro', NULL, 'Panqueques', NULL),
(2, 'charliep@universidad.edu', 'cpapas', '123', 'Docente', 1, '1', '2026-05-25 18:44:01', 1, 'Charlie', NULL, 'Papas', NULL),
(3, 'aliciat@universidad.edu', 'atorres', '123', 'Estudiante', 1, '1', '2026-05-25 18:44:42', 1, 'Alicia', NULL, 'Torres', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idModalidad` (`idModalidad`);

--
-- Indexes for table `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_curso_periodo` (`idPeriodoAcademico`),
  ADD KEY `idx_curso_materia` (`idMateria`),
  ADD KEY `idx_curso_docente` (`idDocente`);

--
-- Indexes for table `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indexes for table `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `idCarrera` (`idCarrera`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_horario_curso` (`idCurso`);

--
-- Indexes for table `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_estudiante_curso` (`idEstudiante`,`idCurso`),
  ADD KEY `idx_inscripcion_estudiante` (`idEstudiante`),
  ADD KEY `idx_inscripcion_curso` (`idCurso`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idPrerequisito` (`idPrerequisito`),
  ADD KEY `idPensum` (`idPensum`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modalidad`
--
ALTER TABLE `modalidad`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pensum`
--
ALTER TABLE `pensum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCarrera` (`idCarrera`);

--
-- Indexes for table `periodoacademico`
--
ALTER TABLE `periodoacademico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_periodo_carrera` (`idCarrera`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nombreUsuario` (`nombreUsuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `curso`
--
ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inscripcion`
--
ALTER TABLE `inscripcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materia`
--
ALTER TABLE `materia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modalidad`
--
ALTER TABLE `modalidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pensum`
--
ALTER TABLE `pensum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `periodoacademico`
--
ALTER TABLE `periodoacademico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carrera`
--
ALTER TABLE `carrera`
  ADD CONSTRAINT `carrera_ibfk_1` FOREIGN KEY (`idModalidad`) REFERENCES `modalidad` (`id`);

--
-- Constraints for table `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`idMateria`) REFERENCES `materia` (`id`),
  ADD CONSTRAINT `curso_ibfk_2` FOREIGN KEY (`idPeriodoAcademico`) REFERENCES `periodoacademico` (`id`),
  ADD CONSTRAINT `curso_ibfk_3` FOREIGN KEY (`idDocente`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);

--
-- Constraints for table `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`);

--
-- Constraints for table `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD CONSTRAINT `inscripcion_ibfk_1` FOREIGN KEY (`idEstudiante`) REFERENCES `estudiante` (`idUsuario`),
  ADD CONSTRAINT `inscripcion_ibfk_2` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`);

--
-- Constraints for table `materia`
--
ALTER TABLE `materia`
  ADD CONSTRAINT `materia_ibfk_1` FOREIGN KEY (`idPrerequisito`) REFERENCES `materia` (`id`),
  ADD CONSTRAINT `materia_ibfk_2` FOREIGN KEY (`idPensum`) REFERENCES `pensum` (`id`);

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Constraints for table `pensum`
--
ALTER TABLE `pensum`
  ADD CONSTRAINT `pensum_ibfk_1` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);

--
-- Constraints for table `periodoacademico`
--
ALTER TABLE `periodoacademico`
  ADD CONSTRAINT `periodoacademico_ibfk_1` FOREIGN KEY (`idCarrera`) REFERENCES `carrera` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
