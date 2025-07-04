<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatVeChiTiet extends Model
{
    protected $table = 'dat_ve_chi_tiet';
    protected $fillable = [
        'ghe_id',
        'dat_ve_id',
        'gia_ve',
    ];
    public function GheDat(){
        return $this->belongsTo(Ghe::class, 'ghe_id', 'id');
    }
}
