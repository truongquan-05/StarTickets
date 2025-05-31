<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rap extends Model
{
    protected $table = 'rap';
    protected $fillable = [
        'ten_rap',
        'dia_chi',
        'isDeleted'
    ];
    // public function phongChieus()
    // {
    //     return $this->hasMany(PhongChieu::class, 'rap_id');
    // }
}
