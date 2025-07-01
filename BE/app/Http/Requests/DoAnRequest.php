<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DoAnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ten_do_an' => 'required|string|max:255',
            'mo_ta' => 'nullable|string',
            'gia_nhap' => 'required|numeric|min:0',
            'gia_ban' => 'required|numeric|min:0',
            'so_luong_ton' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'ten_do_an.required' => 'Tên đồ ăn không được để trống',
            'gia.required' => 'Giá không được để trống',
            'gia.integer' => 'Giá phải là số',
            'gia.min' => 'Giá không được nhỏ hơn 0',
            'so_luong_ton.integer' => 'Số lượng tồn phải là số',
            'so_luong_ton.min' => 'Số lượng tồn không được âm',
        ];
    }
}
