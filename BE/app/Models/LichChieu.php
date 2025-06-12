<?php

namespace App\Models;

use App\Models\Phim;
use App\Models\Phongchieu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class LichChieu extends Model
{
    use SoftDeletes;
    protected $table = 'lich_chieu';
    protected $fillable = [
        'phim_id',
        'phong_id',
        'gio_chieu',
        'gio_ket_thuc',
    ];

    public function phim()
    {
        return $this->belongsTo(Phim::class, 'phim_id');
    }
    public function phong_chieu()
    {
        return $this->belongsTo(Phongchieu::class, 'phong_id');
    }
}
