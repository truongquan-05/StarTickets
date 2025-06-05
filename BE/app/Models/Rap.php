<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rap extends Model
{
    use SoftDeletes;

    protected $table = 'rap';

    protected $fillable = [
        'ten_rap',
        'dia_chi',
    ];

    public function phongChieus()
    {
        return $this->hasMany(PhongChieu::class, 'rap_id');
    }
}
