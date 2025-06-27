<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatVe extends Model
{
    protected $table = 'dat_ve';
    protected $fillable = [
        'nguoi_dung_id',
        'lich_chieu_id',
        'tong_tien',
        'trang_thai',
    ];
}
