<?php

namespace App\Http\Controllers\Admin;


use App\Models\VaiTro;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;




class NguoiDungController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = NguoiDung::with('vaitro')->get();
        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Không có dữ liệu',
                'data' => []
            ])->setStatusCode(404);
        }
        return response()->json([
            'message' => 'Danh sách người dùng',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'ten' => 'required|string|max:255',
            'email' => 'required|email|unique:nguoi_dung,email|max:255',
            'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung',
            'password' => 'required|string|min:8',
            'google_id',
            'anh_dai_dien',
            'email_da_xac_thuc',
            'vai_tro_id' => 'required|exists:vai_tro,id',

        ],   [ // 👉 Thêm custom message ở đây
            'ten.required' => 'Vui lòng nhập tên.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
            'so_dien_thoai.max' => 'Số điện thoại không quá 10 ký tự.',
            'so_dien_thoai.unique' => 'Số điện thoại đã tồn tại.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'vai_tro_id.required' => 'Vui lòng chọn vai trò.',
            'vai_tro_id.exists' => 'Vai trò không tồn tại.',
        ]);
        if ($validatedData->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validatedData->errors()
            ], 422);
        }
        $data = $request->all();

        if ($request->hasFile('anh_dai_dien')) {
            $file = $request->file('anh_dai_dien');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads', $fileName);
            $data['anh_dai_dien'] = $fileName;
        }


        $data['password'] = bcrypt($data['password']); // Mã hóa mật khẩu
        $data['trang_thai'] = 1; // Mặc định trạng thái là 1 (hoạt động)
        $nguoiDung = NguoiDung::create($data);

        return response()->json([
            'message' => 'Thành công',
            'data' => NguoiDung::with('vaitro')->find($nguoiDung->id)
        ]);
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
        if (!$nguoiDung) {
            return response()->json([
                'message' => 'Người dùng không tồn tại',
            ], 404);
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
        $nguoiDung = NguoiDung::find($id);
        if (!$nguoiDung) {
            return response()->json([
                'message' => 'Người dùng không tồn tại',
            ], 404);
        }

        // Xóa người dùng
        $nguoiDung->delete();

        return response()->json([
            'message' => 'Xóa người dùng thành công',
        ]);
    }
}
