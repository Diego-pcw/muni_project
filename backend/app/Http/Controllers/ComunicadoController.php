<?php

namespace App\Http\Controllers;

use App\Models\Comunicado;
use App\Http\Requests\StoreComunicadoRequest;
use App\Http\Requests\UpdateComunicadoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ComunicadoController extends Controller
{
    public function index(): JsonResponse
    {
        // Mostrar solo los activos y no eliminados
        $comunicados = Comunicado::where('estado', 'activo')
            ->latest('fecha_publicacion')
            ->paginate(10);

        return response()->json($comunicados);
    }

    public function show(Comunicado $comunicado): JsonResponse
    {
        return response()->json($comunicado);
    }

    public function store(StoreComunicadoRequest $request): JsonResponse
    {
        $data = $request->validated();

        // ✅ Guardar imagen en storage/app/public/comunicados
        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')
                ->store('comunicados', 'public');
        }

        $comunicado = Comunicado::create($data);

        return response()->json([
            'message' => 'Comunicado creado correctamente',
            'data'    => $comunicado,
        ], 201);
    }

    public function update(UpdateComunicadoRequest $request, Comunicado $comunicado): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            // ✅ Borrar imagen anterior si existe
            if ($comunicado->imagen && Storage::disk('public')->exists($comunicado->imagen)) {
                Storage::disk('public')->delete($comunicado->imagen);
            }
            $data['imagen'] = $request->file('imagen')
                ->store('comunicados', 'public');
        }

        $comunicado->update($data);

        return response()->json([
            'message' => 'Comunicado actualizado correctamente',
            'data'    => $comunicado,
        ]);
    }

    public function destroy(Comunicado $comunicado): JsonResponse
    {
        // ✅ Soft delete
        $comunicado->delete();

        return response()->json(['message' => 'Comunicado eliminado (soft delete)']);
    }

    // 🔄 Recuperar comunicado eliminado
    public function restore(int $id): JsonResponse
    {
        $comunicado = Comunicado::withTrashed()->findOrFail($id);
        $comunicado->restore();

        return response()->json(['message' => 'Comunicado restaurado correctamente']);
    }

    // ❌ Eliminación permanente
    public function forceDelete(int $id): JsonResponse
    {
        $comunicado = Comunicado::withTrashed()->findOrFail($id);

        if ($comunicado->imagen && Storage::disk('public')->exists($comunicado->imagen)) {
            Storage::disk('public')->delete($comunicado->imagen);
        }

        $comunicado->forceDelete();

        return response()->json(['message' => 'Comunicado eliminado definitivamente']);
    }
}
