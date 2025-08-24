<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonDoAn extends Model
{
    protected $table = 'don_do_an';
    protected $fillable = [
        'do_an_id',
        'dat_ve_id',
        'gia_ban',
        'so_luong'
    ];
    public function DoAn()
    {
        return $this->belongsTo(DoAn::class, 'do_an_id', 'id');
    }
    public function DatVe(){
        return $this->belongsTo(DatVe::class, 'dat_ve_id','id');
    }
}
