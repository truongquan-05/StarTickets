<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePhimRequest extends FormRequest
{
        protected function failedValidation(Validator $validator)
{
    throw new HttpResponseException(response()->json([
        'success' => false,
        'message' => 'Dữ liệu không hợp lệ',
        'errors' => $validator->errors()
    ], 422));
}
    public function authorize()
    {
        return true; // Cho phép xác thực
    }

    public function rules()
    {
        return [
            'ten_phim' => [
                'required',
                'string',
                'max:255',
                Rule::unique('phim', 'ten_phim')->ignore($this->route('id')), // tránh trùng khi update chính nó
            ],
            'thoi_luong' => 'required|integer|min:1|max:500',
            'mo_ta' => 'nullable|string|max:1000',
        
            'trailer' => 'nullable|url',
            'ngon_ngu' => 'nullable|string|max:50',
            'quoc_gia' => 'nullable|string|max:50',
            // 'anh_poster' => 'nullable|string|max:255',
            // 'ngay_cong_chieu' => 'required|date',
            'tinh_trang' => 'nullable|string|max:50',
            'do_tuoi_gioi_han' => 'nullable|string|max:10',
            // 'trang_thai' => 'required|boolean',
            
        ];
    }

    public function messages()
    {
        return [
            'ten_phim.required' => 'Tên phim là bắt buộc.',
            'ten_phim.unique'   => 'Tên phim đã tồn tại.',
            'ten_phim.max'      => 'Tên phim không được vượt quá 255 ký tự.',

            'thoi_luong.required' => 'Thời lượng là bắt buộc.',
            'thoi_luong.integer'  => 'Thời lượng phải là số.',
            'thoi_luong.min'      => 'Thời lượng phải lớn hơn 0 phút.',
            'thoi_luong.max'      => 'Thời lượng không được vượt quá 500 phút.',

            'mo_ta.max' => 'Mô tả tối đa 1000 ký tự.',

            'id_the_loai.required' => 'Thể loại là bắt buộc.',
            'id_the_loai.exists'   => 'Thể loại không tồn tại.',
        ];
    }
}
