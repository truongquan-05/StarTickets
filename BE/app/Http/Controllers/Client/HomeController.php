<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Phim;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
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

        //  Ngẫu nhiên
        $phimDacBiet = Phim::inRandomOrder()->take(5)->get();

        return response()->json([
            'phim_dang_chieu' => $phimDangChieu,
            'phim_sap_chieu' => $phimSapChieu,
            'phim_dac_biet' => $phimDacBiet,
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
}
