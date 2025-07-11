<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
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

    public function checkVoucher($id)
    {
        $data = MaGiamGia::find($id);
        if ($data->so_lan_da_su_dung >= $data->so_lan_su_dung) {
            return response()->json([
                'message' => 'Voucher đã hết lượt sử dụng',
                'status' => 422
            ], 422);
        }
        return response()->json([
            'data' => $data
        ]);
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
