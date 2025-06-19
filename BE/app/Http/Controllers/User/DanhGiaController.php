<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDanhGiaRequest;
use App\Http\Requests\UpdateDanhGiaRequest;
use App\Models\DanhGia;
use Illuminate\Support\Facades\Auth;

class DanhGiaController extends Controller
{
public function getAllDanhGia()
{
    $danhGias = DanhGia::with(['nguoiDung', 'phim'])
        ->latest()
        ->get();

    return response()->json([
        'message' => 'Danh sách tất cả đánh giá',
        'data' => $danhGias
    ]);
}
    // Người dùng gửi đánh giá
public function store(StoreDanhGiaRequest $request)
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Bạn cần đăng nhập để đánh giá'], 401);
    }

    $userId = Auth::id();
    $data = $request->validated();

    $daDanhGia = DanhGia::where('nguoi_dung_id', $userId)
        ->where('phim_id', $data['phim_id'])
        ->exists();

    if ($daDanhGia) {
        return response()->json(['message' => 'Bạn đã đánh giá phim này!'], 409);
    }

    $data['nguoi_dung_id'] = $userId;
    $danhGia = DanhGia::create($data)->load(['nguoiDung', 'phim']);

    return response()->json(['message' => 'Đánh giá thành công', 'data' => $danhGia], 201);
}


    // Sửa đánh giá
   public function update(UpdateDanhGiaRequest $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để sửa đánh giá'], 401);
        }

        $userId = Auth::id();
        $danhGia = DanhGia::where('id', $id)
            ->where('nguoi_dung_id', $userId)
            ->firstOrFail();

        $danhGia->update($request->validated());
        $danhGia->load(['nguoiDung', 'phim']);

        return response()->json(['message' => 'Cập nhật đánh giá thành công', 'data' => $danhGia]);
    }

    // Xoá đánh giá
 public function delete($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để xoá đánh giá'], 401);
        }

        $userId = Auth::id();
        $danhGia = DanhGia::where('id', $id)
            ->where('nguoi_dung_id', $userId)
            ->firstOrFail();

        $danhGia->delete();

        return response()->json(['message' => 'Xoá đánh giá thành công']);
    }
}
