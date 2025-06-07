<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaGiamGia extends Model
{
    protected $table = 'ma_giam_gia';

    protected $fillable = [
        'ma',
        'loai_giam_gia',
        'gia_tri_giam',
        'giam_toi_da',
        'gia_tri_don_hang_toi_thieu',
        'dieu_kien',
        'ngay_bat_dau',
        'han_su_dung',
        'so_lan_su_dung',
        'so_lan_da_su_dung',
        'trang_thai',
    ];

    protected $casts = [
        'dieu_kien' => 'array',
        'ngay_bat_dau' => 'date',
        'han_su_dung' => 'date',
    ];
}
