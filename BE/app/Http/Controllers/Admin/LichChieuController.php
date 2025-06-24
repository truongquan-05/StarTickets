<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use App\Models\Phim;
use App\Models\CheckGhe;
use App\Models\LichChieu;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ChuyenNgu;
use Illuminate\Support\Facades\Validator;

class LichChieuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lichChieus = LichChieu::with(['phim', 'phong_chieu', 'chuyenngu'])
            ->orderBy('id', 'desc')
            ->paginate(10);
        return response()->json($lichChieus);
    }


    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
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
                    "chuyen_ngu_id" => $item['chuyen_ngu_id'],
                    "gio_chieu"  => $item['gio_chieu'],
                    "gio_ket_thuc" => $item['gio_ket_thuc'],
                    "phim_id" => $request->get('phim_id'),
                    "phong_id"  => $request->get('phong_id'),
                ];
            }
        }
        // dd($lichChieuThem);
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
        $data = LichChieu::insert($dataLich->toArray());
        return response()->json([
            'message' => 'Thêm lịch chiếu thành công',
            'data' => $dataLich
        ], 201);
    }

    public function checkLichChieu(Request $request)
    {
        $data = $request->all();
        // $duLieuPhim[] = $request->only('gio_chieu', 'gio_ket_thuc');
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
        // dd($duLieuPhim);

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

                if ($lich['gio_chieu'] <= $value['gio_chieu'] && $lich['gio_ket_thuc'] >= $value['gio_chieu']) {
                    return response()->json([
                        'message' => "Phòng {$lich['phong_chieu']['ten_phong']} đang hoạt động vào {$lich['gio_chieu']} đến {$lich['gio_ket_thuc']}",

                        'data' => [
                            'phim' => $lich->phim->ten_phim,
                            'gio_chieu' => $lich['gio_chieu'],
                            'gio_ket_thuc' => $lich['gio_ket_thuc']
                        ],
                        'trang_thai' => false
                    ], 422);
                } elseif ($lich['gio_chieu'] <= $value['gio_ket_thuc'] && $lich['gio_ket_thuc'] >= $value['gio_ket_thuc']) {
                    return response()->json([
                        'message' => "Phòng {$lich['phong_chieu']['ten_phong']} đang hoạt động vào {$lich['gio_chieu']} đến {$lich['gio_ket_thuc']}",
                        'data' => [
                            'phim' => $lich->phim->ten_phim,
                            'gio_chieu' => $lich['gio_chieu'],
                            'gio_ket_thuc' => $lich['gio_ket_thuc']
                        ],
                        'trang_thai' => false
                    ], 422);
                } elseif ($lich['gio_chieu'] >= $value['gio_chieu'] && $lich['gio_chieu'] <= $value['gio_ket_thuc']) {
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
        $lichChieu = LichChieu::with(['phim', 'phong_chieu', 'chuyenngu'])->find($id);
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
            'gio_ket_thuc' => 'required|date|after:gio_chieu',
        ]);
        $validator->after(function ($validator) use ($phim, $request) {
            $gioChieu = Carbon::parse($request->gio_chieu);
            $gioKetThuc = Carbon::parse($request->gio_ket_thuc);

            $ngayChieu = $gioChieu->toDateString(); // chỉ lấy phần ngày
            $ngayKetThuc = $gioKetThuc->toDateString(); // chỉ lấy phần ngày
            $ngayCongChieu = Carbon::parse($phim->ngay_cong_chieu)->toDateString();

            // Ngày chiếu không được trước ngày công chiếu (nếu không phải "Sớm")
            if ($ngayChieu < $ngayCongChieu && $phim->loai_suat_chieu != "Sớm") {
                $validator->errors()->add('gio_chieu', 'Ngày chiếu không được trước ngày công chiếu.');
            }

            // Ngày chiếu không được sau ngày kết thúc (nếu có)
            if (!empty($phim->ngay_ket_thuc)) {
                $ngayKetThucPhim = Carbon::parse($phim->ngay_ket_thuc)->toDateString();
                if ($ngayChieu > $ngayKetThucPhim) {
                    $validator->errors()->add('gio_chieu', 'Ngày chiếu không được sau ngày kết thúc của phim.');
                }
            }

            // Ngày bắt đầu và kết thúc phải giống nhau
            if ($ngayChieu !== $ngayKetThuc) {
                $validator->errors()->add('error', 'Suất chiếu phải bắt đầu và kết thúc trong cùng một ngày.');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
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
        $lichChieu = LichChieu::find($id);
        if (!$lichChieu) {
            return response()->json([
                'message' => 'Lịch chiếu không tồn tại',
            ], 422);
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
