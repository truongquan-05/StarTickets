<?php

namespace App\Http\Controllers\Client;

use App\Models\DatVe;
use Illuminate\Http\Request;
use App\Models\DiemThanhVien;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DiemThuongController extends Controller
{
    public function index()
    {
        $userId = Auth::guard('sanctum')->id();
        $data = DiemThanhVien::where('nguoi_dung_id', $userId)->first();
        if(empty($data)){
            return response()->json([
                'message' => 'Chưa có điểm nào',
            ], 422);
        }
        return response()->json(
            [
                'data' => $data
            ]
        );
    }


    public function checkDiem(Request $request)
    {
        $userId = Auth::guard('sanctum')->id();
        $data = DiemThanhVien::where('nguoi_dung_id', $userId)->first();
        $datVe = DatVe::find($request->input('dat_ve_id'));

        if (empty($request->input('diem'))) {
            $datVe->update(['tong_tien' => $request->input('tong_tien')]);
            return response()->json([
                'message' => 'Hủy dùng điểm',
            ], 200);
        }

        if (!$datVe) {
            return response()->json([
                'message' => 'Có lỗi gì đó!',
                'status' => 404
            ], 404);
        }

        if (!$data) {
            return response()->json([
                'message' => 'Chưa có điểm nào',
            ], 422);
        }

        if ((float)$request->input('diem') > (float)$data->diem) {
            return response()->json([
                'message' => 'Bạn không đủ điểm',
                'status' => 422
            ], 422);
        }

        if ((float)$request->input('diem') > $datVe->tong_tien * 0.7) {
            return response()->json([
                'message' => "Tối đa 70% đơn hàng. Tối đa: $datVe->tong_tien * 0.7",
            ], 422);
        }
        $tongTienNew = $request->input('tong_tien') - (float)$request->input('diem');
        $datVe->update(['tong_tien' => $tongTienNew]);
        $dataDatVe =DatVe::find($request->input('dat_ve_id'));
        return response()->json([
            'message' => 'Thành công',
            'status' => $dataDatVe 
        ], 200);
    }


    // public function update(Request $request, string $id)
    // {
    //     try {
    //         $datVe = DatVe::find($id);
    //         $datVe->update([
    //             'tong_tien' => $request->input('tong_tien')
    //         ]);

    //         return response()->json([
    //             'data' => $datVe,
    //             'message' => 'Voucher đang hoạt động',
    //             'status' => 200
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response()->json([
    //             'error' => $th->getMessage()
    //         ], 404);
    //     }
    // }
}
