<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\LoaiGhe;
use App\Models\ChuyenNgu;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            VaiTroSeeder::class,
            TheLoaiSeeder::class,
            LoaiGheSeeder::class,
            RapSeeder::class,
            ChuyenNguSeeder::class,
            PhuongThucThanhToan::class
        ]);
    }
}
