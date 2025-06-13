<?php 
namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ChuyenNguSeeder extends Seeder
{
    public function run()
    {
        DB::table('chuyen_ngu')->insert([
            ['the_loai' => 'Phụ đề'],
            ['the_loai' => 'Lồng tiếng'],
            ['the_loai' => 'Thuyết minh'],
        ]);
    }
}
