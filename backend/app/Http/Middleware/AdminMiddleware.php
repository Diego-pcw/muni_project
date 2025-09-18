<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'No autenticado. Por favor inicia sesión.'
            ], 401);
        }

        if ($user->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado: se requiere rol de administrador.'
            ], 403);
        }

        return $next($request);
    }
}
