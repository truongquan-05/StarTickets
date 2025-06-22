<?php


namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDanhGiaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'phim_id' => 'required|exists:phim,id',
            'so_sao' => 'required|integer|min:1|max:5',
            'noi_dung' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            'phim_id.required' => 'Phim là bắt buộc.',
            'phim_id.exists' => 'Phim không tồn tại.',
            'so_sao.required' => 'Số sao là bắt buộc.',
            'so_sao.integer' => 'Số sao phải là số.',
            'so_sao.min' => 'Số sao tối thiểu là 1.',
            'so_sao.max' => 'Số sao tối đa là 5.',
            'noi_dung.required' => 'Nội dung là bắt buộc.',
            'noi_dung.string' => 'Nội dung phải là chuỗi.'
        ];
    }
}