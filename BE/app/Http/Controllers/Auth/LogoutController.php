<?php

namespace App\Http\Controllers\Auth;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LogoutController extends Controller
{


    public function logout(Request $request)
    {

        $request->user()->currentAccessToken()->delete();
      

        return response()->json([
            'message' => 'Đăng xuất thành công',
            
        ]);
    }
}
