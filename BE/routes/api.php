<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers Admin
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Admin\LoaiGheController;

// Controllers API
use App\Http\Controllers\API\TheLoaiController;
use App\Http\Controllers\API\PhimController;
use App\Http\Controllers\API\DoAnController;

// Route test
Route::get('/user', function (Request $request) {
    return 'Quan';
})->middleware('auth:sanctum');

// Vai trò, loại ghế
Route::apiResource('vai-tro', VaiTroController::class);
Route::apiResource('loai-ghe', LoaiGheController::class);

// Thể loại phim
Route::get('the-loai', [TheLoaiController::class, 'index']);
Route::post('the-loai', [TheLoaiController::class, 'store']);
Route::get('the-loai/{id}', [TheLoaiController::class, 'show']);
Route::put('the-loai/{id}', [TheLoaiController::class, 'update']);
Route::delete('the-loai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);
Route::delete('the-loai/delete/{id}', [TheLoaiController::class, 'delete']);
Route::post('the-loai/restore/{id}', [TheLoaiController::class, 'restore']);

// Phim
Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('phim/restore/{id}', [PhimController::class, 'restore']);

// Đồ ăn
Route::get('do-an', [DoAnController::class, 'index']);
Route::post('do-an', [DoAnController::class, 'store']);
Route::get('do-an/{id}', [DoAnController::class, 'show']);
Route::put('do-an/{id}', [DoAnController::class, 'update']);
Route::delete('do-an/{id}', [DoAnController::class, 'delete']);
Route::delete('do-an/soft-delete/{id}', [DoAnController::class, 'softDelete']);
Route::post('do-an/restore/{id}', [DoAnController::class, 'restore']);
