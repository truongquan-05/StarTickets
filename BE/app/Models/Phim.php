<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Phim extends Model
{
    use SoftDeletes;
    protected $table = 'phim';
    protected $fillable = [
        'ten_phim',
        'mo_ta',
        'thoi_luong',
        'trailer',
        'ngon_ngu',
        'quoc_gia',
        'anh_poster',
        'ngay_cong_chieu',
        'ngay_ket_thuc',
        'do_tuoi_gioi_han',
        'trang_thai_phim',
        'the_loai_id'
    ];

    // protected $dates = ['deleted_at', 'ngay_cong_chieu'];
    public function theLoai()
    {
        return $this->belongsTo(TheLoai::class, 'the_loai_id');
    }

    public function lichChieu(){
        return $this->hasMany(LichChieu::class,'phim_id');
    }
}
