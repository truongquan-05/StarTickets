<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PhongChieu;
use App\Models\Ghe;
use App\Models\MaTranGhe;
use Illuminate\Http\Request;

class PhongChieuController extends Controller
{
    public function index(Request $request)
    {
        // Lấy tham số từ query string
        $search = $request->query('search'); // Tìm kiếm theo tên phòng
        $rapId = $request->query('rap_id'); // Lọc theo rạp
        $trangThai = $request->query('trang_thai'); // Lọc theo trạng thái
        $perPage = $request->query('per_page', 10); // Mặc định 10 bản ghi/trang
        $page = $request->query('page', 1); // Mặc định trang 1

        // Xây dựng query
        $query = PhongChieu::with('maTranGhe', 'rap')->whereNull('deleted_at');

        // Tìm kiếm theo tên phòng
        if ($search) {
            $query->where('ten_phong', 'like', "%{$search}%");
        }

        // Lọc theo rạp
        if ($rapId) {
            $query->where('rap_id', $rapId);
        }

        // Lọc theo trạng thái
        if ($trangThai) {
            $query->where('trang_thai', $trangThai);
        }

        // Phân trang
        $phongChieus = $query->paginate($perPage, ['*'], 'page', $page);

        // Trả về dữ liệu với metadata phân trang
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
            'loai_so_do' => 'required|integer',
            'hang_thuong' => 'required|integer|min:0',
            'hang_doi' => 'required|integer|min:0',
            'hang_vip' => 'required|integer|min:0',
            'ma_tran_ghe_id' => 'required|exists:ma_tran_ghe,id',
            'trang_thai' => 'required|in:nhap,xuat_ban',
        ]);

        $maTranGhe = MaTranGhe::find($request->ma_tran_ghe_id);
        if ($maTranGhe->trang_thai !== 'xuat_ban') {
            return response()->json(['message' => 'Chỉ sử dụng mẫu đã xuất bản'], 400);
        }

        $phongChieu = PhongChieu::create($request->only([
            'rap_id',
            'ten_phong',
            'loai_so_do',
            'hang_thuong',
            'hang_doi',
            'hang_vip',
            'ma_tran_ghe_id',
            'trang_thai'
        ]));

        $maTran = $maTranGhe->ma_tran;
        $rows = $maTran['rows'];
        $cols = $maTran['cols'];
        $seatData = $maTran['ma_tran'];

        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $loaiGheId = $seatData[$row][$col];
                $hang = chr(65 + $row);
                $soGhe = $hang . ($col + 1);
                Ghe::create([
                    'phong_id' => $phongChieu->id,
                    'loai_ghe_id' => $loaiGheId,
                    'so_ghe' => $soGhe,
                    'hang' => $hang,
                    'cot' => $col + 1,
                    'trang_thai' => true,
                ]);
            }
        }

        return response()->json($phongChieu->load('ghes', 'maTranGhe', 'rap'), 201);
    }

    public function show(PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu không tồn tại'], 404);
        }
        return response()->json($phongChieu->load('ghes', 'maTranGhe', 'rap'), 200);
    }

    public function update(Request $request, PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu không tồn tại'], 404);
        }

        if ($phongChieu->trang_thai === 'xuat_ban') {
            $request->validate([
                'trang_thai' => 'required|in:nhap,xuat_ban',
            ]);
            if ($request->trang_thai === 'nhap' && $phongChieu->trang_thai === 'xuat_ban') {
                $phongChieu->update($request->only(['trang_thai']));
            } else {
                return response()->json(['message' => 'Không thể thay đổi khi đã xuất bản'], 400);
            }
        } else {
            $request->validate([
                'rap_id' => 'required|exists:rap,id',
                'ten_phong' => 'required|string|max:100',
                'loai_so_do' => 'required|integer',
                'hang_thuong' => 'required|integer|min:0',
                'hang_doi' => 'required|integer|min:0',
                'hang_vip' => 'required|integer|min:0',
                'ma_tran_ghe_id' => 'required|exists:ma_tran_ghe,id',
                'trang_thai' => 'required|in:nhap,xuat_ban',
            ]);

            if ($phongChieu->trang_thai === 'nhap') {
                if ($phongChieu->ma_tran_ghe_id !== $request->ma_tran_ghe_id) {
                    $phongChieu->ghes()->delete();
                    $maTranGhe = MaTranGhe::find($request->ma_tran_ghe_id);
                    $maTran = $maTranGhe->ma_tran;
                    $rows = $maTran['rows'];
                    $cols = $maTran['cols'];
                    $seatData = $maTran['ma_tran'];

                    for ($row = 0; $row < $rows; $row++) {
                        for ($col = 0; $col < $cols; $col++) {
                            $loaiGheId = $seatData[$row][$col];
                            $hang = chr(65 + $row);
                            $soGhe = $hang . ($col + 1);
                            Ghe::create([
                                'phong_id' => $phongChieu->id,
                                'loai_ghe_id' => $loaiGheId,
                                'so_ghe' => $soGhe,
                                'hang' => $hang,
                                'cot' => $col + 1,
                                'trang_thai' => true,
                            ]);
                        }
                    }
                }
                $phongChieu->update($request->only(['rap_id', 'ten_phong', 'loai_so_do', 'hang_thuong', 'hang_doi', 'hang_vip', 'ma_tran_ghe_id', 'trang_thai']));
            }
        }

        return response()->json($phongChieu->load('ghes', 'maTranGhe', 'rap'), 200);
    }

    public function destroy(PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu đã bị xóa'], 400);
        }
        $phongChieu->delete();
        return response()->json(['message' => 'Phòng chiếu đã được xóa mềm'], 200);
    }
}
