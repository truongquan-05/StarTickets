<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePhimRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Dữ liệu không hợp lệ',
            'errors' => $validator->errors()
        ], 422));
    }
    public function authorize()
    {
        return true; // Cho phép tất cả, tùy chỉnh nếu có phân quyền
    }

    public function rules()
    {
        return [
            'ten_phim' => 'required|string|max:255',
            'mo_ta' => 'nullable|string',
            'thoi_luong' => 'required|integer|min:1',
            'trailer' => 'nullable|url',
            'ngon_ngu' => 'nullable|string|max:50',
            'quoc_gia' => 'nullable|string|max:50',
           'anh_poster' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:2048', // Giới hạn kích thước file ảnh poster
            'ngay_cong_chieu' => 'required|date',
            'tinh_trang' => 'nullable|string|max:50',
            'do_tuoi_gioi_han' => 'nullable|string|max:80',
            'trang_thai' => 'required|boolean',
            'the_loai_id' => 'required|exists:the_loai,id',
        ];
    }
}
