<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class NguoiDung extends Model
{
  /** @use HasFactory<\Database\Factories\NguoiDungFactory> */
  use HasFactory;
  use HasApiTokens, Notifiable;
  protected $table = 'nguoi_dung';
}
