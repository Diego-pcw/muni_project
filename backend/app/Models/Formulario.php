<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // ✔️ importar desde Illuminate

class Formulario extends Model
{
    use HasFactory;

    protected $table = 'formularios';

    protected $fillable = [
        'nombres_apellidos',
        'dni',
        'ruc',
        'celular',
        'direccion',
        'asociacion',
        'propiedad',
        'titulo',
        'reg_publico',
        'charlas',
        'adicional',   // <-- nuevo
        'user_id',     // <-- nuevo
        'session_id',
    ];

    protected $casts = [
        'propiedad'   => 'boolean',
        'titulo'      => 'boolean',
        'reg_publico' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
