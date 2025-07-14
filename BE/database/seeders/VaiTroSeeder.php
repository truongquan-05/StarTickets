<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroSeeder extends Seeder
{
    public function run()
    {
        $vaiTros = [
            [ 'id' => 99, 'ten_vai_tro' => 'SuperAdmin' ],
            [ 'id' => 1, 'ten_vai_tro' => 'Admin' ],
            [ 'id' => 2, 'ten_vai_tro' => 'User' ],
            [ 'id' => 3, 'ten_vai_tro' => 'Nhân viên' ],
            [ 'id' => 4, 'ten_vai_tro' => 'Nhân viên rạp' ],
        ];

        foreach ($vaiTros as $vaiTro) {
            DB::table('vai_tro')->updateOrInsert(
                ['id' => $vaiTro['id']],                    // Điều kiện tìm
                ['ten_vai_tro' => $vaiTro['ten_vai_tro']]   // Dữ liệu cập nhật/nếu không có thì thêm
            );
        }
    }
}
