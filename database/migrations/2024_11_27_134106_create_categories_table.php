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
        // Удаляем старое поле `category` из таблицы `ads`
        Schema::table('ads', function (Blueprint $table) {
            if (Schema::hasColumn('ads', 'category')) {
                $table->dropColumn('category');
            }
        });

        // Создаем таблицу `categories`
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('img')->nullable();
            $table->timestamps();
        });

        // Добавляем поле `category_id` в таблицу `ads`
        Schema::table('ads', function (Blueprint $table) {
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Удаляем внешний ключ и поле `category_id`
        Schema::table('ads', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
        });

        // Удаляем таблицу `categories`
        Schema::dropIfExists('categories');

        // Восстанавливаем поле `category` в таблице `ads`
        Schema::table('ads', function (Blueprint $table) {
            $table->string('category')->nullable();
        });
    }
};
