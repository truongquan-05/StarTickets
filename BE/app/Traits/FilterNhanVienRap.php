<?php

namespace App\Traits;

use App\Models\NhanVienRap;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;


trait FilterNhanVienRap
{
    public function scopeFilterByRap(Builder $query, $relationPath = null): Builder
    {
        $user = Auth::guard('sanctum')->user();

        $data = NhanVienRap::where('vai_tro_id', $user->vai_tro_id)->first();

        if (!$user || in_array($user->vai_tro_id, [1, 3, 4, 99])) {
            return $query; 
        }
        if (!$data) return $query;

        if ($relationPath) {
            $query->whereHas($relationPath, function ($q) use ($data) {
                $q->where('id', $data->rap_id);
            });
        } else {
            $query->where('id', $data->rap_id);
        }

        return $query;
    }
}
