<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DatVe;
use App\Models\DatVeChiTiet;
use App\Models\DonDoAn;
use App\Models\LichChieu;
use App\Models\NguoiDung;
use App\Models\Phim;
use App\Models\ThanhToan;

class DashboardController extends Controller
{

    public function index()
    {
        $now = Carbon::now();
        $thang = $now->month;
        $nam = $now->year;
        $thangTruoc = $now->copy()->subMonth()->month;

        $thangNam = $now->format('m-Y');

        // Doanh thu tháng này và tháng trước
        $donHangThangNay = ThanhToan::with('datVe')
            ->whereMonth('created_at', $thang)
            ->whereYear('created_at', $nam)
            ->get();

        $donHangThangtruoc = ThanhToan::with('datVe')
            ->whereMonth('created_at', $thangTruoc)
            ->whereYear('created_at', $nam)
            ->get();

        $tongDoanhThuNay = $donHangThangNay->sum(fn($tt) => $tt->datVe->tong_tien ?? 0);
        $tongDoanhThuTruoc = $donHangThangtruoc->sum(fn($tt) => $tt->datVe->tong_tien ?? 0);

        $DoanhThuVsThangtruoc = $tongDoanhThuTruoc > 0
            ? round((($tongDoanhThuNay / $tongDoanhThuTruoc) - 1) * 100, 2) . '%'
            : 'Không có dữ liệu';

        // Tổng vé
        $veThangNay = DatVeChiTiet::whereMonth('created_at', $thang)
            ->whereYear('created_at', $nam)
            ->count();

        $veThangTruoc = DatVeChiTiet::whereMonth('created_at', $thangTruoc)
            ->whereYear('created_at', $nam)
            ->count();

        $VeVsThangtruoc = $veThangTruoc > 0
            ? round((($veThangNay / $veThangTruoc) - 1) * 100, 2) . '%'
            : 'Không có dữ liệu';

        //DO AN
        $doAnThangNay = DonDoAn::whereMonth('created_at', $thang)
            ->whereYear('created_at', $nam)
            ->sum('so_luong');
        $doAnThangTruoc = DonDoAn::whereMonth('created_at', $thangTruoc)
            ->whereYear('created_at', $nam)
            ->sum('so_luong');
        $DoAnVsThangtruoc = $doAnThangTruoc > 0
            ? round((($doAnThangNay / $doAnThangTruoc) - 1) * 100, 2) . '%'
            : 'Không có dữ liệu';

        //NGUOI DUNG
        $NguoiDungThangNay = NguoiDung::whereMonth('created_at', $thang)
            ->whereYear('created_at', $nam)
            ->count();

        $NguoiDungThangTruoc = NguoiDung::whereMonth('created_at', $thangTruoc)
            ->whereYear('created_at', $nam)
            ->count();

        $NguoiDungVsThangtruoc = $NguoiDungThangTruoc > 0
            ? round((($NguoiDungThangNay / $NguoiDungThangTruoc) - 1) * 100, 2) . '%'
            : 'Không có dữ liệu';

        return response()->json([
            'tongDoanhThuNay' => $tongDoanhThuNay,
            'veThangNay' => $veThangNay,
            'doAnThangNay' => $doAnThangNay,
            'NguoiDungThangNay' => $NguoiDungThangNay,
            'DoanhThuVsThangtruoc' => $DoanhThuVsThangtruoc,
            'VeVsThangtruoc' => $VeVsThangtruoc,
            'DoAnVsThangtruoc' => $DoAnVsThangtruoc,
            'NguoiDungVsThangtruoc' => $NguoiDungVsThangtruoc
        ]);
    }



    public function DoanhThuNam()
    {
        $now = Carbon::now();
        $nam = $now->year;
        $rawData = DatVe::query()
            ->whereYear('created_at', $nam)
            ->selectRaw('DATE_FORMAT(created_at, "%m-%Y") as thang, SUM(tong_tien) as doanh_thu')
            ->groupBy('thang')
            ->orderByRaw('STR_TO_DATE(thang, "%m-%Y")')
            ->pluck('doanh_thu', 'thang');

        $data = collect();
        for ($i = 1; $i <= 12; $i++) {
            $thang = str_pad($i, 2, '0', STR_PAD_LEFT) . '-' . $nam;
            $data->put($thang, $rawData[$thang] ?? 0);
        }

        return response()->json([
            'data' => $data,
        ]);
    }


    //TOP 5 PHIM
    public function PhimDoanhThuCaoNhat()
    {

        $DatVe = DatVeChiTiet::all();
        $data = collect();
        foreach ($DatVe as $item) {
            $dulieu = DatVe::find($item->dat_ve_id);

            $data->push($dulieu);
        }
        $grouped = $data->groupBy('lich_chieu_id');

        // Đếm số lượng mỗi nhóm
        $result = $grouped->map(function ($items, $lich_chieu_id) {
            $phim = LichChieu::with('phim')->find($lich_chieu_id);
            return [
                'phim' => $phim->phim,
                'lich_chieu_id' => $lich_chieu_id,
                'doanh_thu' => $items->sum('tong_tien'),
                'so_luong' => $items->count(),
            ];
        })->values()
        ->sortByDesc('doanh_thu')
        ->take(5)
        ->values();





        return response()->json([
            'data' => $result,
        ]);
    }


















    public function store(Request $request)
    {
        //
    }


    public function show(string $id)
    {
        //
    }


    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        //
    }
}
