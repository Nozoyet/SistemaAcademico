<?php

namespace App\Http\Controllers;

use App\Services\ReporteDocenteService;
use Illuminate\Http\Request;

class ReporteDocenteController extends Controller
{
    protected $reporteService;

    public function __construct(ReporteDocenteService $reporteService)
    {
        $this->reporteService = $reporteService;
    }

    public function preview(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:periodo_academico,estudiantes,materias,cursos,calificaciones',
            'periodo_id' => 'nullable|integer',
            'materia_id' => 'nullable|integer',
            'curso_id' => 'nullable|integer',
            'estudiante_id' => 'nullable|integer',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'estado' => 'nullable|string',
        ]);

        $data = $this->reporteService->generarPreview(
            $request->user(),
            $request->all()
        );

        return response()->json([
            'message' => 'Previsualización generada correctamente',
            'data' => $data
        ]);
    }

    public function exportarPdf(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:periodo_academico,estudiantes,materias,cursos,calificaciones',
        ]);

        return $this->reporteService->exportarPdf(
            $request->user(),
            $request->all()
        );
    }

    public function exportarExcel(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:periodo_academico,estudiantes,materias,cursos,calificaciones',
        ]);

        return $this->reporteService->exportarExcel(
            $request->user(),
            $request->all()
        );
    }
}