<?php

namespace App\Http\Controllers\Client;


use App\Models\CheckGhe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class CheckGheController extends Controller
{


    //LẤY DANH SÁCH GHẾ THEO LỊCH CHIẾU
    //ID LỊCH CHIẾU
    public function show(string $id)
    {
        $dataGhe = CheckGhe::with('Ghe')->where('lich_chieu_id', $id)->get();
        return response()->json([
            'message' => 'Lấy danh sách ghế thành công',
            'data' => $dataGhe
        ]);
    }


    //LẤY DANH SÁCH CHECK GHẾ THEO ID GHẾ
    //ID GHẾ
    public function showAllCheckGhe(string $id)
    {
        $dataGhe = CheckGhe::where('ghe_id', $id)->get();
        return response()->json([
            'message' => 'Lấy danh sách check ghế thành công',
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
            'trang_thai' => $request->trang_thai,
        ]);
        if ($request->trang_thai == 'trong') {
            $dataGhe->update(['nguoi_dung_id' => null]);
        } else {
            $dataGhe->update(['nguoi_dung_id' => $request->nguoi_dung_id]);
        }

        return response()->json([
            'message' => 'Lấy danh sách ghế thành công',
            'data' => $dataGhe
        ]);
    }

    //CẬP NHẬT KHI OUT TRANG
    public function bulkUpdate(Request $request)
    {
        // $data = $request->all();
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        try {
            foreach ($data['data'] as $value) {
                $ghe = CheckGhe::find($value['id']);
                if (!$ghe) {
                    return response()->json([
                        'message' => 'Ghế không tồn tại: ' . $value['id']
                    ], 404);
                }

                $ghe->update(['trang_thai' => 'trong']);
            }

            return response()->json([
                'message' => 'Cập nhật trạng thái ghế thành công',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'ERROR',
            ], 422);
        }
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
