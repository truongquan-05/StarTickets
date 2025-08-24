<?php

namespace App\Http\Controllers\Admin;

use App\Models\DanhGia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DanhGiaController extends Controller
{

    public function __construct()
    {

        $this->middleware('IsAdmin');
        $this->middleware('permission:DanhGia-read')->only(['index', 'show']);
        $this->middleware('permission:DanhGia-create')->only(['store']);
        $this->middleware('permission:DanhGia-update')->only(['update']);
    }




    public function index()
    {
        $danhGias = DanhGia::with(['nguoiDung', 'phim'])->get();
        return response()->json(['data'=>$danhGias]);
    }

    public function show($id)
    {
        $danhGia = DanhGia::with(['nguoiDung', 'phim'])->findOrFail($id);
        return response()->json($danhGia);
    }

    public function update(Request $request, string $id){

    }

    // public function delete($id)
    // {
    //     $danhGia = DanhGia::findOrFail($id);
    //     $danhGia->delete();

    //     return response()->json(['message' => 'Xoá đánh giá thành công']);
    // }
}
