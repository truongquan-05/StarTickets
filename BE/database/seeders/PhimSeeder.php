<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhimSeeder extends Seeder
{
public function run()
{
    for ($i = 1; $i <= 5; $i++) {
        DB::table('phim')->insert([
            'id' => $i,
            'ten_phim' => 'Phim '.$i,
            'mo_ta' => 'Mô tả phim '.$i,
            'thoi_luong' => 120,
            'trailer' => 'https://youtube.com/trailer'.$i,
            'ngon_ngu' => 'Tiếng Việt',
            'quoc_gia' => 'Việt Nam',
            'anh_poster' => 'poster'.$i.'.jpg',
            'ngay_cong_chieu' => now(),
            'tinh_trang' => 1,
            'do_tuoi_gioi_han' => 13,
            'trang_thai' => 1,
            'the_loai_id' => 1, // Đảm bảo bảng the_loai có id=1
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
}