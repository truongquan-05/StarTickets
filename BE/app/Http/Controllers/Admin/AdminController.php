<?php

namespace App\Http\Controllers\Admin;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{

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

    public function update(Request $request, string $id)
    {
        $nguoiDung = NguoiDung::find($id);
        if (!$nguoiDung) {
            return response()->json([
                'message' => 'Người dùng không tồn tại',
            ], 404);
        }

        if ($request->has('ten') || $request->has('email') || $request->has('so_dien_thoai')) {
            $updateAdmin = $request->all();
            $validatedData = Validator::make($updateAdmin, [
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

            $nguoiDung->update($updateAdmin);
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

        return response()->json([
            'message' => 'Cập nhật thành công',

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
