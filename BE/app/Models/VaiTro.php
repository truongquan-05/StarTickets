<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaiTro extends Model
{
    public $table = 'vai_tro';
    protected $fillable = [
        'ten_vai_tro',
        'mo_ta',
    ];
}
