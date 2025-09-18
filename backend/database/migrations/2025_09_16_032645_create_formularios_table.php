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
        Schema::create('formularios', function (Blueprint $table) {
            $table->id();
            $table->string('nombres_apellidos');
            $table->string('dni', 8);
            $table->string('ruc', 15)->nullable();
            $table->string('celular', 15);
            $table->string('direccion');
            $table->string('asociacion')->nullable();
            $table->boolean('propiedad')->default(false);
            $table->boolean('titulo')->default(false);
            $table->boolean('reg_publico')->default(false);
            $table->enum('charlas', ['virtual', 'presencial', 'ninguno'])->default('ninguno');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formularios');
    }
};
