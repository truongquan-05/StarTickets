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
            ['id' => 6, 'ten_the_loai' => 'Phiêu lưu'],
            ['id' => 7, 'ten_the_loai' => 'Khoa học viễn tưởng'],
            ['id' => 8, 'ten_the_loai' => 'Hồi hộp'],
            ['id' => 9, 'ten_the_loai' => 'Gia đình'],
            ['id' => 10, 'ten_the_loai' => 'Âm nhạc / Nhạc kịch'],
            ['id' => 11, 'ten_the_loai' => 'Tài liệu'],
            ['id' => 12, 'ten_the_loai' => 'Chiến tranh'],
            ['id' => 13, 'ten_the_loai' => 'Lịch sử'],
            ['id' => 14, 'ten_the_loai' => 'Huyền bí / Siêu nhiên'],
            ['id' => 15, 'ten_the_loai' => 'Tội phạm / Hình sự'],
            ['id' => 16, 'ten_the_loai' => 'Thể thao'],
            ['id' => 17, 'ten_the_loai' => 'Tình huống'],
            ['id' => 18, 'ten_the_loai' => 'Truyền hình'],
            ['id' => 19, 'ten_the_loai' => 'Phim ngắn'],
            ['id' => 20, 'ten_the_loai' => 'Khác'],
        ]);
    }
}
