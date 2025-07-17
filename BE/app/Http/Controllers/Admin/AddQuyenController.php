<?php

namespace App\Http\Controllers\Admin;

use App\Models\VaiTro;
use App\Models\QuyenTruyCap;
use App\Models\QuyenHan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class AddQuyenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->middleware('IsAdmin');
        $this->middleware('permission:All');
    }

    public function index()
    {
        $data = VaiTro::with('QuyenTruyCap')->get();
        return response()->json([
            'message' => 'Danh sách quyền truy cập',
            'data' => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $data = $request->all();

        foreach ($data['quyen_han'] as $quyenHanId) {


            if ($quyenHanId == 1 && $user->vai_tro_id != 99) {
                return response()->json([
                    'message' => "Bạn không có quyền cấp Admin",
                ]);
            }
            $data['quyen_han_id'] = $quyenHanId;
            QuyenTruyCap::create($data);
        }
        return response()->json([
            'message' => 'Cấp quyền thành công',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = VaiTro::with('QuyenTruyCap')->find($id);
        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = QuyenTruyCap::find($id);
        if (!$data) {
            return response()->json([
                'message' => "Không tồn tại",
            ], 422);
        }
        $data->delete();
        return response()->json([
            'message' => "Gỡ quyền thành công",
        ]);
    }
    public function getQuyenHan($id)
    {
        $data = QuyenHan::all(); // Tất cả quyền hạn
        $quyenTruyCap = QuyenTruyCap::where('vai_tro_id', $id)->get(); // Danh sách quyền đã gán cho vai trò

        // Lấy danh sách ID quyền đã có
        $quyenDaGanIds = $quyenTruyCap->pluck('quyen_han_id')->toArray();

        // Lọc ra những quyền chưa được gán
        $dataQuyen = [];

        foreach ($data as $quyen) {
            if (!in_array($quyen->id, $quyenDaGanIds)) {
                $dataQuyen[] = [
                    'id' => $quyen->id,
                    'quyen' => $quyen->quyen,
                    'mo_ta' => $quyen->mo_ta,
                ];
            }
        }

        return response()->json([
            'message' => 'Danh sách quyền hạn chưa gán',
            'data' => $dataQuyen
        ]);
    }

}
