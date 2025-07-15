<?php

namespace App\Http\Controllers\Admin;

use App\Models\VaiTro;
use App\Models\QuyenTruyCap;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AddQuyenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:All');
    }

    public function index()
    {
        $data = VaiTro::with('QuyenTruyCap')->get();
        return response()->json([
            'message' => 'Danh sách quyền truy cập',
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $data = $request->all();

        $check = QuyenTruyCap::where('vai_tro_id', $data['vai_tro_id'])
            ->where('quyen_han_id', $data['quyen_han_id'])->get();

        if (!$check->isEmpty()) {
            return response()->json([
                'message' => 'Quyền đã được cấp từ trước',
            ]);
        }

        if ($data['quyen_han_id'] == 1 && $user->vai_tro_id != 99) {
            return response()->json([
                'message' => "Bạn không có quyền cấp Admin",
            ]);
        }

        QuyenTruyCap::create($data);
        return response()->json([
            'message' => 'Cấp quyền thành công',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = VaiTro::with('QuyenTruyCap')->find($id);
        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = QuyenTruyCap::find($id);
        if (!$data) {
            return response()->json([
                'message' => "Không tồn tại",
            ], 422);
        }
        $data->delete();
        return response()->json([
            'message' => "Gỡ quyền thành công",
        ]);
    }
}
