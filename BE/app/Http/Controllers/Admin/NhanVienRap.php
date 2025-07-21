<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NhanVienRap as ModelsNhanVienRap;
use Illuminate\Http\Request;

class NhanVienRap extends Controller
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

        $data = $request->all();
        $nhanVienRap = ModelsNhanVienRap::where('vai_tro_id', $data['vai_tro_id'])
            ->first();
        if ($nhanVienRap) {
            return response()->json([
                'message' => 'Chỉ được quản lý 1 rạp duy nhất',
            ], 400);
        }
        ModelsNhanVienRap::create($data);

        return response()->json([
            'message' => 'Thêm thành công',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $nhanVienRap = ModelsNhanVienRap::with('rap')->where('vai_tro_id', $id)
            ->first();
        if (!$nhanVienRap) {
            return response()->json([
                'message' => 'Chưa quản lý rạp nào',
            ], 200);
        }
        return $nhanVienRap;
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
        //
    }
}
