<?php

use App\Http\Controllers\Admin\LoaiGheController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\VaiTroController;

Route::get('/user', function (Request $request) {
    return 'Quan';
})->middleware('auth:sanctum');


Route::apiResource('vai-tro',VaiTroController::class);
Route::apiResource('loai-ghe', LoaiGheController::class);


// http://127.0.0.1:8000/api/....