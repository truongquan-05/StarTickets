<?php

namespace App\Http\Controllers\API;

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

    public function update(Request $request, Ghe $ghe)
    {
        $request->validate([
            'trang_thai' => 'required|boolean',
        ]);

        $ghe->update($request->only(['trang_thai']));
        return response()->json($ghe, 200);
    }

    public function destroy(Ghe $ghe)
    {
        $ghe->update(['trang_thai' => false]);
        return response()->json(['message' => 'Ghế đã được đánh dấu là hỏng'], 200);
    }
}
