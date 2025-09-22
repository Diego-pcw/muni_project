<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormularioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Por ahora asumimos true porque la autorización (admin) está por middleware.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Usamos Rule::unique()->ignore($id) recuperando $id de la ruta de forma segura.
     */
    public function rules(): array
    {
        // Obtener el id del formulario desde la ruta:
        // Si la ruta usa route-model-binding, $this->route('formulario') devuelve el modelo.
        // Si la ruta pasa solo el id, devuelve el id directamente.
        $routeParam = $this->route('formulario');

        $id = null;
        if ($routeParam) {
            if (is_object($routeParam) && property_exists($routeParam, 'id')) {
                $id = $routeParam->id;
            } else {
                // si la ruta pasa el id como entero/string
                $id = $routeParam;
            }
        }

        return [
            'nombres_apellidos' => ['sometimes','string','max:255'],

            // usar Rule::unique con ignore para que al actualizar no falle si no se cambia el DNI
            'dni' => array_filter([
                'sometimes',
                'digits:8',
                $id ? Rule::unique('formularios', 'dni')->ignore($id) : 'unique:formularios,dni'
            ]),

            // ruc puede ser nullable; al ignorar usamos la misma lógica
            'ruc' => array_filter([
                'nullable',
                'digits:11',
                $id ? Rule::unique('formularios', 'ruc')->ignore($id) : 'unique:formularios,ruc'
            ]),

            'celular' => array_filter([
                'sometimes',
                'digits_between:6,15',
                $id ? Rule::unique('formularios', 'celular')->ignore($id) : 'unique:formularios,celular'
            ]),

            'direccion' => ['sometimes','string','max:255'],
            'asociacion' => ['nullable','string','max:255'],
            'propiedad' => ['sometimes','boolean'],
            'titulo' => ['sometimes','boolean'],
            'reg_publico' => ['sometimes','boolean'],
            'charlas' => ['sometimes','in:virtual,presencial,ninguno'],
            'adicional' => ['sometimes','string'],
        ];
    }
}
