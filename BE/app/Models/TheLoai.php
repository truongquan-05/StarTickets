<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TheLoai extends Model
{
    use SoftDeletes;

    protected $table = 'the_loai';
    protected $fillable = ['ten_the_loai'];

    protected $dates = ['deleted_at'];

    public function phims()
    {
        return $this->hasMany(Phim::class, 'the_loai_id');
    }
}