<?php

namespace App\Http\Controllers\Auth;

use App\Models\NguoiDung;
use App\Mail\MaDangKyMail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\XacNhanDangKy;
use Illuminate\Http\JsonResponse;
use App\Jobs\XoaMaXacNhanDangKyJob;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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

            $user = NguoiDung::firstOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'ten' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_token' => $googleUser->token,
                    'vai_tro_id' => 2,
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
        if ($user->trang_thai == 0) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
            ], 422);
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user,

        ]);
    }

    public function register(Request $request)
    {

        $maDangKy = XacNhanDangKy::where('email', $request->email)
            ->where('ma_xac_nhan', $request->ma_xac_nhan)
            ->first();
        if (!$maDangKy) {
            return response()->json([
                'message' => 'Mã xác nhận không hợp lệ hoặc đã hết hạn.',
            ], 422);
        }

        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => 'required|email|unique:nguoi_dung,email',
            'password' => 'required|min:6',
            'ten' => 'required|string|max:255',
            'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung,so_dien_thoai',
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
            'ten.required' => 'Vui lòng nhập họ tên.',
            'ten.string' => 'Họ tên không hợp lệ.',
            'ten.max' => 'Họ tên không được vượt quá :max ký tự.',
            'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
            'so_dien_thoai.max' => 'Số điện thoại không được vượt quá :max ký tự.',
            'so_dien_thoai.unique' => 'Số điện thoại đã được sử dụng.',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = NguoiDung::create([
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'ten' => $request->ten,
            'so_dien_thoai' => $request->so_dien_thoai,
            'vai_tro_id' => 2, // Mặc định là User
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => $data
        ]);
    }

    public function createMaDangKy($email)
    {
        $maXacNhan = rand(100000, 999999);
        $xacNhan = XacNhanDangKy::create([
            'email' => $email,
            'ma_xac_nhan' => $maXacNhan,
        ]);

        Mail::to($email)->send(new MaDangKyMail($maXacNhan));
        XoaMaXacNhanDangKyJob::dispatch($xacNhan->id)->delay(now()->addSeconds(120));
        return response()->json([
            'message' => 'Mã xác nhận đã được gửi đến email của bạn.',
        ]);
    }
}
