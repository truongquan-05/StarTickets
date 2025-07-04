<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThanhToan extends Model
{
    protected $table = 'thanh_toan';
    protected $fillable = [
        'dat_ve_id',
        'phuong_thuc_thanh_toan_id',
        'nguoi_dung_id',
        'ma_giao_dich',
    ];
    public function nguoiDung(){
        return $this ->belongsTo(NguoiDung::class,'nguoi_dung_id');
    }
    public function phuongThuc(){
        return $this ->belongsTo(PhuongThucThanhToan::class,'phuong_thuc_thanh_toan_id');
    }
    public function datVe(){
        return $this ->belongsTo(DatVe::class,'dat_ve_id');
    }
}
