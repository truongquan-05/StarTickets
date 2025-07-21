<?php

namespace App\Models;

use App\Traits\FilterNhanVienRap;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoAn extends Model
{
    // use SoftDeletes;
    use FilterNhanVienRap;
    protected $table = 'do_an';

    protected $fillable = [
        'ten_do_an',
        'mo_ta',
        'gia_nhap',
        'gia_ban',
        'so_luong_ton',
        'image',
        'rap_id'
    ];
    public function rap()
    {
        return $this->belongsTo(Rap::class, 'rap_id');
    }
}
