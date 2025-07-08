<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaiTroSeeder extends Seeder
{
    public function run()
    {
        DB::table('vai_tro')->insert([
            [
                'id' => 2,
                'ten_vai_tro' => 'User', 
            ],
            [
                'id' => 1,
                'ten_vai_tro' => 'Admin', // hoặc tên vai trò phù hợp
            ]
        ]);
    }
}