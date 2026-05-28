<?php

namespace App\Services;

use App\Models\Carrera;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ReporteService {
    public function obtenerTodasLasCarreras() {
        try {
            $carreras = DB::table('carrera')
                ->join('modalidad', 'carrera.idModalidad', '=', 'modalidad.id')
                ->where('carrera.estado', 1)
                ->select('carrera.id', 'carrera.codigo', 'carrera.nombre', 'modalidad.nombre as modalidad')
                ->orderBy('carrera.nombre')
                ->get();

            return $carreras->toArray();
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener carreras: ' . $e->getMessage());
        }
    }

    public function obtenerMateriasPorCarrera($carreraId) {
        try {
            $carrera = Carrera::find($carreraId);

            if (!$carrera) {
                throw new \Exception('Carrera no encontrada');
            }

            $materias = DB::table('materia')
                ->join('pensum', 'materia.idPensum', '=', 'pensum.id')
                ->where('pensum.idCarrera', $carreraId)
                ->where('materia.estado', 1)
                ->select(
                    'materia.id',
                    'materia.codigo',
                    'materia.nombre',
                    'materia.creditos'
                )
                ->orderBy('materia.codigo')
                ->get()
                ->map(function ($materia) {
                    return [
                        'id' => $materia->id,
                        'codigo' => $materia->codigo,
                        'nombre' => $materia->nombre,
                        'creditos' => (int) $materia->creditos,
                        'semestre' => $this->calcularSemestre((int) $materia->creditos),
                    ];
                })
                ->toArray();

            return $materias;
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener materias: ' . $e->getMessage());
        }
    }

    public function generarPdf($carreraId) {
        try {
            $carrera = Carrera::find($carreraId);
            if (!$carrera) {
                throw new \Exception('Carrera no encontrada');
            }

            $materias = $this->obtenerMateriasPorCarrera($carreraId);
            $html = $this->generarHtmlReporte($carrera->nombre, $materias);

            $pdf = Pdf::loadHtml($html)
                ->setPaper('a4', 'landscape')
                ->setOption('margin-top', 15)
                ->setOption('margin-bottom', 15)
                ->setOption('margin-left', 15)
                ->setOption('margin-right', 15);

            return $pdf->output();
        } catch (\Exception $e) {
            \Log::error('Error al generar PDF: ' . $e->getMessage());
            throw new \Exception('Error al generar PDF: ' . $e->getMessage());
        }
    }

    public function generarExcel($carreraId) {
        try {
            $carrera = Carrera::find($carreraId);
            if (!$carrera) {
                throw new \Exception('Carrera no encontrada');
            }

            $materias = $this->obtenerMateriasPorCarrera($carreraId);

            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Materias');

            $headers = ['Código', 'Nombre', 'Créditos', 'Semestre'];
            $sheet->fromArray($headers, NULL, 'A1');

            $headerStyle = [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '7c3aed']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                'borders' => ['allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'e2e8f0']]],
            ];
            for ($col = 'A'; $col <= 'D'; $col++) {
                $sheet->getStyle($col . '1')->applyFromArray($headerStyle);
            }

            $row = 2;
            foreach ($materias as $materia) {
                $sheet->setCellValue('A' . $row, $materia['codigo']);
                $sheet->setCellValue('B' . $row, $materia['nombre']);
                $sheet->setCellValue('C' . $row, $materia['creditos']);
                $sheet->setCellValue('D' . $row, $materia['semestre']);
                $row++;
            }

            $sheet->getColumnDimension('A')->setWidth(12);
            $sheet->getColumnDimension('B')->setWidth(45);
            $sheet->getColumnDimension('C')->setWidth(12);
            $sheet->getColumnDimension('D')->setWidth(12);

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

            // ✅ Capturar el output en memoria, no imprimir directo
            ob_start();
            $writer->save('php://output');
            $content = ob_get_clean();

            $filename = 'reporte-' . str_replace(' ', '-', $carrera->nombre) . '.xlsx';

            return response($content)
                ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->header('Cache-Control', 'max-age=0');
        } catch (\Exception $e) {
            \Log::error('Error al generar Excel: ' . $e->getMessage());
            throw new \Exception('Error al generar Excel: ' . $e->getMessage());
        }
    }

    private function calcularSemestre($creditos) {
        return max(1, ceil($creditos / 5));
    }

    private function obtenerDocenteAsignado($materiaId) {
        try {
            $docente = DB::table('curso')
                ->join('usuario', 'curso.idDocente', '=', 'usuario.id')
                ->where('curso.idMateria', $materiaId)
                ->select('usuario.nombre1', 'usuario.apellidoP')
                ->orderBy('curso.id', 'desc')
                ->first();

            if ($docente) {
                return trim("{$docente->nombre1} {$docente->apellidoP}");
            }
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }


    private function generarHtmlReporte($nombreCarrera, $materias) {
        $fechaActual = now()->format('d/m/Y H:i');
        $totalCreditos = array_sum(array_column($materias, 'creditos'));
        $totalMaterias = count($materias);

        $filas = '';
        foreach ($materias as $idx => $materia) {
            $bg = $idx % 2 === 0 ? '#f8fafc' : '#ffffff';
            $filas .= "
                <tr style='background-color: {$bg}; border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 11px 15px; font-size: 13px;'>{$materia['codigo']}</td>
                    <td style='padding: 11px 15px; font-size: 13px;'>{$materia['nombre']}</td>
                    <td style='padding: 11px 15px; font-size: 13px; text-align: center;'>{$materia['creditos']}</td>
                    <td style='padding: 11px 15px; font-size: 13px; text-align: center;'>{$materia['semestre']}</td>
                </tr>
            ";
        }

        $html = "
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <style>
                    * { margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; color: #1e293b; line-height: 1.4; }
                    .container { padding: 25px; }
                    .header { border-top: 4px solid #7c3aed; margin-bottom: 25px; }
                    h1 { font-size: 26px; font-weight: bold; margin-bottom: 5px; color: #0f172a; }
                    .subtitle { font-size: 13px; color: #64748b; margin-bottom: 15px; }
                    .info-section { display: flex; gap: 15px; margin-bottom: 25px; }
                    .info-item { flex: 1; background: #f8fafc; padding: 12px 15px; border-radius: 8px; border-left: 3px solid #7c3aed; }
                    .info-label { font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
                    .info-value { font-size: 14px; color: #1e293b; font-weight: 500; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    thead { background: #7c3aed; color: white; }
                    th { padding: 12px 15px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                    td { padding: 11px 15px; font-size: 13px; }
                    .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Reporte de Materias</h1>
                        <p class='subtitle'>Listado completo de materias de la carrera</p>
                    </div>

                    <div class='info-section'>
                        <div class='info-item'>
                            <div class='info-label'>Carrera</div>
                            <div class='info-value'>{$nombreCarrera}</div>
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Total de Materias</div>
                            <div class='info-value'>{$totalMaterias}</div>
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Total de Créditos</div>
                            <div class='info-value'>{$totalCreditos}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style='width: 12%;'>Código</th>
                                <th style='width: 55%;'>Nombre</th>
                                <th style='width: 16%; text-align: center;'>Créditos</th>
                                <th style='width: 17%; text-align: center;'>Semestre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$filas}
                        </tbody>
                    </table>

                    <div class='footer'>
                        <p><strong>Fecha de generación:</strong> {$fechaActual}</p>
                        <p>Este reporte fue generado automáticamente por el Sistema Académico</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        return $html;
    }
}
