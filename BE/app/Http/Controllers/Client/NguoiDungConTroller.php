<?php

namespace App\Http\Controllers\Client;

use App\Models\XacNhan;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NguoiDungConTroller extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $nguoiDung = NguoiDung::with('vaitro')->find($id);
        if (!$nguoiDung) {
            return response()->json([
                'message' => 'Người dùng không tồn tại',
            ])->setStatusCode(404);
        }
        return response()->json([
            'message' => 'Thông tin người dùng',
            'data' => $nguoiDung
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $nguoiDung = NguoiDung::find($id);
        $updateClient = $request->all();
        

        $user = Auth::guard('sanctum')->user();
        if ($nguoiDung->google_id != null && $nguoiDung->email != $updateClient['email']) {
            return response()->json([
                    'message' => ['Tài khoản Google không thể cập nhật email'],
            ], 422);
        }
        if (!$nguoiDung) {
            return response()->json([
                'errors' => [
                    'message' => ['Người dùng không tồn tại'],
                ]
            ], 404);
        }
        if ($request->has('ma_xac_nhan')) {

            $validatedData = Validator::make($updateClient, [
                'ten' => 'required|string|max:255',
                'email' => 'required|email|unique:nguoi_dung,email,' . $id . '|max:255',
                'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung,so_dien_thoai,' . $id,
            ], [
                'ten.required' => 'Vui lòng nhập tên.',
                'email.required' => 'Vui lòng nhập email.',
                'email.email' => 'Email không hợp lệ.',
                'email.unique' => 'Email đã tồn tại.',
                'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
                'so_dien_thoai.max' => 'Số điện thoại không quá 10 ký tự.',
                'so_dien_thoai.unique' => 'Số điện thoại đã tồn tại.',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validatedData->errors()
                ], 422);
            }

            $xacNhan = XacNhan::where('nguoi_dung_id', $id)->orderByDesc('id')->first();
            if (!$xacNhan) {
                return response()->json([
                    'message' => 'Không tìm thấy mã xác nhận cho người dùng này'
                ], 404);
            }
            if ($xacNhan->ma_xac_nhan != $updateClient['ma_xac_nhan']) {
                return response()->json([
                    'message' => 'Mã xác nhận không đúng'
                ], 422);
            }
            $nguoiDung->update($updateClient);
            return response()->json([
                'message' => 'Cập nhật thành công ',
                'data' => NguoiDung::with('vaitro')->find($nguoiDung->id)
            ]);
        }

        if ($request->has('xac_thuc_mat_khau')) {
            $dataPassword = $request->all();
            if (!Hash::check($dataPassword['mat_khau_cu'], $nguoiDung->password)) {
                return response()->json([
                    'message' => 'Mật khẩu cũ không đúng'
                ], 422);
            }


            $nguoiDung->update([
                'password' => bcrypt($dataPassword['xac_thuc_mat_khau']),
            ]);
            return response()->json([
                'message' => 'Cập nhật mật khẩu thành công ',
                'data' => NguoiDung::with('vaitro')->find($nguoiDung->id)
            ]);
        }


        $validatedData = Validator::make($request->all(), [
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:nguoi_dung,email,' . $id . '|max:255',
            'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung,so_dien_thoai,' . $id,
            'vai_tro_id' => 'required|exists:vai_tro,id',
        ], [
            'ten.required' => 'Vui lòng nhập tên.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
            'so_dien_thoai.max' => 'Số điện thoại không quá 10 ký tự.',
            'so_dien_thoai.unique' => 'Số điện thoại đã tồn tại.',
            'vai_tro_id.required' => 'Vui lòng chọn vai trò.',
            'vai_tro_id.exists' => 'Vai trò không tồn tại.',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validatedData->errors()
            ], 422);
        }
        $anh = $request->input('anh_dai_dien');
        $isUrl = is_string($anh) && (str_starts_with($anh, 'http://') || str_starts_with($anh, 'https://'));
        if (
            $nguoiDung->anh_dai_dien &&
            Storage::disk('public')->exists($nguoiDung->anh_dai_dien) &&
            $isUrl
        ) {
            Storage::disk('public')->delete($nguoiDung->anh_dai_dien);
        }

        //  Nếu hợp lệ thì cập nhật
        $nguoiDung->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => NguoiDung::with('vaitro')->find($nguoiDung->id)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
