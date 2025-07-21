<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NhanVienRap extends Model
{
    protected $table = 'nhan_vien_rap';

    protected $fillable = [
        'vai_tro_id',
        'rap_id',
    ];

    public function rap()
    {
        return $this->belongsTo(Rap::class, 'rap_id');
    }
    public function vaiTro()
    {
        return $this->belongsTo(VaiTro::class, 'vai_tro_id');
    }
}
