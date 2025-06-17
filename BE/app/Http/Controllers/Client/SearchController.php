<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Phim;
use Illuminate\Http\Request;

class SearchController extends Controller
{
public function search(Request $request){
    $query = Phim::query();
    if($request->has('keyword')){
        $keyword=$request->keyword;
        $query->where(function($q) use ($keyword){
            $q->where('ten_phim','like',"%$keyword%")
            ->orWhere('mo_ta','like',"%$keyword%");
        });
    }
if($request->has('ngay_cong_chieu')){
    $query->whereDate('ngay_cong_chieu',$request->ngay_cong_chieu);

}
if($request->has('the_loai_id')){
    $query->where('the_loai_id',$request->the_loai_id);
}
if($request->has('trang_thai_phim')){
    $query->where('trang_thai_phim',$request->trang_thai_phim);
}
if($request->filled('sort_by')){
   $allowedSorts = ['ten_phim', 'ngay_cong_chieu', 'thoi_luong'];
        $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'ngay_cong_chieu';
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);
}
$phim =$request->has('paginate')?$query->paginate(10):$query->get();
return response()->json($phim);
}
}
