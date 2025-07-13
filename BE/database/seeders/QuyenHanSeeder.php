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

            // Quản lý rạp
            ['quyen' => 'Rap-create', 'mo_ta' => 'Thêm rạp'],
            ['quyen' => 'Rap-update', 'mo_ta' => 'Sửa rạp'],
            ['quyen' => 'Rap-delete', 'mo_ta' => 'Xóa rạp'],

            // Quản lý phòng chiếu
            ['quyen' => 'PhongChieu-create', 'mo_ta' => 'Thêm phòng chiếu'],
            ['quyen' => 'PhongChieu-update', 'mo_ta' => 'Sửa phòng chiếu'],
            ['quyen' => 'PhongChieu-delete', 'mo_ta' => 'Xóa phòng chiếu'],

            // Lịch chiếu
            ['quyen' => 'LichChieu-create', 'mo_ta' => 'Thêm lịch chiếu'],
            ['quyen' => 'LichChieu-update', 'mo_ta' => 'Sửa lịch chiếu'],
            ['quyen' => 'LichChieu-delete', 'mo_ta' => 'Xóa lịch chiếu'],

            // Vé
            ['quyen' => 'Ve-create', 'mo_ta' => 'Đặt vé'],
            ['quyen' => 'Ve-update', 'mo_ta' => 'Cập nhật vé'],
            ['quyen' => 'Ve-delete', 'mo_ta' => 'Hủy vé'],

            // Đánh giá
            ['quyen' => 'DanhGia-create', 'mo_ta' => 'Tạo đánh giá'],
            ['quyen' => 'DanhGia-update', 'mo_ta' => 'Sửa đánh giá'],
            ['quyen' => 'DanhGia-delete', 'mo_ta' => 'Xóa đánh giá'],

            //Tài khoản
            ['quyen' => 'TaiKhoan-create', 'mo_ta' => 'Tạo tài khoản'],
            ['quyen' => 'TaiKhoan-update', 'mo_ta' => 'Sửa tài khoản'],
            ['quyen' => 'TaiKhoan-delete', 'mo_ta' => 'Xóa tài khoản'],

            //Đồ ăn
            ['quyen' => 'DoAn-create', 'mo_ta' => 'Tạo đồ ăn'],
            ['quyen' => 'DoAn-update', 'mo_ta' => 'Sửa đồ ăn'],
            ['quyen' => 'DoAn-delete', 'mo_ta' => 'Xóa đồ ăn'],
        ];

        DB::table('quyen_han')->insert($permissions);
    }
}
