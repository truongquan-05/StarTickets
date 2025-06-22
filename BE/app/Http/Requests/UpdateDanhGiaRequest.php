<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDanhGiaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'so_sao' => 'sometimes|integer|min:1|max:5',
            'noi_dung' => 'sometimes|string'
        ];
    }
}