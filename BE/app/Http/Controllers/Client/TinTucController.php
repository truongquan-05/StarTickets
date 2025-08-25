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
}
