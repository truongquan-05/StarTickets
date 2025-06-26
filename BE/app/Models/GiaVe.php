<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiaVe extends Model
{
    protected $table = 'gia_ve';
    protected $fillable = [
        'lich_chieu_id',
        'loai_ghe_id',
        'gia_ve'
    ];
}
