<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaTranGhe;
use Illuminate\Http\Request;

class MaTranGheController extends Controller
{
    public function index(Request $request)
    {
        // Lấy tham số từ query string
        $search = $request->query('search'); // Tìm kiếm theo tên
        $trangThai = $request->query('trang_thai'); // Lọc theo trạng thái
        $perPage = $request->query('per_page', 10); // Mặc định 10 bản ghi/trang
        $page = $request->query('page', 1); // Mặc định trang 1

        // Xây dựng query
        $query = MaTranGhe::query();

        // Tìm kiếm theo tên
        if ($search) {
            $query->where('ten', 'like', "%{$search}%");
        }

        // Lọc theo trạng thái
        if ($trangThai) {
            $query->where('trang_thai', $trangThai);
        }

        // Phân trang
        $maTranGhes = $query->paginate($perPage, ['*'], 'page', $page);

        // Trả về dữ liệu với metadata phân trang
        return response()->json([
            'data' => $maTranGhes->items(),
            'meta' => [
                'current_page' => $maTranGhes->currentPage(),
                'per_page' => $maTranGhes->perPage(),
                'total' => $maTranGhes->total(),
                'last_page' => $maTranGhes->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:100',
            'mo_ta' => 'nullable|string',
            'kich_thuoc' => 'required|regex:/^\d+x\d+$/',
            'hang_thuong' => 'required|integer|min:0',
            'hang_vip' => 'required|integer|min:0',
            'hang_doi' => 'required|integer|min:0',
            'trang_thai' => 'required|in:nhap,xuat_ban',
        ]);

        list($rows, $cols) = explode('x', $request->kich_thuoc);
        $totalRows = $rows;
        $hangThuong = min($request->hang_thuong, $totalRows);
        $hangDoi = min($request->hang_doi, $totalRows - $hangThuong);
        $hangVip = $totalRows - $hangThuong - $hangDoi;

        $maTran = $this->generateMaTran($rows, $cols, $hangThuong, $hangVip, $hangDoi);
        $maTranGhe = MaTranGhe::create([
            'ten' => $request->ten,
            'mo_ta' => $request->mo_ta,
            'kich_thuoc' => $request->kich_thuoc,
            'ma_tran' => $maTran,
            'trang_thai' => $request->trang_thai,
        ]);

        return response()->json($maTranGhe, 201);
    }

    public function show(MaTranGhe $maTranGhe)
    {
        return response()->json($maTranGhe, 200);
    }

    public function update(Request $request, MaTranGhe $maTranGhe)
    {
        if ($maTranGhe->trang_thai === 'xuat_ban') {
            $request->validate([
                'ten' => 'required|string|max:100',
                'mo_ta' => 'nullable|string',
            ]);
            $maTranGhe->update($request->only(['ten', 'mo_ta']));
        } else {
            return response()->json(['message' => 'Chỉ được cập nhật khi xuất bản'], 400);
        }
        return response()->json($maTranGhe, 200);
    }

    public function destroy(MaTranGhe $maTranGhe)
    {
        if ($maTranGhe->phongChieus()->count() > 0) {
            return response()->json(['message' => 'Ma trận ghế đang được sử dụng'], 400);
        }
        $maTranGhe->delete();
        return response()->json(['message' => 'Ma trận ghế đã được xóa'], 200);
    }

    private function generateMaTran($rows, $cols, $hangThuong, $hangVip, $hangDoi)
    {
        $maTran = [];
        $loaiGheThuongId = \App\Models\LoaiGhe::where('ten_loai_ghe', 'Ghế thường')->first()->id;
        $loaiGheVipId = \App\Models\LoaiGhe::where('ten_loai_ghe', 'Ghế VIP')->first()->id;
        $loaiGheDoiId = \App\Models\LoaiGhe::where('ten_loai_ghe', 'Ghế đôi')->first()->id;

        for ($i = 0; $i < $rows; $i++) {
            $row = [];
            for ($j = 0; $j < $cols; $j++) {
                if ($i < $hangThuong) {
                    $row[] = $loaiGheThuongId;
                } elseif ($i >= $rows - $hangDoi) {
                    $row[] = $loaiGheDoiId;
                } else {
                    $row[] = $loaiGheVipId;
                }
            }
            $maTran[] = $row;
        }
        return ['rows' => $rows, 'cols' => $cols, 'ma_tran' => $maTran];
    }
}
