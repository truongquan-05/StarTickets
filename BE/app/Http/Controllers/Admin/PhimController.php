<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Phim;
use Illuminate\Http\Request;
use App\Http\Requests\StorePhimRequest;
use App\Http\Requests\UpdatePhimRequest;
use Illuminate\Support\Facades\Storage;

class PhimController extends Controller
{
    // Lấy danh sách phim (kèm lọc, tìm kiếm, phân trang)
    public function index(Request $request)
    {
        $query = Phim::with('theLoai');

        if ($request->has('search')) {
            $query->where('ten_phim', 'like', '%' . $request->search . '%');
        }

        if ($request->has('tinh_trang')) {
            $query->where('tinh_trang', $request->tinh_trang);
        }

        $perPage = $request->get('per_page', 10);
        $phims = $query->paginate($perPage);

        return response()->json($phims);
    }

    // Thêm phim mới
    public function store(StorePhimRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('anh_poster')) {
            $data['anh_poster'] = $request->file('anh_poster')->store('posters', 'public');
        }

        $phim = Phim::create($data);
        $phim->load('theLoai'); // Load thêm tên thể loại
        return response()->json([
            'message' => 'Thêm phim thành công',
            'data' => $phim
        ], 201);
    }

    // Chi tiết phim theo ID
    public function show($id)
    {
        $phim = Phim::with('theLoai')->findOrFail($id);
        return response()->json($phim);
    }

    // Cập nhật phim
    public function update(UpdatePhimRequest $request, $id)
    {
        $phim = Phim::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('anh_poster')) {
            // Xóa poster cũ nếu có
            if ($phim->anh_poster) {
                Storage::disk('public')->delete($phim->anh_poster);
            }
            $data['anh_poster'] = $request->file('anh_poster')->store('posters', 'public');
        }

        $phim->update($data);

        return response()->json([
            'message' => 'Cập nhật phim thành công',
            'data' => $phim
        ]);
    }

    // Xóa phim
    public function delete($id)
    {
        $phim = Phim::findOrFail($id);

        if ($phim->anh_poster) {
            Storage::disk('public')->delete($phim->anh_poster);
        }

        $phim->delete();

        return response()->json(['message' => 'Xóa phim thành công']);
    }
    // Xóa mềm phim
    public function softDelete($id)
    {
        $phim = Phim::findOrFail($id);
        $phim->delete();

        return response()->json(['message' => 'Phim đã được xóa mềm']);
    }

    // Khôi phục phim đã xóa mềm

    public function restore($id)
    {
        $phim = Phim::withTrashed()->findOrFail($id);

        if ($phim->trashed()) {
            $phim->restore();
            return response()->json(['message' => 'Phim đã được khôi phục']);
        }

        return response()->json(['message' => 'Phim chưa bị xóa hoặc không tồn tại'], 404);
    }
}
