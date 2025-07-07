<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiemThanhVien extends Model
{
    protected $table = 'diem_thanh_vien';
    protected $fillable = [
        'nguoi_dung_id',
        'diem'
    ];
}
