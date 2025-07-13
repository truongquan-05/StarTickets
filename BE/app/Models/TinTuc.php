<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TinTuc extends Model
{
    use HasFactory;

    protected $table = 'tin_tuc';

    protected $fillable = [
        'tieu_de',
        'noi_dung',
        'hinh_anh'
    ];

    protected $dates = [
        'deleted_at'
    ];
}
