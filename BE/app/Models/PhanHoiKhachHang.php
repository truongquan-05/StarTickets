<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhanHoiKhachHang extends Model
{
    protected $table ='phan_hoi_khach_hang';
    protected $fillable= [
        'ho_ten',
        'email',
        'so_dien_thoai',
        'noi_dung',
            'trang_thai',
    ];
}
