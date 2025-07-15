<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuyenTruyCap extends Model
{
    protected $table = 'quyen_truy_cap';
    protected $fillable = [
        'vai_tro_id',
        'quyen_han_id'
    ];
}
