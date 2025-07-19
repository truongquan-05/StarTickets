<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatLaiMatKhau extends Model
{
    protected $table = 'dat_lai_mat_khau';
    protected $fillable = ['email', 'token'];
}
