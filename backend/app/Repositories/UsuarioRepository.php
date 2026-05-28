<?php

namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository
{
    // Obtener todos los usuarios activos
    public function getAll(): Collection
    {
        return Usuario::where('estadoA', true)
            ->select('id', 'nombre1', 'nombre2', 'apellidoP', 'apellidoM', 'email', 'nombreUsuario', 'rol', 'estado', 'fechaHoraA')
            ->orderBy('apellidoP')
            ->get();
    }

    // Crear un nuevo usuario
    public function create(array $data): Usuario
    {
        return Usuario::create($data);
    }

    // Buscar usuario por ID
    public function findById(int $id): ?Usuario
    {
        return Usuario::find($id);
    }

    // Eliminar usuario (soft delete - estadoA = false)
    public function softDelete(int $id): bool
    {
        return Usuario::where('id', $id)->update(['estadoA' => false, 'estado' => false]);
    }

    // Actualizar rol de usuario
    public function updateRol(int $id, string $rol): ?Usuario
    {
        $usuario = Usuario::find($id);
        if ($usuario) {
            $usuario->rol = $rol;
            $usuario->save();
        }
        return $usuario;
    }

    // Contar administradores activos
    public function countAdmins(): int
    {
        return Usuario::where('rol', 'Administrador')
            ->where('estadoA', true)
            ->count();
    }
}