<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TinTucController extends Controller
{


    public function __construct()
    {

        $this->middleware('IsAdmin');
        $this->middleware('permission:TinTuc-read')->only(['index', 'show']);
        $this->middleware('permission:TinTuc-create')->only(['store']);
        $this->middleware('permission:TinTuc-update')->only(['update']);
        $this->middleware('permission:TinTuc-delete')->only(['destroy', 'restore', 'trashed', 'forceDelete']);
    }
    // Lấy danh sách tin tức
    public function index(Request $request)
    {
        $tinTuc = TinTuc::orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $tinTuc,
        ]);
    }

    // Lấy danh sách tin tức đã xóa mềm
    public function trashed(Request $request)
    {
        $tinTuc = TinTuc::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get();

        return response()->json([
            'data' => $tinTuc
        ]);
    }

    // Lấy chi tiết tin tức
    public function show($id) // Bỏ chữ TinTuc là được 
    {

        $tintuc = TinTuc::find($id);

        if (!$tintuc) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết tin tức',
            'data' => $tintuc
        ], 200);
    }

    // Thêm tin tức mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            // 'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $data = $request->only(['tieu_de', 'noi_dung']);

        if ($request->hasFile('hinh_anh')) {
            $path = $request->file('hinh_anh')->store('images', 'public');
            $data['hinh_anh'] = $path;
        }

        $tinTuc = TinTuc::create($data);
        return response()->json($tinTuc, 201);
    }

    // Cập nhật tin tức
    public function update(Request $request, TinTuc $tinTuc)
    {
        $validator = Validator::make($request->all(), [
            'tieu_de' => 'sometimes|required|string|max:255',
            'noi_dung' => 'sometimes|required|string',
            // 'hinh_anh' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $data = $request->only(['tieu_de', 'noi_dung']);

        if ($request->hasFile('hinh_anh')) {
            if ($tinTuc->hinh_anh) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $tinTuc->hinh_anh));
            }
            $path = $request->file('hinh_anh')->store('images', 'public');
            $data['hinh_anh'] = $path;
        }

        $tinTuc->update($data);
        return response()->json($tinTuc);
    }

    // Xóa mềm tin tức
    public function destroy(TinTuc $tinTuc)
    {
        $tinTuc->delete();
        return response()->json(['message' => 'Xóa mềm tin tức thành công']);
    }

    // Khôi phục tin tức đã xóa
    public function restore($id)
    {
        $tinTuc = TinTuc::onlyTrashed()->find($id);
        if (!$tinTuc) {
            return response()->json(['message' => 'Không tìm thấy tin tức đã xóa'], 404);
        }
        $tinTuc->restore();
        return response()->json(['message' => 'Khôi phục tin tức thành công', 'data' => $tinTuc]);
    }

    // Xóa cứng tin tức
    public function forceDelete($id)
    {
        $tinTuc = TinTuc::find($id);
        if (!$tinTuc) {
            return response()->json(['message' => 'Tin tức chưa được xóa mềm hoặc không tồn tại'], 404);
        }
        if ($tinTuc->hinh_anh) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $tinTuc->hinh_anh));
        }
        $tinTuc->forceDelete();
        return response()->json(['message' => 'Xóa cứng tin tức thành công']);
    }
}
