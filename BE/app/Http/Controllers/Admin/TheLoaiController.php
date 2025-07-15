<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\TheLoai;
use App\Http\Requests\StoreTheLoaiRequest;
use App\Http\Requests\UpdateTheLoaiRequest;
use Illuminate\Http\Request;

class TheLoaiController extends Controller
{


    // Danh sách thể loại với tìm kiếm & phân trang
    public function index(Request $request)
    {
        $query = TheLoai::query();

        if ($request->has('search')) {
            $query->where('ten_the_loai', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->get('per_page', 10);
        $theloais = $query->paginate($perPage);

        return response()->json($theloais);
    }

    // Thêm mới thể loại
    public function store(StoreTheLoaiRequest $request)
    {
        $theLoai = TheLoai::create($request->validated());
        return response()->json([
            'message' => 'Thêm thể loại thành công',
            'data' => $theLoai
        ], 201);
    }

    // Xem chi tiết thể loại
    public function show($id)
    {
        $theLoai = TheLoai::findOrFail($id);
        return response()->json($theLoai);
    }

    // Cập nhật thể loại
    public function update(UpdateTheLoaiRequest $request, $id)
    {
        $theLoai = TheLoai::findOrFail($id);
        $theLoai->update($request->validated());
        return response()->json([
            'message' => 'Cập nhật thể loại thành công',
            'data' => $theLoai
        ]);
    }

// Xóa mềm (soft delete)
public function softDelete($id)
{
    $theLoai = TheLoai::findOrFail($id);

    // Kiểm tra nếu còn phim liên quan
    if ($theLoai->phims()->count() > 0) {
        return response()->json(['message' => 'Không thể xóa thể loại vì còn phim liên quan'], 400);
    }

    $theLoai->delete();
    return response()->json(['message' => 'Đã xóa mềm thể loại']);
}

// Xóa vĩnh viễn 
public function delete($id)
{
    $theLoai = TheLoai::withTrashed()->findOrFail($id);

    // Kiểm tra nếu còn phim liên quan
    if ($theLoai->phims()->count() > 0) {
        return response()->json(['message' => 'Không thể xóa thể loại vì còn phim liên quan'], 400);
    }

    $theLoai->forceDelete();
    return response()->json(['message' => 'Đã xóa vĩnh viễn thể loại']);
}


    // Khôi phục (restore) thể loại đã xóa mềm
    public function restore($id)
    {
        $theLoai = TheLoai::withTrashed()->findOrFail($id);
        $theLoai->restore();
        return response()->json(['message' => 'Đã khôi phục thể loại']);
    }
}