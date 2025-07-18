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
    public function quyenTruyCap()
    {
        return $this->hasMany(QuyenTruyCap::class, 'quyen_han_id', 'id');
    }
}
