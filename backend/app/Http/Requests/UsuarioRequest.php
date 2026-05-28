<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Si es solo asignación de rol (PUT /usuarios/{id}/rol)
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'rol' => 'required|in:Estudiante,Docente,Administrador',
            ];
        }

        // Si es creación de usuario (POST /usuarios)
        return [
            'nombre1'      => 'required|string|max:50',
            'nombre2'      => 'nullable|string|max:50',
            'apellidoP'    => 'required|string|max:50',
            'apellidoM'    => 'nullable|string|max:50',
            'email'        => 'required|email|max:100|unique:Usuario,email',
            'nombreUsuario'=> 'required|string|max:50|unique:Usuario,nombreUsuario',
            'contrasena'   => 'required|string|min:6',
            'rol'          => 'required|in:Estudiante,Docente,Administrador',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre1.required'       => 'El primer nombre es obligatorio.',
            'apellidoP.required'     => 'El apellido paterno es obligatorio.',
            'email.required'         => 'El correo electrónico es obligatorio.',
            'email.email'            => 'El correo electrónico no tiene un formato válido.',
            'email.unique'           => 'Este correo ya está registrado.',
            'nombreUsuario.required' => 'El nombre de usuario es obligatorio.',
            'nombreUsuario.unique'   => 'Este nombre de usuario ya está en uso.',
            'contrasena.required'    => 'La contraseña es obligatoria.',
            'contrasena.min'         => 'La contraseña debe tener al menos 6 caracteres.',
            'rol.required'           => 'El rol es obligatorio.',
            'rol.in'                 => 'El rol debe ser Estudiante, Docente o Administrador.',
        ];
    }
}