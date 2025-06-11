<?php

namespace App\Http\Controllers\Admin;

use App\Models\Ghe;
use App\Models\PhongChieu;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PhongChieuController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $rapId = $request->query('rap_id');
        $trangThai = $request->query('trang_thai');
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);

        $query = PhongChieu::with('ghes', 'rap')->whereNull('deleted_at');

        if ($search) {
            $query->where('ten_phong', 'like', "%{$search}%");
        }

        if ($rapId) {
            $query->where('rap_id', $rapId);
        }

        if ($trangThai !== null) {
            $query->where('trang_thai', $trangThai);
        }

        $phongChieus = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $phongChieus->items(),
            'meta' => [
                'current_page' => $phongChieus->currentPage(),
                'per_page' => $phongChieus->perPage(),
                'total' => $phongChieus->total(),
                'last_page' => $phongChieus->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rap_id' => 'required|exists:rap,id',
            'ten_phong' => 'required|string|max:100',
            'loai_so_do' => ['required', 'string', 'regex:/^\d+x\d+$/'], // Ví dụ: "8x8", "12x12"
            'hang_thuong' => 'required|integer|min:0',
            'hang_doi' => 'required|integer|min:0',
            'hang_vip' => 'required|integer|min:0',
            'trang_thai' => 'required|boolean',
        ]);

        // Tách loai_so_do thành số hàng và cột
        [$rows, $cols] = array_map('intval', explode('x', $request->loai_so_do));

        // Kiểm tra tính hợp lệ của loai_so_do
        if ($rows < 1 || $cols < 1) {
            return response()->json(['message' => 'Loại sơ đồ không hợp lệ'], 400);
        }

        // Kiểm tra tổng số hàng
        $totalRows = $request->hang_thuong + $request->hang_doi + $request->hang_vip;
        if ($totalRows > $rows) {
            return response()->json(['message' => 'Tổng số hàng vượt quá số hàng của sơ đồ'], 400);
        }

        $phongChieu = PhongChieu::create([
            'rap_id' => $request->rap_id,
            'ten_phong' => $request->ten_phong,
            'loai_so_do' => $request->loai_so_do,
            'hang_thuong' => $request->hang_thuong,
            'hang_doi' => $request->hang_doi,
            'hang_vip' => $request->hang_vip,
            'trang_thai' => $request->trang_thai,
        ]);

        // Tạo ghế tự động
        $this->createSeats($phongChieu, $rows, $cols, $request->hang_thuong, $request->hang_vip, $request->hang_doi);

        return response()->json($phongChieu->load('ghes', 'rap'), 201);
    }

    public function show(PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu không tồn tại'], 404);
        }
        return response()->json($phongChieu->load('ghes', 'rap'), 200);
    }

    public function update(Request $request, PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu không tồn tại'], 404);
        }


        if ($phongChieu->trang_thai == true) {
            // Chỉ cho phép đổi trang_thai thành false
            $request->validate([
                'trang_thai' => 'required|boolean',
            ],  [
                'trang_thai.required' => 'Trạng thái là bắt buộc',
            ]);

            if ($request->trang_thai == false) {
                $phongChieu->update(['trang_thai' => false]);
                return response()->json($phongChieu->load('ghes', 'rap'), 200);
            }

            return response()->json(['message' => 'Không thể sửa phòng đã xuất bản'], 400);
        }

        // Khi trạng thái là nháp, cho phép sửa tất cả
        $request->validate([
            'rap_id' => 'required|exists:rap,id',
            'ten_phong' => 'required|string|max:100',
            'loai_so_do' => ['required', 'string', 'regex:/^\d+x\d+$/'],
            'hang_thuong' => 'required|integer|min:0',
            'hang_doi' => 'required|integer|min:0',
            'hang_vip' => 'required|integer|min:0',
            'trang_thai' => 'required|boolean',
        ]);

        [$rows, $cols] = array_map('intval', explode('x', $request->loai_so_do));
        if ($rows < 1 || $cols < 1) {
            return response()->json(['message' => 'Sơ đồ không hợp lệ'], 400);
        }

        $totalRows = $request->hang_thuong + $request->hang_doi + $request->hang_vip;
        if ($totalRows > $rows) {
            return response()->json(['message' => 'Tổng số hàng vượt quá sơ đồ'], 400);
        } elseif ($totalRows < $rows) {
            return response()->json(['message' => 'Tổng số hàng không đủ'], 400);
        }

        if (
            $phongChieu->loai_so_do !== $request->loai_so_do ||
            $phongChieu->hang_thuong !== $request->hang_thuong ||
            $phongChieu->hang_vip !== $request->hang_vip ||
            $phongChieu->hang_doi !== $request->hang_doi
        ) {
            $phongChieu->ghes()->delete();
            $this->createSeats($phongChieu, $rows, $cols, $request->hang_thuong, $request->hang_vip, $request->hang_doi);
        }

        $phongChieu->update([
            'rap_id' => $request->rap_id,
            'ten_phong' => $request->ten_phong,
            'loai_so_do' => $request->loai_so_do,
            'hang_thuong' => $request->hang_thuong,
            'hang_doi' => $request->hang_doi,
            'hang_vip' => $request->hang_vip,
            'trang_thai' => $request->trang_thai,
        ]);

        return response()->json($phongChieu->load('ghes', 'rap'), 200);
    }

    public function destroy(PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu đã bị xóa'], 400);
        }
        $phongChieu->delete();
        return response()->json(['message' => 'Phòng chiếu đã được xóa mềm'], 200);
    }
    public function restore($id)
    {
        $phongChieu = PhongChieu::onlyTrashed()->findOrFail($id);
        $phongChieu->restore();

        return response()->json([
            'message' => 'Phòng chiếu đã được khôi phục',
            'data' => $phongChieu->load('ghes', 'rap')
        ], 200);
    }

    // Lây danh sách phòng chiếu đã xóa mềm
    public function trashed(Request $request)
    {
        $query = PhongChieu::onlyTrashed()->with('rap');

        //  Lọc theo tên phòng (tìm kiếm gần đúng)
        if ($request->filled('ten_phong')) {
            $query->where('ten_phong', 'like', '%' . $request->ten_phong . '%');
        }

        //  Lọc theo rạp
        if ($request->filled('rap_id')) {
            $query->where('rap_id', $request->rap_id);
        }

        //Lọc theo trạng thái
        if ($request->filled('trang_thai')) {
            $query->where('trang_thai', $request->trang_thai);
        }

        // Phân trang (mặc định 10)
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $result = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($result, 200);
    }



    public function forceDelete($id)
    {
        $phongChieu = PhongChieu::withTrashed()->find($id);

        if (!$phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu chưa bị xóa mềm'], 400);
        }

        $phongChieu->ghes()->forceDelete(); // Xóa vĩnh viễn ghế
        $phongChieu->forceDelete(); // Xóa vĩnh viễn phòng chiếu

        return response()->json(['message' => 'Phòng chiếu đã được xóa vĩnh viễn'], 200);
    }



    private function createSeats($phongChieu, $rows, $cols, $hangThuong, $hangVip, $hangDoi)
    {
        $currentRow = 0;

        // Hàng thường
        for ($row = $currentRow; $row < $currentRow + $hangThuong; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $hang = chr(65 + $row); // A, B, C,...
                $soGhe = $hang . ($col + 1); // A1, A2,...
                Ghe::create([
                    'phong_id' => $phongChieu->id,
                    'loai_ghe_id' => 1, // Giả sử 1 là ID của ghế thường
                    'so_ghe' => $soGhe,
                    'hang' => $hang,
                    'cot' => $col + 1,
                    'trang_thai' => true,
                ]);
            }
        }
        $currentRow += $hangThuong;

        // Hàng VIP
        for ($row = $currentRow; $row < $currentRow + $hangVip; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $hang = chr(65 + $row);
                $soGhe = $hang . ($col + 1);
                Ghe::create([
                    'phong_id' => $phongChieu->id,
                    'loai_ghe_id' => 2, // Giả sử 2 là ID của ghế VIP
                    'so_ghe' => $soGhe,
                    'hang' => $hang,
                    'cot' => $col + 1,
                    'trang_thai' => true,
                ]);
            }
        }
        $currentRow += $hangVip;

        // Hàng đôi
        for ($row = $currentRow; $row < $currentRow + $hangDoi; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $hang = chr(65 + $row);
                $soGhe = $hang . ($col + 1);
                Ghe::create([
                    'phong_id' => $phongChieu->id,
                    'loai_ghe_id' => 3, // Giả sử 3 là ID của ghế đôi
                    'so_ghe' => $soGhe,
                    'hang' => $hang,
                    'cot' => $col + 1,
                    'trang_thai' => true,
                ]);
            }
        }
    }
}
