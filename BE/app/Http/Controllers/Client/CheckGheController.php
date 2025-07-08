<?php

namespace App\Http\Controllers\Client;

use App\Models\CheckGhe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CheckGheController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    //LẤY DANH SÁCH GHẾ THEO LỊCH CHIẾU
    //ID LỊCH CHIẾU
    public function show(string $id)
    {
        $dataGhe = CheckGhe::where('lich_chieu_id', $id)->get();
        return response()->json([
            'message' => 'Lấy danh sách ghế thành công',
            'data' => $dataGhe
        ]);
    }

    //CẬP NHẬT TRẠNG THÁI GHẾ
    //ID CỦA BẢN GHI CHECK_GHE
    public function update(Request $request, string $id)
    {
        $dataGhe = CheckGhe::find($id);
        if ($dataGhe['trang_thai'] == $request->trang_thai) {
            return response()->json([
                'message' => 'Ghế đã có người chọn'
            ], 422);
        }
        if (!$dataGhe) {
            return response()->json([
                'message' => 'Ghế không tồn tại'
            ], 404);
        }
        $dataGhe->update([
            'trang_thai' => $request->trang_thai
        ]);
        return response()->json([
            'message' => 'Lấy danh sách ghế thành công',
            'data' => $dataGhe
        ]);
    }

    //ID LỊCH CHIẾU
    public function destroy(string $id)
    {
        $dataGhe = CheckGhe::where('lich_chieu_id', $id)->get();
        if ($dataGhe->isEmpty()) {
            return response()->json([
                'message' => 'Không có ghế nào để xóa'
            ], 404);
        }
        foreach ($dataGhe as $ghe) {
            $ghe->delete();
        }
    }
}
