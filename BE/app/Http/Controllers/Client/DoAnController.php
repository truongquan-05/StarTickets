<?php

namespace App\Http\Controllers\Client;

use App\Models\DoAn;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DoAnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DoAn::with('rap')->FilterByRap('rap');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('ten_do_an', 'like', "%{$search}%");
        }

        // Phân trang
        $perPage = $request->input('per_page', 10);
        $items = $query->get();

        return response()->json(['data'=>$items]);
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
