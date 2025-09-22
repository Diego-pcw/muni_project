<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
// añade use de la policy/model si quieres usar clases directamente
use App\Models\Formulario;
use App\Policies\FormularioPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Formulario::class => FormularioPolicy::class,
        // otros policies...
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
