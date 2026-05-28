<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ReporteService;

class ReporteController extends Controller
{
    protected $reporteService;

    public function __construct(ReporteService $reporteService)
    {
        $this->reporteService = $reporteService;
    }

    public function carreras()
    {
        try {
            $carreras = $this->reporteService->obtenerTodasLasCarreras();
            return response()->json($carreras);
        } catch (\Exception $e) {
            \Log::error('Error en carreras: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function materiasXCarrera(Request $request)
    {
        try {
            $carreraId = $request->query('carrera_id');

            if (!$carreraId) {
                return response()->json(['error' => 'carrera_id es requerido'], 400);
            }

            $materias = $this->reporteService->obtenerMateriasPorCarrera($carreraId);
            return response()->json($materias);
        } catch (\Exception $e) {
            \Log::error('Error en materias: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function exportPdf($carreraId)
    {
        try {
            $pdf = $this->reporteService->generarPdf($carreraId);
            return response($pdf)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="reporte-materias.pdf"');
        } catch (\Exception $e) {
            \Log::error('Error en PDF: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function exportExcel($carreraId)
    {
        try {
            return $this->reporteService->generarExcel($carreraId);
        } catch (\Exception $e) {
            \Log::error('Error en Excel: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
