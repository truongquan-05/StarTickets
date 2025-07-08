<?php

namespace App\Http\Controllers\Admin;


use App\Models\VaiTro;
use App\Models\XacNhan;
use App\Models\NguoiDung;
use App\Mail\MaXacNhanMail;
use Illuminate\Http\Request;
use App\Jobs\XoaMaXacNhanJob;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
        if ($request->has('ma_xac_nhan')) {
            $updateClient = $request->all();
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

    public function TaoMaXacNhan($id)
    {
        $nguoiDung = NguoiDung::find($id);
        if (!$nguoiDung) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }

        $maXacNhan = rand(100000, 999999);

        try {
            Mail::to($nguoiDung->email)->send(new MaXacNhanMail($maXacNhan));

            $xacNhan = XacNhan::create([
                'nguoi_dung_id' => $id,
                'ma_xac_nhan' => $maXacNhan
            ]);
            XoaMaXacNhanJob::dispatch($xacNhan->id)->delay(now()->addSeconds(60));
            return response()->json([
                'message' => 'Mã xác nhận đã được tạo và gửi email',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không thể gửi email xác nhận. Vui lòng thử lại sau.'
            ], 500);
        }
    }

    public function getMaXacNhan($id)
    {
        $xacNhan = XacNhan::where('nguoi_dung_id', $id)->orderByDesc('id')->first();
        if (!$xacNhan) {
            return response()->json([
                'message' => 'Không tìm thấy mã xác nhận cho người dùng này'
            ], 404);
        }
        return response()->json([
            'message' => 'Mã xác nhận đã được tìm thấy',
        ]);
    }
}
