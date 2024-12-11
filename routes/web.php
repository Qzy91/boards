<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth'])->group(function () {
    // Listings
    Route::get('/listings', [AdController::class, 'index'])->name('listings.index');
    Route::get('/listings/create', [AdController::class, 'create'])->name('listings.create');
    Route::post('/listings', [AdController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}', [AdController::class, 'show'])->name('listings.show');
    Route::get('/listings/{listing}/edit', [AdController::class, 'edit'])->name('listings.edit');
    Route::put('/listings/{listing}', [AdController::class, 'update'])->name('listings.update');
    Route::delete('/listings/{listing}', [AdController::class, 'destroy'])->name('listings.destroy');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

require __DIR__.'/auth.php';
