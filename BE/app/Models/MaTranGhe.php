<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaTranGhe extends Model
{
    protected $table = 'ma_tran_ghe';
    protected $fillable = ['ten', 'mo_ta', 'ma_tran', 'kich_thuoc', 'trang_thai'];
    protected $casts = [
        'ma_tran' => 'array',
        'trang_thai' => 'string',
    ];

    public function phongChieus()
    {
        return $this->hasMany(PhongChieu::class, 'ma_tran_ghe_id');
    }
}
