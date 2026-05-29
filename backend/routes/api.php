<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\PensumController;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\PeriodoAcademicoController;
use App\Http\Controllers\CursoController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});



Route::middleware(['auth:sanctum'])->group(function () {

    // Gestión de usuarios (RF09 - solo Administrador)
    Route::prefix('usuarios')->group(function () {
        Route::get('/',           [UsuarioController::class, 'index']);        // Listar usuarios
        Route::post('/',          [UsuarioController::class, 'store']);        // Crear usuario
        Route::delete('/{id}',    [UsuarioController::class, 'destroy']);      // Eliminar usuario
        Route::put('/{id}/rol',   [UsuarioController::class, 'asignarRol']);   // Asignar rol
    });

    Route::apiResource('pensum', PensumController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('pensum/{id}/copiar-materias/{sourceId}', [PensumController::class, 'copiarMaterias']);
     Route::get('/carrera/{id}/pensum-activo', [CarreraController::class, 'pensumActivo']);
   
    Route::apiResource('carrera', CarreraController::class);
    Route::apiResource('materia', MateriaController::class);

// Períodos académicos
    Route::get('/periodos',        [PeriodoAcademicoController::class, 'index']);
    Route::post('/periodos',       [PeriodoAcademicoController::class, 'store']);
    Route::get('/periodos/{id}',   [PeriodoAcademicoController::class, 'show']);

    // Cursos
    Route::get('/cursos',          [CursoController::class, 'index']);
    Route::post('/cursos',         [CursoController::class, 'store']);
    Route::delete('/cursos/{id}',  [CursoController::class, 'destroy']);
    Route::put('/cursos/{id}', [CursoController::class, 'update']);

    // Carreras - pensum activo con materias
    
    // Agregar este route para listar docentes disponibles
Route::get('/docentes', function () {
    $docentes = \App\Models\Usuario::where('rol', 'Docente')
        ->where('estadoA', 1)
        ->select('id', 'nombre1', 'nombre2', 'apellidoP', 'apellidoM')
        ->get()
        ->map(fn($u) => [
            'id'     => $u->id,
            'nombre' => trim("{$u->nombre1} {$u->apellidoP}"),
        ]);
    return response()->json(['success' => true, 'data' => $docentes]);
})->middleware('auth:sanctum');
    
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('reportes')->group(function () {
    Route::get('carreras', [ReporteController::class, 'carreras']);
    Route::get('materias', [ReporteController::class, 'materiasXCarrera']);
    Route::get('exportar-pdf/{carreraId}', [ReporteController::class, 'exportPdf']);
    Route::get('exportar-excel/{carreraId}', [ReporteController::class, 'exportExcel']);
});

