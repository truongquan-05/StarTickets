<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Rap;
use App\Models\Phim;
use App\Models\DatVe;
use App\Models\DonDoAn;
use App\Models\CheckGhe;
use App\Models\NguoiDung;
use App\Models\ThanhToan;
use App\Models\DatVeChiTiet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;


class DashboardController extends Controller
{



    public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:Dashboard-read')->only('thongKeVe', 'DoanhThu');
    }



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
         $dulieu->tien_ve = $item->gia_ve;
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
                'doanh_thu' => $items->sum('tien_ve'),
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
        if (empty($filter) || empty($filter['bat_dau'])) {
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
                    DB::raw(
                        $tongSoLuong > 0
                            ? "ROUND(COUNT(id) * 100.0 / {$tongSoLuong}, 2) as phan_tram"
                            : "0 as phan_tram"
                    ),
                    DB::raw('SUM((SELECT tong_tien FROM dat_ve WHERE dat_ve.id = thanh_toan.dat_ve_id)) as doanh_thu')


                )
                ->groupBy('phuong_thuc_thanh_toan_id')
                ->orderByDesc('so_luong')
                ->first();


            $tongRap = $groupRap->map(function ($item, $i) use ($tongDoanhThu) {
                $tongTien = $item->sum('tong_tien');
                return [
                    'rap_id' => Rap::find($i),
                    'tong_doanh_thu' => $tongTien,
                    'chiem' => $tongDoanhThu > 0 ? round($tongTien / $tongDoanhThu * 100, 1) : 0,
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
                'rap' => $resultRap ?? 0,
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


            $tongSoLuong = ThanhToan::whereBetween('created_at', [$batdau, $ketthuc])->when($RapId !== null, function ($query) use ($RapId) {
                $query->whereHas('datVe.lichChieu.phong_chieu', function ($q) use ($RapId) {
                    $q->where('rap_id', $RapId);
                });
            })
                ->count();

            if ($tongSoLuong === 0) {
                $phuongThucTT = null;
            } else {
                $phuongThucTT = ThanhToan::with('phuongThuc', 'datVe.lichChieu.phong_chieu')
                    ->select(
                        'phuong_thuc_thanh_toan_id',
                        DB::raw('COUNT(id) as so_luong'),
                        DB::raw("ROUND(COUNT(id) * 100.0 / {$tongSoLuong}, 2) as phan_tram"),
                        DB::raw('SUM((SELECT tong_tien FROM dat_ve WHERE dat_ve.id = thanh_toan.dat_ve_id)) as doanh_thu')
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
            }


            $tongRap = $groupRap->map(function ($item, $i) use ($tongDoanhThu) {
                $rap = Rap::find($i);
                $doanhThu = $item->sum('tong_tien');

                return [
                    'rap_id' => $rap,
                    'tong_doanh_thu' => $doanhThu,
                    'chiem' => $tongDoanhThu > 0 ? round($doanhThu / $tongDoanhThu * 100, 1) : 0
                ];
            });
            $startYear = $batdau->year;
            $endYear = $ketthuc->year;

            $rawData = DatVe::query()
                ->when($RapId, function ($query) use ($RapId) {
                    $query->whereHas('lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->whereBetween('created_at', [$batdau, $ketthuc])
                ->selectRaw('DATE_FORMAT(created_at, "%m-%Y") as thang, SUM(tong_tien) as doanh_thu')
                ->groupBy('thang')
                ->orderByRaw('STR_TO_DATE(thang, "%m-%Y")')
                ->pluck('doanh_thu', 'thang');

            $doanhthunam = collect();

            for ($year = $startYear; $year <= $endYear; $year++) {
                for ($month = 1; $month <= 12; $month++) {
                    $thang = str_pad($month, 2, '0', STR_PAD_LEFT) . '-' . $year;
                    $doanhthunam->put($thang, $rawData[$thang] ?? 0);
                }
            }


            $DoanhThuPhim[] = $groupPhim->map(function ($item, $i) {
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

    public function thongKeVe(Request $request)
    {
        $filter = $request->all();
        if (empty($filter) || empty($filter['bat_dau'])) {
            $VeBanRa = DatVeChiTiet::count();

            $VeBanRaThang = DatVeChiTiet::whereMonth('created_at', Carbon::now()->month)
                ->count();
            $gioCaoDiem = DatVeChiTiet::selectRaw('HOUR(created_at) as gio')
                ->groupBy('gio')
                ->orderByDesc('gio')
                ->first();

            $dataGioCaoDiem = $gioCaoDiem
                ? str_pad($gioCaoDiem->gio, 2, '0', STR_PAD_LEFT) . ':00'
                : '--:--';


            $lapDayRap = CheckGhe::count();
            $gheDaDat = $lapDayRap > 0
                ? round(CheckGhe::where('trang_thai', 'da_dat')->count() / $lapDayRap * 100, 2)
                : 0;


            $tiLeLapDay =  str_pad(round($gheDaDat, 2), 0, '0', STR_PAD_LEFT) . '%';


            $rawData = DatVe::selectRaw('HOUR(created_at) as gio, COUNT(*) as so_lan')
                ->groupBy('gio')
                ->orderByDesc('so_lan')
                ->limit(5)
                ->pluck('so_lan', 'gio');

            $gioMuaNhieu = [];
            foreach ($rawData as $gio => $so_lan) {
                $label = str_pad($gio, 2, '0', STR_PAD_LEFT) . ':00';
                $gioMuaNhieu[$label] = (int) $so_lan;
            }


            //TOP PHIM BAN CHAY
            $DatVe = DatVeChiTiet::all();
            $data = collect();

            foreach ($DatVe as $item) {
                $dulieu = DatVe::with('lichChieu')->find($item->dat_ve_id);

                $data->push($dulieu);
            }

            $tongPhimBanRa = DatVeChiTiet::count();

            $grouped = $data->groupBy(function ($item) {
                return $item->lichChieu->phim_id;
            });

            $phimBanChay = $grouped->map(function ($items, $phim_id) use ($tongPhimBanRa) {
                $phim = optional($items->first()->lichChieu)->phim;

                return [
                    'phim' => optional($phim)->ten_phim ?? 'Không xác định',
                    'phan_tram' => $tongPhimBanRa > 0 ? round($items->count() / $tongPhimBanRa * 100, 2) : 0,
                ];
            })->values()
                ->sortByDesc('phan_tram')
                ->take(7)
                ->values();

            $phanTranKhac = 100 -  $phimBanChay->sum('phan_tram');

            $phimBanChay->push([
                'phim' => 'Khác',
                'phan_tram' => round($phanTranKhac, 2),
            ]);

            //PHAN LOAI VE

            $tongGheDuocBan = CheckGhe::where('trang_thai', 'da_dat')->get()->count();
            $gheThuong = CheckGhe::where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 1);
                })
                ->count();


            $gheDoi = CheckGhe::where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 3);
                })
                ->count();
            $gheVip = CheckGhe::where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 2);
                })
                ->count();

            $phanLoaiGhe = collect();

            $phanLoaiGhe->push([
                'gheThuong' => $tongGheDuocBan > 0 ? round($gheThuong / $tongGheDuocBan * 100, 2) : 0,
                'gheDoi'    => $tongGheDuocBan > 0 ? round($gheDoi / $tongGheDuocBan * 100, 2) : 0,
                'gheVip'    => $tongGheDuocBan > 0 ? round($gheVip / $tongGheDuocBan * 100, 2) : 0,
            ]);



            //TOP 5 GIO HOT
            $now = Carbon::now();

            $gioCaoDiemTop5 = DatVeChiTiet::selectRaw('HOUR(created_at) as gio, count(*) as so_luong')
                ->whereDate('created_at', $now->toDateString())
                ->groupBy('gio')
                ->orderByDesc('so_luong')
                ->take(5)
                ->get();

            $dataGioCaoDiemTop5 = [];
            foreach ($gioCaoDiemTop5 as $item) {
                $dataGioCaoDiemTop5[] = str_pad($item->gio, 2, '0', STR_PAD_LEFT) . ':00';
            }


            //TI LE LAP DAY
            $tongGheOfRap = CheckGhe::whereHas('Ghe.phong.rap')
                ->with('Ghe.phong.rap')
                ->get()
                ->groupBy('Ghe.phong.rap_id')
                ->map(function ($items) {
                    return count($items);
                });
            $dataGheOfRap = CheckGhe::where('trang_thai', 'da_dat')
                ->whereHas('Ghe.phong.rap')
                ->with('Ghe.phong.rap')
                ->get()
                ->groupBy('Ghe.phong.rap_id')
                ->map(function ($items) {
                    return count($items);
                });
            $tyLeDat = $tongGheOfRap->map(function ($tong, $rap_id) use ($dataGheOfRap) {
                $daDat = $dataGheOfRap->get($rap_id, 0);
                return $tong > 0 ? round($daDat / $tong * 100, 2) : 0;
            });

            $dataLapDayRap = collect();

            foreach ($tyLeDat as $k => $v) {
                $dataLapDayRap->push([
                    'rap' => Rap::select('ten_rap')->find($k)->ten_rap,
                    'daDatChiem' => $v
                ]);
            }

            return response()->json([
                'tongVe' => $VeBanRa,
                'trungBinhNgay' => round($VeBanRaThang / 30, 2),
                'gioCaoDiem' => $dataGioCaoDiem,
                'tiLeLapDay' => $tiLeLapDay,
                'xuHuongve' => $gioMuaNhieu,
                'phimBanChay' => $phimBanChay,
                'phanLoaiGhe' => $phanLoaiGhe,
                'gioCaoDiemTop5' => $gioCaoDiemTop5,
                'tyLeDat' => $dataLapDayRap
            ]);
        } else {
            $batdau = Carbon::parse($filter['bat_dau'])->startOfDay();
            $ketthuc = Carbon::parse($filter['ket_thuc'])->endOfDay();
            $RapId = $filter['rap_id'] ?? null;

            $VeBanRa = DatVeChiTiet::whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('GheDat.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->count();

            $VeBanRaThang = DatVeChiTiet::whereMonth('created_at', Carbon::now()->month)
                ->count();

            $gioCaoDiem = DatVeChiTiet::selectRaw('HOUR(created_at) as gio')
                ->whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('GheDat.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->groupBy('gio')
                ->orderByDesc('gio')
                ->first();

            $gio = $gioCaoDiem ? str_pad($gioCaoDiem->gio, 2, '0', STR_PAD_LEFT) . ':00' : null;

            $lapDayRap = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->count();

            if ($lapDayRap > 0) {
                $gheDaDat = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                    ->when($RapId !== null, function ($query) use ($RapId) {
                        $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                            $q->where('rap_id', $RapId);
                        });
                    })->where('trang_thai', 'da_dat')->count();

                $tiLeLapDay = str_pad(round($gheDaDat / $lapDayRap * 100, 2), 0, '0', STR_PAD_LEFT) . '%';
            } else {
                $tiLeLapDay = '0%';
            }

            $rawData = DatVe::whereBetween('created_at', [$batdau, $ketthuc])->selectRaw('HOUR(created_at) as gio, COUNT(*) as so_lan')
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('lichChieu.phong_chieu', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })
                ->groupBy('gio')
                ->orderByDesc('so_lan')
                ->limit(5)
                ->pluck('so_lan', 'gio');

            $gioMuaNhieu = [];
            foreach ($rawData as $gio => $so_lan) {
                $label = str_pad($gio, 2, '0', STR_PAD_LEFT) . ':00';
                $gioMuaNhieu[$label] = (int) $so_lan;
            }

            //
            $DatVe = DatVeChiTiet::whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('GheDat.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->get();
            $data = collect();

            foreach ($DatVe as $item) {
                $dulieu = DatVe::with('lichChieu')->find($item->dat_ve_id);

                $data->push($dulieu);
            }


            $tongPhimBanRa = DatVeChiTiet::whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('GheDat.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->count();

            $grouped = $data->groupBy(function ($item) {
                return $item->lichChieu->phim_id;
            });

            $phimBanChay = $grouped->map(function ($items, $phim_id) use ($tongPhimBanRa) {
                $phim = optional(optional($items->first())->lichChieu)->phim;

                return [
                    'phim' => optional($phim)->ten_phim ?? 'Không xác định',
                    'phan_tram' => $tongPhimBanRa > 0 ? round($items->count() / $tongPhimBanRa * 100, 2) : 0,
                ];
            })->values()
                ->sortByDesc('phan_tram')
                ->take(7)
                ->values();


            $phanTranKhac = 100 -  $phimBanChay->sum('phan_tram');

            $phimBanChay->push([
                'phim' => 'Khác',
                'phan_tram' => round($phanTranKhac, 2),
            ]);
            //PHAN LOAI VE

            $tongGheDuocBan = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                ->where('trang_thai', 'da_dat')
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->get()->count();
            $gheThuong = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                ->where('trang_thai', 'da_dat')
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 1);
                })
                ->count();


            $gheDoi = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                ->where('trang_thai', 'da_dat')
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 3);
                })
                ->count();
            $gheVip = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])
                ->where('trang_thai', 'da_dat')
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->where('trang_thai', 'da_dat')
                ->whereHas('Ghe', function ($query) {
                    $query->where('loai_ghe_id', 2);
                })
                ->count();

            $phanLoaiGhe = collect();

            if ($tongGheDuocBan > 0) {
                $phanLoaiGhe->push(
                    [
                        'gheThuong' => round($gheThuong / $tongGheDuocBan * 100, 2),
                        'gheDoi' => round($gheDoi / $tongGheDuocBan * 100, 2),
                        'gheVip' => round($gheVip / $tongGheDuocBan * 100, 2),
                    ]
                );
            } else {
                $phanLoaiGhe->push(
                    [
                        'gheThuong' => 0,
                        'gheDoi' => 0,
                        'gheVip' => 0,
                    ]
                );
            }

            $now = Carbon::now();

            $gioCaoDiemTop5 = DatVeChiTiet::whereBetween('created_at', [$batdau, $ketthuc])
                ->when($RapId !== null, function ($query) use ($RapId) {
                    $query->whereHas('GheDat.phong', function ($q) use ($RapId) {
                        $q->where('rap_id', $RapId);
                    });
                })->selectRaw('HOUR(created_at) as gio, count(*) as so_luong')
                ->whereDate('created_at', $now->toDateString())
                ->groupBy('gio')
                ->orderByDesc('so_luong')
                ->take(5)
                ->get();

            $dataGioCaoDiemTop5 = [];
            foreach ($gioCaoDiemTop5 as $item) {
                $dataGioCaoDiemTop5[] = str_pad($item->gio, 2, '0', STR_PAD_LEFT) . ':00';
            }


            //TI LE LAP DAY
            $tongGheOfRap = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])->when($RapId !== null, function ($query) use ($RapId) {
                $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                    $q->where('rap_id', $RapId);
                });
            })->whereHas('Ghe.phong.rap')
                ->with('Ghe.phong.rap')
                ->get()
                ->groupBy('Ghe.phong.rap_id')
                ->map(function ($items) {
                    return count($items);
                });
            $dataGheOfRap = CheckGhe::whereBetween('created_at', [$batdau, $ketthuc])->when($RapId !== null, function ($query) use ($RapId) {
                $query->whereHas('Ghe.phong', function ($q) use ($RapId) {
                    $q->where('rap_id', $RapId);
                });
            })->where('trang_thai', 'da_dat')
                ->whereHas('Ghe.phong.rap')
                ->with('Ghe.phong.rap')
                ->get()
                ->groupBy('Ghe.phong.rap_id')
                ->map(function ($items) {
                    return count($items);
                });

            $tyLeDat = $tongGheOfRap->map(function ($tong, $rap_id) use ($dataGheOfRap) {
                if ($tong > 0) {
                    $daDat = $dataGheOfRap->get($rap_id, 0);
                    return round($daDat / $tong * 100, 2); // phần trăm
                }
                return 0;
            });

            $dataLapDayRap = collect();

            foreach ($tyLeDat as $k => $v) {
                $dataLapDayRap->push([
                    'rap' => Rap::select('ten_rap')->find($k)->ten_rap,
                    'daDatChiem' => $v
                ]);
            }



            return response()->json([
                'tongVe' => $VeBanRa,
                'trungBinhNgay' => round($VeBanRaThang / 30, 2),
                'gioCaoDiem' => $gio,
                'tiLeLapDay' => $tiLeLapDay,
                'xuHuongve' => $gioMuaNhieu,
                'phimBanChay' => $phimBanChay,
                'phanLoaiGhe' => $phanLoaiGhe,
                'gioCaoDiemTop5' => $gioCaoDiemTop5,
                'tyLeDat' => $dataLapDayRap
            ]);
        }
    }
}
