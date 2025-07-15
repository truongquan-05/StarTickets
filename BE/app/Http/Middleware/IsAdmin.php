<?php

namespace App\Http\Middleware;

use App\Models\NguoiDung;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $userId = Auth::guard('sanctum')->id();

        if (!$userId) {
            return response()->json(['message' =>  "Chưa đăng nhập"], 401);
        }

        $nguoiDung = NguoiDung::find($userId);

        if ($nguoiDung && $nguoiDung->vai_tro_id != 2) {
            return $next($request);
        }

        return response()->json(['message' =>  "Không có quyền truy cập"], 403);
    }
}
