<?php

namespace App\Http\Controllers\Client;

use App\Models\ThanhToan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LichSuMuaHangController extends Controller

{

    public function index()
    {
        $userId = Auth::guard('sanctum')->id();

        $lichSu = ThanhToan::with([
            'datVe.lichChieu.phim',
            'datVe.lichChieu.phong_chieu.rap',
            'datVe.DatVeChiTiet.GheDat',
            'phuongThuc',
        ])
            ->where('nguoi_dung_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $lichSu
        ]);
    }


    public function show( $id)
    {
        // $userId = Auth::guard('sanctum')->id();

        $lichSu = ThanhToan::with([
            'datVe.lichChieu.phim',
            'datVe.lichChieu.phong_chieu.rap',
            'datVe.DatVeChiTiet.GheDat',
            'phuongThuc',
        ])->find($id);


        if (!$lichSu) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy giao dịch.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $lichSu
        ]);
    }
}
