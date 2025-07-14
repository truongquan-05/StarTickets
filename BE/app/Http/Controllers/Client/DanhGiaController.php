<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDanhGiaRequest;
use App\Http\Requests\UpdateDanhGiaRequest;
use App\Models\DanhGia;
use App\Models\ThanhToan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DanhGiaController extends Controller
{
    // Lấy tất cả đánh giá (admin)
    public function getAllDanhGia()
    {
        $danhGias = DanhGia::with(['nguoiDung', 'phim'])->latest()->get();
        return response()->json([
            'message' => 'Danh sách tất cả đánh giá',
            'data' => $danhGias
        ]);
    }

    // Lấy đánh giá theo phim
    public function getByPhim($phimId)
    {
        $danhGias = DanhGia::with('nguoiDung')
            ->where('phim_id', $phimId)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Danh sách đánh giá cho phim',
            'data' => $danhGias
        ]);
    }

    // Lấy điểm trung bình đánh giá của một phim
    public function getAverageRating($phimId)
    {
        $average = DanhGia::where('phim_id', $phimId)->avg('so_sao');
        return response()->json([
            'message' => 'Điểm trung bình đánh giá phim',
            'average' => round($average ?? 0, 2)  // nếu không có đánh giá thì trả 0
        ]);
    }

    // Lấy tất cả đánh giá của user đã đăng nhập
    public function index()
    {
        $userId = Auth::id();
        $danhGias = DanhGia::with(['phim'])
            ->where('nguoi_dung_id', $userId)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Danh sách đánh giá của bạn',
            'data' => $danhGias
        ]);
    }

    // Lấy đánh giá của user cho 1 phim
    public function getMyDanhGiaByPhim($phimId)
    {
        $userId = Auth::id();
        $danhGia = DanhGia::where('phim_id', $phimId)
            ->where('nguoi_dung_id', $userId)
            ->with(['nguoiDung', 'phim'])
            ->first();

        if (!$danhGia) {
            return response()->json([
                'message' => 'Bạn chưa đánh giá phim này'
            ], 200);
        }

        return response()->json([
            'message' => 'Đánh giá của bạn cho phim',
            'data' => $danhGia
        ]);
    }

    public function getDanhGiaByPhim($phimId)
    {
        $danhGia = DanhGia::where('phim_id', $phimId)
            ->with(['nguoiDung', 'phim'])
            ->orderBy('id', 'desc')
            ->get();

        if (!$danhGia) {
            return response()->json([
                'message' => 'Chưa có đánh giá nào'
            ], 422);
        }

        return response()->json([
            'message' => 'Đánh giá phim',
            'data' => $danhGia
        ]);
    }

    // Thêm đánh giá mới
    public function store(StoreDanhGiaRequest $request)
    {
        $userId = Auth::id();
        $data = $request->validated();
        $thanhToan = ThanhToan::with(['datVe.lichChieu.phim'])->where('nguoi_dung_id',  $userId)
            ->whereHas('datVe.lichChieu.phim', function ($query) use ($data) {
                $query->where('id', $data['phim_id']);
            })
            ->get();
        if ($thanhToan->isEmpty()) {
            return response()->json([
                'message' => 'Bạn chưa mua phim này',
            ], 422);
        }


        if ($request['nguoi_dung_id'] != $userId) {
            return response()->json(['message' => 'Lỗi đăng nhập']);
        }
        $oldDanhGia = DanhGia::where('nguoi_dung_id', $userId)
            ->where('phim_id', $data['phim_id'])
            ->with(['nguoiDung', 'phim'])
            ->first();

        if ($oldDanhGia) {
            return response()->json([
                'message' => 'Bạn đã đánh giá phim này!',
                'data' => $oldDanhGia
            ], 422);
        }

        $data['nguoi_dung_id'] = $userId;
        $danhGia = DanhGia::create($data)->load(['nguoiDung', 'phim']);

        return response()->json(['message' => 'Đánh giá thành công', 'data' => $danhGia], 201);
    }

    // Sửa đánh giá
    public function update(UpdateDanhGiaRequest $request, $id)
    {
        $userId = Auth::id();
        $danhGia = DanhGia::where('id', $id)
            ->where('nguoi_dung_id', $userId)
            ->firstOrFail();

        $danhGia->update($request->validated());
        $danhGia->load(['nguoiDung', 'phim']);

        return response()->json(['message' => 'Cập nhật đánh giá thành công', 'data' => $danhGia]);
    }

    // Xóa đánh giá
    public function destroy($id)
    {
        try {
            $userId = Auth::id();
            $danhGia = DanhGia::where('id', $id)
                ->where('nguoi_dung_id', $userId)
                ->firstOrFail();

            $danhGia->delete();

            return response()->json(['message' => 'Xoá đánh giá thành công']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy đánh giá'], 404);
        }
    }
}
