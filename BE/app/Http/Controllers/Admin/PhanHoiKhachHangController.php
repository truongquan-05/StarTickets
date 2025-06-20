<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PhanHoiKhachHang;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class PhanHoiKhachHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      $data=PhanHoiKhachHang::latest()->get();
       if($data->isEmpty()){
        return response()->json([
            'message'=>'khong co phan hoi nao',
            'data'=>[]
        ],200);
       }
       return response()->json([
        'message'=>'phan hoi khach hang',
        'data'=>$data
       ],200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email',
            'so_dien_thoai' => 'required|string',
           'noi_dung'=>'required|string'
        ]);
        if ($validatedData->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validatedData->errors()
            ]);
        }
      $data= $request-> all();
       $phanHoi=PhanHoiKhachHang::create($data);
       return response()->json([
        'message'=>'gui phan hoi thanh cong',
        'data'=>$phanHoi
       ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $phanHoi=PhanHoiKhachHang::find($id);
        if(!$phanHoi){
            return response()->json([
                'message'=>'phan hoi khong ton tai',
                'data'=>null
            ],404);
        }
        return response()->json([
            'message'=>'Chi tiet phan hoi',
            'data'=>$phanHoi
        ],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $phanHoi=PhanHoiKhachHang::find($id);
        if(!$phanHoi){
            return response()->json([
                'message'=>'khong ton tai trang thai',
            'data'=>[]
            ],404);
        }
        $phanHoi->trang_thai=!$phanHoi->trang_thai;
        $phanHoi->save();
        return response()->json([
            'message'=>'Cap nhap trang thai thanh cong',
            'data'=>$phanHoi,
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

}
