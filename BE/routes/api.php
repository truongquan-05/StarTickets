<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TheLoaiController;
use App\Http\Controllers\API\PhimController;
use App\Http\Controllers\API\DoAnController;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// // Test API
// Route::get('testapi', function () {
//     return response()->json(['message' => 'Test API thành công!']);
// });
// Route::post('testapi', function (Request $request) {
//     return response()->json([
//         'received_data' => $request->all()
//     ]);
// });

// qli Thể loại phim 
Route::get('the_loai', [TheLoaiController::class, 'index']);           // Lấy danh sách
Route::post('the_loai', [TheLoaiController::class, 'store']);          // Thêm mới
Route::get('the_loai/{id}', [TheLoaiController::class, 'show']);       // Xem chi tiết
Route::put('the_loai/{id}', [TheLoaiController::class, 'update']);     // Cập nhật
Route::delete('the_loai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);   // Xóa mềm
Route::delete('the_loai/delete/{id}', [TheLoaiController::class, 'delete']); // Xóa vĩnh viễn
Route::post('the_loai/restore/{id}', [TheLoaiController::class, 'restore']);            // Khôi phục

//qliqli Phim 

Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('/phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('/phim/restore/{id}', [PhimController::class, 'restore']);

// Đồ ăn
Route::get('doan', [DoAnController::class, 'index']);
Route::post('doan', [DoAnController::class, 'store']);
Route::get('doan/{id}', [DoAnController::class, 'show']);
Route::put('doan/{id}', [DoAnController::class, 'update']);
Route::delete('doan/{id}', [DoAnController::class, 'delete']);
Route::delete('doan/soft-delete/{id}', [DoAnController::class, 'softDelete']);
Route::post('doan/restore/{id}', [DoAnController::class, 'restore']);

