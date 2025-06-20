<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NguoiDungSeeder extends Seeder
{
public function run()
{
   for ($i = 1; $i <= 10; $i++) {
        DB::table('nguoi_dung')->insert([
            'id' => $i,
            'ten' => 'User '.$i,
            'email' => 'user'.$i.'@example.com',
            'password' => bcrypt('password'),
            'vai_tro_id' => 1, 
        ]);
    }
}
}