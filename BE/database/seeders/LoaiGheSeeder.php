<?php 
namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class LoaiGheSeeder extends Seeder
{
    public function run()
    {
        DB::table('loai_ghe')->insert([
            ['ten_loai_ghe' => 'Thường'],
            ['ten_loai_ghe' => 'Vip'],
            ['ten_loai_ghe' => 'Đôi'],
        ]);
    }
}
