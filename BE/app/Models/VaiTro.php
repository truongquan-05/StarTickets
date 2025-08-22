<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VaiTro extends Model
{
    public $table = 'vai_tro';

    protected $fillable = [
        'ten_vai_tro',
        'mo_ta',
        'menu'
    ];
    public function QuyenTruyCap()
    {
        return $this->belongsToMany(QuyenHan::class, 'quyen_truy_cap', 'vai_tro_id', 'quyen_han_id')
                ->withPivot('id');
    }
}
