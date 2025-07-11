<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\DatVe;
use App\Models\MaGiamGia;
use Illuminate\Http\Request;

class MaGiamGiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        $datVe->update(['tong_tien' => $request->input('tong_tien')]);

        return response()->json([
            'data' => $datVe,
            'message' => 'Voucher đang hoạt động',
            'status' => 200
        ], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
