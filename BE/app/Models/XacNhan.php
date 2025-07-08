<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XacNhan extends Model
{
    protected $table = 'xac_nhan';

    protected $fillable = [
        'nguoi_dung_id',
        'ma_xac_nhan',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
    }
}
