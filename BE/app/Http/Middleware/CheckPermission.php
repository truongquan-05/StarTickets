<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\QuyenTruyCap;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {
        $user = Auth::guard('sanctum')->user();

        $vaiTroId = $user->vai_tro_id;

        $quyens = Cache::remember("permissions_for_role_{$vaiTroId}", 60, function () use ($vaiTroId) {
            return QuyenTruyCap::where('vai_tro_id', $vaiTroId)
                ->join('quyen_han', 'quyen_truy_cap.quyen_han_id', '=', 'quyen_han.id')
                ->pluck('quyen_han.quyen')
                ->toArray();
        });

        if (in_array('All', $quyens) || in_array($permission, $quyens)) {
            return $next($request);
        }

        return response()->json(['message' => 'Không có quyền'], 403);
    }
}
