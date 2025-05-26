<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('testapi', function () {
    return response()->json(['message' => 'Test API thành công!']);
});
Route::post('testapi', function (Request $request) {
    return response()->json([
        'received_data' => $request->all()
    ]);
});
