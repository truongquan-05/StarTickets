<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ThanhToan;
use App\Models\LichChieu;
use App\Models\Phim;


class QuanLyDonVeController extends Controller
{
  public function __construct()
    {

        $this->middleware('IsAdmin');
        $this->middleware('permission:Ve-read')->only(['index', 'show','loc']);
        $this->middleware('permission:Ve-create')->only(['store']);
        $this->middleware('permission:Ve-update')->only(['update']);
        $this->middleware('permission:Ve-delete')->only(['destroy']);
    }


    // hien thi danh sach
    public function index()
    {
        $donVe = ThanhToan::with([
            'nguoiDung:id,ten,email',
            'phuongThuc:id,ten',
            'datVe:id,lich_chieu_id,tong_tien',
            'datVe.lichChieu',
            'datVe.lichChieu.phim',
            'datVe.lichChieu.phong_chieu.rap',
        ])->FilterByRap('datVe.lichChieu.phong_chieu.rap')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $donVe
        ]);
    }

    // Xem chi tiet
    public function show($id)
    {
        $donVe = ThanhToan::with([
            'nguoiDung:id,ten,email,so_dien_thoai',
            'phuongThuc:id,ten',
            'datVe:id,lich_chieu_id,tong_tien',
            'datVe.lichChieu',
            'datVe.lichChieu.phim',
            'datVe.lichChieu.phong_chieu.rap',
            'datVe.DatVeChiTiet.GheDat',
            'datVe.DonDoAn',
            'datVe.DonDoAn.DoAn'
        ])->find($id);

        if (!$donVe) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn vé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $donVe
        ]);
    }

    //loc don ve theo ngay vaf phim(co trong lich)
    public function loc(Request $request)
    {
        $query = ThanhToan::with([
            'nguoiDung:id,ten,email',
            'phuongThuc:id,ten',
            'datVe:id,lich_chieu_id,tong_tien',
            'datVe.lichChieu:id,phim_id,gio_chieu',
            'datVe.lichChieu.phim:id,ten_phim'
        ]);

        // Loc phim neu co
        if ($request->filled('phim_id')) {
            $query->whereHas('datVe.lichChieu', function ($q) use ($request) {
                $q->where('phim_id', $request->phim_id);
            });
        }

        // Loc ngay neu co
        if ($request->filled('ngay')) {
            $query->whereDate('created_at', $request->ngay);
        }

        $donVe = $query->latest()->get();

        if ($donVe->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn vé'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $donVe
        ]);
    }

    // danh sach phim co trong lich dung cho loc
    public function phimCoLichChieu()
    {
        $phimIds = LichChieu::distinct()->pluck('phim_id');

        $phim = Phim::whereIn('id', $phimIds)
            ->select('id', 'ten_phim')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $phim
        ]);
    }
}
