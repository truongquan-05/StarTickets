<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoaiGhe extends Model
{

    public $table = 'loai_ghe';
    protected $fillable = [
        'ten_loai_ghe',
    ];

}
