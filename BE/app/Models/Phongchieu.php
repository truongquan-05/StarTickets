<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhongChieu extends Model
{
    use SoftDeletes;

    protected $table = 'phong_chieu';
    protected $fillable = ['rap_id', 'ten_phong', 'loai_so_do', 'hang_thuong', 'hang_doi', 'hang_vip', 'ma_tran_ghe_id', 'trang_thai'];
    protected $dates = ['deleted_at'];
    protected $casts = ['trang_thai' => 'string'];

    public function rap()
    {
        return $this->belongsTo(Rap::class, 'rap_id');
    }

    public function ghes()
    {
        return $this->hasMany(Ghe::class, 'phong_id');
    }
}
