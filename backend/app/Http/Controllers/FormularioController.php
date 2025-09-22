<?php

namespace App\Http\Controllers;

use App\Models\Formulario;
use App\Http\Requests\StoreFormularioRequest;
use App\Http\Requests\UpdateFormularioRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class FormularioController extends Controller
{
    /**
     * Listar formularios
     *
     * Reglas:
     * - admin -> puede ver todo
     * - cliente autenticado -> si solicita ?mine=1 ve solo los suyos
     * - invitado -> NO puede ver otros formularios (devuelve lista vacía)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q', null);
        $mine = $request->boolean('mine', false);

        $user = $request->user();

        if (! $user) {
            $bearer = $request->bearerToken();
            if ($bearer) {
                $pat = PersonalAccessToken::findToken($bearer);
                if ($pat && $pat->tokenable) {
                    $user = $pat->tokenable;
                }
            }
        }

        $query = Formulario::query()->latest();

        if ($mine) {
            if (! $user) {
                return response()->json(['message' => 'No autenticado.'], 401);
            }
            $query->where('user_id', $user->id);
        } else {
            if (! ($user && $user->rol === 'admin')) {
                return response()->json([
                    'current_page' => 1,
                    'data' => [],
                    'first_page_url' => null,
                    'from' => null,
                    'last_page' => 0,
                    'last_page_url' => null,
                    'links' => [],
                    'next_page_url' => null,
                    'path' => $request->url(),
                    'per_page' => $perPage,
                    'prev_page_url' => null,
                    'to' => null,
                    'total' => 0,
                ]);
            }
        }

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('nombres_apellidos', 'like', "%{$q}%")
                    ->orWhere('dni', 'like', "%{$q}%")
                    ->orWhere('celular', 'like', "%{$q}%")
                    ->orWhere('direccion', 'like', "%{$q}%");
            });
        }

        $formularios = $query->paginate($perPage);

        return response()->json($formularios);
    }

    /**
     * Guardar un formulario
     * Invitados -> asigna session_id
     * Autenticados -> asigna user_id
     */
    public function store(StoreFormularioRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $request->user();

        if (! $user) {
            $bearer = $request->bearerToken();
            if ($bearer) {
                $pat = PersonalAccessToken::findToken($bearer);
                if ($pat && $pat->tokenable) {
                    $user = $pat->tokenable;
                }
            }
        }

        if ($user) {
            $data['user_id'] = $user->id;
        } else {
            $data['session_id'] = $request->header('X-Session-Id') ?? bin2hex(random_bytes(16));
        }

        $formulario = Formulario::create($data);

        $response = [
            'message' => 'Formulario registrado correctamente',
            'data'    => $formulario,
        ];

        if (! $user) {
            $response['session_id'] = $data['session_id'];
        }

        return response()->json($response, 201);
    }

    /**
     * Mostrar un formulario individual
     */
    public function show(Request $request, Formulario $formulario): JsonResponse
    {
    $user = $request->user();
    if (! $user) {
        $bearer = $request->bearerToken();
        if ($bearer) {
            $pat = PersonalAccessToken::findToken($bearer);
            if ($pat && $pat->tokenable) {
                $user = $pat->tokenable;
            }
        }
    }

    if ($user && ($user->rol === 'admin' || $formulario->user_id === $user->id)) {
        return response()->json($formulario);
    }

    return response()->json(['message' => 'No autorizado para ver este formulario.'], 403);
    }

    /**
     * Actualizar formulario (solo admin)
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
     * Eliminar formulario (solo admin)
     */
    public function destroy(Formulario $formulario): JsonResponse
    {
        $formulario->delete();

        return response()->json(['message' => 'Formulario eliminado correctamente']);
    }
}

