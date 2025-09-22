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
            // agrega user_id nullable y la columna adicional (text nullable)
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->text('adicional')->nullable()->after('charlas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formularios', function (Blueprint $table) {
            // primero eliminar FK si existe
            if (Schema::hasColumn('formularios', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
            if (Schema::hasColumn('formularios', 'adicional')) {
                $table->dropColumn('adicional');
            }
        });
    }
};
