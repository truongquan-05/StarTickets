<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ghe;
use Illuminate\Http\Request;

class GheController extends Controller
{
    public function index(Request $request)
    {
        // Lấy tham số từ query string
        $search = $request->query('search'); // Tìm kiếm theo số ghế
        $phongId = $request->query('phong_id'); // Lọc theo phòng chiếu
        $trangThai = $request->query('trang_thai'); // Lọc theo trạng thái (true/false)
        $perPage = $request->query('per_page', 10); // Mặc định 10 bản ghi/trang
        $page = $request->query('page', 1); // Mặc định trang 1

        // Xây dựng query
        $query = Ghe::with('phong', 'loaiGhe');

        // Tìm kiếm theo số ghế
        if ($search) {
            $query->where('so_ghe', 'like', "%{$search}%");
        }

        // Lọc theo phòng chiếu
        if ($phongId) {
            $query->where('phong_id', $phongId);
        }

        // Lọc theo trạng thái
        if (!is_null($trangThai)) {
            $query->where('trang_thai', filter_var($trangThai, FILTER_VALIDATE_BOOLEAN));
        }

        // Phân trang
        $ghes = $query->paginate($perPage, ['*'], 'page', $page);

        // Trả về dữ liệu với metadata phân trang
        return response()->json([
            'data' => $ghes->items(),
            'meta' => [
                'current_page' => $ghes->currentPage(),
                'per_page' => $ghes->perPage(),
                'total' => $ghes->total(),
                'last_page' => $ghes->lastPage(),
            ],
        ], 200);
    }

    //cập nhật trạng thái ghế
    public function update(Request $request, Ghe $ghe)
    {
        $request->validate([
            'trang_thai' => 'required|boolean',
        ]);

        $ghe->update($request->only(['trang_thai']));
        return response()->json([
            'message' => 'Cập nhật trạng thái ghế thành công',
            'data' => $ghe
        ], 200);
    }

    //xử lý thay đổi loại ghế
    public function changeSeatType(Request $request, Ghe $ghe)
    {
        // Kiểm tra trạng thái phòng chiếu
        if ($ghe->phong->trang_thai) {
            return response()->json(['message' => 'Không thể thay đổi loại ghế khi phòng chiếu đã xuất bản'], 400);
        }

        // Validate dữ liệu
        $request->validate([
            'loai_ghe_id' => 'required|exists:loai_ghe,id',
        ], [
            'loai_ghe_id.required' => 'Vui lòng chọn loại ghế',
            'loai_ghe_id.exists' => 'Loại ghế không tồn tại',
        ]);

        // Cập nhật loại ghế
        $ghe->update(['loai_ghe_id' => $request->loai_ghe_id]);

        return response()->json([
            'message' => 'Thay đổi loại ghế thành công',
            'data' => $ghe->load('phong', 'loaiGhe')
        ], 200);
    }
}
