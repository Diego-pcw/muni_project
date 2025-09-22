<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormularioController;
use App\Http\Controllers\ComunicadoController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {

    // user
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',  [AuthController::class, 'logout']);
        Route::get('/profile',  [AuthController::class, 'profile']);
    });

    // Público / usuario /formulario
    Route::get('/formularios', [FormularioController::class, 'index']);
    Route::get('/formularios/{formulario}', [FormularioController::class, 'show']);
    Route::post('/formularios', [FormularioController::class, 'store']);

    // Admin (requiere token + rol admin) => solo admin puede editar/borrar
    Route::middleware(['auth:sanctum','admin'])->group(function () {
    Route::put('/formularios/{formulario}', [FormularioController::class, 'update']);
    Route::delete('/formularios/{formulario}', [FormularioController::class, 'destroy']);
    });

    // Comunicados
    Route::get('/comunicados', [ComunicadoController::class, 'index']);
    Route::get('/comunicados/{comunicado}', [ComunicadoController::class, 'show']);

    Route::middleware(['auth:sanctum','admin'])->group(function () {
        Route::post('/comunicados', [ComunicadoController::class, 'store']);
        Route::put('/comunicados/{comunicado}', [ComunicadoController::class, 'update']);
        Route::delete('/comunicados/{comunicado}', [ComunicadoController::class, 'destroy']);
        Route::post('/comunicados/{id}/restore', [ComunicadoController::class, 'restore']);
        Route::delete('/comunicados/{id}/force', [ComunicadoController::class, 'forceDelete']);
    });

});