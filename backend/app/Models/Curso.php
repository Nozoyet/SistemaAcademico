<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'curso';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['codigoGrupo', 'idMateria', 'idPeriodoAcademico', 'idDocente', 'cupoMaximo', 'cupoActual'];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'idMateria', 'id');
    }

    public function docente()
    {
        return $this->belongsTo(Usuario::class, 'idDocente', 'id');
    }
}
