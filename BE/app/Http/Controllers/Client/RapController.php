<?php

namespace App\Http\Controllers\Client;

use App\Models\Rap;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
