<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Phim;
use App\Models\GiaVe;
use App\Models\CheckGhe;
use App\Models\ChuyenNgu;
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
        $lichChieus = LichChieu::with(['phim', 'phong_chieu', 'chuyenngu', 'giaVe'])
            ->orderBy('id', 'desc')
            ->paginate(10);
        return response()->json($lichChieus);
    }

   
    public function store(Request $request)
    {
        try {
            
      
        $phim = Phim::find($request->phim_id);
        $duLieuPhim[] = $request->except('lich_chieu_them');


        if (!$phim) {
            return response()->json(['message' => 'Phim không tồn tại'], 422);
        }

        $validator = Validator::make($request->all(), [
            'phim_id' => 'required|exists:phim,id',
            'phong_id' => 'required|exists:phong_chieu,id',
            'gio_chieu' => 'required|date',
            'gio_ket_thuc' => 'required|date|after:gio_chieu',
        ]);


        $lichChieuThem = [];
        if ($request->get('lich_chieu_them') != null) {
            $lichChieuThem = $request->get('lich_chieu_them');

            foreach ($lichChieuThem as $item) {
                $duLieuPhim[] = [
                    "gia_ve" => $item['gia_ve'],
                    "chuyen_ngu_id" => $item['chuyen_ngu_id'],
                    "gio_chieu"  => $item['gio_chieu'],
                    "gio_ket_thuc" => $item['gio_ket_thuc'],
                    "phim_id" => $request->get('phim_id'),
                    "phong_id"  => $request->get('phong_id'),
                ];
            }
        }

        $validator->after(function ($validator) use ($phim, $duLieuPhim) {
            foreach ($duLieuPhim as $item) {
                $gioChieu = Carbon::parse($item['gio_chieu']);
                $gioKetThuc = Carbon::parse($item['gio_ket_thuc']);

                $ngayChieu = $gioChieu->toDateString(); // chỉ lấy phần ngày
                $ngayKetThuc = $gioKetThuc->toDateString(); // chỉ lấy phần ngày
                $ngayCongChieu = Carbon::parse($phim->ngay_cong_chieu)->toDateString();

                // 1. Ngày chiếu không được trước ngày công chiếu (nếu không phải "Sớm")
                if ($ngayChieu < $ngayCongChieu && $phim->loai_suat_chieu != "Sớm") {
                    $validator->errors()->add('err', 'Ngày chiếu không được trước ngày công chiếu.');
                }

                // 2. Ngày chiếu không được sau ngày kết thúc (nếu có)
                if (!empty($phim->ngay_ket_thuc)) {
                    $ngayKetThucPhim = Carbon::parse($phim->ngay_ket_thuc)->toDateString();
                    if ($ngayChieu > $ngayKetThucPhim) {
                        $validator->errors()->add('err', 'Ngày chiếu không được sau ngày kết thúc của phim.');
                    }
                }
            }
        });

        $dataLich = collect();
        foreach ($request->get('phong_id') as $item) {
            foreach ($duLieuPhim as $value) {
                $value['phong_id'] = $item;
                $dataLich = $dataLich->merge([$value]); // Bao $value trong mảng
            }
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()
            ], 422);
        }

        $ArrayData = $dataLich->toArray();

        foreach ($ArrayData as $key => $item) {
            $data[] = LichChieu::create($item);

            //MẢNG LƯU TẠM DATA GIÁ
            $DataTam[] = [
                'lich_chieu_id' => $data[$key]->id,
                'gia_ve' => $item['gia_ve'],
            ];
        }

        //TẠO GIÁ VÉ CHO MỖI LỊCH (THƯỜNG-VIP-ĐÔI)
        foreach ($DataTam as $key => $item) {
            for ($i = 1; $i <= 3; $i++) {
                if ($i == 1) {
                    $giaVe = $item['gia_ve'];
                } elseif ($i == 2) {
                    $giaVe = $item['gia_ve'] + $item['gia_ve'] * 0.3; // 30% so với giá thường
                } else {
                    $giaVe = $item['gia_ve'] * 2 + 10000;
                }
                $dataGiave[] = [
                    'lich_chieu_id' => $item['lich_chieu_id'],
                    'loai_ghe_id' => $i,
                    'gia_ve' => $giaVe
                ];
            }
        }
        $OK = GiaVe::insert($dataGiave);

        return response()->json([
            'message' => 'Thêm lịch chiếu thành công',
            'data' => $OK
        ], 201);
          } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi thêm lịch chiếu: ' . $th->getMessage(),
            ], 500);
        }
    }

    public function checkLichChieu(Request $request)
    {
        $data = $request->all();
        $phongIds = $request->get('phong_id');
        $dataLichThem = $request->get('lich_chieu_them');

        foreach ($phongIds as $phongId) {
            $duLieuPhim[] = [
                "phong_id"  => $phongId,
                "gio_chieu"  => $request->get('gio_chieu'),
                "gio_ket_thuc" => $request->get('gio_ket_thuc'),
            ];
            foreach ($dataLichThem as $item) {
                $duLieuPhim[] = [
                    "phong_id"  => $phongId,
                    "gio_chieu"  => $item['gio_chieu'],
                    "gio_ket_thuc" => $item['gio_ket_thuc'],
                ];
            }
        }

        $lichDangHD = collect();

        foreach ($duLieuPhim as $item) {
            $date = Carbon::parse($item['gio_chieu'])->toDateString();
            $lichTrongNgay = LichChieu::with('phim', 'phong_chieu')
                ->select('phong_id', 'gio_chieu', 'gio_ket_thuc', 'phim_id')
                ->where('phong_id', $item['phong_id'])
                ->whereDate('gio_chieu', $date)
                ->get();

            $lichDangHD = $lichDangHD->merge($lichTrongNgay);
        }

        //CHECK LICH CHIẾU TẠO HÀNG LOẠT
        foreach ($duLieuPhim as $keyOne => $checkData) {
            foreach ($duLieuPhim as $keyTwo => $item) {
                if ($keyOne === $keyTwo) continue; // Bỏ qua chính nó

                if ($checkData['phong_id'] == $item['phong_id']) {
                    $startA = strtotime($checkData['gio_chieu']);
                    $endA = strtotime($checkData['gio_ket_thuc']);
                    $startB = strtotime($item['gio_chieu']);
                    $endB = strtotime($item['gio_ket_thuc']);

                    // Nếu hai khoảng giao nhau
                    if ($startA < $endB && $startB < $endA) {
                        return response()->json([
                            'message' => "Không được trùng lịch chiếu trong cùng một phòng (khung giờ $checkData[gio_chieu] - $checkData[gio_ket_thuc] bị trùng với $item[gio_chieu] - $item[gio_ket_thuc])",
                            'trang_thai' => false
                        ], 422);
                    }
                }
            }
        }

        foreach ($duLieuPhim as $value) {
            foreach ($lichDangHD as $lich) {
                $lich['gio_chieu'] = Carbon::parse($lich['gio_chieu'])->format('Y-m-d H:i:s');
                $lich['gio_ket_thuc'] = Carbon::parse($lich['gio_ket_thuc'])->format('Y-m-d H:i:s');

                if ($lich['gio_chieu'] < $value['gio_ket_thuc'] && $lich['gio_ket_thuc'] > $value['gio_chieu']) {
                    return response()->json([
                        'message' => "Phòng {$lich['phong_chieu']['ten_phong']} đang hoạt động vào {$lich['gio_chieu']} đến {$lich['gio_ket_thuc']}",
                        'data' => [
                            'phim' => $lich->phim->ten_phim,
                            'gio_chieu' => $lich['gio_chieu'],
                            'gio_ket_thuc' => $lich['gio_ket_thuc']
                        ],
                        'trang_thai' => false
                    ], 422);
                }
            }
        }

        return response()->json([
            'message' => 'Phòng này không có lịch chiếu nào trùng với thời gian bạn đã chọn.',
            'data' => [],
            'trang_thai' => true
        ]);
    }

    public function show($id)
    {
        $lichChieu = LichChieu::with(['phim', 'phong_chieu', 'chuyenngu', 'giaVe'])->find($id);
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
        $phim = Phim::find($request->phim_id);

        if (!$phim) {
            return response()->json(['message' => 'Phim không tồn tại'], 422);
        }

        $validator = Validator::make($request->all(), [
            'phim_id' => 'required|exists:phim,id',
            'phong_id' => 'required|exists:phong_chieu,id',
            'gio_chieu' => 'required|date',
        ]);
        $validator->after(function ($validator) use ($phim, $request) {
            $gioChieu = Carbon::parse($request->gio_chieu);
            $gioKetThuc = Carbon::parse($request->gio_ket_thuc);

            $ngayChieu = $gioChieu->toDateString(); // chỉ lấy phần ngày
            $ngayKetThuc = $gioKetThuc->toDateString(); // chỉ lấy phần ngày
            $ngayCongChieu = Carbon::parse($phim->ngay_cong_chieu)->toDateString();

            // Ngày chiếu không được trước ngày công chiếu (nếu không phải "Sớm")
            if ($ngayChieu < $ngayCongChieu && $phim->loai_suat_chieu != "Sớm") {
                $validator->errors()->add('error', 'Ngày chiếu không được trước ngày công chiếu.');
            }

            // Ngày chiếu không được sau ngày kết thúc (nếu có)
            if (!empty($phim->ngay_ket_thuc)) {
                $ngayKetThucPhim = Carbon::parse($phim->ngay_ket_thuc)->toDateString();
                if ($ngayChieu > $ngayKetThucPhim) {
                    $validator->errors()->add('error', 'Ngày chiếu không được sau ngày kết thúc của phim.');
                }
            }

            // Ngày bắt đầu và kết thúc phải giống nhau
            if ($ngayChieu !== $ngayKetThuc) {
                $validator->errors()->add('error', 'Suất chiếu phải bắt đầu và kết thúc trong cùng một ngày.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                // 'message' => 'Dữ liệu không hợp lệ',
                'message' => $validator->errors()
            ], 422);
        }

        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'da_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này đã có vé được đặt, không thể sửa',
                ]);
            }
        }

        foreach ($ve as $item) {
            if ($item['trang_thai'] == 'dang_dat') {
                return response()->json([
                    'message' => 'Lịch chiếu này có 1 người đang đặt vé, quay lại sau ít phút',
                ], 422);
            }
        }

        //CHECK THỜI GIAN UPDATE LỊCH
        $phongId = $request->get('phong_id'); // rõ ràng hơn so với $IdPhong
        $ngayChieu = Carbon::parse($request->get('gio_chieu'))->toDateString(); // rõ nghĩa: chỉ ngày
        $gioChieu = Carbon::parse($request->get('gio_chieu'))->format('Y-m-d H:i:s');
        $gioKetThuc = Carbon::parse($request->get('gio_ket_thuc'))->format('Y-m-d H:i:s');

        $lichTrongNgay = LichChieu::with('phong_chieu')
            ->select('phong_id', 'gio_chieu', 'gio_ket_thuc')
            ->where('phong_id', $phongId)
            ->whereDate('gio_chieu', $ngayChieu)
            ->where('id', '!=', $id) // loại bỏ lịch chiếu hiện tại
            ->get();


        foreach ($lichTrongNgay as $item) {
            $item['gio_chieu'] = Carbon::parse($item['gio_chieu'])->format('Y-m-d H:i:s');
            $item['gio_ket_thuc'] = Carbon::parse($item['gio_ket_thuc'])->format('Y-m-d H:i:s');

            if ($item['gio_chieu'] < $gioKetThuc && $item['gio_ket_thuc'] > $gioChieu) {
                return response()->json([
                    'message' => "Đang có lịch hoạt động từ {$item['gio_chieu']} đến {$item['gio_ket_thuc']}",
                    'trang_thai' => false
                ], 422);
            }
        }

        //UPDATE GIÁ VÉ
        $giaVe = $request->get('gia_ve');
        $DataVeOld = GiaVe::where('lich_chieu_id', $id)->get();

        for ($i = 1; $i <= 3; $i++) {
            if ($i == 1) {
                $giaVeNew = $giaVe;
            } elseif ($i == 2) {
                $giaVeNew = $giaVe + $giaVe * 0.3;
            } else {
                $giaVeNew = $giaVe * 2 + 10000;
            }
            $dataGiave[] = [
                'id' => $DataVeOld[$i - 1]['id'],
                'lich_chieu_id' => $id,
                'loai_ghe_id' => $i,
                'gia_ve' => $giaVeNew
            ];
        }

        $lichChieu = LichChieu::find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 422);
        }


        $data = $request->all();

        LichChieu::find($id)->update($data);

        foreach ($dataGiave as $item) {
            GiaVe::find($item['id'])->update($item);
        }

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

    public function ChuyenNguIndex($id)
    {
        $chuyenNgu = ChuyenNgu::all();
        $chuyenNguPhim = Phim::select('chuyen_ngu')->where('id', $id)->first();

        if ($chuyenNguPhim && $chuyenNguPhim->chuyen_ngu) {
            $chuyen_ngu_array = json_decode($chuyenNguPhim->chuyen_ngu, true);
        } else {
            $chuyen_ngu_array = [];
        }

        $selectedIds = array_column($chuyen_ngu_array, 'id');

        // Lọc ra các chuyển ngữ trùng ID
        $chuyenNguDaChon = $chuyenNgu->filter(function ($item) use ($selectedIds) {
            return in_array($item->id, $selectedIds);
        });
        $chuyenNguDaChonArray = $chuyenNguDaChon->values()->all();

        return response()->json(
            [
                'message' => 'Danh sách chuyên ngữ',
                'data' => $chuyenNguDaChonArray,
            ]
        );
    }
}
