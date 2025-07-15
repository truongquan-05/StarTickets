<?php

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\GheController;
use App\Http\Controllers\Admin\RapController;
use App\Http\Controllers\Admin\DoAnController;
use App\Http\Controllers\Admin\PhimController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\Admin\TinTucController;
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Client\DatVeController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\TheLoaiController;
use App\Http\Controllers\Admin\ChuyenNguController;
use App\Http\Controllers\Admin\LichChieuController;
use App\Http\Controllers\Admin\MaGiamGiaController;
use App\Http\Controllers\Admin\NguoiDungController;
use App\Http\Controllers\Client\CheckGheController;
use App\Http\Controllers\Client\CheckOutController;
use App\Http\Controllers\Admin\PhongChieuController;
use App\Http\Controllers\Admin\QuanLyDonVeController;
use App\Http\Controllers\Client\LichSuMuaHangController;
use App\Http\Controllers\Admin\PhanHoiKhachHangController;
use App\Http\Controllers\Client\MaGiamGiaController as MaGiamGiaClient;
use App\Http\Controllers\Admin\DanhGiaController as AdminDanhGiaController;
use App\Http\Controllers\Client\DanhGiaController as ClientDanhGiaController;
use App\Http\Controllers\Client\NguoiDungController as ClientNguoiDungController;




//-------------------ADMIN-------------------//

Route::apiResource('vai_tro', VaiTroController::class);
Route::apiResource('nguoi_dung', NguoiDungController::class);
Route::apiResource('phan_hoi', PhanHoiKhachHangController::class);
Route::get('the_loai', [TheLoaiController::class, 'index']);
Route::post('the_loai', [TheLoaiController::class, 'store']);
Route::get('the_loai/{id}', [TheLoaiController::class, 'show']);
Route::put('the_loai/{id}', [TheLoaiController::class, 'update']);
Route::delete('the_loai/soft-delete/{id}', [TheLoaiController::class, 'softDelete']);
Route::delete('the_loai/delete/{id}', [TheLoaiController::class, 'delete']);
Route::post('the_loai/restore/{id}', [TheLoaiController::class, 'restore']);
Route::apiResource('loai_ghe', LoaiGheController::class);
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
Route::apiResource('phong_chieu', PhongChieuController::class);
Route::prefix('phong_chieu')->group(function () {
    Route::get('/trashed/list', [PhongChieuController::class, 'trashed']); // Lấy danh sách phòng đã xóa mềm
    Route::post('/restore/{id}', [PhongChieuController::class, 'restore']);
    Route::delete('/{id}/delete', [PhongChieuController::class, 'forceDelete']);
});
Route::apiResource('ghe', GheController::class);
Route::put('ghe/{ghe}/sua_loai_ghe', [GheController::class, 'changeSeatType']); //sửa loại ghế
Route::apiResource('rap', RapController::class);
Route::prefix('rap')->group(function () {
    Route::get('/trashed/list', [RapController::class, 'trashed']);   // Danh sách đã xóa mềm
    Route::delete('/{id}/soft-delete', [RapController::class, 'softDelete']); // Xóa mềm rạp
    Route::post('/{id}/restore', [RapController::class, 'restore']);  // Khôi phục
    Route::delete('/{id}/force', [RapController::class, 'destroy']);  // Xóa vĩnh viễn
});
Route::prefix('ma_giam_gia')->group(function () {
    Route::get('/', [MaGiamGiaController::class, 'index']);         // Danh sách mã còn hạn
    Route::get('/het_han', [MaGiamGiaController::class, 'hetHan']); // Danh sách mã đã hết hạn
    Route::get('/{id}', [MaGiamGiaController::class, 'show']);      // Chi tiết
    Route::post('/', [MaGiamGiaController::class, 'store']);        // Thêm
    Route::put('/{id}', [MaGiamGiaController::class, 'update']);    // Cập nhật
});
Route::apiResource('lich_chieu', LichChieuController::class);
Route::post('lich_chieu/check', [LichChieuController::class, 'checkLichChieu']); //Check thời gian hợp lệ
Route::get('/lich_chieus/chuyen_ngu/{id}', [LichChieuController::class, 'ChuyenNguIndex']); //Id của phim
Route::get('/home', [HomeController::class, 'index']);
Route::get('/phim-dang-chieu', [HomeController::class, 'getAllPhimDangChieu']);
Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimSapChieu']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/chi-tiet-phim/{id}', [HomeController::class, 'show']);
Route::apiResource('chuyen_ngu', ChuyenNguController::class);
Route::apiResource('tin_tuc', TinTucController::class);
Route::prefix('tin_tuc')->group(function () {
    Route::get('/trashed/list', [TinTucController::class, 'trashed']); // lấy danh sách xóa mềm
    Route::post('/{id}/restore', [TinTucController::class, 'restore']); // khôi phục tin tức
    Route::delete('/force/{id}', [TinTucController::class, 'forceDelete']); //xóa cứng tin tức
});
Route::prefix('admin')->group(function () {
    Route::get('/danh-gia', [AdminDanhGiaController::class, 'index']); // Lấy danh sách đánh giá
    Route::get('/danh-gia/{id}', [AdminDanhGiaController::class, 'show']); // Xem chi tiết đánh giá
    Route::delete('/danh-gia/{id}', [AdminDanhGiaController::class, 'destroy']); // Xóa đánh giá
});
Route::prefix('admin')->group(function () {
    Route::get('don-ve', [QuanLyDonVeController::class, 'index']);
    Route::get('don-ve/{id}', [QuanLyDonVeController::class, 'show']);
    Route::post('don-ve/loc', [QuanLyDonVeController::class, 'loc']);
    Route::get('don-ve-phim', [QuanLyDonVeController::class, 'phimCoLichChieu']);
});
Route::prefix('auth/google')->group(function () {
    Route::get('redirect', [LoginController::class, 'redirect']); //Dùng cái này
    Route::get('callback', [LoginController::class, 'callback']);
});
Route::prefix('auth')->group(function () {
    Route::post('login', [LoginController::class, 'login']);
    Route::post('register', [LoginController::class, 'register']);
    Route::post('create-ma-dang-ky/{email}', [LoginController::class, 'createMaDangKy']); // Tạo mã đăng ký
});
Route::middleware("auth:sanctum")->post('logout', [LogoutController::class, 'logout']);

Route::apiResource('dat_ve', DatVeController::class);
Route::post('/momo-pay', [CheckOutController::class, 'momo_payment']);
Route::get('/momo-ipn', [CheckOutController::class, 'handleIpn']);
Route::POST('delete-dat-ve/{id}', [DatVeController::class, 'BackDelete']);
Route::post('ma_xac_thuc/{id}', [NguoiDungController::class, 'TaoMaXacNhan']); // Tạo mã xác nhận cho người dùng
Route::get('get_ma_xac_nhan/{id}', [NguoiDungController::class, 'getMaXacNhan']);

//-------------------CLIENT-------------------//


Route::get('/client/nguoi_dung/{id}',[ClientNguoiDungController::class,'show']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/phim-dang-chieu', [HomeController::class, 'getAllPhimDangChieu']);
Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimSapChieu']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/chi-tiet-phim/{id}', [HomeController::class, 'show']);
Route::post('/loc', [HomeController::class, 'locPhimTheoRapNgayTheLoai']);
Route::get('/rap-client', [HomeController::class, 'getAllRap']);
Route::get('/the-loai', [HomeController::class, 'getAllTheLoai']);
Route::middleware("auth:sanctum")->group(function () {
    Route::get('/danh-gia', [ClientDanhGiaController::class, 'index']); // Lấy tất cả đánh giá của user
    Route::post('/danh-gia', [ClientDanhGiaController::class, 'store']); // Thêm đánh giá
    Route::put('/danh-gia/{id}', [ClientDanhGiaController::class, 'update']); // Sửa đánh giá
    Route::delete('/danh-gia/{id}', [ClientDanhGiaController::class, 'destroy']); // Xóa đánh giá
    Route::get('/phim/{phim}/danh-gia/me', [ClientDanhGiaController::class, 'getMyDanhGiaByPhim']); // Lấy đánh giá của user cho phim
});
Route::get('/phim/{phim}/danh-gia', [ClientDanhGiaController::class, 'getDanhGiaByPhim']);
Route::get('/danh-gia/all', [ClientDanhGiaController::class, 'getAllDanhGia']);
Route::middleware("auth:sanctum")->post('logout', [LogoutController::class, 'logout']);
Route::apiResource('check_ghe', CheckGheController::class);
Route::get('show-all-checkghe/{id}', [CheckGheController::class, 'showAllCheckGhe']);
Route::post('check_ghe/bulk-update', [CheckGheController::class, 'bulkUpdate']);
Route::get('voucher', [MaGiamGiaClient::class, 'index']);
Route::put('voucher/destroy/{id}', [MaGiamGiaClient::class, 'update']);
Route::post('voucher-check', [MaGiamGiaClient::class, 'checkVoucher']);
Route::get('phuong_thuc_thanh_toan', [DatVeController::class, 'getPhuongThucThanhToan']);

//phân quyền người dùng
// Route::middleware(['auth:sanctum', 'permission:User-view'])->get('nguoi_dung', [NguoiDungController::class, 'index']);
// Route::middleware(['auth:sanctum', 'permission:User-create'])->post('nguoi_dung', [NguoiDungController::class, 'store']);
// Route::middleware(['auth:sanctum', 'permission:User-view'])->get('nguoi_dung/{id}', [NguoiDungController::class, 'show']);
// Route::middleware(['auth:sanctum', 'permission:User-update'])->put('nguoi_dung/{id}', [NguoiDungController::class, 'update']);
// Route::middleware(['auth:sanctum', 'permission:User-delete'])->delete('nguoi_dung/{id}', [NguoiDungController::class, 'destroy']);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/lich-su-mua-hang', [LichSuMuaHangController::class, 'lichSu']);
//     Route::get('/lich-su-mua-hang/{id}', [LichSuMuaHangController::class, 'show']);
// });


// //Route phân quyền admin và nhân viên  
// Route::middleware(['auth:sanctum', 'is.admin.area'])->group(function () {

//     // SUPERADMIN + ADMIN (vai_tro_id = 99, 1)
//     Route::middleware('check.permission:All')->group(function () {

//         Route::apiResource('vai_tro', VaiTroController::class);
//         Route::apiResource('nguoi_dung', NguoiDungController::class);
//         Route::apiResource('phan_hoi', PhanHoiKhachHangController::class);
//         Route::apiResource('loai_ghe', LoaiGheController::class);
//         Route::apiResource('chuyen_ngu', ChuyenNguController::class);
//         Route::apiResource('tin_tuc', TinTucController::class);
//         Route::prefix('tin_tuc')->group(function () {
//             Route::get('/trashed/list', [TinTucController::class, 'trashed']);
//             Route::post('/{id}/restore', [TinTucController::class, 'restore']);
//             Route::delete('/force/{id}', [TinTucController::class, 'forceDelete']);
//         });

//         // API cấp quyền - SuperAdmin và Admin có thể gán quyền dưới quyền họ
//         Route::post('/cap-quyen', [NguoiDungController::class, 'capQuyen'])->middleware('check.permission:CapQuyen');
//     });

//     // ADMIN + STAFF (vai_tro_id = 1, 3)
//     Route::middleware('check.permission:Phim-create')->post('phim', [PhimController::class, 'store']);
//     Route::middleware('check.permission:Phim-update')->put('phim/{id}', [PhimController::class, 'update']);
//     Route::middleware('check.permission:Phim-delete')->delete('phim/{id}', [PhimController::class, 'delete']);
//     Route::get('phim', [PhimController::class, 'index']);
//     Route::get('phim/{id}', [PhimController::class, 'show']);

//     Route::middleware('check.permission:Rap-create')->post('rap', [RapController::class, 'store']);
//     Route::middleware('check.permission:Rap-update')->put('rap/{id}', [RapController::class, 'update']);
//     Route::middleware('check.permission:Rap-delete')->delete('rap/{id}', [RapController::class, 'destroy']);
//     Route::apiResource('rap', RapController::class)->only(['index', 'show']);

//     Route::middleware('check.permission:DoAn-create')->post('do_an', [DoAnController::class, 'store']);
//     Route::middleware('check.permission:DoAn-update')->put('do_an/{id}', [DoAnController::class, 'update']);
//     Route::middleware('check.permission:DoAn-delete')->delete('do_an/{id}', [DoAnController::class, 'delete']);
//     Route::apiResource('do_an', DoAnController::class)->only(['index', 'show']);

//     Route::middleware('check.permission:PhongChieu-manage')->apiResource('phong_chieu', PhongChieuController::class);

//     // STAFF RAP (vai_tro_id = 4)
//     Route::middleware('check.permission:LichChieu-create')->post('lich_chieu', [LichChieuController::class, 'store']);
//     Route::middleware('check.permission:LichChieu-update')->put('lich_chieu/{id}', [LichChieuController::class, 'update']);
//     Route::middleware('check.permission:LichChieu-delete')->delete('lich_chieu/{id}', [LichChieuController::class, 'destroy']);
//     Route::apiResource('lich_chieu', LichChieuController::class)->only(['index', 'show']);

//     // Đánh giá & đơn vé (admin)
//     Route::prefix('admin')->group(function () {
//         Route::middleware('check.permission:DanhGia-manage')->group(function () {
//             Route::get('/danh-gia', [AdminDanhGiaController::class, 'index']);
//             Route::get('/danh-gia/{id}', [AdminDanhGiaController::class, 'show']);
//             Route::delete('/danh-gia/{id}', [AdminDanhGiaController::class, 'destroy']);
//         });

//         Route::middleware('check.permission:DonVe-manage')->group(function () {
//             Route::get('don-ve', [QuanLyDonVeController::class, 'index']);
//             Route::get('don-ve/{id}', [QuanLyDonVeController::class, 'show']);
//             Route::post('don-ve/loc', [QuanLyDonVeController::class, 'loc']);
//             Route::get('don-ve-phim', [QuanLyDonVeController::class, 'phimCoLichChieu']);
//         });
//     });
// });
