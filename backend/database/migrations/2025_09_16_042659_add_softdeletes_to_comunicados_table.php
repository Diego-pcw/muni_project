<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comunicados', function (Blueprint $table) {
            // ➕ Añade la columna deleted_at (nullable) para Soft Deletes
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comunicados', function (Blueprint $table) {
            // ➖ Elimina la columna deleted_at si se hace rollback
            $table->dropSoftDeletes();
        });
    }
};
