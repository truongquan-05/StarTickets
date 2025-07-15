<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {
        $user = Auth::guard('sanctum')->user();

        $quyens = DB::table('quyen_truy_cap')
            ->join('quyen_han', 'quyen_truy_cap.quyen_han_id', '=', 'quyen_han.id')
            ->where('quyen_truy_cap.vai_tro_id', $user->vai_tro_id)
            ->pluck('quyen_han.quyen')
            ->toArray();

        if (in_array('All', $quyens) || in_array($permission, $quyens)) {
            return $next($request);
        }

        return response()->json(['message' => 'Không có quyền'], 403);
    }
}
