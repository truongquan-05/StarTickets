<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\NguoiDungController;

Route::get('/user', function (Request $request) {
    return 'Quan';
})->middleware('auth:sanctum');


Route::apiResource('vai-tro',VaiTroController::class);

Route::apiResource('loai-ghe', LoaiGheController::class);
// Route::post('/loai-ghe/{id}/restore', [LoaiGheController::class, 'restore'])->name('loai-ghe.restore'); 
// Route::delete('/loai-ghe/{id}/force-delete', [LoaiGheController::class, 'forceDelete'])->name('loai-ghe.force-delete'); 

Route::apiResource('nguoi-dung', NguoiDungController::class);





// http://127.0.0.1:8000/api/....