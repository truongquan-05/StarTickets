<?php


namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class StoreTheLoaiRequest extends FormRequest
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
        return true;
    }

   public function rules()
{
    return [
        'ten_the_loai' => 'required|string|max:255|unique:the_loai,ten_the_loai',
    ];
}


    public function messages()
    {
        return [
            'ten_the_loai.required' => 'Tên thể loại là bắt buộc.',
            'ten_the_loai.unique'   => 'Tên thể loại đã tồn tại.',
            'ten_the_loai.max'      => 'Tên thể loại tối đa 255 ký tự.',
        ];
    }
}