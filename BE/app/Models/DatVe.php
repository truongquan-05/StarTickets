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
    ];


    public function DonDoAn()
    {
        return $this->hasMany(DonDoAn::class, 'dat_ve_id', 'id');
    }

    public function DatVeChiTiet()
    {
        return $this->hasMany(DatVeChiTiet::class, 'dat_ve_id', 'id');
    }
    public function lichChieu() {
    return $this->belongsTo(LichChieu::class, 'lich_chieu_id');
}
}
