<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DanhGia;

class DanhGiaController extends Controller
{
public function index()
{
    $danhGias = DanhGia::with(['nguoiDung', 'phim'])->paginate(10);
    return response()->json($danhGias);
}

    public function show($id)
    {
        $danhGia = DanhGia::with(['nguoiDung', 'phim'])->findOrFail($id);
        return response()->json($danhGia);
    }

    public function delete($id)
    {
        $danhGia = DanhGia::findOrFail($id);
        $danhGia->delete();

        return response()->json(['message' => 'Xoá đánh giá thành công']);
    }
}
