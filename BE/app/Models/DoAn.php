<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoAn extends Model
{
    use SoftDeletes;
    protected $table = 'do_an';

    protected $fillable = [
        'ten_do_an',
        'mo_ta',
        'gia',
        'so_luong_ton'
    ];
}
