<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuyenHan extends Model
{
     protected $table = 'quyen_han';
    protected $fillable = [
        'quyen',
        'mo_ta'
    ];
}
