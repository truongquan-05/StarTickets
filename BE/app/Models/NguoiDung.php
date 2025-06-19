<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;


class NguoiDung extends Model
{
  use HasFactory;
  use HasApiTokens, Notifiable;
  protected $table = 'nguoi_dung';
  protected $fillable = [
    'ten',
    'email',
    'so_dien_thoai',
    'password',
    'google_id',
    'anh_dai_dien',
    'email_da_xac_thuc',
    'trang_thai',
    'vai_tro_id',
  ];
  protected $hidden = [
    'password',
    'access_token',
  ];
  public function vaitro()
  {
    return $this->belongsTo(VaiTro::class, 'vai_tro_id', 'id');
  }
}
