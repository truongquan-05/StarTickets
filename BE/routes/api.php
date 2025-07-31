<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\QRController;
use App\Http\Controllers\Admin\GheController;
use App\Http\Controllers\Admin\RapController;
use App\Http\Controllers\Admin\DoAnController;
use App\Http\Controllers\Admin\PhimController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\TinTucController;
use App\Http\Controllers\Admin\VaiTroController;
use App\Http\Controllers\Client\DatVeController;
use App\Http\Controllers\Admin\LoaiGheController;
use App\Http\Controllers\Admin\TheLoaiController;
use App\Http\Controllers\Admin\AddQuyenController;
use App\Http\Controllers\Admin\ChuyenNguController;
use App\Http\Controllers\Admin\LichChieuController;
use App\Http\Controllers\Admin\MaGiamGiaController;
use App\Http\Controllers\Admin\NguoiDungController;
use App\Http\Controllers\Client\CheckGheController;
use App\Http\Controllers\Client\CheckOutController;
use App\Http\Controllers\Admin\PhongChieuController;
use App\Http\Controllers\Admin\QuanLyDonVeController;
use App\Http\Controllers\Client\DiemThuongController;
use App\Http\Controllers\Client\LichSuMuaHangController;
use App\Http\Controllers\Admin\PhanHoiKhachHangController;
use App\Http\Controllers\Client\RapController as ClientRapController;
use App\Http\Controllers\Client\DoAnController as ClientDoAnController;
use App\Http\Controllers\Client\MaGiamGiaController as MaGiamGiaClient;
use App\Http\Controllers\Admin\DanhGiaController as AdminDanhGiaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NhanVienRap;
use App\Http\Controllers\Admin\Profile;
use App\Http\Controllers\Client\DanhGiaController as ClientDanhGiaController;
use App\Http\Controllers\Client\LichChieuController as ClientLichChieuController;
use App\Http\Controllers\Client\NguoiDungController as ClientNguoiDungController;
use App\Http\Controllers\Client\PhongChieuController as ClientPhongChieuController;
use App\Http\Controllers\Client\QuenMatKhau;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

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
    Route::get('/trashed/list', [PhongChieuController::class, 'trashed']);
    Route::post('/restore/{id}', [PhongChieuController::class, 'restore']);
    Route::delete('/{id}/delete', [PhongChieuController::class, 'forceDelete']);
});
Route::apiResource('ghe', GheController::class);
Route::put('ghe/{ghe}/sua_loai_ghe', [GheController::class, 'changeSeatType']);
Route::apiResource('rap', RapController::class);
Route::prefix('rap')->group(function () {
    Route::get('/trashed/list', [RapController::class, 'trashed']);
    Route::delete('/{id}/soft-delete', [RapController::class, 'softDelete']);
    Route::post('/{id}/restore', [RapController::class, 'restore']);
    Route::delete('/{id}/force', [RapController::class, 'destroy']);
});
Route::prefix('ma_giam_gia')->group(function () {
    Route::get('/', [MaGiamGiaController::class, 'index']);
    Route::get('/het_han', [MaGiamGiaController::class, 'hetHan']);
    Route::get('/{id}', [MaGiamGiaController::class, 'show']);
    Route::post('/', [MaGiamGiaController::class, 'store']);
    Route::put('/{id}', [MaGiamGiaController::class, 'update']);
});
Route::apiResource('lich_chieu', LichChieuController::class);
Route::post('lich_chieu/check', [LichChieuController::class, 'checkLichChieu']);
Route::get('/lich_chieus/chuyen_ngu/{id}', [LichChieuController::class, 'ChuyenNguIndex']);
Route::apiResource('chuyen_ngu', ChuyenNguController::class);
Route::apiResource('tin_tuc', TinTucController::class);
Route::prefix('tin_tuc')->group(function () {
    Route::get('/trashed/list', [TinTucController::class, 'trashed']);
    Route::post('/{id}/restore', [TinTucController::class, 'restore']);
    Route::delete('/force/{id}', [TinTucController::class, 'forceDelete']);
});
Route::prefix('admin')->group(function () {
    Route::get('/danh-gia', [AdminDanhGiaController::class, 'index']);
    Route::get('/danh-gia/{id}', [AdminDanhGiaController::class, 'show']);
    Route::delete('/danh-gia/{id}', [AdminDanhGiaController::class, 'destroy']);
});
Route::prefix('admin')->group(function () {
    Route::get('don-ve', [QuanLyDonVeController::class, 'index']);
    Route::get('don-ve/{id}', [QuanLyDonVeController::class, 'show']);
    Route::post('don-ve/loc', [QuanLyDonVeController::class, 'loc']);
    Route::get('don-ve-phim', [QuanLyDonVeController::class, 'phimCoLichChieu']);
});
Route::prefix('auth/google')->group(function () {
    Route::get('redirect', [LoginController::class, 'redirect']);
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
Route::POST('delete-voucher/{id}', [MaGiamGiaClient::class, 'BackDelete']);
Route::post('ma_xac_thuc/{id}', [NguoiDungController::class, 'TaoMaXacNhan']);
Route::get('get_ma_xac_nhan/{id}', [NguoiDungController::class, 'getMaXacNhan']);
Route::apiResource('quyen_truy_cap', AddQuyenController::class);
Route::get('get-quyen/{id}', [AddQuyenController::class, 'getQuyenHan']);
Route::prefix('banners')->group(function () {
    Route::get('/', [BannerController::class, 'index']);
    Route::post('/', [BannerController::class, 'store']);
    Route::get('/{id}', [BannerController::class, 'show']);
    Route::put('/{id}', [BannerController::class, 'update']);
    Route::delete('/{id}', [BannerController::class, 'destroy']);
    Route::post('/{id}/restore', [BannerController::class, 'restore']);
    Route::PATCH('/{id}/active', [BannerController::class, 'toggleActive']);
    Route::delete('/{id}/force', [BannerController::class, 'forceDelete']);
    Route::get('list/trash', [BannerController::class, 'trashed']);
    Route::get('list/het_han', [BannerController::class, 'hetHan']);
});
Route::get('handler-qr/{id}', [QRController::class, 'show']);
Route::post('handler-qr/{id}', [QRController::class, 'update']);
Route::get('thong_tin_admin/{id}', [AdminController::class, 'show']);
Route::put('thong_tin_admin/{id}', [AdminController::class, 'update']);
Route::post('forget-password', [QuenMatKhau::class, 'store']);
Route::post('xac-nhan-ma', [QuenMatKhau::class, 'checkMaXacNhan']);
Route::post('reset-password', [QuenMatKhau::class, 'update']);
Route::post('add-rap', [NhanVienRap::class, 'store']);
Route::get("add-rap/{id}", [NhanVienRap::class, 'show']);
Route::apiResource('admin/profile',Profile::class);
Route::get('lay-vaitro/{id}', [VaiTroController::class, 'getVaiTro']);
Route::get('tong-quan',[DashboardController::class,'index']);
Route::get('doanh-thu-nam',[DashboardController::class,'DoanhThuNam']);
Route::get('doanh-thu-phim',[DashboardController::class,'PhimDoanhThuCaoNhat']);



//-------------------CLIENT-------------------//

Route::get('/client/nguoi_dung/{id}', [ClientNguoiDungController::class, 'show']);
Route::get('/home', [HomeController::class, 'index']);

Route::get('/home/dang-chieu', [HomeController::class, 'getPhimDangChieu']);
Route::get('/home/sap-chieu', [HomeController::class, 'getPhimSapChieu']);
Route::get('/home/dac-biet', [HomeController::class, 'getPhimDacBiet']);

Route::get('/phim-dang-chieu', [HomeController::class, 'getAllPhimDangChieu']);
Route::get('/phim-sap-chieu', [HomeController::class, 'getAllPhimSapChieu']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/chi-tiet-phim/{id}', [HomeController::class, 'show']);
Route::post('/loc', [HomeController::class, 'locPhimTheoRapNgayTheLoai']);
Route::get('/rap-client', [HomeController::class, 'getAllRap']);
Route::get('/the-loai', [HomeController::class, 'getAllTheLoai']);
Route::middleware("auth:sanctum")->group(function () {
    Route::get('/danh-gia', [ClientDanhGiaController::class, 'index']);
    Route::post('/danh-gia', [ClientDanhGiaController::class, 'store']);
    Route::put('/danh-gia/{id}', [ClientDanhGiaController::class, 'update']);
    Route::delete('/danh-gia/{id}', [ClientDanhGiaController::class, 'destroy']);
    Route::get('/phim/{phim}/danh-gia/me', [ClientDanhGiaController::class, 'getMyDanhGiaByPhim']);
});
Route::get('/phim/{phim}/danh-gia', [ClientDanhGiaController::class, 'getDanhGiaByPhim']);
Route::get('/danh-gia/all', [ClientDanhGiaController::class, 'getAllDanhGia']);
Route::middleware("auth:sanctum")->post('logout', [LogoutController::class, 'logout']);
Route::apiResource('check_ghe', CheckGheController::class);
Route::get('show-all-checkghe/{id}', [CheckGheController::class, 'showAllCheckGhe']);
Route::post('check_ghe/bulk-update', [CheckGheController::class, 'bulkUpdate']);
Route::get('voucher', [MaGiamGiaClient::class, 'index']);
Route::put('voucher/destroy/{id}', [MaGiamGiaClient::class, 'destroy']);
Route::post('voucher-check', [MaGiamGiaClient::class, 'checkVoucher']);
Route::get('phuong_thuc_thanh_toan', [DatVeController::class, 'getPhuongThucThanhToan']);

Route::apiResource('lich-su-ve', LichSuMuaHangController::class);
Route::get('diem_thanh_vien', [DiemThuongController::class, 'index']);
Route::post('diem_thanh_vien', [DiemThuongController::class, 'checkDiem']);
Route::apiResource('client/lich_chieu', ClientLichChieuController::class);
Route::apiResource('client/phong_chieu', ClientPhongChieuController::class);
Route::get('/client/rap', [ClientRapController::class, 'index']);
