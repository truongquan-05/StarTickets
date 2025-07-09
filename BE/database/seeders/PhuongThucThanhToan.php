<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PhuongThucThanhToan extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('phuong_thuc_thanh_toan')->insert([
            [
                'ten' => 'MOMO',
                'nha_cung_cap' => 'MOMO',
                'mo_ta' => 'Ví điện tử MOMO'

            ],
            [
                'ten' => 'VNPAY',
                'nha_cung_cap' => 'VNPAY',
                'mo_ta' => 'Ví điện tử VNPAY'
            ],
        ]);
    }
}
