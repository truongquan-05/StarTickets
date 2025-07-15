<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BannerSeeder extends Seeder
{
    public function run()
    {
        DB::table('banners')->insert([
            [
                'title' => 'Khuyến mãi hè 2025',
                'image_url' => 'https://example.com/banner1.jpg',
                'link_url' => 'https://example.com/promotion1',
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(10),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Phim mới: Người Nhện',
                'image_url' => 'https://example.com/banner2.jpg',
                'link_url' => 'https://example.com/movie/spiderman',
                'start_date' => Carbon::now()->subDay(),
                'end_date' => Carbon::now()->addDays(5),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Sắp ra mắt: Fast & Furious 12',
                'image_url' => 'https://example.com/banner3.jpg',
                'link_url' => null,
                'start_date' => null,
                'end_date' => null,
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
