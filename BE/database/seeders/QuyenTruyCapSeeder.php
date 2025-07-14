<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuyenTruyCapSeeder extends Seeder
{
    public function run()
    {
        $permissions = DB::table('quyen_han')->pluck('id', 'quyen')->toArray();

        // SUPER ADMIN (id = 99): Toàn quyền
        DB::table('quyen_truy_cap')->insert([
            'vai_tro_id' => 99,
            'quyen_han_id' => $permissions['All'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ADMIN (id = 1): Toàn quyền (trừ quyền quản lý SuperAdmin – sẽ chặn bằng logic)
        DB::table('quyen_truy_cap')->insert([
            'vai_tro_id' => 1,
            'quyen_han_id' => $permissions['All'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // NHÂN VIÊN (id = 3)
        $staffPermissions = [
            'Phim-create', 'Phim-update', 'Phim-delete',
            'Rap-create', 'Rap-update', 'Rap-delete',
            'PhongChieu-create', 'PhongChieu-update', 'PhongChieu-delete',
            'Ve-update', 'Ve-delete',
             'DoAn-create', 'DoAn-update', 'DoAn-delete' // Thêm quản lý đồ ăn
        ];
        foreach ($staffPermissions as $perm) {
            DB::table('quyen_truy_cap')->insert([
                'vai_tro_id' => 3,
                'quyen_han_id' => $permissions[$perm],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // NHÂN VIÊN RẠP (id = 4)
        $theaterStaffPermissions = [
            'PhongChieu-create', 'PhongChieu-update', 'PhongChieu-delete',
            'LichChieu-create', 'LichChieu-update', 'LichChieu-delete',
        ];
        foreach ($theaterStaffPermissions as $perm) {
            DB::table('quyen_truy_cap')->insert([
                'vai_tro_id' => 4,
                'quyen_han_id' => $permissions[$perm],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // USER (id = 2)
        $userPermissions = ['Ve-create', 'DanhGia-create', 'DanhGia-update', 'DanhGia-delete'];
        foreach ($userPermissions as $perm) {
            DB::table('quyen_truy_cap')->insert([
                'vai_tro_id' => 2,
                'quyen_han_id' => $permissions[$perm],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
