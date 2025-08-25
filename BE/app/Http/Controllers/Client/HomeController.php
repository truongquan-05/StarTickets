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


        $phimDangChieu = Phim::whereDate('ngay_cong_chieu', '<=', $today)
            ->take(9)
            ->get();


        $phimSapChieu = Phim::whereDate('ngay_cong_chieu', '>=', $today)
            ->take(9)
            ->get();

        $phimDacBiet = Phim::where('loai_suat_chieu', 'Đặc biệt')
            ->take(9)
            ->get();

        return response()->json([
            'phim_dang_chieu' => $phimDangChieu,
            'phim_sap_chieu' => $phimSapChieu,
            'phim_dac_biet' => $phimDacBiet,

        ]);
    }

    public function getPhimDangChieu()
    {
        $today = Carbon::now()->toDateString();

        $phimDangChieu = Phim::whereDate('ngay_cong_chieu', '<=', $today)
            ->take(9)
            ->get();


        return $phimDangChieu;
    }

    public function getPhimSapChieu()
    {
        $now = Carbon::now();
        $today = $now->toDateString();

        $phimSapChieu = Phim::whereDate('ngay_cong_chieu', '>', $today)
            ->take(9)
            ->get();

        return $phimSapChieu;
    }

    public function getPhimDacBiet()
    {
        $phimDacBiet = Phim::where('loai_suat_chieu', 'Đặc biệt')
            ->take(9)
            ->get();
        return $phimDacBiet;
    }



    // Có trong lịch chiếu
    public function getAllPhimDangChieu()
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        $timeNow = $now->toTimeString();

        $phim = Phim::whereDate('ngay_cong_chieu', '<=', $today)
            ->get();


        return response()->json($phim);
    }

    public function getAllPhimDacBiet()
    {
        $phimDacBiet = Phim::where('loai_suat_chieu', 'Đặc biệt')
            ->get();
        return response()->json($phimDacBiet);
    }

    public function getAllPhimSapChieu()
    {
        $now = Carbon::now();
        $today = $now->toDateString();

        $phimSapChieu = Phim::whereDate('ngay_cong_chieu', '>', $today)

            ->get();

        return response()->json($phimSapChieu);
    }

    public function search(Request $request)
    {
        $query = Phim::query();

        // === Tìm kiếm theo tên hoặc mô tả ===
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('ten_phim', 'like', "%$keyword%");
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
        $phim =  $query->get();

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
        $ngayChieu = $request->input('ngay_cong_chieu');
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

        $phim = $query->get()
            ->map(function ($item) {
                $item->the_loai_id = json_decode($item->the_loai_id, true);
                return $item;
            })
            ->unique('id')   // Giữ lại duy nhất theo id phim
            ->values();      // Reset lại index (0,1,2,...)

        return response()->json($phim);
    }
}
