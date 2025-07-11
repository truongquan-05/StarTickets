<?php

namespace App\Http\Controllers\Client;

use App\Models\DoAn;
use App\Models\DatVe;
use App\Models\DonDoAn;
use App\Models\CheckGhe;
use App\Models\DatVeChiTiet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\PhuongThucThanhToan;

class DatVeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dat_ve = $request->only('dat_ve');
        $don_do_an = $request->only('don_do_an');
        $dat_ve_chi_tiet = $request->only('dat_ve_chi_tiet');

        DB::beginTransaction();
        try {
            foreach ($dat_ve as $item) {
                foreach ($item as $value) {
                    $DatVe = DatVe::create([
                        "lich_chieu_id" => $value['lich_chieu_id'],
                        "nguoi_dung_id" => $value['nguoi_dung_id'],
                        "tong_tien" => $value['tong_tien'],
                    ]);
                    $lich_chieu_id = $value['lich_chieu_id'];
                }
            }

            $idDatVe = $DatVe->id;

            if ($don_do_an && count($don_do_an) > 0) {

                foreach ($don_do_an as $group) {
                    foreach ($group as $item) {
                        $DoAn = DoAn::find($item['do_an_id']);

                        if (!$DoAn || $DoAn->so_luong_ton < $item['so_luong']) {
                            DB::rollBack();
                            return response()->json([
                                'message' => 'Số lượng đồ ăn không đủ hoặc không tồn tại',
                                'status' => 422
                            ], 422);
                        }
                    }
                }

                foreach ($don_do_an as $group) {
                    foreach ($group as $item) {
                        $DoAn = DoAn::find($item['do_an_id']);
                        $item['dat_ve_id'] = $idDatVe;

                        DonDoAn::create($item);

                        $DoAn->update([
                            'so_luong_ton' => $DoAn->so_luong_ton - $item['so_luong']
                        ]);
                    }
                }
            }


            foreach ($dat_ve_chi_tiet as $group) {
                foreach ($group as $item) {
                    $checkGhe = CheckGhe::where('ghe_id', $item['ghe_id'])
                        ->where('lich_chieu_id', $lich_chieu_id)
                        ->first();

                    if (!$checkGhe || $checkGhe->trang_thai === 'da_dat') {
                        DB::rollBack();
                        return response()->json([
                            'message' => 'Ghế đã được đặt hoặc không tồn tại',
                        ], 422);
                    }
                }
            }

            foreach ($dat_ve_chi_tiet as $group) {
                foreach ($group as $item) {
                    $item['dat_ve_id'] = $idDatVe;

                    DatVeChiTiet::create($item);

                    CheckGhe::where('ghe_id', $item['ghe_id'])
                        ->where('lich_chieu_id', $lich_chieu_id)
                        ->update(['trang_thai' => 'da_dat']);
                }
            }

            DB::commit();


            $dataThanhToan = DatVe::with(['DonDoAn.DoAn', 'DatVeChiTiet.GheDat.loaiGhe'])->find($idDatVe);

            return response()->json([
                'data' => $dataThanhToan
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(DatVe $datVe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DatVe $datVe)
    {
        //
    }

    public function getPhuongThucThanhToan(){
        $phuongThucThanhToan = PhuongThucThanhToan::all();
        return response()->json([
            'data' => $phuongThucThanhToan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = DatVe::find($id);
        if (!$data) {
            return response()->json([
                "message" => "Không tìm thấy dữ liệu đặt vé",
            ], 404);
        }
        $dataThanhToan = DatVe::with(['donDoAn.doAn', 'datVeChiTiet.gheDat'])->find($id);

        $DonDoAn = $dataThanhToan->donDoAn;
        $DatVeChiTiet = $dataThanhToan->datVeChiTiet;

        foreach ($DatVeChiTiet as $item) {
            CheckGhe::where('ghe_id', $item->ghe_id)
                ->where('lich_chieu_id', $dataThanhToan->lich_chieu_id)
                ->update(['trang_thai' => 'trong']);
        }
        foreach ($DonDoAn as $item) {
            $DoAn = DoAn::find($item->do_an_id);
            if ($DoAn) {
                $DoAn->update([
                    'so_luong_ton' => $DoAn->so_luong_ton + $item->so_luong
                ]);
            }
        }
        DatVe::find($id)->delete();
        return response()->json([
            "message" => "Hủy đặt vé thành công",
        ]);
    }
}
