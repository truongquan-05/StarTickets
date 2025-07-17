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

        if (empty($data)) {
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
        $userPoints = DiemThanhVien::where('nguoi_dung_id', $userId)->first();
        $datVe = DatVe::find($request->input('dat_ve_id'));

        // Kiểm tra dữ liệu cơ bản
        if (!$userPoints) {
            return response()->json([
                'message' => 'Bạn chưa có điểm thành viên nào.',
            ], 404); // Dùng 404 nếu không tìm thấy resource điểm
        }

        if (!$datVe) {
            return response()->json([
                'message' => 'Không tìm thấy đơn đặt vé.',
            ], 404);
        }

        $diemMuonDung = (float)$request->input('diem', 0); // Lấy điểm muốn dùng, mặc định là 0 nếu rỗng
        $diemCu = (float)$request->input('diemCu', 0); // Lấy điểm cũ, mặc định là 0 nếu rỗng


        if ($diemCu > 0) {
            $userPoints->diem += $diemCu;
            $userPoints->save(); // Cập nhật ngay điểm của thành viên
        }

        if ($diemMuonDung <= 0) {

            $datVe->tong_tien = $datVe->tong_tien + $diemCu;
            $datVe->save();

            return response()->json([
                'message' => 'Đã hủy áp dụng điểm thành công.',
                'current_total_price' => $datVe->tong_tien // Trả về tổng tiền đã cập nhật
            ], 200);
        }

        // --- Bước 3: Xử lý trường hợp ÁP DỤNG điểm mới ---

        if ($diemMuonDung > $userPoints->diem) {
            if ($diemCu > 0) {
                $datVe->tong_tien = $datVe->tong_tien + $diemCu;
                $datVe->save();
            }
            return response()->json([
                'message' => 'Bạn không đủ điểm để sử dụng.',
                'current_available_points' => $userPoints->diem
            ], 422);
        }

        $maxDiemAllowed = $datVe->tong_tien * 0.7;
        if ($diemMuonDung > $maxDiemAllowed) {
            return response()->json([
                'message' => "Số điểm tối đa được áp dụng là 70% giá trị đơn hàng. Tối đa: " . (float)$maxDiemAllowed . " điểm.",
                'max_points_allowed' => (float)$maxDiemAllowed
            ], 422);
        }

        // Nếu mọi thứ hợp lệ, tiến hành áp dụng điểm
        $tongTienMoi = $datVe->tong_tien - $diemMuonDung + $diemCu;
        $datVe->tong_tien = $tongTienMoi;
        $datVe->save();

        $userPoints->diem -= $diemMuonDung;
        $userPoints->save();
        return response()->json([
            'message' => 'Áp dụng điểm thành công.',
            'current_total_price' => $datVe->tong_tien,
            'remaining_points' => $userPoints->diem
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
