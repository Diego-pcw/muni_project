<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComunicadoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // solo admin creará, pero validación de rol se hace en middleware
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo'            => ['required','string','max:255'],
            'imagen'            => ['nullable','image','mimes:jpg,jpeg,png','max:2048'], // ✅
            'descripcion'       => ['required','string'],
            'fecha_publicacion' => ['required','date'],
            'hora_publicacion'  => ['required','date_format:H:i'],
            'publicador'        => ['required','string','max:255'],
            'entidad'           => ['required','string','max:255'],
            'estado'            => ['required','in:activo,inactivo'],
        ];
    }
}
