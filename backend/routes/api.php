<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;

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
 
});