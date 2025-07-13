<?php

namespace App\Http\Controllers\Admin;

use App\Models\Phim;
use App\Models\ChuyenNgu;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhimRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdatePhimRequest;
use App\Models\TheLoai;

class PhimController extends Controller
{
    // Lấy danh sách phim (kèm lọc, tìm kiếm, phân trang)
    public function index(Request $request)
    {
        $query = Phim::with('theLoai')->all();

        if ($request->has('search')) {
            $query->where('ten_phim', 'like', '%' . $request->search . '%');
        }


        $perPage = $request->get('per_page', 10);
        $phims = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json($phims);
    }


    public function store(StorePhimRequest $request)
    {
        $data = $request->validated();

        // Kiểm tra và chuyển thành mảng object
        $chuyenNguInput = $request->input('chuyen_ngu');

        // Nếu lỡ nhận là chuỗi "1,2" thì tách thủ công
        if (is_string($chuyenNguInput)) {
            $chuyenNguInput = explode(',', $chuyenNguInput);
        }

        $data['chuyen_ngu'] = collect($chuyenNguInput)
            ->map(function ($id) {
                $chuyenNgu = ChuyenNgu::find($id);
                return $chuyenNgu ? [
                    'id' => $chuyenNgu->id,
                    'the_loai' => $chuyenNgu->the_loai,
                ] : null;
            })
            ->filter() // loại bỏ phần null nếu có id không tồn tại
            ->values()
            ->toJson();


        //Thể loại

        $theLoaiInput = $request->input('the_loai_id');
        if (is_string($theLoaiInput)) {
            $theLoaiInput = explode(',', $theLoaiInput);
        }

        $data['the_loai_id'] = collect($theLoaiInput)
            ->map(function ($id) {
                $theLoai = TheLoai::find($id);
                return $theLoai ? [
                    'id' => $theLoai->id,
                    'ten_the_loai' => $theLoai->ten_the_loai,
                ] : null;
            })
            ->filter() // loại bỏ phần null nếu có id không tồn tại
            ->values()
            ->toJson();

        if ($request->hasFile('anh_poster')) {
            $data['anh_poster'] = $request->file('anh_poster')->store('posters', 'public');
        }

        $phim = Phim::create($data);
        // $phim->load('theLoai');


        return response()->json([
            'message' => 'Thêm phim thành công',
            'data' => $phim
        ], 200);
    }

    // Chi tiết phim theo ID
    public function show($id)
    {
        $phim = Phim::withTrashed()->findOrFail($id);
        return response()->json($phim);
    }

    // Cập nhật phim
    public function update(UpdatePhimRequest $request, $id)
    {
        $phim = Phim::findOrFail($id);
        $data = $request->validated();
        $theLoaiInput = $request->input('the_loai_id');
        if (is_string($theLoaiInput)) {
            $theLoaiInput = explode(',', $theLoaiInput);
        }

        $data['the_loai_id'] = collect($theLoaiInput)
            ->map(function ($id) {
                $theLoai = TheLoai::find($id);
                return $theLoai ? [
                    'id' => $theLoai->id,
                    'ten_the_loai' => $theLoai->ten_the_loai,
                ] : null;
            })
            ->filter() // loại bỏ phần null nếu có id không tồn tại
            ->values()
            ->toJson();

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
        // Cho phép tìm luôn cả phim đã bị xóa mềm
        $phim = Phim::withTrashed()->findOrFail($id);

        // Xóa ảnh nếu có
        if ($phim->anh_poster) {
            Storage::disk('public')->delete($phim->anh_poster);
        }

        // Xóa vĩnh viễn
        $phim->forceDelete();

        return response()->json(['message' => 'Xóa phim thành công']);
    }

    // Xóa mềm phim
    public function softDelete($id)
    {
        $phim = Phim::find($id);

        if (!$phim) {
            return response()->json(['message' => 'Phim không tồn tại hoặc đã bị xóa'], 200); // Không 404
        }

        $phim->delete();

        return response()->json(['message' => 'Phim đã được xóa mềm']);
    }

    // Lấy phim đã xóa mềm
    public function trashed()
    {
        $trashed = Phim::onlyTrashed()->get();
        return response()->json(['data' => $trashed]);
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
