<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\DoAnRequest;
use Illuminate\Http\Request;
use App\Models\DoAn;

class DoAnController extends Controller
{
public function index(Request $request)
{
    $query = DoAn::query();

    // Tìm kiếm theo tên
    if ($request->has('search')) {
        $search = $request->input('search');
        $query->where('ten_do_an', 'like', "%{$search}%");
    }

    // Phân trang
    $perPage = $request->input('per_page', 10); // mặc định 10 item/trang
    $items = $query->paginate($perPage);

    return response()->json($items);
}

public function show($id) {
    $item = DoAn::findOrFail($id);
    return response()->json($item);
}

public function store(DoAnRequest $request) {
    $item = DoAn::create($request->all());
    return response()->json(['message' => 'Thêm món thành công!', 'data' => $item]);
}

public function update(DoAnRequest $request, $id) {
    $item = DoAn::findOrFail($id);
    $item->update($request->all());
    return response()->json(['message' => 'Cập nhật thành công!', 'data' => $item]);
}

 public function delete($id)
{
    $item = DoAn::findOrFail($id);
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
