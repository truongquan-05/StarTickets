<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\DatVe;
use App\Models\MaGiamGia;
use Illuminate\Http\Request;

class MaGiamGiaController extends Controller
{

    public function index()
    {
        $data = MaGiamGia::where('trang_thai', '=', 'KÍCH HOẠT')
            ->where('ngay_bat_dau', '<=', now())
            ->where('ngay_ket_thuc', '>=', now())
            ->whereColumn('so_lan_da_su_dung', '<', 'so_lan_su_dung')
            ->orderByDesc('id')
            ->get();
        return response()->json(
            [
                'data' => $data
            ]
        );
    }


    public function checkVoucher(Request $request)
    {
        $id = $request->input('id');
        $data = MaGiamGia::find($id);
        $datVe = DatVe::find($request->input('dat_ve_id'));
        if (!$datVe) {
            return response()->json([
                'message' => 'Có lỗi gì đó!',
                'status' => 404
            ], 404);
        }

        if (!$data) {
            return response()->json([
                'message' => 'Voucher không tồn tại',
                'status' => 404
            ], 404);
        }
        if ($data->so_lan_da_su_dung >= $data->so_lan_su_dung) {
            return response()->json([
                'message' => 'Voucher đã hết lượt sử dụng',
                'status' => 422
            ], 422);
        }

        if ($data->gia_tri_don_hang_toi_thieu > $datVe->tong_tien) {
            return response()->json([
                'message' => 'Voucher không đủ điều kiện sử dụng',
                'status' => 422
            ], 422);
        }
        $tongTienNew = $datVe->tong_tien - $request->input('tien_voucher');
        if ($request->input('tien_voucher') > $data->giam_toi_da) {
            $tongTienNew = $datVe->tong_tien - $data->giam_toi_da;
        }
        $datVe->update(['tong_tien' => $tongTienNew]);

        $voucher = MaGiamGia::find($request['id']);
        $voucher->update(['so_lan_da_su_dung' => $voucher->so_lan_da_su_dung + 1]);

        return response()->json([
            'data' => $datVe,
            'message' => 'Voucher đang hoạt động',
            'status' => 200,
            'voucher' => $tongTienNew
        ], 200);
    }


    public function destroy(Request $request, string $id)
    {
        try {
            $voucher = MaGiamGia::find($request['ma_giam_gia_id']);
            $voucher->update(['so_lan_da_su_dung' => $voucher->so_lan_da_su_dung - 1]);
            $datVe = DatVe::find($id);

            $tongTienNew = $datVe->tong_tien + $request->input('tien_voucher');
            if ($request->input('tien_voucher') > $voucher->giam_toi_da) {
                $tongTienNew = $datVe->tong_tien + $voucher->giam_toi_da;
            }

            $datVe->update([
                'tong_tien' => $tongTienNew
            ]);

            return response()->json([
                'data' => $datVe,
                'message' => 'Hủy thành công',
                'status' => 200
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage()
            ], 404);
        }
    }
}
