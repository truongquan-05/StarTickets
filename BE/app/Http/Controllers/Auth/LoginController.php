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
    public function callback()
{
    try {
         /** @var \Laravel\Socialite\Two\AbstractProvider $provider */
        $provider = Socialite::driver('google');
        $googleUser = $provider->stateless()->user();

        $user = NguoiDung::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'ten' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_token' => $googleUser->token,
                'vai_tro_id' => 1,
                'anh_dai_dien' => $googleUser->getAvatar(),
                'email_da_xac_thuc' => now(),
                'password' => bcrypt(Str::random(16)),
                'so_dien_thoai' => substr(bin2hex(random_bytes(5)), 0, 10),
            ]
        );

        $token = $user->createToken('google-api')->plainTextToken;

        // 🔁 Redirect về FE kèm theo token và user (nếu muốn)
        return redirect()->away(
            'http://localhost:5173/auth/google/callback?' . http_build_query([
                'token' => $token,
                'user' => urlencode(json_encode([
                    'id' => $user->id,
                ]))
            ])
        );
    } catch (\Throwable $th) {
        // Có thể redirect sang FE với thông báo lỗi cũng được
        return redirect()->away(
            'http://localhost:5173/auth/google/callback?error=' . urlencode($th->getMessage())
        );
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
