<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChuyenNgu;
use Illuminate\Http\Request;

class ChuyenNguController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $chuyenNgu = ChuyenNgu::all();
        return response()->json([
            'message' => 'Danh sách chuyên ngữ',
            'data' => $chuyenNgu
        ]);
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
        //
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
