<?php

namespace Database\Seeders;

use App\Models\Rap;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rap::create([
            'ten_rap' => 'CGV Vincom',
            'dia_chi' => '123 Đường Láng, Hà Nội',
        ]);

        Rap::create([
            'ten_rap' => 'CGV Royal City',
            'dia_chi' => '456 Nguyễn Trãi, Hà Nội',
        ]);

        Rap::create([
            'ten_rap' => 'Lotte Cinema Landmark',
            'dia_chi' => '789 Keangnam, Hà Nội',
        ]);

        Rap::create([
            'ten_rap' => 'BHD Star Cineplex',
            'dia_chi' => '101 Lê Lợi, TP.HCM',
        ]);

        Rap::create([
            'ten_rap' => 'Galaxy Nguyễn Du',
            'dia_chi' => '321 Nguyễn Du, TP.HCM',
        ]);
    }
}
