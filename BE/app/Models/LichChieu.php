<?php

namespace App\Models;

use App\Models\Phim;
use App\Models\ChuyenNgu;
use App\Models\Phongchieu;
use App\Traits\FilterNhanVienRap;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;


class LichChieu extends Model
{
    // use SoftDeletes;
    protected $table = 'lich_chieu';
    use FilterNhanVienRap;
    protected $fillable = [
        'phim_id',
        'phong_id',
        'chuyen_ngu_id',
        'gio_chieu',
        'gio_ket_thuc'
    ];

    public function phim()
    {
        return $this->belongsTo(Phim::class, 'phim_id');
    }
    public function phong_chieu()
    {
        return $this->belongsTo(Phongchieu::class, 'phong_id');
    }
    public function chuyenngu()
    {
        return $this->belongsTo(ChuyenNgu::class, 'chuyen_ngu_id');
    }
    //QUAN HỆ NHIỀU NHIỀU VỚI BẢNG GIA_VE
    public function giaVe()
    {
        return $this->belongsToMany(LoaiGhe::class, 'gia_ve', 'lich_chieu_id', 'loai_ghe_id')
            ->withPivot('id', 'gia_ve');
    }
}
