<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThanhToan extends Model
{
    protected $table = 'thanh_toan';
    protected $fillable = [
        'dat_ve_id',
        'phuong_thuc_thanh_toan_id',
        'nguoi_dung_id',
        'ma_giao_dich',
    ];
}
