<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaTranGhe;
use App\Models\PhongChieu;
use App\Models\Ghe;
use App\Models\Rap;
use App\Models\LoaiGhe;

class MaTranGheSeeder extends Seeder
{
    public function run(): void
    {
        $rap = Rap::create(['ten_rap' => 'Rạp CGV', 'dia_chi' => '123 Đường ABC']);
        $loaiGheThuong = LoaiGhe::create(['ten_loai_ghe' => 'Ghế thường']);
        $loaiGheVip = LoaiGhe::create(['ten_loai_ghe' => 'Ghế VIP']);
        $loaiGheDoi = LoaiGhe::create(['ten_loai_ghe' => 'Ghế đôi']);

        // Tạo mẫu sơ đồ ghế 12x12
        $maTranGhe = MaTranGhe::create([
            'ten' => 'Mẫu 12x12',
            'mo_ta' => 'Mẫu sơ đồ ghế 12x12 với 4 hàng thường, 6 hàng VIP, 2 hàng đôi',
            'kich_thuoc' => '12x12',
            'ma_tran' => $this->generateMaTran(12, 12, 4, 6, 2),
            'trang_thai' => 'xuat_ban',
        ]);

        // Tạo phòng chiếu
        $phongChieu = PhongChieu::create([
            'rap_id' => $rap->id,
            'ten_phong' => 'Phòng 1',
            'loai_so_do' => 1,
            'hang_thuong' => 4,
            'hang_doi' => 2,
            'hang_vip' => 6,
            'ma_tran_ghe_id' => $maTranGhe->id,
            'trang_thai' => 'xuat_ban',
        ]);

        // Tạo ghế
        $maTran = $maTranGhe->ma_tran;
        $rows = $maTran['rows'];
        $cols = $maTran['cols'];
        $seatData = $maTran['ma_tran'];

        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $loaiGheId = $seatData[$row][$col];
                $hang = chr(65 + $row);
                $soGhe = $hang . ($col + 1);
                Ghe::create([
                    'phong_id' => $phongChieu->id,
                    'loai_ghe_id' => $loaiGheId,
                    'so_ghe' => $soGhe,
                    'hang' => $hang,
                    'cot' => $col + 1,
                    'trang_thai' => true,
                ]);
            }
        }
    }

    private function generateMaTran($rows, $cols, $hangThuong, $hangVip, $hangDoi)
    {
        $maTran = [];
        for ($i = 0; $i < $rows; $i++) {
            $row = [];
            for ($j = 0; $j < $cols; $j++) {
                if ($i < $hangThuong) {
                    $row[] = LoaiGhe::where('ten_loai_ghe', 'Ghế thường')->first()->id;
                } elseif ($i >= $rows - $hangDoi) {
                    $row[] = LoaiGhe::where('ten_loai_ghe', 'Ghế đôi')->first()->id;
                } else {
                    $row[] = LoaiGhe::where('ten_loai_ghe', 'Ghế VIP')->first()->id;
                }
            }
            $maTran[] = $row;
        }
        return ['rows' => $rows, 'cols' => $cols, 'ma_tran' => $maTran];
    }
}
