<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenHanSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Toàn quyền
            ['quyen' => 'All', 'mo_ta' => 'Toàn quyền hệ thống'],

            // Quản lý phim
            ['quyen' => 'Phim-create', 'mo_ta' => 'Thêm phim'],
            ['quyen' => 'Phim-update', 'mo_ta' => 'Sửa phim'],
            ['quyen' => 'Phim-delete', 'mo_ta' => 'Xóa phim'],
            ['quyen' => 'Phim-read', 'mo_ta' => 'Xóa phim'],

            // Quản lý rạp
            ['quyen' => 'Rap-create', 'mo_ta' => 'Thêm rạp'],
            ['quyen' => 'Rap-update', 'mo_ta' => 'Sửa rạp'],
            ['quyen' => 'Rap-delete', 'mo_ta' => 'Xóa rạp'],
            ['quyen' => 'Rap-read', 'mo_ta' => 'Xóa rạp'],

            // Quản lý phòng chiếu
            ['quyen' => 'PhongChieu-create', 'mo_ta' => 'Thêm phòng chiếu'],
            ['quyen' => 'PhongChieu-update', 'mo_ta' => 'Sửa phòng chiếu'],
            ['quyen' => 'PhongChieu-delete', 'mo_ta' => 'Xóa phòng chiếu'],
            ['quyen' => 'PhongChieu-read', 'mo_ta' => 'Xem phòng chiếu'],

            // Lịch chiếu
            ['quyen' => 'LichChieu-create', 'mo_ta' => 'Thêm lịch chiếu'],
            ['quyen' => 'LichChieu-update', 'mo_ta' => 'Sửa lịch chiếu'],
            ['quyen' => 'LichChieu-delete', 'mo_ta' => 'Xóa lịch chiếu'],
            ['quyen' => 'LichChieu-read', 'mo_ta' => 'Xem lịch chiếu'],

            // Vé
            ['quyen' => 'Ve-create', 'mo_ta' => 'Đặt vé'],
            ['quyen' => 'Ve-update', 'mo_ta' => 'Cập nhật vé'],
            ['quyen' => 'Ve-delete', 'mo_ta' => 'Hủy vé'],
            ['quyen' => 'Ve-read', 'mo_ta' => 'Xem Vé'],

            // Đánh giá
            ['quyen' => 'DanhGia-create', 'mo_ta' => 'Tạo đánh giá'],
            ['quyen' => 'DanhGia-update', 'mo_ta' => 'Sửa đánh giá'],
            ['quyen' => 'DanhGia-delete', 'mo_ta' => 'Xóa đánh giá'],
            ['quyen' => 'DanhGia-read', 'mo_ta' => 'Xem đánh giá'],

            //Tài khoản
            ['quyen' => 'TaiKhoan-create', 'mo_ta' => 'Tạo tài khoản'],
            ['quyen' => 'TaiKhoan-update', 'mo_ta' => 'Sửa tài khoản'],
            ['quyen' => 'TaiKhoan-delete', 'mo_ta' => 'Xóa tài khoản'],
            ['quyen' => 'TaiKhoan-read', 'mo_ta' => 'Xem tài khoản'],

            //Đồ ăn
            ['quyen' => 'DoAn-create', 'mo_ta' => 'Tạo đồ ăn'],
            ['quyen' => 'DoAn-update', 'mo_ta' => 'Sửa đồ ăn'],
            ['quyen' => 'DoAn-delete', 'mo_ta' => 'Xóa đồ ăn'],
            ['quyen' => 'DoAn-read', 'mo_ta' => 'Xem đồ ăn'],

            //Vai trò
            ['quyen' => 'VaiTro-create', 'mo_ta' => 'Tạo vai trò'],
            ['quyen' => 'VaiTro-update', 'mo_ta' => 'Sửa vai trò'],
            ['quyen' => 'VaiTro-delete', 'mo_ta' => 'Xóa vai trò'],
            ['quyen' => 'VaiTro-read', 'mo_ta' => 'Xóa vai trò'],

            //Mã giảm giá
            ['quyen' => 'MaGiamGia-create', 'mo_ta' => 'Tạo mã giảm giá'],
            ['quyen' => 'MaGiamGia-update', 'mo_ta' => 'Sửa mã giảm giá'],
            ['quyen' => 'MaGiamGia-delete', 'mo_ta' => 'Xóa mã giảm giá'],
            ['quyen' => 'MaGiamGia-read', 'mo_ta' => 'Xem mã giảm giá'],

            //Tin tức
            ['quyen' => 'TinTuc-create', 'mo_ta' => 'Tạo tin tức'],
            ['quyen' => 'TinTuc-update', 'mo_ta' => 'Sửa tin tức'],
            ['quyen' => 'TinTuc-delete', 'mo_ta' => 'Xóa tin tức'],
            ['quyen' => 'TinTuc-read', 'mo_ta' => 'Xem tin tức'],
        ];

        DB::table('quyen_han')->insert($permissions);
    }
}
