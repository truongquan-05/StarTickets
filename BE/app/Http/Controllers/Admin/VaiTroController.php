<?php

namespace App\Http\Controllers\Admin;

use App\Models\VaiTro;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;


class VaiTroController extends Controller
{

    public function __construct()
    {

        $this->middleware('IsAdmin');
        $this->middleware('permission:VaiTro-read')->only(['index', 'show']);
        $this->middleware('permission:VaiTro-create')->only(['store']);
        $this->middleware('permission:VaiTro-update')->only(['update']);
        $this->middleware('permission:VaiTro-delete')->only(['destroy']);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = VaiTro::all();
        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Không có dữ liệu',
                'data' => []
            ])->setStatusCode(404);
        }
        return response()->json([
            'message' => 'Danh sách vai trò',
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_vai_tro' => 'required|max:50|unique:vai_tro,ten_vai_tro',
            'mo_ta' => 'nullable|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['ten_vai_tro', 'mo_ta']);
        $vaiTro = VaiTro::create($data);

        return response()->json([
            'message' => 'Thêm thành công',
            'data' => $vaiTro,
        ]);
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = VaiTro::find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không có dữ liệu'
            ]);
        } else {
            return response()->json([
                'message' => 'Thông tin vai trò',
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
            'ten_vai_tro' => 'required|max:50',
            'mo_ta' => 'nullable|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $vaiTro = VaiTro::find($id);
        if ($id == 1 || $id == 2 || $id == 3 || $id == 4 || $id == 99) {
            return response()->json([
                'message' => 'Không thể sửa vai trò này',

            ], 422);
        }

        if (!$vaiTro) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }

        $vaiTro->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $vaiTro
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = VaiTro::find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }
        if ($id == 1 || $id == 2 || $id == 3 || $id == 4 || $id == 99) {
            return response()->json([
                'message' => 'Không thể xóa vai trò này',

            ], 422);
        }
        $data->delete();
        return response()->json([
            'message' => 'Xóa thành công',

        ]);
    }
    //Xóa mềm + Khôi phục
    // public function restore(string $id)
    // {
    //     $data = VaiTro::withTrashed()->find($id);
    //     if (!$data) {
    //         return response()->json([
    //             'message' => 'Không tìm thấy dữ liệu'
    //         ], 404);
    //     }
    //     $data->restore();
    //     return response()->json([
    //         'message' => 'Khôi phục thành công',
    //         'data' => $data
    //     ]);
    // }
    // public function forceDelete(string $id)
    // {
    //     $data = VaiTro::withTrashed()->find($id);
    //     if (!$data) {
    //         return response()->json([
    //             'message' => 'Không tìm thấy dữ liệu'
    //         ], 404);
    //     }
    //     $data->forceDelete();
    //     return response()->json([
    //         'message' => 'Xóa vĩnh viễn thành công',
    //     ]);
    // }
}
