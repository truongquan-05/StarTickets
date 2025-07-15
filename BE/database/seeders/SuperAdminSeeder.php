<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        DB::table('nguoi_dung')->updateOrInsert(
            ['email' => 'superadmin@example.com'],
            [
                'ten' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('12345678'), // Mật khẩu đăng nhập
                'so_dien_thoai' => '0999999999',
                'google_id' => null,
                'anh_dai_dien' => null,
                'email_da_xac_thuc' => now(),
                'trang_thai' => 1,
                'vai_tro_id' => 99, 
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
