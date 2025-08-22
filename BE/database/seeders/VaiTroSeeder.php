<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroSeeder extends Seeder
{
    public function run()
    {
        $vaiTros = [
            ['id' => 99, 'ten_vai_tro' => 'SuperAdmin', 'menu' => 1],
            ['id' => 1, 'ten_vai_tro' => 'Admin', 'menu' => 1],
            ['id' => 2, 'ten_vai_tro' => 'User', 'menu' => null],
            ['id' => 3, 'ten_vai_tro' => 'Nhân viên', 'menu' => 3],
            ['id' => 4, 'ten_vai_tro' => 'Quản lý', 'menu' => 4],
        ];

        foreach ($vaiTros as $vaiTro) {
            DB::table('vai_tro')->updateOrInsert(
                ['id' => $vaiTro['id']],   // Điều kiện tìm
                [
                    'ten_vai_tro' => $vaiTro['ten_vai_tro'],
                    'menu' => $vaiTro['menu']
                ] // Dữ liệu cập nhật/nếu không có thì thêm
            );
        }
    }
}
