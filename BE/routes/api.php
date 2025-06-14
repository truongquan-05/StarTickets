<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\GheController;
use App\Http\Controllers\Admin\RapController;
use App\Http\Controllers\Admin\DoAnController;
use App\Http\Controllers\Admin\PhimController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\TheLoaiController;
use App\Http\Controllers\Admin\ChuyenNguController;
use App\Http\Controllers\Admin\LichChieuController;
use App\Http\Controllers\Admin\MaGiamGiaController;
use App\Http\Controllers\Admin\NguoiDungController;
use App\Http\Controllers\Admin\PhongChieuController;
use App\Http\Controllers\Admin\PhanHoiKhachHangController;


// Route::get('/user', function (Request $request) {
//     return 'Quan';
// })->middleware('auth:sanctum');


Route::apiResource('vai_tro', VaiTroController::class);

// Route::post('/loai-ghe/{id}/restore', [LoaiGheController::class, 'restore'])->name('loai-ghe('loai-ghe.force-delete');

Route::apiResource('nguoi_dung', NguoiDungController::class);

//API phản hồi khách hàng
Route::apiResource('phan_hoi', PhanHoiKhachHangController::class);


// Thể loại phim
Route::get('the_loai', [TheLoaiController::class, 'index']);           // Lấy danh sách
Route::post('the_loai', [TheLoaiController::class, 'store']);          // Thêm mới
Route::get('the_loai/{id}', [TheLoaiController::class, 'show']);       // Xem chi tiết
Route::put('the_loai/{id}', [TheLoaiController::class, 'update']);     // Cập nhật
Route::delete('the_loai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);   // Xóa mềm
Route::delete('the_loai/delete/{id}', [TheLoaiController::class, 'delete']); // Xóa vĩnh viễn
Route::post('the_loai/restore/{id}', [TheLoaiController::class, 'restore']);            // Khôi phục

// Phim


Route::apiResource('loai_ghe', LoaiGheController::class);
// Route::post('/loai-ghe/{id}/restore', [LoaiGheController::class, 'restore'])->name('loai-ghe.restore');
// Route::delete('/loai-ghe/{id}/force-delete', [LoaiGheController::class, 'forceDelete'])->name('loai-ghe.force-delete');


// http://127.0.0.1:8000/api/....

Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('/phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('/phim/restore/{id}', [PhimController::class, 'restore']);


Route::get('do_an', [DoAnController::class, 'index']);
Route::post('do_an', [DoAnController::class, 'store']);
Route::get('do_an/{id}', [DoAnController::class, 'show']);
Route::put('do_an/{id}', [DoAnController::class, 'update']);
Route::delete('do_an/{id}', [DoAnController::class, 'delete']);
Route::delete('do_an/soft-delete/{id}', [DoAnController::class, 'softDelete']);
Route::post('do_an/restore/{id}', [DoAnController::class, 'restore']);

//
Route::apiResource('phong_chieu', PhongChieuController::class);
Route::prefix('phong_chieu')->group(function () {
    Route::get('/trashed/list', [PhongChieuController::class, 'trashed']); // Lấy danh sách phòng đã xóa mềm
    Route::post('/{id}/restore', [PhongChieuController::class, 'restore']);
    Route::delete('/{id}/delete', [PhongChieuController::class, 'forceDelete']);
});

Route::apiResource('ghe', GheController::class);
Route::put('ghe/{ghe}/sua_loai_ghe', [GheController::class, 'changeSeatType']); //sửa loại ghế

//API rạp
Route::apiResource('rap', RapController::class);

// Các route tùy chỉnh cho soft delete
Route::prefix('rap')->group(function () {
    Route::get('/trashed/list', [RapController::class, 'trashed']);   // Danh sách đã xóa mềm
    Route::patch('/{id}/soft-delete', [RapController::class, 'softDelete']); // Xóa mềm rạp
    Route::post('/{id}/restore', [RapController::class, 'restore']);  // Khôi phục
    Route::delete('/{id}/force', [RapController::class, 'destroy']);  // Xóa vĩnh viễn
});

//API mã giảm giá
Route::prefix('ma_giam_gia')->group(function () {
    Route::get('/', [MaGiamGiaController::class, 'index']);         // Danh sách mã còn hạn
    Route::get('/het_han', [MaGiamGiaController::class, 'hetHan']); // Danh sách mã đã hết hạn
    Route::get('/{id}', [MaGiamGiaController::class, 'show']);      // Chi tiết
    Route::post('/', [MaGiamGiaController::class, 'store']);        // Thêm
    Route::put('/{id}', [MaGiamGiaController::class, 'update']);    // Cập nhật
});


//API lịch chiếu
//Xóa mềm dùng api api lich_chieu
Route::apiResource('lich_chieu', LichChieuController::class);
Route::post('lich_chieu/check', [LichChieuController::class, 'checkLichChieu']); //Check thời gian hợp lệ
Route::post('/lich_chieu/{id}/restore', [LichChieuController::class, 'restore'])->name('lich_chieu.restore'); //Khôi phục
Route::delete('/lich_chieu/{id}/force-delete', [LichChieuController::class, 'forceDelete'])->name('lich_chieu.force-delete'); //Xóa vinh viễn




//trang chu
Route::prefix('client')->group(function () {
    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/phim-chieu-hom-nay', [HomeController::class, 'getAllPhimchieuhomnay']);
    Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimsapchieu']);
});

Route::apiResource('chuyen_ngu',ChuyenNguController::class);

// http://127.0.0.1:8000/api/....
