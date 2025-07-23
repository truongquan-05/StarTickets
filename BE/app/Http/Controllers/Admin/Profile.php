<?php

namespace App\Http\Controllers\Admin;

use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class Profile extends Controller
{
    public function __construct()
    {

        $this->middleware('IsAdmin');
    }
    public function index()
    {
        //
    }


    public function show(string $id)
    {
        $data = NguoiDung::find($id);
        if (!$data) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 422);
        }
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dulieu = $request->all();
        $data = NguoiDung::find($id);
        if ($request->has('new_password')) {
            if (!Hash::check($request->input('old_password'), $data->password)) {
                return response()->json([
                    'message' => 'Mật khẩu cũ không đúng'
                ], 422);
            }
            $data->update([
                'password' => bcrypt($request->input('new_password')),
            ]);


            return response()->json(['message' => 'Cập nhật mật khẩu thành công']);
        }


        if (!$data) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 422);
        }
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|email|unique:nguoi_dung,email,' . $id . '|max:255',
            'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung,so_dien_thoai,' . $id,
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
            'so_dien_thoai.max' => 'Số điện thoại không quá 10 ký tự.',
            'so_dien_thoai.unique' => 'Số điện thoại đã tồn tại.',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'message' => $validatedData->errors()
            ], 422);
        }
        if ($request->hasFile('anh_dai_dien')) {
            // Xóa ảnh cũ nếu có
            if ($data->anh_dai_dien && Storage::disk('public')->exists($data->anh_dai_dien)) {
                Storage::disk('public')->delete($data->anh_dai_dien);
            }
            $path = $request->file('anh_dai_dien')->store('uploads', 'public');
            $dulieu['anh_dai_dien'] = $path;
        }

        $data->update($dulieu);
        $user = $data->fresh();
        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $user

        ]);
    }
}
