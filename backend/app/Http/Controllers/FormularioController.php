<?php

namespace App\Http\Controllers;

use App\Models\Formulario;
use App\Http\Requests\StoreFormularioRequest;
use App\Http\Requests\UpdateFormularioRequest;
use Illuminate\Http\JsonResponse;

class FormularioController extends Controller
{
    /**
     * Listar todos los formularios
     */
    public function index(): JsonResponse
    {
        // Paginación recomendada
        $formularios = Formulario::latest()->paginate(10);
        return response()->json($formularios);
    }

    /**
     * Guardar un nuevo formulario (registro público o usuario)
     */
    public function store(StoreFormularioRequest $request): JsonResponse
    {
        $formulario = Formulario::create($request->validated());
        return response()->json([
            'message' => 'Formulario registrado correctamente',
            'data'    => $formulario
        ], 201);
    }

    /**
     * Mostrar detalle de un formulario
     */
    public function show(Formulario $formulario): JsonResponse
    {
        return response()->json($formulario);
    }

    /**
     * Actualizar (solo admin, protegido por middleware en rutas)
     */
    public function update(UpdateFormularioRequest $request, Formulario $formulario): JsonResponse
    {
        $formulario->update($request->validated());
        return response()->json([
            'message' => 'Formulario actualizado correctamente',
            'data'    => $formulario
        ]);
    }

    /**
     * Eliminar o desactivar (solo admin)
     */
    public function destroy(Formulario $formulario): JsonResponse
    {
        // Opción 1: Soft delete (si añades SoftDeletes al modelo)
        // $formulario->delete();

        // Opción 2: Eliminación definitiva
        $formulario->delete();

        return response()->json(['message' => 'Formulario eliminado correctamente']);
    }
}
