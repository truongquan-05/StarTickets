<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TheLoaiController;
use App\Http\Controllers\API\PhimController;
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

// Thể loại phim 
Route::get('theloai', [TheLoaiController::class, 'index']);           // Lấy danh sách
Route::post('theloai', [TheLoaiController::class, 'store']);          // Thêm mới
Route::get('theloai/{id}', [TheLoaiController::class, 'show']);       // Xem chi tiết
Route::put('theloai/{id}', [TheLoaiController::class, 'update']);     // Cập nhật
Route::delete('theloai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);   // Xóa mềm
Route::delete('theloai/delete/{id}', [TheLoaiController::class, 'delete']); // Xóa vĩnh viễn
Route::post('theloai/restore/{id}', [TheLoaiController::class, 'restore']);            // Khôi phục

// Phim 

Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('/phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('/phim/restore/{id}', [PhimController::class, 'restore']);
