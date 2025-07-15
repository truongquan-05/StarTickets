<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdminArea
{
    public function handle(Request $request, Closure $next)
    {
        // $user = $request->user();

        // if (!$user) {
        //     return response()->json(['message' => 'Bạn chưa đăng nhập'], 401);
        // }

        // if (in_array($user->vai_tro_id, [1, 3, 4, 99])) {
        //     return $next($request);
        // }

        // return response()->json(['message' => 'Bạn không có quyền truy cập vào khu vực quản trị'], 403);
    }
}
