<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaGiamGia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MaGiamGiaController extends Controller
{
    // Danh sách mã đang hoạt động hoặc sắp bắt đầu (ẩn mã hết hạn)
    public function index(Request $request)
    {
        $truyVan = MaGiamGia::query();

        // Chỉ lấy mã chưa hết hạn
        $truyVan->where('trang_thai', '!=', 'HẾT HẠN');

        // Tìm kiếm
        if ($request->filled('search')) {
            $truyVan->where('ma', 'like', '%' . $request->search . '%');
        }

        // Lọc theo trạng thái (nếu có)
        if ($request->filled('trang_thai')) {
            $truyVan->where('trang_thai', $request->trang_thai);
        }

        $truyVan->orderByDesc('created_at');
        $perPage = $request->get('per_page', 10);
        return response()->json($truyVan->paginate($perPage));
    }

    // Danh sách mã đã hết hạn
    public function hetHan(Request $request)
    {
        $truyVan = MaGiamGia::query()
            ->where('trang_thai', 'HẾT HẠN');

        if ($request->filled('search')) {
            $truyVan->where('ma', 'like', '%' . $request->search . '%');
        }

        $truyVan->orderByDesc('ngay_ket_thuc');
        return response()->json($truyVan->paginate($request->get('per_page', 10)));
    }

    // Chi tiết mã giảm giá
    public function show($id)
    {
        $ma = MaGiamGia::findOrFail($id);
        return response()->json($ma);
    }

    // Tạo mã giảm giá
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma' => 'required|string|unique:ma_giam_gia,ma|max:50',
            'image' => 'nullable|string|max:150',
            'phan_tram_giam' => 'nullable|numeric|min:0|max:100',
            'giam_toi_da' => 'nullable|numeric|min:0',
            'gia_tri_don_hang_toi_thieu' => 'nullable|numeric|min:0',
            'ngay_bat_dau' => 'required|date',
            'ngay_ket_thuc' => 'required|date|after_or_equal:ngay_bat_dau',
            'so_lan_su_dung' => 'nullable|integer|min:1',
            'trang_thai' => 'in:CHƯA KÍCH HOẠT,KÍCH HOẠT,HẾT HẠN',
        ]);

        if ($validator->fails()) {
            return response()->json(['Lỗi' => $validator->errors()], 422);
        }

        $ma = MaGiamGia::create($request->all());
        return response()->json(['thong_bao' => 'Tạo mã giảm giá thành công.', 'data' => $ma], 201);
    }

    // Cập nhật mã giảm giá
    public function update(Request $request, $id)
    {
        $ma = MaGiamGia::findOrFail($id);

        $trangThai = $ma->trang_thai;

        $truongChoPhep = match ($trangThai) {
            'CHƯA KÍCH HOẠT' => [
                'image',
                'phan_tram_giam',
                'giam_toi_da',
                'gia_tri_don_hang_toi_thieu',
                'ngay_bat_dau',
                'ngay_ket_thuc',
                'so_lan_su_dung',
                'trang_thai'
            ],
            'KÍCH HOẠT' => [
                'image',
                'giam_toi_da',
                'gia_tri_don_hang_toi_thieu',
                'ngay_ket_thuc',
                'so_lan_su_dung',
                'trang_thai'
            ],
            'HẾT HẠN' => [
                'trang_thai'
            ],
            default => []
        };

        // Lấy tất cả trường người dùng gửi lên
        $truongGuiLen = array_keys($request->all());

        // Tìm các trường gửi lên mà không được phép cập nhật
        $truongKhongChoPhep = array_diff($truongGuiLen, $truongChoPhep);

        if (!empty($truongKhongChoPhep)) {
            return response()->json([
                'thong_bao' => 'Không được phép cập nhật các trường sau khi mã ở trạng thái ' . $trangThai,
                'truong_khong_cho_phep' => array_values($truongKhongChoPhep)
            ], 400);
        }

        // Lọc chỉ giữ lại các trường được phép
        $duLieuCapNhat = collect($request->only($truongChoPhep))->filter(function ($value) {
            return !is_null($value);
        })->toArray();

        if (empty($duLieuCapNhat)) {
            return response()->json([
                'thong_bao' => 'Không có dữ liệu hợp lệ để cập nhật theo trạng thái hiện tại.',
            ], 400);
        }

        // Validate
        $validator = Validator::make($duLieuCapNhat, [
            'image' => 'nullable|string|max:150',
            'phan_tram_giam' => 'nullable|numeric|min:0|max:100',
            'giam_toi_da' => 'nullable|numeric|min:0',
            'gia_tri_don_hang_toi_thieu' => 'nullable|numeric|min:0',
            'ngay_bat_dau' => 'date',
            'ngay_ket_thuc' => 'date|after_or_equal:ngay_bat_dau',
            'so_lan_su_dung' => 'nullable|integer|min:1',
            'trang_thai' => 'in:CHƯA KÍCH HOẠT,KÍCH HOẠT,HẾT HẠN',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ma->update($duLieuCapNhat);

        return response()->json([
            'thong_bao' => 'Cập nhật mã giảm giá thành công.',
            'data' => $ma
        ]);
    }
}
