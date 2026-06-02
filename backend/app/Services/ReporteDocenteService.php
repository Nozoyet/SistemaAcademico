<?php

namespace App\Services;

use App\Models\Curso;
use App\Models\Materia;
use App\Models\Inscripcion;
use App\Models\Calificacion;
use App\Models\PeriodoAcademico;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ReporteDocenteService
{
    public function generarPreview($docente, array $filtros)
    {
        return match ($filtros['tipo']) {
            'periodo_academico' => $this->reportePeriodoAcademico($docente, $filtros),
            'estudiantes' => $this->reporteEstudiantes($docente, $filtros),
            'materias' => $this->reporteMaterias($docente, $filtros),
            'cursos' => $this->reporteCursos($docente, $filtros),
            'calificaciones' => $this->reporteCalificaciones($docente, $filtros),
        };
    }

    private function reportePeriodoAcademico($docente, array $filtros)
    {
        return PeriodoAcademico::query()
            ->when($filtros['periodo_id'] ?? null, function ($query, $periodoId) {
                $query->where('id', $periodoId);
            })
            ->get();
    }

    private function reporteEstudiantes($docente, array $filtros)
    {
        return Inscripcion::query()
            ->with(['estudiante', 'curso.materia', 'curso.periodoAcademico'])
            ->whereHas('curso', function ($query) use ($docente, $filtros) {
                $query->where('docente_id', $docente->id);

                if (!empty($filtros['curso_id'])) {
                    $query->where('id', $filtros['curso_id']);
                }

                if (!empty($filtros['materia_id'])) {
                    $query->where('materia_id', $filtros['materia_id']);
                }

                if (!empty($filtros['periodo_id'])) {
                    $query->where('periodo_academico_id', $filtros['periodo_id']);
                }
            })
            ->when($filtros['estudiante_id'] ?? null, function ($query, $estudianteId) {
                $query->where('estudiante_id', $estudianteId);
            })
            ->when($filtros['estado'] ?? null, function ($query, $estado) {
                $query->where('estado', $estado);
            })
            ->get();
    }

    private function reporteMaterias($docente, array $filtros)
    {
        return Materia::query()
            ->whereHas('cursos', function ($query) use ($docente, $filtros) {
                $query->where('docente_id', $docente->id);

                if (!empty($filtros['periodo_id'])) {
                    $query->where('periodo_academico_id', $filtros['periodo_id']);
                }
            })
            ->when($filtros['materia_id'] ?? null, function ($query, $materiaId) {
                $query->where('id', $materiaId);
            })
            ->get();
    }

    private function reporteCursos($docente, array $filtros)
    {
        return Curso::query()
            ->with(['materia', 'periodoAcademico', 'horario'])
            ->where('docente_id', $docente->id)
            ->when($filtros['curso_id'] ?? null, function ($query, $cursoId) {
                $query->where('id', $cursoId);
            })
            ->when($filtros['materia_id'] ?? null, function ($query, $materiaId) {
                $query->where('materia_id', $materiaId);
            })
            ->when($filtros['periodo_id'] ?? null, function ($query, $periodoId) {
                $query->where('periodo_academico_id', $periodoId);
            })
            ->get();
    }

    private function reporteCalificaciones($docente, array $filtros)
    {
        return Calificacion::query()
            ->with(['estudiante', 'curso.materia', 'curso.periodoAcademico'])
            ->whereHas('curso', function ($query) use ($docente, $filtros) {
                $query->where('docente_id', $docente->id);

                if (!empty($filtros['curso_id'])) {
                    $query->where('id', $filtros['curso_id']);
                }

                if (!empty($filtros['materia_id'])) {
                    $query->where('materia_id', $filtros['materia_id']);
                }

                if (!empty($filtros['periodo_id'])) {
                    $query->where('periodo_academico_id', $filtros['periodo_id']);
                }
            })
            ->when($filtros['estudiante_id'] ?? null, function ($query, $estudianteId) {
                $query->where('estudiante_id', $estudianteId);
            })
            ->get();
    }

    public function exportarPdf($docente, array $filtros)
    {
        $data = $this->generarPreview($docente, $filtros);

        $pdf = Pdf::loadView('reportes.docente', [
            'docente' => $docente,
            'filtros' => $filtros,
            'data' => $data
        ]);

        return $pdf->download('reporte_docente.pdf');
    }

    public function exportarExcel($docente, array $filtros)
    {
        // Aquí puedes conectar un Export de Laravel Excel.
        // Si todavía no lo tienes, puedes dejarlo pendiente.
        return response()->json([
            'message' => 'Exportación Excel pendiente de implementar',
            'filtros' => $filtros
        ]);
    }
}