<?php

namespace App\Http\Controllers\Client;

use Carbon\Carbon;
use App\Models\Phim;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth('sanctum')->user();
        $now = Carbon::now();
        $today = $now->toDateString();
        $timeNow = $now->toTimeString();

        //  Lịch chiếu hôm naygiờ >= hiện tại
        $phimDangChieu = Phim::whereHas('lichChieu', function ($query) use ($today, $timeNow) {
            $query->whereDate('gio_chieu', $today)
                  ->whereTime('gio_chieu', '>=', $timeNow);
        })
        ->select('phim.*')
        ->distinct()
        ->orderBy('ngay_cong_chieu', 'desc')
        ->take(32)
        ->get();

        //
        $phimCoLichChieuIds = DB::table('lich_chieu')->pluck('phim_id')->unique();

        //  Không có trong lịch chiếu
        $phimSapChieu = Phim::whereNotIn('id', $phimCoLichChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->take(9)
            ->get();

        //  all dac biet


$phimDacBiet = Phim::where('loai_suat_chieu', 'Đặc biệt')
    ->whereHas('lichChieu', function ($query) use ($now) {
        $query->where('gio_chieu', '>=', $now);
    })
    ->select('phim.*')
    ->distinct()
    ->orderBy('ngay_cong_chieu', 'desc')
    ->get();

        return response()->json([
            'phim_dang_chieu' => $phimDangChieu,
            'phim_sap_chieu' => $phimSapChieu,
            'phim_dac_biet' => $phimDacBiet,
            'login'=>$user
        ]);
    }

    // Có trong lịch chiếu
    public function getAllPhimDangChieu()
    {
        $phimCoLichChieuIds = DB::table('lich_chieu')->pluck('phim_id')->unique();

        $phim = Phim::whereIn('id', $phimCoLichChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->get();

        return response()->json($phim);
    }

    //  Không có lịch chiếu
    public function getAllPhimSapChieu()
    {
        $phimCoLichChieuIds = DB::table('lich_chieu')->pluck('phim_id')->unique();

        $phim = Phim::whereNotIn('id', $phimCoLichChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->get();

        return response()->json($phim);
    }
     public function search(Request $request)
    {
        $query = Phim::query();
        // theo ten va mo ta
        if ($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_phim', 'like', "%$keyword%")
                    ->orWhere('mo_ta', 'like', "%$keyword%");
            });
        }
        // theo ngay cong chieu
        if ($request->has('ngay_cong_chieu')) {
            $query->whereDate('ngay_cong_chieu', $request->ngay_cong_chieu);
        }
        //theo the loai
        if ($request->has('the_loai_id')) {
            $query->where('the_loai_id', $request->the_loai_id);
        }
        // theo trang thai
        if ($request->has('trang_thai_phim')) {
            $query->where('trang_thai_phim', $request->trang_thai_phim);
        }
        //theo quoc gia
           if ($request->filled('quoc_gia')) {
        $query->where('quoc_gia', $request->quoc_gia);
    }
    //theo do tuoi
     if ($request->filled('do_tuoi_gioi_han')) {
        $query->where('do_tuoi_gioi_han', $request->do_tuoi_gioi_han);
    }
    //theo loai suat chieu
    if ($request->filled('loai_suat_chieu')) {
        $query->where('loai_suat_chieu', $request->loai_suat_chieu);
    }
    //sap xep
        if ($request->filled('sort_by')) {
            $allowedSorts = ['ten_phim', 'ngay_cong_chieu', 'thoi_luong'];
            $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'ngay_cong_chieu';
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);
        }
        $phim = $request->has('paginate') ? $query->paginate(10) : $query->get();
        return response()->json($phim);
    }
     public function show($id)
    {
        $phim = Phim::with(['theLoai', 'lichChieu'])->find($id);

        if (!$phim) {
            return response()->json(['message' => 'Phim không tồn tại'], 404);
        }

        return response()->json($phim);
    }
}
