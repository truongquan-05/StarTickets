<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoAnRequest;
use Illuminate\Http\Request;
use App\Models\DoAn;
use Illuminate\Support\Facades\Storage;

class DoAnController extends Controller
{
    public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:DoAn-read')->only(['index', 'show']);
        $this->middleware('permission:DoAn-create')->only(['store']);
        $this->middleware('permission:DoAn-update')->only(['update']);
        $this->middleware('permission:DoAn-delete')->only(['delete']);
    }
    
    public function index(Request $request)
    {
        $query = DoAn::query();

        // Tìm kiếm theo tên
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('ten_do_an', 'like', "%{$search}%");
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $items = $query->paginate($perPage);

        return response()->json($items);
    }

    public function show($id)
    {
        $item = DoAn::findOrFail($id);
        return response()->json($item);
    }

    public function store(DoAnRequest $request)
    {
        $data = $request->all();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('uploads', 'public');
        }


        $item = DoAn::create($data);
        return response()->json(['message' => 'Thêm món thành công!', 'data' => $item]);
    }

    public function update(DoAnRequest $request, $id)
    {
        $item = DoAn::findOrFail($id);
        $data = $request->all();

        // Xử lý cập nhật ảnh
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($item->image && Storage::disk('public')->exists($item->image)) {
                Storage::disk('public')->delete($item->image);
            }
            $path = $request->file('image')->store('images/do_an', 'public');
            $data['image'] = $path;
        }

        $item->update($data);
        return response()->json(['message' => 'Cập nhật thành công!', 'data' => $item]);
    }

    public function delete($id)
    {
        $item = DoAn::findOrFail($id);

        // Xóa ảnh khỏi storage
        if ($item->image && Storage::disk('public')->exists($item->image)) {
            Storage::disk('public')->delete($item->image);
        }

        $item->forceDelete();
        return response()->json(['message' => 'Xóa vĩnh viễn thành công!']);
    }

    public function softDelete($id)
    {
        $item = DoAn::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Đã xóa mềm thành công!']);
    }

    public function restore($id)
    {
        $item = DoAn::withTrashed()->findOrFail($id);
        $item->restore();
        return response()->json(['message' => 'Khôi phục thành công!']);
    }
}
