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
        Schema::table('formularios', function (Blueprint $table) {
            // session_id
            $table->string('session_id', 128)->nullable()->after('user_id')->index();

            // Índices únicos (nota: si ya tienes duplicados, la migración fallará)
            // Aplicar UNIQUE sólo si estás seguro de que no existen duplicados
            // Si hay riesgo, crea índices no únicos o limpia los datos antes.
            $table->unique('dni', 'formularios_dni_unique');
            $table->unique('ruc', 'formularios_ruc_unique');
            $table->unique('celular', 'formularios_celular_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formularios', function (Blueprint $table) {
            if (Schema::hasColumn('formularios', 'session_id')) {
                $table->dropIndex(['session_id']);
                $table->dropColumn('session_id');
            }

            // drop unique indexes if exist
            if (Schema::hasColumn('formularios', 'dni')) {
                $table->dropUnique('formularios_dni_unique');
            }
            if (Schema::hasColumn('formularios', 'ruc')) {
                $table->dropUnique('formularios_ruc_unique');
            }
            if (Schema::hasColumn('formularios', 'celular')) {
                $table->dropUnique('formularios_celular_unique');
            }
        });
    }
};
