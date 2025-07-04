<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\DatVeController;
use App\Http\Controllers\Admin\GheController;
use App\Http\Controllers\Admin\RapController;
use App\Http\Controllers\Admin\DoAnController;
use App\Http\Controllers\Admin\PhimController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\Admin\TinTucController;
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\TheLoaiController;
use App\Http\Controllers\Admin\ChuyenNguController;
use App\Http\Controllers\Admin\LichChieuController;
use App\Http\Controllers\Admin\MaGiamGiaController;
use App\Http\Controllers\Admin\NguoiDungController;
use App\Http\Controllers\Client\CheckGheController;
use App\Http\Controllers\Admin\PhongChieuController;
use App\Http\Controllers\Admin\PhanHoiKhachHangController;
use App\Http\Controllers\Admin\DanhGiaController as AdminDanhGiaController;
use App\Http\Controllers\Client\CheckOutController;
use App\Http\Controllers\Client\DanhGiaController as ClientDanhGiaController;

// Route::get('/user', function (Request $request) {
//     return 'Quan';
// })->middleware('auth:sanctum');




//-------------------ADMIN-------------------//

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

Route::apiResource('loai_ghe', LoaiGheController::class);

// Phim
Route::get('phim', [PhimController::class, 'index']);
Route::post('phim', [PhimController::class, 'store']);
Route::get('phim/{id}', [PhimController::class, 'show']);
Route::put('phim/{id}', [PhimController::class, 'update']);
Route::delete('phim/{id}', [PhimController::class, 'delete']);
Route::delete('/phim/soft-delete/{id}', [PhimController::class, 'softDelete']);
Route::post('/phim/restore/{id}', [PhimController::class, 'restore']);
Route::get('/phim/trashed/list', [PhimController::class, 'trashed']); 







Route::get('do_an', [DoAnController::class, 'index']);
Route::post('do_an', [DoAnController::class, 'store']);
Route::get('do_an/{id}', [DoAnController::class, 'show']);
Route::put('do_an/{id}', [DoAnController::class, 'update']);
Route::delete('do_an/{id}', [DoAnController::class, 'delete']);
Route::delete('do_an/soft-delete/{id}', [DoAnController::class, 'softDelete']);
Route::post('do_an/restore/{id}', [DoAnController::class, 'restore']);

// Phòng chiếu
Route::apiResource('phong_chieu', PhongChieuController::class);
Route::prefix('phong_chieu')->group(function () {
    Route::get('/trashed/list', [PhongChieuController::class, 'trashed']); // Lấy danh sách phòng đã xóa mềm
    Route::post('/restore/{id}', [PhongChieuController::class, 'restore']);
    Route::delete('/{id}/delete', [PhongChieuController::class, 'forceDelete']);
});

// Ghế
Route::apiResource('ghe', GheController::class);
Route::put('ghe/{ghe}/sua_loai_ghe', [GheController::class, 'changeSeatType']); //sửa loại ghế

//API rạp
Route::apiResource('rap', RapController::class);
// Các route tùy chỉnh cho soft delete
Route::prefix('rap')->group(function () {
    Route::get('/trashed/list', [RapController::class, 'trashed']);   // Danh sách đã xóa mềm
    Route::post('/{id}/soft-delete', [RapController::class, 'softDelete']); // Xóa mềm rạp
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
Route::apiResource('lich_chieu', LichChieuController::class);
Route::post('lich_chieu/check', [LichChieuController::class, 'checkLichChieu']); //Check thời gian hợp lệ
Route::get('/lich_chieus/chuyen_ngu/{id}', [LichChieuController::class, 'ChuyenNguIndex']); //Id của phim



//trang chu

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/phim-dang-chieu', [HomeController::class, 'getAllPhimDangChieu']);
    Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimSapChieu']);
    Route::get('/search', [HomeController::class, 'search']);
    Route::get('/chi-tiet-phim/{id}', [HomeController::class, 'show']);




Route::apiResource('chuyen_ngu', ChuyenNguController::class);

//Tin Tức
Route::apiResource('tin_tuc', TinTucController::class);
Route::prefix('tin_tuc')->group(function () {
    Route::get('/trashed/list', [TinTucController::class, 'trashed']); // lấy danh sách xóa mềm
    Route::post('/{id}/restore', [TinTucController::class, 'restore']); // khôi phục tin tức
    Route::delete('/{id}/force', [TinTucController::class, 'forceDelete']); //xóa cứng tin tức
});

// qli đánh giá cho admin
Route::prefix('admin')->group(function () {
    Route::get('/danh-gia', [AdminDanhGiaController::class, 'index']); // Lấy danh sách đánh giá
    Route::get('/danh-gia/{id}', [AdminDanhGiaController::class, 'show']); // Xem chi tiết đánh giá
    Route::delete('/danh-gia/{id}', [AdminDanhGiaController::class, 'destroy']); // Xóa đánh giá
});

// XỬ LÝ ĐĂNG NHẬP VỚI GOOGLE
Route::prefix('auth/google')->group(function () {
    Route::get('redirect', [LoginController::class, 'redirect']); //Dùng cái này
    Route::get('callback', [LoginController::class, 'callback']);
});

//XỬ LÝ THANH TOÁN
Route::apiResource('dat_ve', DatVeController::class);
Route::post('/momo-pay', [CheckOutController::class, 'momo_payment']);
Route::get('/momo-ipn', [CheckOutController::class, 'handleIpn']);



//-------------------CLIENT-------------------//

//trang chu
Route::get('/home', [HomeController::class, 'index']);
Route::get('/phim-dang-chieu', [HomeController::class, 'getAllPhimDangChieu']);
Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimSapChieu']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/chi-tiet-phim/{id}', [HomeController::class, 'show']);
Route::post('/loc', [HomeController::class, 'locPhimTheoRapNgayTheLoai']);
Route::get('/rap-client', [HomeController::class, 'getAllRap']);
Route::get('/the-loai', [HomeController::class, 'getAllTheLoai']);

// đánh giá của người dùng (client)

// Route::get('/phim/{phim}/danh-gia',           [ClientDanhGiaController::class, 'getByPhim']); // Lấy đánh giá theo phim
// Route::get('/phim/{phim}/danh-gia/average',   [ClientDanhGiaController::class, 'getAverageRating']); // Lấy điểm trung bình

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/danh-gia', [ClientDanhGiaController::class, 'index']); // Lấy tất cả đánh giá của user
//     Route::get('/phim/{phim}/danh-gia/me', [ClientDanhGiaController::class, 'getMyDanhGiaByPhim']); // Lấy đánh giá của user cho phim
//     Route::post('/danh-gia', [ClientDanhGiaController::class, 'store']); // Thêm đánh giá
//     Route::put('/danh-gia/{id}', [ClientDanhGiaController::class, 'update']); // Sửa đánh giá
//     Route::delete('/danh-gia/{id}', [ClientDanhGiaController::class, 'destroy']); // Xóa đánh giá
// });
Route::get('/danh-gia/all', [ClientDanhGiaController::class, 'getAllDanhGia']);

// Lấy tất cả đánh giá của 1 phim
Route::get('/phim/{phimId}/danh-gia', [ClientDanhGiaController::class, 'getByPhim']);

// Lấy điểm trung bình của phim
Route::get('/phim/{phimId}/danh-gia/average', [ClientDanhGiaController::class, 'getAverageRating']);

// Lấy đánh giá của user hiện tại cho 1 phim (không có auth thì dùng tạm id test)
Route::get('/phim/{phimId}/danh-gia/my', [ClientDanhGiaController::class, 'getMyDanhGiaByPhim']);

// Lấy tất cả đánh giá của chính người dùng hiện tại
Route::get('/danh-gia', [ClientDanhGiaController::class, 'index']);

// Thêm đánh giá mới
Route::post('/danh-gia', [ClientDanhGiaController::class, 'store']);

// Cập nhật đánh giá
Route::put('/danh-gia/{id}', [ClientDanhGiaController::class, 'update']);

// Xoá đánh giá
Route::delete('/danh-gia/{id}', [ClientDanhGiaController::class, 'destroy']);


//Đăng nhập và đăng xuất
Route::post('login', [LoginController::class, 'login']);
Route::middleware("auth:sanctum")->post('logout', [LogoutController::class, 'logout']);

//Check ghế đặt vé
Route::apiResource('check_ghe',CheckGheController::class);















// http://127.0.0.1:8000/api/....
