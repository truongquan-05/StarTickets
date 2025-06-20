<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TheLoaiSeeder extends Seeder
{
    public function run()
    {
        DB::table('the_loai')->insert([
            ['id' => 1, 'ten_the_loai' => 'Hành động'],
            ['id' => 2, 'ten_the_loai' => 'Tình cảm'],
            ['id' => 3, 'ten_the_loai' => 'Hài'],
            ['id' => 4, 'ten_the_loai' => 'Kinh dị'],
            ['id' => 5, 'ten_the_loai' => 'Hoạt hình'],
        ]);
    }
}