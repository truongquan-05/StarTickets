<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\VaiTroController;

Route::get('/user', function (Request $request) {
    return 'Quan';
})->middleware('auth:sanctum');


Route::apiResource('vai-tro',VaiTroController::class);