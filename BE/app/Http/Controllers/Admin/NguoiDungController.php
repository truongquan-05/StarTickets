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

        ]);
        if ($validatedData->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validatedData->errors()
            ]);
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
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validatedData->errors()
            ]);
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






// use Google_Client;
// use App\Models\NguoiDung;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Auth;

// public function googleLogin(Request $request)
// {
//     $idToken = $request->token;

//     $client = new Google_Client(['client_id' => config('services.google.client_id')]);
//     $payload = $client->verifyIdToken($idToken);

//     if ($payload) {
//         $googleId = $payload['sub'];
//         $email = $payload['email'];
//         $name = $payload['name'];

//         $user = NguoiDung::where('google_id', $googleId)->orWhere('email', $email)->first();

//         if (!$user) {
//             $user = NguoiDung::create([
//                 'name' => $name,
//                 'email' => $email,
//                 'google_id' => $googleId,
//                 'password' => Hash::make('dummy-password'),
//             ]);
//         } elseif (!$user->google_id) {
//             $user->update(['google_id' => $googleId]);
//         }

//         // Nếu bạn dùng Laravel Sanctum
//         $token = $user->createToken('api_token')->plainTextToken;

//         return response()->json([
//             'user' => $user,
//             'token' => $token,
//         ]);
//     }

//     return response()->json(['message' => 'Token không hợp lệ'], 401);
// }
