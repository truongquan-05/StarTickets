<?php

namespace App\Http\Controllers\Client;

use App\Models\DatVe;
use App\Http\Controllers\Controller;
use App\Models\DatVeChiTiet;
use App\Models\DoAn;
use App\Models\DonDoAn;
use Illuminate\Http\Request;

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


        foreach ($dat_ve as $item) {
            foreach ($item as $value) {
                $DatVe = DatVe::create([
                    "lich_chieu_id" => $value['lich_chieu_id'],
                    "nguoi_dung_id" => $value['nguoi_dung_id'],
                    "tong_tien" => $value['tong_tien'],
                ]);
            }
        }

        $idDatVe = $DatVe->id;

        if ($don_do_an && count($don_do_an) > 0) {
            foreach ($don_do_an as $value) {
                foreach ($value as $item) {
                    $DoAn = DoAn::find($item['do_an_id']);
                    if ($DoAn->so_luong_ton < $item['so_luong'] || $DoAn->so_luong_ton <= 0) {
                        return response()->json([
                            'message' => 'Số lượng đồ ăn không đủ',
                            'status' => 422
                        ], 422);
                    }
                    $item['dat_ve_id'] = $idDatVe;
                    $DonDoAn =  DonDoAn::insert($item);
                    $DoAn->update([
                        'so_luong_ton' => $DoAn->so_luong_ton - $item['so_luong']
                    ]);
                }
            }
        }

        if ($dat_ve_chi_tiet && count($dat_ve_chi_tiet) > 0) {
            foreach ($dat_ve_chi_tiet as $value) {
                foreach ($value as $item) {
                    $item['dat_ve_id'] = $idDatVe;
                    $DonVeChiTiet =  DatVeChiTiet::insert($item);
                }
            }
        }


        $dataThanhToan = DatVe::with(['DonDoAn.DoAn','DatVeChiTiet.GheDat'])->find($idDatVe);

        return response()->json([
            'data' => $dataThanhToan
        ]);
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DatVe $datVe)
    {
        //
    }
}
