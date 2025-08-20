<?php

namespace App\Http\Controllers\Admin;

use App\Models\DoAn;
use App\Models\DonDoAn;
use Illuminate\Http\Request;
use App\Http\Requests\DoAnRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DoAnController extends Controller
{
    public function __construct()
    {
        $this->middleware(['IsAdmin', 'permission:DoAn-read'])->only(['show']);
        $this->middleware(['IsAdmin', 'permission:DoAn-create'])->only(['store']);
        $this->middleware(['IsAdmin', 'permission:DoAn-update'])->only(['update']);
        $this->middleware(['IsAdmin', 'permission:DoAn-delete'])->only(['delete']);
    }

    public function index(Request $request)
    {
        $query = DoAn::with('rap')->FilterByRap('rap');

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
        $rap = $request->input('rap_id');
        foreach ($rap as $id) {
            $data['rap_id'] = $id;
            $item = DoAn::create($data);
        }

        return response()->json(['message' => 'Thêm món thành công!', 'data' => $rap]);
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

    public function showByRap($id)
    {
        $doAn = DoAn::where('rap_id', $id)->get();

        if ($doAn->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy món ăn cho rạp này'], 404);
        }

        return response()->json($doAn);
    }


    public function storeByRap(Request $request)
    {
        $data = $request->all();

        foreach ($data['items'] as $item) {
            $validator = Validator::make($item, [
                'dat_ve_id' => 'required|integer|exists:dat_ve,id',
                'do_an_id'  => 'required|integer|exists:do_an,id',
                'so_luong'  => 'required|integer|min:1',
                'gia_ban'   => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors'  => $validator->errors()
                ], 422);
            }
        }

        DB::beginTransaction();
        try {
            foreach ($data['items'] as $item) {
                $doAn = DoAn::findOrFail($item['do_an_id']);
                if ($doAn->so_luong_ton < $item['so_luong']) {
                    return response()->json([
                        'message' => 'Số lượng món ăn không đủ trong kho',
                        'available' => $doAn->so_luong_ton,
                    ], 422);
                }
                DonDoAn::create($item);
                $doAn = DoAn::find($item['do_an_id']);
                $doAn->so_luong_ton -= $item['so_luong'];
                $doAn->save();
            }
            DB::commit();

            return response()->json(['message' => 'Thêm món ăn thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi hệ thống',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
