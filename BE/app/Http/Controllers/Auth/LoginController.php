<?php

namespace App\Http\Controllers\Auth;

use App\Models\NguoiDung;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /**
     * Lấy URL để frontend redirect đến trang đăng nhập Google
     */
    public function redirect(): JsonResponse
    {
        /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
        $provider = Socialite::driver('google');

        $url = $provider->stateless()->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    /**
     * Xử lý callback từ Google sau khi người dùng đăng nhập
     */
    public function callback(): JsonResponse
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->user();


            // Tìm hoặc tạo user
            $user = NguoiDung::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'ten' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_token' => $googleUser->token,
                    'vai_tro_id' => 1,
                    'anh_dai_dien' => $googleUser->getAvatar(),
                    'email_da_xac_thuc' => date('Y-m-d H:i:s'),
                    'password' => bcrypt(Str::random(16)),
                ]
            );

            // Tạo token API (nếu dùng Sanctum)
            $token = $user->createToken('google-api')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'user' => $user,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Đăng nhập thất bại',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = NguoiDung::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user,
            
        ]);
    }
}
