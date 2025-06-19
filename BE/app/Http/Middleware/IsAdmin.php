<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{

public function handle(Request $request, Closure $next)
{
    $user = $request->user() ;
    // Kiểm tra người dùng đã đăng nhập và có quyền admin  
    if (!$user) {
        return response()->json(['message' => 'Bạn chưa đăng nhập'], 401);
    }
    if ($user->is_admin) {
        return $next($request);
    }
    return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
}
}

