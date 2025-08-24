<?php

namespace App\Http\Controllers\Client;

use App\Models\Phim;
use App\Models\GiaVe;
use App\Models\CheckGhe;
use App\Models\ChuyenNgu;
use App\Models\LichChieu;
use App\Models\PhongChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class LichChieuController extends Controller
{




    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lichChieus = LichChieu::with(['phim', 'phong_chieu.rap', 'chuyenngu', 'giaVe'])
            ->orderBy('id', 'desc')
            ->get();
        return response()->json(['data'=>$lichChieus]);
    }


    public function show($id)
    {
        $lichChieu = LichChieu::with(['phim', 'phong_chieu', 'chuyenngu', 'giaVe'])->find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 404);
        }
        return response()->json($lichChieu);
    }
    

}