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
        $now = Carbon::now();
        $today = $now->toDateString();
        $timeNow = $now->toTimeString();
        $tomorrow = $now->copy()->addDay()->toDateString();


        $phimDangChieuIds = DB::table('lich_chieu')
            ->whereDate('gio_chieu', $today)
            ->whereTime('gio_chieu', '>=', $timeNow)
            ->pluck('phim_id')
            ->unique();

        $phimDangChieu = Phim::whereIn('id', $phimDangChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->take(32)
            ->get();


        $phimCoLichChieuTuNgayMai = DB::table('lich_chieu')
            ->whereDate('gio_chieu', '>=', $tomorrow)
            ->pluck('phim_id');


        $phimKhongCoLichChieu = Phim::whereNotIn('id', DB::table('lich_chieu')->pluck('phim_id'))
            ->whereDate('ngay_cong_chieu', '>=', $tomorrow)
            ->pluck('id');


        $phimSapChieuIds = $phimCoLichChieuTuNgayMai
            ->merge($phimKhongCoLichChieu)
            ->unique()
            ->diff($phimDangChieuIds)        //loai bo phim giong
            ->values();

        $phimSapChieu = Phim::whereIn('id', $phimSapChieuIds)
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

        ]);
    }

    // Có trong lịch chiếu
    public function getAllPhimDangChieu()
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        $timeNow = $now->toTimeString();

        // Lấy các phim có lịch chiếu hôm nay và giờ chiếu >= hiện tại
        $phimDangChieuIds = DB::table('lich_chieu')
            ->whereDate('gio_chieu', $today)
            ->whereTime('gio_chieu', '>=', $timeNow)
            ->pluck('phim_id')
            ->unique();

        $phim = Phim::whereIn('id', $phimDangChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->get();

        return response()->json($phim);
    }

    public function getAllPhimSapChieu()
    {
        $now = Carbon::now();
        $tomorrow = $now->copy()->addDay()->toDateString();


        $phimCoLichChieuTuNgayMai = DB::table('lich_chieu')
            ->whereDate('gio_chieu', '>=', $tomorrow)
            ->pluck('phim_id');


        $phimKhongCoLichChieu = Phim::whereNotIn('id', DB::table('lich_chieu')->pluck('phim_id'))
            ->whereDate('ngay_cong_chieu', '>=', $tomorrow)
            ->pluck('id');

        // Gop lai all
        $phimDangChieuIds = DB::table('lich_chieu')
            ->whereDate('gio_chieu', $now->toDateString())
            ->whereTime('gio_chieu', '>=', $now->toTimeString())
            ->pluck('phim_id')
            ->unique();

        $phimSapChieuIds = $phimCoLichChieuTuNgayMai
            ->merge($phimKhongCoLichChieu)
            ->unique()
            ->diff($phimDangChieuIds) //loai tru phim dang chei
            ->values();

        $phim = Phim::whereIn('id', $phimSapChieuIds)
            ->orderBy('ngay_cong_chieu', 'desc')
            ->get();

        return response()->json($phim);
    }
    public function search(Request $request)
    {
        $query = Phim::query();

        // === Tìm kiếm theo tên hoặc mô tả ===
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_phim', 'like', "%$keyword%")
                    ->orWhere('mo_ta', 'like', "%$keyword%");
            });
        }

        //sap xep du lieu
        $allowedSorts = ['ten_phim', 'ngay_cong_chieu', 'thoi_luong'];
        $sortBy = $request->get('sort_by');
        $sortOrder = $request->get('sort_order', 'asc'); // tang dan

        if (in_array($sortBy, $allowedSorts)) {
            // Neu gia tri hop le moi dc dung
            $query->orderBy($sortBy, $sortOrder);
        } else {
            // neu truyen sai mac dinh nga moi nhat
            $query->orderBy('ngay_cong_chieu', 'desc');
        }

        // phan trang neu co
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
    public function getAllRap()
    {
        return DB::table('rap')
            ->select('id', 'ten_rap')
            ->orderBy('ten_rap')
            ->get();
    }


    public function getAllTheLoai()
    {
        return DB::table('the_loai')
            ->select('id', 'ten_the_loai')
            ->orderBy('ten_the_loai')
            ->get();
    }


    public function locPhimTheoRapNgayTheLoai(Request $request)
    {
        $rapId = $request->input('rap_id');
        $ngayChieu = $request->input('ngay_chieu');
        $theLoaiIds = $request->input('the_loai_id'); // Mảng ID

        if (!$rapId || !$ngayChieu) {
            return response()->json([]);
        }

        $query = DB::table('lich_chieu')
            ->join('phong_chieu', 'lich_chieu.phong_id', '=', 'phong_chieu.id')
            ->join('phim', 'lich_chieu.phim_id', '=', 'phim.id')
            ->where('phong_chieu.rap_id', $rapId)
            ->whereDate('lich_chieu.gio_chieu', $ngayChieu);

        // Lọc theo thể loại (ít nhất 1 khớp)
        if (is_array($theLoaiIds) && count($theLoaiIds)) {
            $query->where(function ($q) use ($theLoaiIds) {
                foreach ($theLoaiIds as $id) {
                    $q->orWhereJsonContains('phim.the_loai_id', ['id' => (int)$id]);
                }
            });
        }

        $phim = $query->select(
            'phim.id',
            'phim.ten_phim',
            'phim.mo_ta',
            'phim.ngay_cong_chieu',
            'phim.thoi_luong',
            'phim.the_loai_id'
        )
            ->distinct()
            ->get()
            ->map(function ($item) {
                $item->the_loai_id = json_decode($item->the_loai_id, true);
                return $item;
            });

        return response()->json($phim);
    }
}
