<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RapController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'nullable|string|max:100',
            'sort_by' => 'nullable|in:id,ten_rap,dia_chi',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi tham số đầu vào',
                'errors' => $validator->errors()
            ], 422);
        }

        $keyword = $request->input('keyword');
        $sortBy = $request->input('sort_by', 'id');
        $perPage = $request->input('per_page', 10);

        $query = Rap::query();

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_rap', 'LIKE', "%{$keyword}%")
                    ->orWhere('dia_chi', 'LIKE', "%{$keyword}%");
            });
        }

        $raps = $query->orderBy($sortBy, 'DESC')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Danh sách rạp',
            'data' => $raps->items(),
            'pagination' => [
                'current_page' => $raps->currentPage(),
                'per_page' => $raps->perPage(),
                'total' => $raps->total(),
                'last_page' => $raps->lastPage(),
            ]
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_rap' => 'required|string|max:100',
            'dia_chi' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm rạp',
                'errors' => $validator->errors()
            ], 422);
        }

        $rap = Rap::create($request->only(['ten_rap', 'dia_chi']));

        return response()->json([
            'success' => true,
            'message' => 'Thêm rạp thành công',
            'data' => $rap
        ], 201);
    }

    public function show($id)
    {
        $rap = Rap::find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết rạp',
            'data' => $rap
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $rap = Rap::find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'ten_rap' => 'required|string|max:100',
            'dia_chi' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật rạp',
                'errors' => $validator->errors()
            ], 422);
        }

        $rap->update($request->only(['ten_rap', 'dia_chi']));

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật rạp thành công',
            'data' => $rap
        ], 200);
    }

    public function destroy($id)
    {
        $rap = Rap::onlyTrashed()->find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp đã xóa mềm.',
            ], 404);
        }

        $rap->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn rạp thành công',
        ], 200);
    }

    public function softDelete($id)
    {
        $rap = Rap::find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp'
            ], 404);
        }

        $rap->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa mềm rạp thành công'
        ], 200);
    }

    public function restore($id)
    {
        $rap = Rap::onlyTrashed()->find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp đã xóa mềm'
            ], 404);
        }

        $rap->restore();

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục rạp thành công',
            'data' => $rap
        ], 200);
    }

    public function trashed(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'nullable|string|max:100',
            'sort_by' => 'nullable|in:id,ten_rap,dia_chi',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi tham số đầu vào',
                'errors' => $validator->errors()
            ], 422);
        }

        $keyword = $request->input('keyword');
        $sortBy = $request->input('sort_by', 'id');
        $perPage = $request->input('per_page', 10);

        $query = Rap::onlyTrashed();

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_rap', 'LIKE', "%{$keyword}%")
                    ->orWhere('dia_chi', 'LIKE', "%{$keyword}%");
            });
        }

        $raps = $query->orderBy($sortBy, 'DESC')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Danh sách rạp đã xóa mềm',
            'data' => $raps->items(),
            'pagination' => [
                'current_page' => $raps->currentPage(),
                'per_page' => $raps->perPage(),
                'total' => $raps->total(),
                'last_page' => $raps->lastPage(),
            ]
        ], 200);
    }
}
