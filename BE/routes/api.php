<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PhimController;
use App\Http\Controllers\API\TheLoaiController;
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\NguoiDungController;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// Thể loại phim 
Route::get('the_loai', [TheLoaiController::class, 'index']);           // Lấy danh sách
Route::post('the_loai', [TheLoaiController::class, 'store']);          // Thêm mới
Route::get('the_loai/{id}', [TheLoaiController::class, 'show']);       // Xem chi tiết
Route::put('the_loai/{id}', [TheLoaiController::class, 'update']);     // Cập nhật
Route::delete('the_loai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);   // Xóa mềm
Route::delete('the_loai/delete/{id}', [TheLoaiController::class, 'delete']); // Xóa vĩnh viễn
Route::post('the_loai/restore/{id}', [TheLoaiController::class, 'restore']);            // Khôi phục

// Phim 


Route::apiResource('vai_tro',VaiTroController::class);

Route::apiResource('loai_ghe', LoaiGheController::class);
// Route::post('/loai-ghe/{id}/restore', [LoaiGheController::class, 'restore'])->name('loai-ghe.restore'); 
// Route::delete('/loai-ghe/{id}/force-delete', [LoaiGheController::class, 'forceDelete'])->name('loai-ghe.force-delete'); 

Route::apiResource('nguoi_dung', NguoiDungController::class);





// http://127.0.0.1:8000/api/....

Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('/phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('/phim/restore/{id}', [PhimController::class, 'restore']);

