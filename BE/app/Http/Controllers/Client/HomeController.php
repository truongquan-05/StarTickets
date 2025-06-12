<?php

namespace App\Http\Controllers\Client;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\Phim;
use Illuminate\Http\Request;



class HomeController extends Controller
{


    public function index(){
            $homNay= Carbon::today();
    $ngayMai= Carbon::tomorrow();
        $phimDangChieu = Phim::whereHas('lichChieu',function($query) use ($homNay){
            $query->whereDate('gio_chieu','=',$homNay);
        })
        ->where('trang_thai',true)
        ->orderBy('ngay_cong_chieu','desc')
        ->take(32)
        ->get();

        $phimSapChieu = Phim::whereHas('lichChieu',function($query) use ($ngayMai){
            $query->whereDate('gio_chieu','=',$ngayMai);
        })
        ->where('trang_thai',true)
        ->orderBy('ngay_cong_chieu','desc')
        ->take(9)
        ->get();

        return response()->json([
            'phim_dang_chieu'=>$phimDangChieu,
            'phim_sap_chieu'=>$phimSapChieu,
        ]);
    }
    public function getAllPhimDangChieu(){
        $homNay=Carbon::today();
        $phim= Phim::whereHas('lichChieu',function($query) use ($homNay){
            $query->whereDate('gio_chieu','=',$homNay);
        })
        ->where('trang_thai',true)
        ->orderBy('ngay_cong_chieu','desc')
        ->get();
        return response()->json($phim);
    }

    public function getAllPhimSapChieu(){
        $ngayMai=Carbon::tomorrow();
        $phim= Phim::whereHas('lichChieu',function($query) use ($ngayMai){
            $query->whereDate('gio_chieu','=',$ngayMai);
        })
        ->where('trang_thai',true)
        ->orderBy('ngay_cong_chieu','desc')
        ->get();
        return response()->json($phim);
    }
}
