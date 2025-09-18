<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFormularioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // cualquiera puede registrar (usuario autenticado o público según tu política)
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
            'nombres_apellidos' => ['required','string','max:255'],
            'dni'              => ['required','digits:8'],
            'ruc'              => ['nullable','digits:11'],
            'celular'          => ['required','digits_between:6,15'],
            'direccion'        => ['required','string','max:255'],
            'asociacion'       => ['nullable','string','max:255'],
            'propiedad'        => ['required','boolean'],
            'titulo'           => ['required','boolean'],
            'reg_publico'      => ['required','boolean'],
            'charlas'          => ['required','in:virtual,presencial,ninguno'],
        ];
    }
}
