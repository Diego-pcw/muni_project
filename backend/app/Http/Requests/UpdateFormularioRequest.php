<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFormularioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // se protegerá con middleware 'admin', aquí basta con true
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
            'nombres_apellidos' => ['sometimes','string','max:255'],
            'dni'              => ['sometimes','digits:8'],
            'ruc'              => ['nullable','digits:11'],
            'celular'          => ['sometimes','digits_between:6,15'],
            'direccion'        => ['sometimes','string','max:255'],
            'asociacion'       => ['nullable','string','max:255'],
            'propiedad'        => ['sometimes','boolean'],
            'titulo'           => ['sometimes','boolean'],
            'reg_publico'      => ['sometimes','boolean'],
            'charlas'          => ['sometimes','in:virtual,presencial,ninguno'],
        ];
    }
}
