<?php

namespace App\Http\Controllers\Admin;

use App\Models\LoaiGhe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class LoaiGheController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = LoaiGhe::all();
        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Không có dữ liệu',
                'data' => []
            ])->setStatusCode(404);
        }
        return response()->json([
            'message' => 'Danh sách loại ghế',
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_loai_ghe' => 'required|max:50',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $loaiGhe = LoaiGhe::create($data);

        return response()->json([
            'message' => 'Thêm thành công',
            'data' => $loaiGhe,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = LoaiGhe::find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không có dữ liệu'
            ]);
        } else {
            return response()->json([
                'message' => 'Thông tin loại ghế',
                'data' => $data
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_loai_ghe' => 'required|max:50',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $loaiGhe = LoaiGhe::find($id);

        if (!$loaiGhe) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }

        $loaiGhe->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $loaiGhe
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = LoaiGhe::find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }
        $data->delete();
        return response()->json([
            'message' => 'Xóa thành công',

        ]);
    }


}
