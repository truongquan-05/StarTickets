<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ghe extends Model
{
    protected $table = 'ghe';
    protected $fillable = ['phong_id', 'loai_ghe_id', 'so_ghe', 'hang', 'cot', 'trang_thai'];
    protected $casts = ['trang_thai' => 'boolean'];

    public function phong()
    {
        return $this->belongsTo(PhongChieu::class, 'phong_id');
    }

    public function loaiGhe()
    {
        return $this->belongsTo(LoaiGhe::class, 'loai_ghe_id');
    }
}
