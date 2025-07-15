<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaGiamGia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MaGiamGiaController extends Controller
{
  public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:MaGiamGia-read')->only(['index', 'show']);
        $this->middleware('permission:MaGiamGia-create')->only(['store']);
        $this->middleware('permission:MaGiamGia-update')->only(['update']);
    }




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
        ], [
            'ma.required' => 'Vui lòng nhập mã giảm giá.',
            'ma.string' => 'Mã giảm giá phải là chuỗi ký tự.',
            'ma.unique' => 'Mã giảm giá đã tồn tại.',
            'ma.max' => 'Mã giảm giá không được vượt quá :max ký tự.',

            'image.string' => 'Hình ảnh phải là chuỗi.',
            'image.max' => 'Đường dẫn hình ảnh không được vượt quá :max ký tự.',

            'phan_tram_giam.numeric' => 'Phần trăm giảm phải là số.',
            'phan_tram_giam.min' => 'Phần trăm giảm không được nhỏ hơn :min.',
            'phan_tram_giam.max' => 'Phần trăm giảm không được lớn hơn :max.',

            'giam_toi_da.numeric' => 'Giá trị giảm tối đa phải là số.',
            'giam_toi_da.min' => 'Giảm tối đa không được nhỏ hơn :min.',

            'gia_tri_don_hang_toi_thieu.numeric' => 'Giá trị đơn hàng tối thiểu phải là số.',
            'gia_tri_don_hang_toi_thieu.min' => 'Giá trị tối thiểu không được nhỏ hơn :min.',

            'ngay_bat_dau.required' => 'Vui lòng chọn ngày bắt đầu.',
            'ngay_bat_dau.date' => 'Ngày bắt đầu không đúng định dạng.',

            'ngay_ket_thuc.required' => 'Vui lòng chọn ngày kết thúc.',
            'ngay_ket_thuc.date' => 'Ngày kết thúc không đúng định dạng.',
            'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',

            'so_lan_su_dung.integer' => 'Số lần sử dụng phải là số nguyên.',
            'so_lan_su_dung.min' => 'Số lần sử dụng phải lớn hơn hoặc bằng :min.',

            'trang_thai.in' => 'Trạng thái không hợp lệ. Chỉ chấp nhận: CHƯA KÍCH HOẠT, KÍCH HOẠT, HẾT HẠN.',
        ]);


        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
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
