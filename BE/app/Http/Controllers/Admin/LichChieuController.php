<?php

namespace App\Http\Controllers\Admin;

use App\Models\CheckGhe;
use Carbon\Carbon;
use App\Models\LichChieu;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class LichChieuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lichChieus = LichChieu::with(['phim', 'phong_chieu'])
            ->orderBy('id', 'desc')
            ->paginate(10);
        return response()->json($lichChieus);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'phim_id' => 'required|exists:phim,id',
            'phong_id' => 'required|exists:phong_chieu,id',
            'gio_chieu' => 'required',
            'gio_ket_thuc' => 'required|after:gio_chieu',
        ]);
        if ($validate->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validate->errors()
            ], 422);
        }
        $data = LichChieu::create($request->all());
        return response()->json([
            'message' => 'Thêm lịch chiếu thành công',
            'data' => $data
        ], 201);
    }

    public function checkLichChieu(Request $request)
    {
        $data = $request->all();

        $date = date('Y-m-d', strtotime($request->get('gio_chieu')));

        $lichHoatDong = LichChieu::with('phim')
            ->select('phong_id', 'gio_chieu', 'gio_ket_thuc', 'phim_id')
            ->where('phong_id', $data['phong_id'])
            ->whereDate('gio_chieu', $date)
            ->get();

        foreach ($lichHoatDong as $lich) {
            $lich['gio_chieu'] = Carbon::parse($lich['gio_chieu'])->subMinutes(15)->format('Y-m-d H:i:s');
            $lich['gio_ket_thuc'] = Carbon::parse($lich['gio_ket_thuc'])->addMinutes(15)->format('Y-m-d H:i:s');

            if ($lich['gio_chieu'] <= $data['gio_chieu'] && $lich['gio_ket_thuc'] >= $data['gio_chieu']) {
                return response()->json([
                    'message' => 'Phòng này đang hoạt động.',
                    'data' => [
                        'phim' => $lich->phim->ten_phim,
                        'gio_chieu' => $lich['gio_chieu'],
                        'gio_ket_thuc' => $lich['gio_ket_thuc']
                    ],
                    'trang_thai' => false
                ], 422);
            } elseif ($lich['gio_chieu'] <= $data['gio_ket_thuc'] && $lich['gio_ket_thuc'] >= $data['gio_ket_thuc']) {
                return response()->json([
                    'message' => 'Phòng này đang hoạt động.',
                    'data' => [
                        'phim' => $lich->phim->ten_phim,
                        'gio_chieu' => $lich['gio_chieu'],
                        'gio_ket_thuc' => $lich['gio_ket_thuc']
                    ],
                    'trang_thai' => false
                ], 422);
            } elseif ($lich['gio_chieu'] >= $data['gio_chieu'] && $lich['gio_chieu'] <= $data['gio_ket_thuc']) {
                return response()->json([
                    'message' => 'Phòng này đang hoạt động.',
                    'data' => [
                        'phim' => $lich->phim->ten_phim,
                        'gio_chieu' => $lich['gio_chieu'],
                        'gio_ket_thuc' => $lich['gio_ket_thuc']
                    ],
                    'trang_thai' => false

                ], 422);
            }
        }
        if ($data['gio_chieu'] >= $data['gio_ket_thuc']) {
            return response()->json([
                'message' => 'Thời gian bắt đầu không được lớn hơn hoặc bằng thời gian kết thúc.',
                'data' => [],
                'trang_thai' => false
            ]);
        }


        return response()->json([
            'message' => 'Phòng này không có lịch chiếu nào trùng với thời gian bạn đã chọn.',
            'data' => [],
            'trang_thai' => true
        ]);
    }


    public function show($id)
    {
        $lichChieu = LichChieu::with(['phim', 'phong_chieu'])->find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 404);
        }
        return response()->json($lichChieu);
    }


    public function update(Request $request, $id)
    {
        $ve = CheckGhe::where('lich_chieu_id', $id)->get();

        //KHÔNG CHO UPDATE NẾU CÓ VÉ ĐÃ ĐƯỢC ĐẶT
        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'da_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này đã có vé được đặt, không thể sửa',
                ]);
            }
        }

        //KHÔNG CHO UPDATE NẾU CÓ NGƯỜI ĐANG ĐẶT 
        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'dang_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này có 1 người đang đặt vé, quay lại sau ít phút',
                ]);
            }
        }
        $lichChieu = LichChieu::find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 404);
        }

        $data = $request->all();
        LichChieu::where('id', $id)->update($data);
        return response()->json([
            'message' => 'Cập nhật lịch chiếu thành công',
            'data' => LichChieu::with(['phim', 'phong_chieu'])->find($id)
        ], 200);
    }


    public function destroy($id)
    {
        $lichChieu = LichChieu::find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 404);
        }

        //KHÔNG CHO XÓA NẾU CÓ VÉ ĐÃ ĐƯỢC ĐẶT
        $ve = CheckGhe::where('lich_chieu_id', $id)->get();
        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'da_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này đã có vé được đặt, không thể xóa',
                ]);
            }
        }

        //KHÔNG CHO XÓA NẾU CÓ NGƯỜI ĐANG ĐẶT 
        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'dang_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này có 1 người đang đặt vé, quay lại sau ít phút',
                ]);
            }
        }

        $lichChieu->delete();
        return response()->json([
            'message' => 'Xóa lịch chiếu thành công',
        ], 200);
    }


    public function restore(string $id)
    {
        $data = LichChieu::withTrashed()->find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }
        $data->restore();
        return response()->json([
            'message' => 'Khôi phục thành công',
            'data' => $data
        ]);
    }
    public function forceDelete(string $id)
    {
        $data = LichChieu::withTrashed()->find($id);
        if (!$data) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu'
            ], 404);
        }
        $data->forceDelete();
        return response()->json([
            'message' => 'Xóa vĩnh viễn thành công',
        ]);
    }
}
