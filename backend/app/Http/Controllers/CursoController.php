<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Curso;
use App\Models\Horario;
use Illuminate\Support\Facades\DB;

class CursoController extends Controller
{
    public function index(Request $request)
    {
        $query = Curso::with(['materia', 'docente', 'horarios', 'periodoAcademico.carrera'])
            ->where('estadoA', 1);
        if ($request->idPeriodo) {
            $query->where('idPeriodoAcademico', $request->idPeriodo);
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigoGrupo'        => 'required|string|max:20',
            'idMateria'          => 'required|exists:materia,id',
            'idPeriodoAcademico' => 'required|exists:periodoacademico,id',
            'idDocente'          => 'required|exists:usuario,id',
            'cupoMaximo'         => 'required|integer|min:1',
            'horarios'           => 'required|array|min:1',
            'horarios.*.diaSemana'  => 'required|in:Lunes,Martes,Miercoles,Jueves,Viernes,Sabado',
            'horarios.*.horaInicio' => 'required|date_format:H:i',
            'horarios.*.horaFin'    => 'required|date_format:H:i',
            'horarios.*.aula'       => 'required|string|max:50',
            'horarios.*.edificio'   => 'nullable|string|max:50',
            'horarios.*.turno'      => 'nullable|in:Mañana,Tarde,Noche',
        ]);

        // Validar grupo duplicado
        $existe = Curso::where('codigoGrupo', $validated['codigoGrupo'])
            ->where('idMateria', $validated['idMateria'])
            ->where('idPeriodoAcademico', $validated['idPeriodoAcademico'])
            ->where('estadoA', 1)->exists();
        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Ya existe un curso con ese código de grupo para esta materia en el período',
            ], 422);
        }

        // ── Validación de choque de horario del docente ──────────────────
        $choque = $this->detectarChoque($validated['idDocente'], $validated['horarios']);
        if ($choque) {
            return response()->json([
                'success' => false,
                'message' => "El docente ya tiene clase el {$choque['dia']} de {$choque['inicio']} a {$choque['fin']} (curso: {$choque['grupo']})",
            ], 422);
        }

        DB::beginTransaction();
        try {
            $curso = Curso::create([
                'codigoGrupo'        => $validated['codigoGrupo'],
                'idMateria'          => $validated['idMateria'],
                'idPeriodoAcademico' => $validated['idPeriodoAcademico'],
                'idDocente'          => $validated['idDocente'],
                'cupoMaximo'         => $validated['cupoMaximo'],
                'cupoActual'         => 0,
                'estado'             => true,
                'usuarioA'           => $request->user()->id,
                'estadoA'            => true,
            ]);
            foreach ($validated['horarios'] as $h) {
                Horario::create([
                    'idCurso'    => $curso->id,
                    'diaSemana'  => $h['diaSemana'],
                    'horaInicio' => $h['horaInicio'],
                    'horaFin'    => $h['horaFin'],
                    'aula'       => $h['aula'],
                    'edificio'   => $h['edificio'] ?? null,
                    'turno'      => $h['turno'] ?? null,
                    'usuarioA'   => $request->user()->id,
                    'estadoA'    => true,
                ]);
            }
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Curso creado correctamente',
                'data'    => $curso->load(['materia', 'docente', 'horarios']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $curso = Curso::where('estadoA', 1)->find($id);
        if (!$curso) return response()->json(['success' => false, 'message' => 'Curso no encontrado'], 404);

        $validated = $request->validate([
            'codigoGrupo' => 'sometimes|string|max:20',
            'idDocente'   => 'sometimes|exists:usuario,id',
            'cupoMaximo'  => 'sometimes|integer|min:1',
            'horarios'    => 'sometimes|array|min:1',
            'horarios.*.diaSemana'  => 'required_with:horarios|in:Lunes,Martes,Miercoles,Jueves,Viernes,Sabado',
            'horarios.*.horaInicio' => 'required_with:horarios|date_format:H:i',
            'horarios.*.horaFin'    => 'required_with:horarios|date_format:H:i',
            'horarios.*.aula'       => 'required_with:horarios|string|max:50',
            'horarios.*.edificio'   => 'nullable|string|max:50',
            'horarios.*.turno'      => 'nullable|in:Mañana,Tarde,Noche',
        ]);

        // Validar choque excluyendo el curso actual
        if (!empty($validated['horarios'])) {
            $idDocente = $validated['idDocente'] ?? $curso->idDocente;
            $choque = $this->detectarChoque($idDocente, $validated['horarios'], $id);
            if ($choque) {
                return response()->json([
                    'success' => false,
                    'message' => "El docente ya tiene clase el {$choque['dia']} de {$choque['inicio']} a {$choque['fin']} (curso: {$choque['grupo']})",
                ], 422);
            }
        }

        DB::beginTransaction();
        try {
            $curso->update(array_filter([
                'codigoGrupo' => $validated['codigoGrupo'] ?? null,
                'idDocente'   => $validated['idDocente'] ?? null,
                'cupoMaximo'  => $validated['cupoMaximo'] ?? null,
            ], fn($v) => $v !== null));

            if (!empty($validated['horarios'])) {
                Horario::where('idCurso', $id)->delete();
                foreach ($validated['horarios'] as $h) {
                    Horario::create([
                        'idCurso'    => $id,
                        'diaSemana'  => $h['diaSemana'],
                        'horaInicio' => $h['horaInicio'],
                        'horaFin'    => $h['horaFin'],
                        'aula'       => $h['aula'],
                        'edificio'   => $h['edificio'] ?? null,
                        'turno'      => $h['turno'] ?? null,
                        'usuarioA'   => $request->user()->id,
                        'estadoA'    => true,
                    ]);
                }
            }
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Curso actualizado correctamente',
                'data'    => $curso->load(['materia', 'docente', 'horarios']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $curso = Curso::where('estadoA', 1)->find($id);
        if (!$curso) return response()->json(['success' => false, 'message' => 'Curso no encontrado'], 404);
        $curso->update(['estadoA' => 0]);
        return response()->json(['success' => true, 'message' => 'Curso eliminado correctamente']);
    }

    // ── Detectar choque de horario ───────────────────────────────────────────
    private function detectarChoque(int $idDocente, array $nuevosHorarios, ?int $excluirCursoId = null): ?array
    {
        // Traer todos los horarios activos del docente
        $query = Horario::whereHas('curso', function ($q) use ($idDocente, $excluirCursoId) {
            $q->where('idDocente', $idDocente)->where('estadoA', 1);
            if ($excluirCursoId) $q->where('id', '!=', $excluirCursoId);
        })->with('curso')->where('estadoA', 1);

        $existentes = $query->get();

        foreach ($nuevosHorarios as $nuevo) {
            $diaMatch = $existentes->where('diaSemana', $nuevo['diaSemana']);
            foreach ($diaMatch as $ex) {
                // Choque si los rangos se solapan
                if ($nuevo['horaInicio'] < $ex->horaFin && $nuevo['horaFin'] > $ex->horaInicio) {
                    return [
                        'dia'    => $ex->diaSemana,
                        'inicio' => $ex->horaInicio,
                        'fin'    => $ex->horaFin,
                        'grupo'  => $ex->curso->codigoGrupo,
                    ];
                }
            }
        }
        return null;
    }
}