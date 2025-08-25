<?php

namespace App\Http\Controllers\Client;

use App\Models\TinTuc;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TinTucController extends Controller
{
    public function index(Request $request)
    {
        $tinTuc = TinTuc::orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $tinTuc,
        ]);
    }
    public function show($id) // Bỏ chữ TinTuc là được 
    {

        $tintuc = TinTuc::find($id);

        if (!$tintuc) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tin tức.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết tin tức',
            'data' => $tintuc
        ], 200);
    }
}
