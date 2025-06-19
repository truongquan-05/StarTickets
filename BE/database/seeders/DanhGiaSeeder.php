<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DanhGia;

class DanhGiaSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'nguoi_dung_id' => 1,
                'phim_id' => 1,
                'so_sao' => 5,
                'noi_dung' => 'Phim rất hay và cảm động!',
            ],
            [
                'nguoi_dung_id' => 2,
                'phim_id' => 1,
                'so_sao' => 4,
                'noi_dung' => 'Kịch bản tốt, diễn xuất ổn.',
            ],
            [
                'nguoi_dung_id' => 3,
                'phim_id' => 2,
                'so_sao' => 3,
                'noi_dung' => 'Phim xem được, nhưng hơi dài.',
            ],
            [
                'nguoi_dung_id' => 4,
                'phim_id' => 2,
                'so_sao' => 5,
                'noi_dung' => 'Xuất sắc, đáng xem lại!',
            ],
            [
                'nguoi_dung_id' => 5,
                'phim_id' => 3,
                'so_sao' => 2,
                'noi_dung' => 'Không hợp gu của mình.',
            ],
            [
                'nguoi_dung_id' => 6,
                'phim_id' => 3,
                'so_sao' => 4,
                'noi_dung' => 'Hình ảnh đẹp, âm nhạc hay.',
            ],
            [
                'nguoi_dung_id' => 7,
                'phim_id' => 4,
                'so_sao' => 5,
                'noi_dung' => 'Cốt truyện hấp dẫn.',
            ],
            [
                'nguoi_dung_id' => 8,
                'phim_id' => 4,
                'so_sao' => 3,
                'noi_dung' => 'Tạm ổn, chưa thực sự nổi bật.',
            ],
            [
                'nguoi_dung_id' => 9,
                'phim_id' => 5,
                'so_sao' => 4,
                'noi_dung' => 'Diễn viên diễn rất tốt.',
            ],
            [
                'nguoi_dung_id' => 10,
                'phim_id' => 5,
                'so_sao' => 5,
                'noi_dung' => 'Phim tuyệt vời, sẽ giới thiệu bạn bè.',
            ],
        ];

        foreach ($data as $item) {
            DanhGia::create($item);
        }
    }
}