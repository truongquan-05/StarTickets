<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        $sortBy = $request->input('sort_by', 'id'); // Mặc định sắp xếp theo id
        $perPage = $request->input('per_page', 10); // Mặc định 10 kết quả/trang

        $query = Rap::where('isDeleted', false); // Chỉ lấy rạp chưa xóa mềm

        // Tìm kiếm nếu có keyword
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_rap', 'LIKE', "%{$keyword}%")
                    ->orWhere('dia_chi', 'LIKE', "%{$keyword}%");
            });
        }

        // Sắp xếp và phân trang
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

    /**
     * Store a newly created resource in storage.
     */
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

        $rap = Rap::create(array_merge(
            $request->only(['ten_rap', 'dia_chi']),
            ['isDeleted' => false] // Đảm bảo isDeleted mặc định là false
        ));

        return response()->json([
            'success' => true,
            'message' => 'Thêm rạp thành công',
            'data' => $rap
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $rap = Rap::find($id);
        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp.',
            ], 404);
        }

        if ($rap->isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Rạp đã bị xóa mềm',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết rạp',
            'data' => $rap
        ], 200);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rap = Rap::find($id);
        if (!$rap || $rap->isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp hoặc rạp đã bị xóa mềm',
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rap = Rap::find($id);

        if (!$rap) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp.',
            ], 404);
        }

        if (!$rap->isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Rạp chưa được xóa mềm. Vui lòng xóa mềm trước khi xóa vĩnh viễn.',
            ], 400);
        }

        $rap->forceDelete(); // Xóa vĩnh viễn
        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn rạp thành công',
        ], 200);
    }

    // xóa mềm
    public function softDelete($id)
    {
        $rap = Rap::find($id);
        if (!$rap || $rap->isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp hoặc rạp đã bị xóa mềm'
            ], 404);
        }

        $rap->update(['isDeleted' => true]);
        return response()->json([
            'success' => true,
            'message' => 'Xóa mềm rạp thành công'
        ], 200);
    }

    // Khôi phục rạp đã xóa mềm
    public function restore($id)
    {
        $rap = Rap::find($id);
        if (!$rap || !$rap->isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp hoặc rạp chưa bị xóa mềm'
            ], 404);
        }

        $rap->update(['isDeleted' => false]);
        return response()->json([
            'success' => true,
            'message' => 'Khôi phục rạp thành công',
            'data' => $rap
        ], 200);
    }

    //Lấy danh sách rạp đã xóa mềm
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
        $sortBy = $request->input('sort_by', 'id'); // Mặc định sắp xếp theo id
        $perPage = $request->input('per_page', 10); // Mặc định 10 kết quả/trang

        $query = Rap::where('isDeleted', true); // Chỉ lấy rạp đã xóa mềm

        // Tìm kiếm nếu có keyword
        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_rap', 'LIKE', "%{$keyword}%")
                    ->orWhere('dia_chi', 'LIKE', "%{$keyword}%");
            });
        }

        // Sắp xếp và phân trang
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
