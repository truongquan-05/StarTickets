<?php

namespace App\Http\Controllers\Client;

use App\Models\ThanhToan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LichSuMuaHangController extends Controller

{

    public function lichSu(Request $request)
    {
        $userId = Auth::id();

        $lichSu = ThanhToan::with([
            'datVe.lichChieu.phim',
            'datVe.DatVeChiTiet.GheDat',
            'phuongThucThanhToan',
        ])
            ->where('nguoi_dung_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $lichSu
        ]);
    }


    public function show(Request $request, $id)
    {
        $userId = Auth::id();

        $thanhToan = ThanhToan::with([
            'datVe.lichChieu.phim',
            'datVe.DatVeChiTiet.GheDat',
            'phuongThucThanhToan',
        ])
            ->where('id', $id)
            ->where('nguoi_dung_id', $userId) // lau ve cua chinh nguoi dung
            ->first();

        if (!$thanhToan) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy giao dịch.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $thanhToan
        ]);
    }
}
