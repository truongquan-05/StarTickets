<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckGhe extends Model
{
    protected $table = 'check_ghes';

    protected $fillable = [
        'lich_chieu_id',
        'ghe_id',
        'nguoi_dung_id', // NULL DEFAULT
        'trang_thai',
    ];

    public function Ghe(){
        return $this->belongsTo(Ghe::class, 'ghe_id', 'id');
    }
}
