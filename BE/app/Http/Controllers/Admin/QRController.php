<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ThanhToan;
use Illuminate\Http\Request;

class QRController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = ThanhToan::where('ma_giao_dich', $id)->first();
        if (empty($data)) {
            return response()->json([
                'message' => 'Không tìm thấy giao dịch',
            ], 422);
        }

        return response()->json([
            "id" => $data->id,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = ThanhToan::find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không tìm thấy giao dịch',
            ], 422);
        }
        $data->update([
            'da_quet' => true,
        ]);
        return response()->json([
            'message' => 'Cập nhật thành công',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
