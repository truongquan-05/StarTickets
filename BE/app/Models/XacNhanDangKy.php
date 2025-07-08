<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XacNhanDangKy extends Model
{
    protected $table = 'xac_nhan_dang_ky';

    protected $fillable = [
        'email',
        'ma_xac_nhan',
      
    ];

}
