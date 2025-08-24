<?php

namespace App\Http\Controllers\Client;

use App\Models\Ghe;
use App\Models\PhongChieu;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class PhongChieuController extends Controller
{



    // Lấy danh sách phòng chiếu
    public function index(Request $request)
    {
        $search = $request->query('search');
        $rapId = $request->query('rap_id');
        $trangThai = $request->query('trang_thai');
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);

        $query = PhongChieu::with('ghes', 'rap')->whereNull('deleted_at');

        if ($search) {
            $query->where('ten_phong', 'like', "%{$search}%");
        }

        if ($rapId) {
            $query->where('rap_id', $rapId);
        }

        if ($trangThai !== null) {
            $query->where('trang_thai', $trangThai);
        }

        $phongChieus = $query->get();

        return response()->json([
            'data' => $phongChieus,
            'message' => 'Danh sách phòng chiếu',
          
        ], 200);
    }

    // Tạo phòng chiếu mới

    // Lấy chi tiết phòng chiếu
    public function show(PhongChieu $phongChieu)
    {
        if ($phongChieu->trashed()) {
            return response()->json(['message' => 'Phòng chiếu không tồn tại'], 404);
        }
        return response()->json($phongChieu->load('ghes', 'rap'), 200);
    }



}