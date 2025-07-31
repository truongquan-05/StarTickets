<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Phim;
use App\Models\DatVe;
use App\Models\DonDoAn;
use App\Models\LichChieu;
use App\Models\NguoiDung;
use App\Models\ThanhToan;
use App\Models\DatVeChiTiet;
use Illuminate\Http\Request;
use function PHPSTORM_META\map;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Rap;

use function Laravel\Prompts\select;

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
            $dulieu = DatVe::with('lichChieu')->find($item->dat_ve_id);

            $data->push($dulieu);
        }

        $grouped = $data->groupBy(function ($item) {
            return $item->lichChieu->phim_id;
        });

        // Đếm số lượng mỗi nhóm
        $result = $grouped->map(function ($items, $phim_id) {
            $phim = optional($items->first()->lichChieu)->phim;

            return [
                'phim' => $phim,
                'phim_id' => $phim_id,
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


    public function DoanhThu(Request $request)
    {
        $filter = $request->all();
        if (empty($filter)) {
            $DoanhThu = ThanhToan::with('datVe')->get();
            $tongDoanhThu = $DoanhThu->sum(fn($tt) => $tt->datVe->tong_tien ?? 0);

            $rapMax = DatVe::with('lichChieu.phong_chieu')->get();

            $groupRap = $rapMax->groupBy(function ($item) {
                return $item->lichChieu->phong_chieu->rap_id;
            });

            $resultRap = $groupRap->map(function ($items, $rap_id) {
                return [
                    'rap_id' => Rap::find($rap_id),
                    'tong_doanh_thu' => $items->sum('tong_tien'),
                ];
            })->sortByDesc('tong_doanh_thu')->first();

            $groupPhim = $rapMax->groupBy(function ($item) {
                return $item->lichChieu->phim_id;
            });
            $resultPhim = $groupPhim->map(function ($item, $i) {
                return [
                    'phim_id' => Phim::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien')

                ];
            })->sortByDesc('tong_doanh_thu')->first();

            $DoanhThuPhim = $groupPhim->map(function ($item, $i) {
                return [
                    'phim_id' => Phim::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien')

                ];
            })->sortByDesc('tong_doanh_thu')->take(5);


            $tongSoLuong = ThanhToan::count();

            $phuongThucTT = ThanhToan::with('phuongThuc')
                ->select(
                    'phuong_thuc_thanh_toan_id',
                    DB::raw('COUNT(id) as so_luong'),
                    DB::raw("ROUND(COUNT(id) * 100.0 / {$tongSoLuong}, 2) as phan_tram")
                )
                ->groupBy('phuong_thuc_thanh_toan_id')
                ->orderByDesc('so_luong')
                ->first();

            $tongRap = $groupRap->map(function ($item, $i) use ($tongDoanhThu) {
                return [
                    'rap_id' => Rap::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien'),
                    'chiem' => round($item->sum('tong_tien') / $tongDoanhThu * 100, 1)

                ];
            });

            $now = Carbon::now();
            $nam = $now->year;
            $rawData = DatVe::query()
                ->whereYear('created_at', $nam)
                ->selectRaw('DATE_FORMAT(created_at, "%m-%Y") as thang, SUM(tong_tien) as doanh_thu')
                ->groupBy('thang')
                ->orderByRaw('STR_TO_DATE(thang, "%m-%Y")')
                ->pluck('doanh_thu', 'thang');

            $doanhthunam = collect();
            for ($i = 1; $i <= 12; $i++) {
                $thang = str_pad($i, 2, '0', STR_PAD_LEFT) . '-' . $nam;
                $doanhthunam->put($thang, $rawData[$thang] ?? 0);
            }

            return response()->json([
                'doanhThu' => $tongDoanhThu,
                'rap' => $resultRap,
                'phimDoanhThuMax' => $resultPhim,
                'phuongThucTT' => $phuongThucTT,
                'doanhthurap' => $tongRap,
                'doanhthutheothang' => $doanhthunam,
                'DoanhThuPhim' => $DoanhThuPhim

            ]);
        } else {
            $batdau = Carbon::parse($filter['bat_dau'])->startOfDay();
            $ketthuc = Carbon::parse($filter['ket_thuc'])->endOfDay();
            $RapId = $filter['rap_id'] ?? null;
            $DoanhThu = ThanhToan::with('datVe.lichChieu.phong_chieu')
                ->whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('datVe.lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->get();
            $tongDoanhThu = $DoanhThu->sum(fn($tt) => $tt->datVe->tong_tien ?? 0);


            $rapMax = DatVe::with('lichChieu.phong_chieu')
                ->whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->get();

            $groupRap = $rapMax->filter(function ($item) {
                return $item->lichChieu && $item->lichChieu->phong_chieu;
            })
                ->groupBy(function ($item) {
                    return $item->lichChieu->phong_chieu->rap_id;
                });

            $resultRap = $groupRap->map(function ($items, $rap_id) {
                return [
                    'rap' => Rap::find($rap_id),
                    'tong_doanh_thu' => $items->sum('tong_tien'),
                ];
            })->sortByDesc('tong_doanh_thu')->first();

            $groupPhim = $rapMax->groupBy(function ($item) {
                return $item->lichChieu->phim_id;
            });
            $resultPhim = $groupPhim->map(function ($item, $i) {
                return [
                    'phim_id' => Phim::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien')

                ];
            })->sortByDesc('tong_doanh_thu')->first();


            $tongSoLuong = ThanhToan::whereBetween('created_at', [$batdau, $ketthuc])->count();

            $phuongThucTT = ThanhToan::with('phuongThuc', 'datVe.lichChieu.phong_chieu')
                ->select(
                    'phuong_thuc_thanh_toan_id',
                    DB::raw('COUNT(id) as so_luong'),
                    DB::raw("ROUND(COUNT(id) * 100.0 / {$tongSoLuong}, 2) as phan_tram")
                )
                ->whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('datVe.lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->groupBy('phuong_thuc_thanh_toan_id')
                ->orderByDesc('so_luong')
                ->first();


            $tongRap = $groupRap->map(function ($item, $i) use ($tongDoanhThu) {
                return [
                    'rap_id' => Rap::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien'),
                    'chiem' => round($item->sum('tong_tien') / $tongDoanhThu * 100, 1)

                ];
            });


            $now = Carbon::now();
            $nam = $now->year;

            $rawData = DatVe::query()
                ->when($RapId, function ($query) use ($RapId) {
                    $query->whereHas('lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->whereYear('created_at', $nam)
                ->selectRaw('DATE_FORMAT(created_at, "%m-%Y") as thang, SUM(tong_tien) as doanh_thu')
                ->groupBy('thang')
                ->orderByRaw('STR_TO_DATE(thang, "%m-%Y")')
                ->pluck('doanh_thu', 'thang');

            $doanhthunam = collect();
            for ($i = 1; $i <= 12; $i++) {
                $thang = str_pad($i, 2, '0', STR_PAD_LEFT) . '-' . $nam;
                $doanhthunam->put($thang, $rawData[$thang] ?? 0);
            }


            $DoanhThuPhim = $groupPhim->map(function ($item, $i) {
                return [
                    'phim_id' => Phim::find($i),
                    'tong_doanh_thu' => $item->sum('tong_tien')

                ];
            })->sortByDesc('tong_doanh_thu')->take(5);





            return response()->json([
                'doanhThu' => $tongDoanhThu,
                'rap' => $resultRap,
                'phimDoanhThuMax' => $resultPhim,
                'phuongThucTT' => $phuongThucTT,
                'doanhthurap' => $tongRap,
                'doanhthutheothang' => $doanhthunam,
                'DoanhThuPhim' => $DoanhThuPhim

            ]);
        }
    }
}
