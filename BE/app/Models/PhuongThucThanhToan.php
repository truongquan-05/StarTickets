<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhuongThucThanhToan extends Model
{
    protected $table = 'phuong_thuc_thanh_toan';
    protected $fillable = [
        'ten',
        'mo_ta',
        'nha_cung_cap',
    ];
}
