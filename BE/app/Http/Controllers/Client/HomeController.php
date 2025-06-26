<?php

namespace App\Http\Controllers\Client;

use Carbon\Carbon;
use App\Models\Rap;
use App\Models\Phim;
use App\Models\TheLoai;
use App\Models\LichChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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


    //loc phim
    public function getDanhSachRap()
    {
        return response()->json(Rap::all());
    }

    // lay ngay theo rap
    public function getNgayChieuTheoRap(Request $request)
    {
        $ngayChieu = LichChieu::where('rap_id', $request->rap_id)
            ->selectRaw('DATE(gio_chieu) as ngay')
            ->distinct()
            ->pluck('ngay');

        return response()->json($ngayChieu);
    }

    // lay the loai theo rap + ngay
    public function getTheLoaiTheoRapVaNgay(Request $request)
    {
        $phimIds = LichChieu::where('rap_id', $request->rap_id)
            ->whereDate('gio_chieu', $request->ngay)
            ->pluck('phim_id');

        $theLoais = TheLoai::whereHas('phim', function ($q) use ($phimIds) {
            $q->whereIn('id', $phimIds);
        })->get();

        return response()->json($theLoais);
    }

    // lay phim thao rap + ngay +the loai
    public function getPhimTheoLoc(Request $request)
    {
        $query = Phim::query();

        $query->whereHas('lichChieu', function ($q) use ($request) {
            $q->where('rap_id', $request->rap_id)
              ->whereDate('gio_chieu', $request->ngay);
        });

        $query->where('the_loai_id', $request->the_loai_id);

        return response()->json($query->get());
    }
}
