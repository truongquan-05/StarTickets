<?php

namespace App\Http\Controllers\Client;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Models\DatLaiMatKhau;
use App\Http\Controllers\Controller;
use App\Jobs\XoaMaQuenMatKhauJob;
use App\Mail\QuenMatKhauMail;
use Illuminate\Support\Facades\Mail;

class QuenMatKhau extends Controller
{

    public function index()
    {
        //
    }


    public function store(Request $request)
    {
        $data = $request->only(['email']);
        $nguoi_dung = NguoiDung::where('email', $data['email'])->first();

        if (!$nguoi_dung) {
            return response()->json(['message' => 'Email không tồn tại'], 404);
        }
        $maXacNhan = rand(100000, 999999);
        Mail::to($data)->send(new QuenMatKhauMail($maXacNhan));
        $dataMa = DatLaiMatKhau::create([
            'email' => $data['email'],
            'token' => $maXacNhan
        ]);

        XoaMaQuenMatKhauJob::dispatch($dataMa->id)->delay(now()->addMinutes(2));

        return response()->json(['message' => 'Mã xác nhận đã được gửi đến email của bạn'], 200);
    }


    public function checkMaXacNhan(Request $request)
    {
        $du_lieu = $request->only(['email', 'token']);
        $data = DatLaiMatKhau::where('token', $du_lieu['token'])
            ->where('email', $du_lieu['email'])
            ->first();

        if (!$data) {
            return response()->json(['message' => 'Mã xác nhận không tồn tại'], 404);
        }

        return response()->json(['message' => 'Mã xác nhận hợp lệ'], 200);
    }


    public function update(Request $request)
    {
        $data = $request->only(['email', 'password', 'token']);
        $token = DatLaiMatKhau::where('token', $data['token'])
            ->where('email', $data['email'])->first();
        if (!$token) {
            return response()->json(['message' => 'Mã xác nhận không hợp lệ'], 404);
        }
        $nguoi_dung = NguoiDung::where('email', $data['email'])->first();
        $nguoi_dung->password = bcrypt($data['password']);
        $nguoi_dung->save();
        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công'], 200);
    }
}
