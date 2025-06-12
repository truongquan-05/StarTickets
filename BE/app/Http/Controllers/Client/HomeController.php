<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Phim;
class HomeController extends Controller
{
    public function index(){
        //lam viec voi thoi gian cua lich chieu
        $hienTai=Carbon::now();
        $homNay= $hienTai->toDateString();
        $ngayMai=Carbon::tomorrow();


        $phimChieuhomnay= Phim::whereHas('lichChieu',function($query) use ($hienTai,$homNay){
            $query->whereDate('gio_chieu','=',$homNay)
            ->whereTime('gio_chieu','>=',$hienTai->toDateString());
        })

        ->orderBy('ngay_cong_chieu','desc')
        ->distinct()
        ->take(32)
        ->get();


        $phimSapChieu= Phim::whereHas('lichChieu',function($query) use ($ngayMai){
            $query->whereDate('gio_chieu','>=',$ngayMai);
        })

        ->orderBy('ngay_cong_chieu','desc')
        ->distinct()
        ->take(9)
        ->get();

        return response()->json([
            'phim_chieu_hom_nay'=>$phimChieuhomnay,
            'phim_sap_chieu'=>$phimSapChieu,
        ]);

    }

    public function getAllPhimchieuhomnay(){
           $hienTai=Carbon::now();
        $homNay= $hienTai->toDateString();
        $phim=Phim::whereHas('lichChieu',function($query) use ($hienTai,$homNay){
            $query->whereDate('gio_chieu','=',$homNay)
            ->whereTime('gio_chieu','>=',$hienTai->toDateString());

        })

        ->orderBy('ngay_cong_chieu','desc')
        ->distinct()
        ->get();
        return response()->json($phim);
    }


    public function getAllPhimsapchieu()  {
        $ngayMai=Carbon::tomorrow();
        $phim=Phim::whereHas('lichChieu',function($query) use($ngayMai){
            $query->whereDate('gio_chieu','>=',$ngayMai);
        })
        ->distinct()
        ->orderBy('ngay_cong_chieu','desc')
        ->get();
        return response()->json($phim);

    }

}
