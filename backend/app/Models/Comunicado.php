<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // ✔️ importar desde Illuminate
use Illuminate\Database\Eloquent\SoftDeletes;

class Comunicado extends Model
{
    use HasFactory;

    protected $table = 'comunicados';

    protected $fillable = [
        'titulo',
        'imagen',
        'descripcion',
        'fecha_publicacion',
        'hora_publicacion',
        'publicador',
        'entidad',
        'estado',
    ];

    protected $casts = [
        'fecha_publicacion' => 'date',
        'hora_publicacion'  => 'datetime:H:i',
    ];
}

